// src/engine/recommendationEngine.js
//
// Pelora recommendation engine — runs entirely in the browser.
// Consumes products_denormalized.json, matrix_scores.json,
// compatibility_rules.json, and routine_templates.json.
//
// Entry point: runRecommendationEngine(quizAnswers, aiResult) → { routine, warnings, profile }
// ─────────────────────────────────────────────────────────────────────────────

import PRODUCTS_RAW      from "../data/products_denormalized.json";
import MATRIX_RAW        from "../data/matrix_scores.json";
import RULES_RAW         from "../data/compatibility_rules.json";
import ROUTINE_TMPL_RAW  from "../data/routine_templates.json";

// ── 1. Quiz answer → DB value normalisation ───────────────────────────────────

const GOAL_MAP = {
  definition: "More definition",
  frizz:      "Less frizz",
  moisture:   "Moisture + softness",
  length:     "Length retention",
  scalp:      "More definition",
};

function primaryGoal(goals) {
  if (!goals) return "definition";
  if (typeof goals === "string") return goals;
  if (Array.isArray(goals) && goals.length > 0) return goals[0];
  return "definition";
}

const DENSITY_MAP = {
  thin:   "Fine",
  medium: "Medium",
  dense:  "Thick",
};

const POROSITY_MAP = {
  high:   "High",
  normal: "Medium",
  low:    "Low",
};

const SCALP_MAP = {
  balanced:  "Normal",
  oily:      "Oily",
  dry:       "Dry",
  sensitive: "Sensitive",
};

const HISTORY_MAP = {
  heat:       "Heat styled",
  relaxer:    "Relaxed/permed",
  color:      "Color/bleach",
  protective: "Protective styles",
  none:       "Virgin",
};

// Budget quiz value → tier filter
// "mix" means no filter — show all tiers (existing behavior)
const BUDGET_TIER_MAP = {
  drugstore: ["drugstore"],
  mid:       ["mid"],
  luxury:    ["luxury"],
  mix:       null, // null = no filter, show all tiers
};

function curlGroup(curl) {
  if (!curl) return null;
  const c = curl.toLowerCase();
  if (c.startsWith("2")) return "wavy";
  if (c.startsWith("3")) return "curly";
  if (c.startsWith("4")) return "coily";
  return null;
}

// ── 2. Build normalised user profile ─────────────────────────────────────────

function buildProfile(answers, aiResult) {
  const primary  = primaryGoal(answers.goals);
  const dbGoal   = GOAL_MAP[primary] || "More definition";
  const history  = (answers.history || []).map(h => HISTORY_MAP[h]).filter(Boolean);
  const curl     = aiResult?.curlType
                     ? aiResult.curlType.toLowerCase()
                     : answers.visualCurlType
                       ? answers.visualCurlType.toLowerCase()
                       : null;

  // Budget: which tiers to include in picks. null = all tiers.
  const budgetKey   = answers.budget || "mix";
  const allowedTiers = BUDGET_TIER_MAP[budgetKey] || null;

  return {
    goal:        dbGoal,
    goalKey:     primary,
    density:     DENSITY_MAP[answers.density]   || "Medium",
    porosity:    POROSITY_MAP[answers.porosity] || "Medium",
    scalp:       SCALP_MAP[answers.scalp]       || "Normal",
    history,
    curl,
    curlGroup:   curlGroup(curl),
    budget:      budgetKey,
    allowedTiers,
    coconutSensitive: false,
    damageRecent:     history.includes("Color/bleach"),
  };
}

// ── 3. Matrix scoring ─────────────────────────────────────────────────────────

function matrixScore(profile, productType) {
  const row = MATRIX_RAW.find(r => r.goal === profile.goal && r.product_type === productType);
  if (!row) return 0;
  let score = row.base_score;
  if (row.porosity_modifier && profile.porosity) score += row.porosity_modifier[profile.porosity] || 0;
  if (row.density_modifier  && profile.density)  score += row.density_modifier[profile.density]   || 0;
  if (row.curl_group_modifier && profile.curlGroup) score += row.curl_group_modifier[profile.curlGroup] || 0;
  return score;
}

// ── 4. Rule evaluation ────────────────────────────────────────────────────────

function productMatchesCondition(cond, product, profile) {
  const pc = cond.product;
  if (!pc) return true;

  if (pc.type     && product.product_type !== pc.type)            return false;
  if (pc.type_in  && !pc.type_in.includes(product.product_type))  return false;
  if (pc.type_not && product.product_type === pc.type_not)         return false;

  const tags        = product.tags        || [];
  const tagsTop3    = product.tags_top_3  || [];
  const tagsTop5    = product.tags_top_5  || [];
  const ingredients = (product.ingredients || []).map(i => i.ingredient_name.toLowerCase());

  if (pc.has_tags        && !pc.has_tags.some(t => tags.includes(t)))           return false;
  if (pc.has_all_tags    && !pc.has_all_tags.every(t => tags.includes(t)))      return false;
  if (pc.has_any_tags    && !pc.has_any_tags.some(t => tags.includes(t)))       return false;
  if (pc.missing_all_tags && pc.missing_all_tags.some(t => tags.includes(t)))   return false;
  if (pc.missing_tags     && pc.missing_tags.some(t => tags.includes(t)))        return false;

  if (pc.tags_in_top_n) {
    const { tags: targetTags, n } = pc.tags_in_top_n;
    let topNTags;
    if (n <= 3) topNTags = tagsTop3;
    else if (n <= 5) topNTags = tagsTop5;
    else topNTags = tags;
    if (!targetTags.some(t => topNTags.includes(t))) return false;
  }

  if (pc.contains_ingredients && !pc.contains_ingredients.some(i => ingredients.includes(i.toLowerCase()))) return false;
  if (pc.contains_any_ingredients && !pc.contains_any_ingredients.some(i => ingredients.includes(i.toLowerCase()))) return false;

  if (pc.contains_ingredients_top_n) {
    const { ingredients: targetIngs, n } = pc.contains_ingredients_top_n;
    const topN = (product.ingredients || [])
      .sort((a,b) => a.position - b.position)
      .slice(0, n)
      .map(i => i.ingredient_name.toLowerCase());
    if (!targetIngs.some(i => topN.includes(i.toLowerCase()))) return false;
  }

  return true;
}

function userMatchesCondition(cond, profile) {
  const uc = cond.user;
  if (!uc) return true;

  if (uc.density    && profile.density   !== uc.density)   return false;
  if (uc.porosity   && profile.porosity  !== uc.porosity)  return false;
  if (uc.scalp      && profile.scalp     !== uc.scalp)     return false;
  if (uc.goal       && profile.goal      !== uc.goal)      return false;
  if (uc.curl       && profile.curl      !== uc.curl.toLowerCase()) return false;
  if (uc.curl_in    && !uc.curl_in.includes(profile.curl))    return false;
  if (uc.porosity_in && !uc.porosity_in.includes(profile.porosity)) return false;

  if (uc.hair_history_contains && !profile.history.includes(uc.hair_history_contains)) return false;
  if (uc.coconut_sensitive !== undefined && uc.coconut_sensitive !== profile.coconutSensitive) return false;
  if (uc.damage_recent     !== undefined && uc.damage_recent     !== profile.damageRecent)     return false;
  if (uc.climate) return false;

  return true;
}

function evaluateRule(rule, product, profile, routineTags) {
  if (!userMatchesCondition(rule.condition, profile)) return { triggered: false };

  if (rule.condition.routine) {
    const rc = rule.condition.routine;
    if (rc.missing_all_tags && routineTags.some(t => rc.missing_all_tags.includes(t))) return { triggered: false };
    if (rc.count_tags) {
      const count = routineTags.filter(t => t === rc.count_tags.tag).length;
      if (count < rc.count_tags.min) return { triggered: false };
    }
    return { triggered: true, severity: rule.severity, adjustment: rule.score_adjustment || 0, userMessage: rule.user_message };
  }

  if (!productMatchesCondition(rule.condition, product, profile)) return { triggered: false };

  return { triggered: true, severity: rule.severity, adjustment: rule.score_adjustment || 0, userMessage: rule.user_message };
}

// ── 5. Score a single product ─────────────────────────────────────────────────

const SCALP_IDEAL_TAGS = {
  Oily:      ["SCALP","SURF-CLAR","SURF-GEN"],
  Dry:       ["SCALP","EMO-LW","EMO-MED","HUM"],
  Sensitive: ["SCALP","HUM"],
  Normal:    ["SCALP","EMO-LW","HUM"],
};
const SCALP_POOR_TAGS = {
  Oily:      ["EMO-HV"],
  Dry:       ["SURF-CLAR"],
  Sensitive: ["FLAG"],
  Normal:    [],
};
const SCALP_BOOST_INGREDIENTS = {
  Oily:      ["Salicylic acid","Witch hazel","Tea tree oil","Kaolin clay","Peppermint oil"],
  Dry:       ["Jojoba oil","Argan oil","Castor oil","Avocado oil","Rosemary oil","Niacinamide"],
  Sensitive: ["Niacinamide","Panthenol","Aloe barbadensis leaf juice","Bisabolol"],
  Normal:    ["Rosemary oil","Caffeine","Biotin","Niacinamide"],
};

function scoreProduct(product, productType, profile, routineTags) {
  let score = 0;

  if (productType === "scalp") {
    const scalpType   = profile.scalp || "Normal";
    const tags        = product.tags || [];
    const ingredients = (product.ingredients || []).map(i => i.ingredient_name.toLowerCase());
    const idealTags   = SCALP_IDEAL_TAGS[scalpType] || [];
    const poorTags    = SCALP_POOR_TAGS[scalpType]  || [];
    score += idealTags.filter(t => tags.includes(t)).length * 8;
    score -= poorTags.filter(t => tags.includes(t)).length  * 10;
    const boostIngs = SCALP_BOOST_INGREDIENTS[scalpType] || [];
    for (const ing of boostIngs) { if (ingredients.includes(ing.toLowerCase())) score += 5; }
    if (profile.curl && product.curl_fit?.length > 0 && product.curl_fit.includes(profile.curl)) score += 5;
    score += matrixScore(profile, productType) * 2;
  } else {
    if (profile.curl && product.curl_fit && product.curl_fit.length > 0) {
      if (product.curl_fit.includes(profile.curl)) score += 20;
      else score += product.curl_fit.some(c => curlGroup(c) === profile.curlGroup) ? 10 : -15;
    } else if (!product.curl_fit || product.curl_fit.length === 0) {
      score += 5;
    }
    score += matrixScore(profile, productType) * 4;
    if (profile.porosity && profile.porosity !== "Unknown") {
      const porosityBonusMap = {
        "High":   { ideal:["BOND","PRO-HYD","EMO-HV","EMO-MED"], poor:["SIL-NW"] },
        "Medium": { ideal:["HUM","EMO-MED","FATTY"],              poor:[] },
        "Low":    { ideal:["HUM","EMO-LW","SURF-GEN"],            poor:["EMO-HV","SIL-NW"] },
      };
      const map = porosityBonusMap[profile.porosity];
      if (map) {
        const tags = product.tags || [];
        score += map.ideal.filter(t => tags.includes(t)).length * 5;
        score -= map.poor.filter(t => tags.includes(t)).length  * 8;
      }
      const matrixRow = MATRIX_RAW.find(r => r.goal === profile.goal && r.product_type === productType);
      if (matrixRow?.porosity_modifier) score += (matrixRow.porosity_modifier[profile.porosity] || 0) * 4;
    }
    const matrixRow = MATRIX_RAW.find(r => r.goal === profile.goal && r.product_type === productType);
    if (matrixRow?.density_modifier   && profile.density)   score += (matrixRow.density_modifier[profile.density]     || 0) * 2;
    if (matrixRow?.curl_group_modifier && profile.curlGroup) score += (matrixRow.curl_group_modifier[profile.curlGroup] || 0) * 2;
    if (profile.history?.some(h => ["Color/bleach","Relaxed/permed"].includes(h))) {
      if ((product.tags || []).includes("BOND")) score += 3;
    }
  }

  const warnings = [];
  let excluded = false;
  for (const rule of RULES_RAW) {
    if (!rule.is_active && rule.is_active !== undefined) continue;
    const result = evaluateRule(rule, product, profile, routineTags);
    if (!result.triggered) continue;
    if (result.severity === "exclude")  { excluded = true; break; }
    if (result.severity === "penalize") score += result.adjustment * 2;
    if (result.severity === "boost")    score += result.adjustment * 2;
    if (result.severity === "warn" && result.userMessage) warnings.push(result.userMessage);
  }

  return { score, excluded, warnings };
}

// ── 6. Main engine ────────────────────────────────────────────────────────────

export function runRecommendationEngine(quizAnswers, aiResult = null) {
  const profile = buildProfile(quizAnswers, aiResult);

  const routineSteps = ROUTINE_TMPL_RAW
    .filter(t => t.goal === profile.goal)
    .sort((a,b) => a.step_order - b.step_order);

  const routine = [];
  const globalWarnings = [];
  const routineTagsAccumulator = [];

  for (const step of routineSteps) {
    const { product_type, step_label, frequency, is_required } = step;

    const candidates = PRODUCTS_RAW.filter(p => {
      if (p.product_type !== product_type) return false;
      // Budget filter: if allowedTiers is set, only include products in those tiers
      if (profile.allowedTiers && !profile.allowedTiers.includes(p.tier)) return false;
      return true;
    });

    if (candidates.length === 0) {
      if (is_required) {
        routine.push({ step_label, frequency, product_type, is_required, picks: [], unavailable: true });
      }
      continue;
    }

    const scored = candidates.map(p => {
      const { score, excluded, warnings } = scoreProduct(p, product_type, profile, routineTagsAccumulator);
      return { product: p, score, excluded, warnings };
    }).filter(s => !s.excluded);

    let finalScored = scored;
    if (finalScored.length === 0) {
      finalScored = candidates.map(p => ({
        product: p,
        score: matrixScore(profile, product_type),
        excluded: false,
        warnings: ["This product was flagged for your profile but included as a fallback."],
      }));
    }

    finalScored.sort((a,b) => b.score - a.score);

    // Pick top 1 per tier (respects budget filter since candidates are already filtered)
    const picks = [];
    const seenTiers = new Set();
    for (const s of finalScored) {
      if (!seenTiers.has(s.product.tier)) {
        seenTiers.add(s.product.tier);
        picks.push({ ...s.product, _score: s.score, _warnings: s.warnings });
      }
      if (seenTiers.size === 3) break;
    }

    for (const pick of picks) routineTagsAccumulator.push(...(pick.tags || []));
    for (const pick of picks) {
      for (const w of (pick._warnings || [])) {
        if (!globalWarnings.includes(w)) globalWarnings.push(w);
      }
    }

    routine.push({ step_label, frequency, product_type, is_required, picks });
  }

  // Post-routine rule checks
  for (const rule of RULES_RAW) {
    if (rule.severity !== "warn") continue;
    if (!rule.condition.routine) continue;
    if (!userMatchesCondition(rule.condition, profile)) continue;
    const rc = rule.condition.routine;
    let triggered = false;
    if (rc.missing_all_tags && !routineTagsAccumulator.some(t => rc.missing_all_tags.includes(t))) triggered = true;
    if (rc.count_tags) {
      const count = routineTagsAccumulator.filter(t => t === rc.count_tags.tag).length;
      if (count >= rc.count_tags.min) triggered = true;
    }
    if (triggered && rule.user_message && !globalWarnings.includes(rule.user_message)) {
      globalWarnings.push(rule.user_message);
    }
  }

  return { profile, routine, warnings: globalWarnings };
}

// ── 7. Helpers ────────────────────────────────────────────────────────────────

export function getProfileSummary(quizAnswers, aiResult) {
  return buildProfile(quizAnswers, aiResult);
}

export const TIER_LABELS = {
  drugstore: "Budget-friendly",
  mid:       "Mid-range",
  luxury:    "Premium",
};

export const TYPE_LABELS = {
  shampoo:     "Shampoo",
  conditioner: "Conditioner",
  treatment:   "Treatment",
  "leave-in":  "Leave-In",
  styler:      "Styler",
  scalp:       "Scalp",
};
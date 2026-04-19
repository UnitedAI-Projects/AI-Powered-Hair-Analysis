// src/engine/recommendationEngine.js
//
// Pelora recommendation engine — runs entirely in the browser.
// Consumes products_denormalized.json, matrix_scores.json,
// compatibility_rules.json, and routine_templates.json.
//
// Entry point: runRecommendationEngine(quizAnswers) → { routine, warnings }
// ─────────────────────────────────────────────────────────────────────────────

import PRODUCTS_RAW      from "../data/products_denormalized.json";
import MATRIX_RAW        from "../data/matrix_scores.json";
import RULES_RAW         from "../data/compatibility_rules.json";
import ROUTINE_TMPL_RAW  from "../data/routine_templates.json";

// ── 1. Quiz answer → DB value normalisation ───────────────────────────────────
//
// Goals is now stored as a single string (e.g. "frizz") from the single-select quiz.
// We keep backward compatibility with the array form just in case.

const GOAL_MAP = {
  definition: "More definition",
  frizz:      "Less frizz",
  moisture:   "Moisture + softness",
  length:     "Length retention",
  scalp:      "More definition", // closest proxy — scalp products get boosted separately
};

// goals is a single string. Array form kept for safety.
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

// Hair history: quiz values → DB enum values
const HISTORY_MAP = {
  heat:       "Heat styled",
  relaxer:    "Relaxed/permed",
  color:      "Color/bleach",
  protective: "Protective styles",
  none:       "Virgin",
};

// Curl pattern group for matrix curl_group_modifier
function curlGroup(curl) {
  if (!curl) return null;
  const c = curl.toLowerCase();
  if (c.startsWith("2")) return "wavy";
  if (c.startsWith("3")) return "curly";
  if (c.startsWith("4")) return "coily";
  return null;
}

// ── 2. Build normalised user profile from quiz answers ────────────────────────

function buildProfile(answers, aiResult) {
  // goals is now a single string (e.g. "frizz") from the single-select quiz.
  // Keep backward-compat with old array form just in case.
  const primary   = primaryGoal(answers.goals);
  const dbGoal    = GOAL_MAP[primary] || "More definition";
  const history   = (answers.history || []).map(h => HISTORY_MAP[h]).filter(Boolean);
  const curl      = aiResult?.curlType
                      ? aiResult.curlType.toLowerCase()   // from AI e.g. "3B" → "3b"
                      : answers.visualCurlType             // from tile e.g. "3b"
                        ? answers.visualCurlType.toLowerCase()
                        : null;

  return {
    goal:      dbGoal,
    goalKey:   primary,
    density:   DENSITY_MAP[answers.density]   || "Medium",
    porosity:  POROSITY_MAP[answers.porosity] || "Medium",
    scalp:     SCALP_MAP[answers.scalp]       || "Normal",
    history,
    curl,
    curlGroup: curlGroup(curl),
    coconutSensitive: false,
    damageRecent:     history.includes("Color/bleach"),
  };
}

// ── 3. Matrix scoring ─────────────────────────────────────────────────────────

function matrixScore(profile, productType) {
  const row = MATRIX_RAW.find(r => r.goal === profile.goal && r.product_type === productType);
  if (!row) return 0;

  let score = row.base_score;

  // Porosity modifier
  if (row.porosity_modifier && profile.porosity) {
    score += row.porosity_modifier[profile.porosity] || 0;
  }

  // Density modifier
  if (row.density_modifier && profile.density) {
    score += row.density_modifier[profile.density] || 0;
  }

  // Curl group modifier
  if (row.curl_group_modifier && profile.curlGroup) {
    score += row.curl_group_modifier[profile.curlGroup] || 0;
  }

  return score;
}

// ── 4. Rule evaluation ────────────────────────────────────────────────────────

// Check if a product matches ingredient-level conditions
function productMatchesCondition(cond, product, profile) {
  const pc = cond.product;
  if (!pc) return true;

  // type filter
  if (pc.type && product.product_type !== pc.type) return false;
  if (pc.type_in && !pc.type_in.includes(product.product_type)) return false;
  if (pc.type_not && product.product_type === pc.type_not) return false;

  const tags        = product.tags        || [];
  const tagsTop3    = product.tags_top_3  || [];
  const tagsTop5    = product.tags_top_5  || [];
  const ingredients = (product.ingredients || []).map(i => i.ingredient_name.toLowerCase());

  // has_tags: product must have ALL of these tags anywhere
  if (pc.has_tags) {
    if (!pc.has_tags.some(t => tags.includes(t))) return false;
  }

  // has_all_tags: product must have ALL specified tags
  if (pc.has_all_tags) {
    if (!pc.has_all_tags.every(t => tags.includes(t))) return false;
  }

  // has_any_tags: product must have at least one
  if (pc.has_any_tags) {
    if (!pc.has_any_tags.some(t => tags.includes(t))) return false;
  }

  // missing_all_tags: product must be missing ALL of these
  if (pc.missing_all_tags) {
    if (pc.missing_all_tags.some(t => tags.includes(t))) return false;
  }

  // missing_tags: product must be missing ALL of these (alias)
  if (pc.missing_tags) {
    if (pc.missing_tags.some(t => tags.includes(t))) return false;
  }

  // tags_in_top_n
  if (pc.tags_in_top_n) {
    const { tags: targetTags, n } = pc.tags_in_top_n;
    // Build the top-n tag list dynamically from ordered ingredients
    const orderedTags = (product.ingredients || [])
      .sort((a,b) => a.position - b.position)
      .slice(0, n)
      .map(i => {
        // look up tag from the product's full tag list by matching ingredient name
        // Since we have tags_top_3 and tags_top_5 pre-computed, use those for n=3 or n=5
        return null; // placeholder — we use pre-computed below
      });
    let topNTags;
    if (n <= 3) topNTags = tagsTop3;
    else if (n <= 5) topNTags = tagsTop5;
    else topNTags = tags; // fallback: use all tags
    if (!targetTags.some(t => topNTags.includes(t))) return false;
  }

  // contains_ingredients: product must have ANY of these ingredients
  if (pc.contains_ingredients) {
    if (!pc.contains_ingredients.some(i => ingredients.includes(i.toLowerCase()))) return false;
  }

  // contains_any_ingredients
  if (pc.contains_any_ingredients) {
    if (!pc.contains_any_ingredients.some(i => ingredients.includes(i.toLowerCase()))) return false;
  }

  // contains_ingredients_top_n
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

// Check if user matches user-level conditions
function userMatchesCondition(cond, profile) {
  const uc = cond.user;
  if (!uc) return true;

  if (uc.density   && profile.density   !== uc.density)   return false;
  if (uc.porosity  && profile.porosity  !== uc.porosity)  return false;
  if (uc.scalp     && profile.scalp     !== uc.scalp)     return false;
  if (uc.goal      && profile.goal      !== uc.goal)      return false;
  if (uc.curl      && profile.curl      !== uc.curl.toLowerCase()) return false;

  if (uc.curl_in   && !uc.curl_in.includes(profile.curl))    return false;
  if (uc.porosity_in && !uc.porosity_in.includes(profile.porosity)) return false;

  if (uc.hair_history_contains) {
    if (!profile.history.includes(uc.hair_history_contains)) return false;
  }

  if (uc.coconut_sensitive !== undefined && uc.coconut_sensitive !== profile.coconutSensitive) return false;
  if (uc.damage_recent     !== undefined && uc.damage_recent     !== profile.damageRecent)     return false;

  // Climate rule R021 — we don't have climate data, skip it
  if (uc.climate) return false;

  return true;
}

// Evaluate a single rule against a product + profile
// Returns: { triggered: bool, severity, adjustment, userMessage }
function evaluateRule(rule, product, profile, routineTags) {
  if (!userMatchesCondition(rule.condition, profile)) return { triggered: false };

  // Routine-level conditions (R013, R026)
  if (rule.condition.routine) {
    const rc = rule.condition.routine;
    if (rc.missing_all_tags) {
      // Check if routine is missing bond builders entirely
      if (routineTags.some(t => rc.missing_all_tags.includes(t))) return { triggered: false };
    }
    if (rc.count_tags) {
      const count = routineTags.filter(t => t === rc.count_tags.tag).length;
      if (count < rc.count_tags.min) return { triggered: false };
    }
    return { triggered: true, severity: rule.severity, adjustment: rule.score_adjustment || 0, userMessage: rule.user_message };
  }

  if (!productMatchesCondition(rule.condition, product, profile)) return { triggered: false };

  return {
    triggered:   true,
    severity:    rule.severity,
    adjustment:  rule.score_adjustment || 0,
    userMessage: rule.user_message,
  };
}

// ── 5. Score a single product — 3-tier priority system ───────────────────────
//
// SCALP PRODUCTS: scalp type answer is the #1 priority.
//   We score scalp products on a completely separate track — the user's
//   scalp condition determines the best match before anything else.
//
// ALL OTHER PRODUCTS:
// PRIORITY 1 (weight 40): Curl type fit + goal alignment
// PRIORITY 2 (weight 25): Porosity match
// PRIORITY 3 (weight 10):  Everything else as tiebreakers

// Which ingredient tags are ideal for each scalp type
const SCALP_IDEAL_TAGS = {
  Oily:      ["SCALP","SURF-CLAR","SURF-GEN"],        // clarifying + scalp actives
  Dry:       ["SCALP","EMO-LW","EMO-MED","HUM"],      // nourishing oils + hydration
  Sensitive: ["SCALP","HUM"],                          // gentle actives, no harsh
  Normal:    ["SCALP","EMO-LW","HUM"],                 // light maintenance
};

// Ingredient tags that are poor fits for each scalp type
const SCALP_POOR_TAGS = {
  Oily:      ["EMO-HV"],                              // heavy butters add grease
  Dry:       ["SURF-CLAR"],                           // clarifiers strip dry scalp
  Sensitive: ["FLAG"],                                // fragrance/irritants
  Normal:    [],
};

// Specific ingredients that boost scalp product scores by scalp type
const SCALP_BOOST_INGREDIENTS = {
  Oily:      ["Salicylic acid","Witch hazel","Tea tree oil","Kaolin clay","Peppermint oil"],
  Dry:       ["Jojoba oil","Argan oil","Castor oil","Avocado oil","Rosemary oil","Niacinamide"],
  Sensitive: ["Niacinamide","Panthenol","Aloe barbadensis leaf juice","Bisabolol"],
  Normal:    ["Rosemary oil","Caffeine","Biotin","Niacinamide"],
};

function scoreProduct(product, productType, profile, routineTags) {
  let score = 0;

  // ══════════════════════════════════════════════════════════════════════════
  // SCALP PRODUCTS: different scoring priority track
  // ══════════════════════════════════════════════════════════════════════════
  if (productType === "scalp") {
    const scalpType = profile.scalp || "Normal";
    const tags        = product.tags || [];
    const ingredients = (product.ingredients || []).map(i => i.ingredient_name.toLowerCase());

    // Priority 1 for scalp: ideal tag matches (up to +30)
    const idealTags = SCALP_IDEAL_TAGS[scalpType] || [];
    const poorTags  = SCALP_POOR_TAGS[scalpType]  || [];
    const idealMatches = idealTags.filter(t => tags.includes(t)).length;
    const poorMatches  = poorTags.filter(t => tags.includes(t)).length;
    score += idealMatches * 8;   // strong reward for right ingredient profile
    score -= poorMatches  * 10;  // strong penalty for wrong profile

    // Priority 2 for scalp: specific hero ingredients (+5 each, up to +25)
    const boostIngs = SCALP_BOOST_INGREDIENTS[scalpType] || [];
    for (const ing of boostIngs) {
      if (ingredients.includes(ing.toLowerCase())) score += 5;
    }

    // Priority 3 for scalp: minor curl/goal tiebreaker
    if (profile.curl && product.curl_fit?.length > 0) {
      if (product.curl_fit.includes(profile.curl)) score += 5;
    }
    const base = matrixScore(profile, productType);
    score += base * 2;

    // Apply rules on top
    const warnings = [];
    let excluded = false;
    for (const rule of RULES_RAW) {
      if (!rule.is_active && rule.is_active !== undefined) continue;
      const result = evaluateRule(rule, product, profile, routineTags);
      if (!result.triggered) continue;
      if (result.severity === "exclude") { excluded = true; break; }
      if (result.severity === "penalize") score += result.adjustment * 2;
      if (result.severity === "boost")    score += result.adjustment * 2;
      if (result.severity === "warn" && result.userMessage) warnings.push(result.userMessage);
    }
    return { score, excluded, warnings };
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ALL OTHER PRODUCTS: curl+goal → porosity → tiebreakers
  // ══════════════════════════════════════════════════════════════════════════

  // ── PRIORITY 1: Curl type fit (weight up to 20) ──────────────────────────
  if (profile.curl && product.curl_fit && product.curl_fit.length > 0) {
    if (product.curl_fit.includes(profile.curl)) {
      score += 20;
    } else {
      const userGroup = profile.curlGroup;
      const productMatchesGroup = product.curl_fit.some(c => curlGroup(c) === userGroup);
      score += productMatchesGroup ? 10 : -15;
    }
  } else if (!product.curl_fit || product.curl_fit.length === 0) {
    score += 5; // universal product
  }

  // ── PRIORITY 1: Goal alignment (weight up to 20) ─────────────────────────
  const base = matrixScore(profile, productType);
  score += base * 4;

  // ── PRIORITY 2: Porosity match (weight up to 25) ─────────────────────────
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
    if (matrixRow?.porosity_modifier) {
      score += (matrixRow.porosity_modifier[profile.porosity] || 0) * 4;
    }
  }

  // ── PRIORITY 3: Tiebreakers ───────────────────────────────────────────────
  const matrixRow = MATRIX_RAW.find(r => r.goal === profile.goal && r.product_type === productType);
  if (matrixRow?.density_modifier && profile.density) {
    score += (matrixRow.density_modifier[profile.density] || 0) * 2;
  }
  if (matrixRow?.curl_group_modifier && profile.curlGroup) {
    score += (matrixRow.curl_group_modifier[profile.curlGroup] || 0) * 2;
  }
  if (profile.history?.some(h => ["Color/bleach","Relaxed/permed"].includes(h))) {
    if ((product.tags || []).includes("BOND")) score += 3;
  }

  // ── Compatibility rules ───────────────────────────────────────────────────
  const warnings = [];
  let excluded = false;
  for (const rule of RULES_RAW) {
    if (!rule.is_active && rule.is_active !== undefined) continue;
    const result = evaluateRule(rule, product, profile, routineTags);
    if (!result.triggered) continue;
    if (result.severity === "exclude") { excluded = true; break; }
    if (result.severity === "penalize") score += result.adjustment * 2;
    if (result.severity === "boost")    score += result.adjustment * 2;
    if (result.severity === "warn" && result.userMessage) warnings.push(result.userMessage);
  }

  return { score, excluded, warnings };
}

// ── 6. Main engine ────────────────────────────────────────────────────────────

export function runRecommendationEngine(quizAnswers, aiResult = null) {
  const profile = buildProfile(quizAnswers, aiResult);

  // Get routine template for this goal
  const routineSteps = ROUTINE_TMPL_RAW
    .filter(t => t.goal === profile.goal)
    .sort((a,b) => a.step_order - b.step_order);

  const routine = [];
  const globalWarnings = [];
  const routineTagsAccumulator = []; // grows as we add products — for R026/R013

  for (const step of routineSteps) {
    const { product_type, step_label, frequency, is_required } = step;

    // Filter candidate products for this step
    const candidates = PRODUCTS_RAW.filter(p => p.product_type === product_type);

    if (candidates.length === 0) {
      // No products of this type in DB yet (e.g. conditioner)
      if (is_required) {
        routine.push({
          step_label,
          frequency,
          product_type,
          is_required,
          picks: [],
          unavailable: true,
        });
      }
      continue;
    }

    // Score all candidates
    const scored = candidates.map(p => {
      const { score, excluded, warnings } = scoreProduct(p, product_type, profile, routineTagsAccumulator);
      return { product: p, score, excluded, warnings };
    }).filter(s => !s.excluded);

    if (scored.length === 0) {
      // All products excluded — relax exclusions and just use matrix score
      const fallback = candidates.map(p => ({
        product: p,
        score: matrixScore(profile, product_type),
        excluded: false,
        warnings: ["This product was flagged for your profile but included as a fallback."],
      }));
      scored.push(...fallback);
    }

    // Sort descending
    scored.sort((a,b) => b.score - a.score);

    // Pick top 1 per tier
    const picks = [];
    const seenTiers = new Set();
    for (const s of scored) {
      if (!seenTiers.has(s.product.tier)) {
        seenTiers.add(s.product.tier);
        picks.push({
          ...s.product,
          _score: s.score,
          _warnings: s.warnings,
        });
      }
      if (seenTiers.size === 3) break; // drugstore + mid + luxury
    }

    // Accumulate tags for routine-level rules (R013, R026)
    for (const pick of picks) {
      routineTagsAccumulator.push(...(pick.tags || []));
    }

    // Collect product-level warnings
    for (const pick of picks) {
      for (const w of (pick._warnings || [])) {
        if (!globalWarnings.includes(w)) globalWarnings.push(w);
      }
    }

    routine.push({
      step_label,
      frequency,
      product_type,
      is_required,
      picks,
    });
  }

  // Post-routine rule checks (R013 warn about bond repair, R026 protein overload)
  for (const rule of RULES_RAW) {
    if (rule.severity !== "warn") continue;
    if (!rule.condition.routine) continue;
    if (!userMatchesCondition(rule.condition, profile)) continue;

    const rc = rule.condition.routine;
    let triggered = false;

    if (rc.missing_all_tags) {
      // R013: warn if no BOND tag in entire routine
      if (!routineTagsAccumulator.some(t => rc.missing_all_tags.includes(t))) {
        triggered = true;
      }
    }
    if (rc.count_tags) {
      // R026: warn if too many PRO-HYD
      const count = routineTagsAccumulator.filter(t => t === rc.count_tags.tag).length;
      if (count >= rc.count_tags.min) triggered = true;
    }

    if (triggered && rule.user_message && !globalWarnings.includes(rule.user_message)) {
      globalWarnings.push(rule.user_message);
    }
  }

  return {
    profile,
    routine,
    warnings: globalWarnings,
  };
}

// ── 7. Helper: map quiz answers for display ───────────────────────────────────

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
// src/components/ResultsPage.jsx

import { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { CURL_TYPE_MAP } from "./QuizFlow";

const T = {
  redDeep:"#7A0E1E", redMid:"#9B1B30", redSoft:"#C4485A", redFaint:"#F5D5D8",
  gold:"#C9A03C", goldLight:"#DFC06E", goldPale:"#F7EDCE",
  cream:"#FDFAF4", creamWarm:"#F8F2E8", creamMid:"#EFE6D6",
  brownText:"#3D2B1F", brownMuted:"#5C4A3A", brownLight:"#7A6858",
  green:"#2E7D4F", greenPale:"#E8F5EE",
};
const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'DM Sans', system-ui, sans-serif";

// ── Bullet list ───────────────────────────────────────────────────────────────
function BulletList({ items, type = "neutral" }) {
  const dotBg    = type === "problem" ? "#FEE2E2"    : type === "solution" ? T.greenPale : T.redFaint;
  const dotColor = type === "problem" ? "#B91C1C"    : type === "solution" ? T.green     : T.redMid;
  const dotChar  = type === "problem" ? "!"          : type === "solution" ? "✓"         : "•";
  return (
    <ul style={{margin:0,padding:0,listStyle:"none",display:"flex",flexDirection:"column",gap:7}}>
      {items.map((item, i) => (
        <li key={i} style={{display:"flex",alignItems:"flex-start",gap:8}}>
          <span style={{width:18,height:18,borderRadius:"50%",background:dotBg,color:dotColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0,marginTop:1}}>
            {dotChar}
          </span>
          <span style={{fontSize:13,color:T.brownMuted,lineHeight:1.55}}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionLabel({ children, type }) {
  const color = type === "problem" ? "#B91C1C" : type === "solution" ? T.green : T.brownLight;
  return (
    <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color,marginBottom:6,marginTop:14}}>
      {children}
    </div>
  );
}

// ── Data maps ─────────────────────────────────────────────────────────────────

const POROSITY_MAP = {
  low: {
    label: "Low",
    problems: [
      "Moisture struggles to penetrate the tightly closed cuticle",
      "Products sit on top of hair rather than absorbing",
      "Hair can feel coated or waxy with the wrong products",
    ],
    solutions: [
      "Use water-based, lightweight leave-ins — no heavy butters",
      "Apply products to soaking-wet hair to force absorption",
      "Use gentle heat (warm towel or hooded dryer) during deep conditioning",
      "Look for humectants like glycerin and aloe as top ingredients",
    ],
  },
  normal: {
    label: "Medium",
    problems: [
      "Can swing toward dryness or product buildup if routine is inconsistent",
      "Not immune to damage — bleach or heat can push you toward high porosity",
    ],
    solutions: [
      "Most product types work — you have flexibility",
      "Focus on consistency: a steady routine beats chasing the perfect product",
      "Deep condition every 1–2 weeks to maintain balance",
    ],
  },
  high: {
    label: "High",
    problems: [
      "Moisture absorbs quickly but escapes just as fast",
      "Hair dries out between wash days",
      "Prone to frizz in humidity as cuticle absorbs moisture unevenly",
      "More vulnerable to breakage due to lifted cuticle gaps",
    ],
    solutions: [
      "Seal moisture in with an oil or butter after your leave-in",
      "Use the LOC method: Liquid → Oil → Cream",
      "Protein treatments every 4–6 weeks to fill cuticle gaps",
      "Avoid silicone-heavy products that can build up in open cuticles",
    ],
  },
  unsure: {
    label: "TBD",
    problems: ["Porosity not yet determined"],
    solutions: ["Time your hair's air-dry after washing — under 40 min = high, 40 min–2 hrs = medium, over 2 hrs = low"],
  },
};

const DENSITY_MAP = {
  thin: {
    label: "Thin",
    problems: [
      "Products build up quickly and flatten curl pattern",
      "Roots weigh down easily — volume is hard to maintain",
    ],
    solutions: [
      "Use mousses, light creams, and water-based leave-ins",
      "Avoid heavy butters and oils at the roots",
      "Clarify regularly when hair feels weighed down",
      "Apply products mid-length to ends, not scalp",
    ],
  },
  medium: {
    label: "Medium",
    problems: [
      "Uneven application can cause some sections to feel dry while others feel heavy",
    ],
    solutions: [
      "You can use both light and medium-weight products",
      "Focus on even distribution through all sections",
      "Adjust product weight seasonally — lighter in humidity, richer in dry weather",
    ],
  },
  dense: {
    label: "Dense",
    problems: [
      "Products take longer to distribute evenly through all layers",
      "Uneven application leads to crunchy patches and inconsistent definition",
      "Longer dry time — most guides underestimate how much you need",
    ],
    solutions: [
      "Work in small sections when applying products",
      "Use more product than standard amounts suggest",
      "Diffuse or air-dry longer than average curl guides recommend",
      "Layer products: liquid base first, then cream on top",
    ],
  },
};

const SCALP_MAP = {
  balanced: {
    label: "Balanced",
    problems: ["No major issues — maintain what's working"],
    solutions: [
      "Wash every 1–2 weeks depending on activity level",
      "Scalp massage 1–2x per week to stimulate circulation",
      "Keep a consistent routine — don't fix what isn't broken",
    ],
  },
  oily: {
    label: "Oily",
    problems: [
      "Excess sebum builds up quickly, especially in dense or low-porosity hair",
      "Buildup weighs down roots and can cause scalp odor",
    ],
    solutions: [
      "Use a clarifying shampoo every 1–2 weeks",
      "Avoid heavy scalp oils — they add to the problem",
      "Don't skip wash days, even if ends feel dry",
      "Look for ingredients like salicylic acid or witch hazel",
    ],
  },
  dry: {
    label: "Dry",
    problems: [
      "Itchy, tight scalp that can flake",
      "Dry scalp can signal under-moisturized hair overall",
    ],
    solutions: [
      "Use a gentle, sulfate-free shampoo — no clarifying more than once a month",
      "Apply jojoba or rosemary oil directly to the scalp between wash days",
      "Scalp massages with light oil help restore moisture and circulation",
    ],
  },
  sensitive: {
    label: "Sensitive",
    problems: [
      "Reacts easily to fragrances, alcohols, and harsh surfactants",
      "Redness, itching, or irritation are common with new products",
    ],
    solutions: [
      "Patch test every new product before full use",
      "Prioritize fragrance-free and dye-free formulas",
      "Avoid products with high-alcohol content (ethanol, isopropyl alcohol)",
      "Look for soothing ingredients: aloe, niacinamide, panthenol",
    ],
  },
};

const CURL_CHALLENGES = {
  wavy: {
    label: "Frizz & Definition Loss",
    problems: [
      "Waves flatten easily under heavy products",
      "Humidity disrupts the pattern and causes frizz",
      "Hard to balance moisture without losing volume",
    ],
    goals: {
      definition: ["Scrunch product into soaking-wet hair — don't rake", "Let waves air-dry completely before touching", "A light-hold mousse or gel maintains pattern without weight"],
      frizz:      ["Anti-humidity gel or mousse is your best defense", "Diffuse on low speed to set the pattern before humidity hits", "Avoid touching hair while it dries"],
      moisture:   ["Choose lightweight leave-ins over heavy creams", "Heavy products flatten wave pattern instead of hydrating it", "Mist with water + leave-in between wash days"],
      length:     ["Use heat protectant every time — no exceptions", "Gentle detangling prevents mid-shaft splits from friction", "Trim split ends every 8–12 weeks to prevent breakage climbing up"],
      scalp:      ["Clarify every 1–2 weeks — buildup weighs waves flat", "A lifted root makes waves look more defined overall", "Avoid applying heavy products directly to scalp"],
    },
  },
  curly: {
    label: "Frizz, Shrinkage & Dryness",
    problems: [
      "Sebum can't travel down the curl spiral easily — dryness is constant",
      "Significant shrinkage makes length feel invisible",
      "Frizz forms when the cuticle absorbs uneven moisture from air",
    ],
    goals: {
      definition: ["Apply product to soaking-wet hair in sections", "Scrunch upward and don't disturb curls until fully dry", "Gel over cream for stronger cast and definition"],
      frizz:      ["Seal cuticle with gel before humidity can affect it", "Apply in small sections so every curl is coated evenly", "Scrunch out the gel cast only when 100% dry"],
      moisture:   ["Deep condition weekly — not monthly", "Use the LOC method: Liquid, Oil, then Cream", "Seal ends every few days to prevent tip dryness"],
      length:     ["Protective styles reduce daily manipulation and breakage", "Trim every 10–12 weeks — split ends travel upward fast", "Keep ends moisturized — they're the oldest and most fragile part"],
      scalp:      ["Scalp health drives curl strength at the root", "Scalp massage 2x per week stimulates growth", "Don't neglect your scalp during protective styles"],
    },
  },
  coily: {
    label: "Shrinkage, Dryness & Breakage",
    problems: [
      "Shrinkage of 50–75% makes true length hard to see",
      "Highest moisture need of any curl type — dryness returns quickly",
      "Tight pattern creates more points where breakage can occur",
    ],
    goals: {
      definition: ["Shingling or finger-coiling on very wet, product-loaded hair works best", "Work section by section — rushing causes uneven definition", "A firm hold cream or gel maintains coil shape through the day"],
      frizz:      ["Seal with a butter or heavy cream after leave-in", "The LOC or LOCO method is essential — don't skip the oil step", "Satin bonnet at night preserves definition and prevents frizz"],
      moisture:   ["Layer moisture every step: water → leave-in → oil → cream", "Skipping any layer causes dryness to return within a day", "Re-moisturize between wash days — don't wait for dryness"],
      length:     ["Protective styles are your best length retention tool", "Satin bonnet or pillowcase every night — no exceptions", "Moisturize under protective styles — don't 'set and forget'"],
      scalp:      ["Scalp oils + massage weekly keeps follicles healthy", "Don't neglect scalp in protective styles — buildup stunts growth", "Rosemary or peppermint oil are proven scalp stimulants"],
    },
  },
};

function getCurlGroup(curlType) {
  if (!curlType) return null;
  const c = curlType.toLowerCase();
  if (c.startsWith("2")) return "wavy";
  if (c.startsWith("3")) return "curly";
  if (c.startsWith("4")) return "coily";
  return null;
}

const BUDGET_INSIGHTS = {
  drugstore: {
    label: "Drugstore",
    wavy:  { pros: ["Many drugstore mousses and gels work excellently for wavy hair","Lighter formulas common at this tier are ideal for fine waves","Easy to find and replace — great for experimenting"], cons: ["Sulfates in shampoos can strip natural oils and cause frizz","Some gels contain drying alcohols (ethanol, SD alcohol) — check labels","Fragrance is common and can irritate sensitive scalps"] },
    curly: { pros: ["Budget tier has improved dramatically — brands like SheaMoisture offer quality at low cost","Good for experimenting to find what works before investing more","Conditioners at this tier are often underrated for curly hair"], cons: ["Sulfates and silicones are common — both can disrupt curl pattern over time","Moisture content tends to be lower — you may need to use more product","Harder to find protein-moisture balance without reading every label"] },
    coily: { pros: ["Eco Styler gel and similar drugstore staples are cult favorites for coily hair","Heavy butters and oils at this tier can be just as effective as luxury versions","Good for building a basics routine before optimizing"], cons: ["Sulfate shampoos are very stripping for coily hair — look for sulfate-free","Many products contain mineral oil or petrolatum which block moisture absorption","Labels at this tier often don't disclose full ingredient order"] },
  },
  mid: {
    label: "Mid-Range",
    wavy:  { pros: ["Better ingredient transparency and cleaner formulas than most drugstore options","More targeted wavy-hair products (curl creams, wave enhancers) at this tier","Reduced sulfates and alcohol — less risk of frizz-inducing ingredients"], cons: ["Some mid-range products are still heavy for fine wavy hair — read the formula","Higher cost makes it harder to experiment freely"] },
    curly: { pros: ["Most curl-specific brands live in this tier (Ouidad, Curl Smith, etc.)","Better moisture payoff per application — you tend to use less product","More likely to be sulfate-free, silicone-free, and alcohol-free"], cons: ["Price can add up quickly if you're layering multiple products","Not all mid-range products are worth the upgrade — some are just rebranded drugstore formulas"] },
    coily: { pros: ["Dedicated coily-hair brands (Mielle, Camille Rose) are well-represented here","Higher butter and oil content with cleaner carrier ingredients","Better protein-moisture balance options than drugstore"], cons: ["Still need to check labels — some mid-range brands use cheap fillers as top ingredients","Fragrance is still common even at this tier"] },
  },
  luxury: {
    label: "Luxury",
    wavy:  { pros: ["Cleanest formulas with highest-quality humectants and film-formers","Often fragrance-free or naturally scented — better for sensitive scalps","Lightweight luxury leave-ins and serums are ideal for wavy hair"], cons: ["Significant cost for a hair type that often does well with simpler products","Diminishing returns are real — wavy hair doesn't always need luxury-tier ingredients"] },
    curly: { pros: ["Premium ingredients like baobab oil, silk proteins, and ceramides make a real difference","Best-in-class moisture retention and frizz control","Smaller amounts needed per application — cost-per-use is better than it looks"], cons: ["Easy to over-invest — a $50 conditioner isn't always better than a $15 one","Some luxury brands market heavily to curly hair without the formula to back it up"] },
    coily: { pros: ["Luxury butters and oils (mango, shea, avocado) have superior slip and moisture payoff","Bond-building treatments at this tier are genuinely effective for damaged coily hair","Worth the investment for treatments — you use less and results last longer"], cons: ["Everyday stylers don't need to be luxury — save the spend for treatments","Some products are priced for the brand, not the formula — always check ingredients"] },
  },
  mix: {
    label: "Mix It Up",
    wavy:  { pros: ["Spend more on shampoo and conditioner — they affect frizz most for wavy hair","Drugstore gels and mousses often perform as well as luxury for hold","Flexibility lets you try more products and find what actually works"], cons: ["Without a strategy, mixing tiers can lead to ingredient conflicts","Easy to accumulate products without building a consistent routine"] },
    curly: { pros: ["Strategic mixing is ideal: mid-range conditioner + drugstore styler is a common winning combo","Spend more on leave-ins and treatments, less on everyday stylers","Flexibility to experiment without full commitment"], cons: ["Requires more label-reading to avoid conflicting ingredients across tiers","Without a clear routine, mixing can make it hard to know what's working"] },
    coily: { pros: ["Best strategy: invest in a good leave-in and treatment, save on stylers","Drugstore sealants (castor oil, raw shea) often outperform luxury versions","More product variety means you can rotate and prevent buildup sensitivity"], cons: ["Coily hair is ingredient-sensitive — mixing tiers without reading labels can cause buildup","Hard to track what's working without isolating variables"] },
  },
};

const HISTORY_INSIGHTS = {
  none:      { label:"Virgin Hair",              problems:[],                                                                                                                                                                                                        solutions:["Cuticle is intact — moisture retention is at its strongest baseline","Your natural curl pattern is undisrupted","Focus on building a consistent routine rather than repairing damage","You have the most flexibility with products and techniques"] },
  heat:      { label:"Heat Styling History",     problems:["Hydrogen bonds that define your curl shape weaken over time","Curls may be looser or less springy than your natural pattern","Increased frizz and reduced elasticity are common signs"],                solutions:["Use heat protectant every single time — no exceptions","Reduce heat frequency: stretch styles, roller sets, or twist-outs instead","Protein treatment every 4–6 weeks to rebuild strength","Deep condition after every heat styling session"] },
  relaxer:   { label:"Chemical Relaxer / Perm",  problems:["Disulfide bonds are permanently altered — the structure changed at the cortex","If transitioning, two textures (new growth + processed) require different care","Higher breakage risk at the line of demarcation where textures meet"], solutions:["Bond-building treatments (look for bis-aminopropyl diglycol dimaleate) are essential","Deep condition weekly — moisture is critical during transition","Avoid any additional chemical processes until hair recovers strength","Trim processed ends gradually rather than one big cut if possible"] },
  color:     { label:"Color or Bleach",          problems:["Coloring raises and roughens the cuticle, increasing porosity","Bleach removes protein from the cortex — hair is structurally weaker","Dryness, brittleness, and breakage increase with lightening level"],     solutions:["Protein treatment every 2–4 weeks to fill cuticle gaps","Moisture immediately after protein — protein without moisture causes brittleness","Avoid excessive heat on color-treated hair","Be extra gentle when detangling — start from ends, work upward"] },
  protective:{ label:"Protective Styling",       problems:["Neglect under styles causes dryness and matting","Styles worn too long cause tension at the roots","Buildup can occur at the scalp without regular cleansing"],                                         solutions:["Moisturize scalp and visible hair every 3–5 days under protective styles","Don't exceed 6–8 weeks in any single style","Clarify scalp gently when you take the style down","Let hair rest between protective styles before re-installing"] },
  multiple:  { label:"Multiple Treatments",      problems:["Cumulative damage to the cuticle is significant","Hair may behave differently in different sections","Protein-moisture balance is harder to maintain"],                                                   solutions:["Bond-building treatments are your highest priority (bis-aminopropyl diglycol dimaleate)","Deep condition every wash day — not every other","Be gentle with heat and manipulation while hair recovers","Give hair time between any additional chemical services"] },
};

function getHistoryInsight(history) {
  if (!history || history.length === 0 || (history.length === 1 && history[0] === "none")) return HISTORY_INSIGHTS.none;
  const meaningful = history.filter(h => h !== "none");
  if (meaningful.length > 1) return HISTORY_INSIGHTS.multiple;
  return HISTORY_INSIGHTS[meaningful[0]] || HISTORY_INSIGHTS.none;
}

// ── Session cache ─────────────────────────────────────────────────────────────
function getCacheKey(answers, curlType) {
  return `pelora_goal_synthesis_${curlType}_${answers.porosity}_${answers.density}_${answers.scalp}_${answers.goals}_${answers.budget}_${(answers.history||[]).join("-")}`;
}
function getCached(answers, curlType) {
  try { const v = sessionStorage.getItem(getCacheKey(answers, curlType)); return v ? JSON.parse(v) : null; }
  catch { return null; }
}
function setCache(answers, curlType, data) {
  try { sessionStorage.setItem(getCacheKey(answers, curlType), JSON.stringify(data)); }
  catch {}
}

// ── AI synthesis section ──────────────────────────────────────────────────────
const GOAL_DISPLAY = {
  definition: "More Curl Definition",
  frizz:      "Less Frizz",
  moisture:   "More Moisture & Softness",
  length:     "Length Retention",
  scalp:      "Healthier Scalp",
};

function GoalSynthesis({ answers, curlType, curlTypeName }) {
  const [status,   setStatus]   = useState("idle");
  const [data,     setData]     = useState(null);
  const [error,    setError]    = useState(null);

  const goalLabel = GOAL_DISPLAY[answers.goals] || "your goal";

  useEffect(() => {
    if (!curlType || !answers.porosity) return;

    const cached = getCached(answers, curlType);
    if (cached) { setData(cached); setStatus("done"); return; }

    let cancelled = false;
    setStatus("loading");

    fetch("/api/analyze-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, curlType, curlTypeName }),
    })
      .then(res => {
        if (!res.ok) return res.json().then(e => { throw new Error(e.error || `Error ${res.status}`); });
        return res.json();
      })
      .then(result => {
        if (!cancelled) { setCache(answers, curlType, result); setData(result); setStatus("done"); }
      })
      .catch(err => {
        if (!cancelled) { setError(err.message); setStatus("error"); }
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section style={{maxWidth:860,margin:"0 auto",padding:"0 24px 70px"}}>
      <div style={{background:"#fff",borderRadius:20,border:`1px solid ${T.creamMid}`,overflow:"hidden"}}>

        {/* Header strip */}
        <div style={{background:`linear-gradient(135deg,${T.redDeep},${T.redMid})`,padding:"20px 28px",display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🎯</div>
          <div>
            <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.16em",textTransform:"uppercase",color:"rgba(255,255,255,0.7)",marginBottom:3}}>Your goal</div>
            <div style={{fontFamily:serif,fontSize:20,fontWeight:500,color:"#fff",lineHeight:1.1}}>{goalLabel}</div>
          </div>
          <div style={{marginLeft:"auto",fontSize:11,color:"rgba(255,255,255,0.5)",fontStyle:"italic"}}>AI-generated</div>
        </div>

        {/* Body */}
        <div style={{padding:"24px 28px"}}>

          {/* Loading */}
          {status === "loading" && (
            <div style={{display:"flex",alignItems:"center",gap:14,padding:"8px 0"}}>
              <div style={{width:28,height:28,borderRadius:"50%",border:`2px solid ${T.creamMid}`,borderTopColor:T.redMid,animation:"pel-spin 1s linear infinite",flexShrink:0}}/>
              <span style={{fontSize:14,color:T.brownMuted,fontWeight:400}}>Connecting the dots for your profile…</span>
              <style>{`@keyframes pel-spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
              <span style={{fontSize:13,color:T.brownMuted}}>Couldn't generate your analysis right now.</span>
              <button
                onClick={() => {
                  try { sessionStorage.removeItem(getCacheKey(answers, curlType)); } catch {}
                  setError(null); setStatus("loading");
                  fetch("/api/analyze-profile", {
                    method:"POST", headers:{"Content-Type":"application/json"},
                    body: JSON.stringify({ answers, curlType, curlTypeName }),
                  })
                    .then(r => r.json()).then(result => { setCache(answers, curlType, result); setData(result); setStatus("done"); })
                    .catch(err => { setError(err.message); setStatus("error"); });
                }}
                style={{fontSize:12,fontWeight:500,padding:"7px 18px",borderRadius:100,border:`1px solid ${T.redMid}`,background:"transparent",color:T.redMid,cursor:"pointer",fontFamily:sans,flexShrink:0}}>
                Try again
              </button>
            </div>
          )}

          {/* Result */}
          {status === "done" && data && (
            <>
              <p style={{fontSize:14,fontWeight:400,color:T.brownText,lineHeight:1.7,marginBottom:20,marginTop:0}}>
                {data.intro}
              </p>
              <ul style={{margin:0,padding:0,listStyle:"none",display:"flex",flexDirection:"column",gap:10}}>
                {(data.bullets || []).map((b, i) => (
                  <li key={i} style={{display:"flex",alignItems:"flex-start",gap:10}}>
                    <span style={{width:22,height:22,borderRadius:"50%",background:T.redFaint,color:T.redMid,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0,marginTop:1}}>
                      {i + 1}
                    </span>
                    <span style={{fontSize:14,color:T.brownMuted,lineHeight:1.6}}>{b}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

        </div>
      </div>
    </section>
  );
}

// ── Shared card shell ─────────────────────────────────────────────────────────
function ProfileCard({ icon, label, value, children }) {
  return (
    <div style={{background:"#fff",borderRadius:16,padding:"24px 20px",border:`1px solid ${T.creamMid}`}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:"#fce8eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{icon}</div>
        <span style={{fontSize:12,fontWeight:500,color:T.brownMuted}}>{label}</span>
      </div>
      <div style={{fontFamily:serif,fontSize:26,fontWeight:600,color:T.redMid,marginBottom:12,lineHeight:1.1}}>{value}</div>
      {children}
    </div>
  );
}

// ── Results hero ──────────────────────────────────────────────────────────────
function ResultsHero({ curlType, curlTypeName }) {
  return (
    <div style={{padding:"120px 24px 40px",textAlign:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:"-200px",left:"50%",transform:"translateX(-50%)",width:700,height:700,borderRadius:"50%",background:`radial-gradient(circle,${T.redFaint} 0%,transparent 70%)`,pointerEvents:"none",opacity:0.5}}/>
      <div style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:11,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:T.redDeep,background:T.redFaint,padding:"7px 18px",borderRadius:100,marginBottom:20,position:"relative",animation:"pel-fadeUp 0.5s ease 0.1s both"}}>
        Your curl profile
      </div>
      <h1 style={{fontFamily:serif,fontSize:"clamp(32px,5vw,52px)",fontWeight:500,lineHeight:1.15,color:T.brownText,marginBottom:10,position:"relative",animation:"pel-fadeUp 0.6s ease 0.2s both"}}>
        {curlType
          ? <>You have <em style={{fontStyle:"italic",background:`linear-gradient(135deg,${T.redDeep},${T.redMid})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Type {curlType}</em> curls.</>
          : <>Meet your <em style={{fontStyle:"italic",background:`linear-gradient(135deg,${T.redDeep},${T.redMid})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>curls.</em></>
        }
      </h1>
      {curlTypeName && (
        <p style={{fontFamily:serif,fontSize:"clamp(16px,2vw,20px)",fontWeight:400,fontStyle:"italic",color:T.brownMuted,marginBottom:0,position:"relative",animation:"pel-fadeUp 0.6s ease 0.35s both"}}>
          {curlTypeName}
        </p>
      )}
    </div>
  );
}

// ── Row 1 ─────────────────────────────────────────────────────────────────────
function HairInsights({ porosity, density, scalp }) {
  const p = POROSITY_MAP[porosity] || POROSITY_MAP.unsure;
  const d = DENSITY_MAP[density]   || { label:"—", problems:[], solutions:[] };
  const s = SCALP_MAP[scalp]       || { label:"—", problems:[], solutions:[] };
  return (
    <section style={{maxWidth:860,margin:"0 auto",padding:"0 24px 24px"}}>
      <div style={{fontSize:11,fontWeight:500,letterSpacing:"0.16em",textTransform:"uppercase",color:T.redMid,marginBottom:10}}>Your hair profile</div>
      <h2 style={{fontFamily:serif,fontSize:"clamp(26px,4vw,34px)",fontWeight:500,color:T.brownText,lineHeight:1.2,marginBottom:8}}>What makes your curls unique</h2>
      <p style={{fontSize:14,fontWeight:400,color:T.brownMuted,lineHeight:1.6,marginBottom:36}}>Understanding these characteristics is the foundation of an effective curl routine.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16}}>
        <ProfileCard icon="💧" label="Hair Porosity" value={p.label}>
          {p.problems.length > 0 && <><SectionLabel type="problem">Challenges</SectionLabel><BulletList items={p.problems} type="problem"/></>}
          <SectionLabel type="solution">Tips</SectionLabel><BulletList items={p.solutions} type="solution"/>
        </ProfileCard>
        <ProfileCard icon="✨" label="Hair Density" value={d.label}>
          {d.problems.length > 0 && <><SectionLabel type="problem">Challenges</SectionLabel><BulletList items={d.problems} type="problem"/></>}
          <SectionLabel type="solution">Tips</SectionLabel><BulletList items={d.solutions} type="solution"/>
        </ProfileCard>
        <ProfileCard icon="🌿" label="Scalp Type" value={s.label}>
          {s.problems.length > 0 && <><SectionLabel type="problem">Challenges</SectionLabel><BulletList items={s.problems} type="problem"/></>}
          <SectionLabel type="solution">Tips</SectionLabel><BulletList items={s.solutions} type="solution"/>
        </ProfileCard>
      </div>
    </section>
  );
}

// ── Row 2 ─────────────────────────────────────────────────────────────────────
function HairContext({ curlType, history, goal, budget }) {
  const group         = getCurlGroup(curlType);
  const challengeData = group ? CURL_CHALLENGES[group] : null;
  const goalTips      = challengeData ? (challengeData.goals[goal] || []) : [];
  const historyData   = getHistoryInsight(history);
  const budgetKey     = budget || "mix";
  const budgetData    = BUDGET_INSIGHTS[budgetKey] || BUDGET_INSIGHTS.mix;
  const budgetGroup   = group || "curly";
  const budgetTier    = budgetData[budgetGroup] || budgetData.curly;
  return (
    <section style={{maxWidth:860,margin:"0 auto",padding:"0 24px 70px"}}>
      <div style={{height:1,background:T.creamMid,marginBottom:36}}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16}}>
        <ProfileCard icon="⚡" label="Common Challenges" value={challengeData ? challengeData.label : "—"}>
          <SectionLabel type="problem">What to watch for</SectionLabel>
          <BulletList items={challengeData ? challengeData.problems : ["Complete the quiz for your challenges."]} type="problem"/>
          {goalTips.length > 0 && <><SectionLabel type="solution">For your goal</SectionLabel><BulletList items={goalTips} type="solution"/></>}
        </ProfileCard>
        <ProfileCard icon="💰" label="Your Budget" value={budgetData.label}>
          <SectionLabel type="solution">Advantages</SectionLabel><BulletList items={budgetTier.pros} type="solution"/>
          <SectionLabel type="problem">Watch out for</SectionLabel><BulletList items={budgetTier.cons} type="problem"/>
        </ProfileCard>
        <ProfileCard icon="📋" label="Your Hair History" value={historyData.label}>
          {historyData.problems.length > 0 && <><SectionLabel type="problem">Effects on your hair</SectionLabel><BulletList items={historyData.problems} type="problem"/></>}
          <SectionLabel type="solution">{historyData.problems.length > 0 ? "How to recover" : "Your advantage"}</SectionLabel>
          <BulletList items={historyData.solutions} type="solution"/>
        </ProfileCard>
      </div>
    </section>
  );
}

// ── Tools section ─────────────────────────────────────────────────────────────
function ToolsSection() {
  const tools = [
    {name:"Praying hands method",      desc:"Smooth product through your curls with flat palms to distribute evenly and reduce frizz without disrupting your curl pattern.", tag:"Technique"},
    {name:"Microfiber towel / T-shirt",desc:"Ditch the terry cloth — microfiber or a cotton t-shirt reduces friction and prevents frizz while drying.",                       tag:"Tool"},
    {name:"Plopping",                  desc:"Wrap wet curls in a t-shirt on top of your head for 15–30 minutes to set your curl pattern and absorb excess water gently.",     tag:"Technique"},
    {name:"Diffuser attachment",       desc:"Use a diffuser on low heat and low speed to dry curls without disturbing their shape — cup curls upward toward the scalp.",       tag:"Tool"},
    {name:"Pineapple technique",       desc:"Gather curls into a loose, high ponytail before bed using a silk scrunchie — preserves curls overnight.",                         tag:"Technique"},
    {name:"Silk or satin pillowcase",  desc:"Reduces friction while you sleep, preventing breakage and frizz — a must-have for maintaining defined curls overnight.",          tag:"Tool"},
  ];
  return (
    <section style={{padding:"70px 24px",maxWidth:860,margin:"0 auto"}}>
      <div style={{fontSize:11,fontWeight:500,letterSpacing:"0.16em",textTransform:"uppercase",color:T.redMid,marginBottom:10}}>Technique library</div>
      <h2 style={{fontFamily:serif,fontSize:"clamp(26px,4vw,34px)",fontWeight:500,color:T.brownText,marginBottom:8}}>Tools &amp; techniques</h2>
      <p style={{fontSize:14,fontWeight:400,color:T.brownMuted,lineHeight:1.6,marginBottom:36}}>The right method matters as much as the right product.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16}}>
        {tools.map((t,i)=>(
          <div key={i} style={{background:"#fff",borderRadius:14,padding:"20px",border:`1px solid ${T.creamMid}`,display:"flex",gap:14}}>
            <div style={{width:36,height:36,borderRadius:10,background:T.redFaint,color:T.redDeep,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 12l3 3 5-5"/></svg>
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:500,color:T.brownText,marginBottom:4}}>{t.name}</div>
              <div style={{fontSize:13,fontWeight:400,color:T.brownMuted,lineHeight:1.55,marginBottom:8}}>{t.desc}</div>
              <span style={{fontSize:10,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",color:T.brownLight,background:T.creamMid,padding:"3px 10px",borderRadius:100}}>{t.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Challenge CTA ─────────────────────────────────────────────────────────────
function ChallengeCTA({ onNavigate }) {
  return (
    <section style={{padding:"0 24px 70px"}}>
      <div style={{maxWidth:860,margin:"0 auto"}}>
        <div style={{background:`linear-gradient(135deg,${T.redDeep},${T.redMid})`,borderRadius:24,padding:"52px 40px",textAlign:"center",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:"-80px",right:"-80px",width:300,height:300,borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>
          <div style={{position:"relative"}}>
            <div style={{fontSize:11,fontWeight:500,letterSpacing:"0.16em",textTransform:"uppercase",color:"rgba(255,255,255,0.75)",marginBottom:12}}>Your next step</div>
            <h2 style={{fontFamily:serif,fontSize:"clamp(26px,4vw,36px)",fontWeight:500,color:"#fff",lineHeight:1.2,marginBottom:12}}>Start your 4-week<br/>curl transformation</h2>
            <p style={{fontSize:14,fontWeight:400,color:"rgba(255,255,255,0.85)",lineHeight:1.7,maxWidth:440,margin:"0 auto 32px"}}>Daily challenges, streaks, and badges personalized to your curl profile. Build healthy habits that stick.</p>
            <button onClick={()=>onNavigate("challenge")} style={{display:"inline-flex",alignItems:"center",gap:8,fontFamily:sans,fontSize:14,fontWeight:500,padding:"16px 40px",border:"none",borderRadius:100,background:"#fff",color:T.redDeep,cursor:"pointer",transition:"all 0.3s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.15)"}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
              Begin the Challenge →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function ResultsPage({ answers, aiResult, recs, onNavigate }) {
  const fallback     = CURL_TYPE_MAP[answers?.visualCurlType?.toLowerCase()] || {};
  const curlType     = aiResult?.curlType     || fallback.curlType     || null;
  const curlTypeName = aiResult?.curlTypeName || fallback.curlTypeName || null;

  return (
    <div style={{fontFamily:sans,background:T.cream}}>
      <style>{`@keyframes pel-fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <Navbar onNavigate={onNavigate} activeScreen="results" quizLabel="Retake Quiz" />
      <ResultsHero curlType={curlType} curlTypeName={curlTypeName}/>
      <HairInsights porosity={answers.porosity} density={answers.density} scalp={answers.scalp}/>
      <HairContext curlType={curlType} history={answers.history} goal={answers.goals} budget={answers.budget}/>
      <GoalSynthesis answers={answers} curlType={curlType} curlTypeName={curlTypeName}/>
      <ToolsSection/>
      <ChallengeCTA onNavigate={onNavigate}/>
      <footer style={{padding:"36px 40px",borderTop:`1px solid ${T.creamMid}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <span style={{fontFamily:serif,fontSize:20,fontWeight:600,fontStyle:"italic",background:`linear-gradient(135deg,${T.redMid},${T.redSoft})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>pelora</span>
        <p style={{fontSize:12,color:T.brownLight,fontWeight:400}}>Built for waves, curls, coils &amp; all textures in between.</p>
        <p style={{fontSize:12,color:T.brownLight,fontWeight:400}}>© 2026 Pelora</p>
      </footer>
    </div>
  );
}
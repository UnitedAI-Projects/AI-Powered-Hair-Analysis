import { useState, useRef } from "react";

const C = {
  cream:   "#FFF7EC",
  light:   "#D7D2DC",
  mid:     "#A88BBA",
  primary: "#765392",
  deep:    "#49266D",
};

// ── Logo ──────────────────────────────────────────────────────────────────────
function PeloraLogo({ size = 56 }) {
  return (
    <img
      src="pelora-logo.png"
      alt="Pelora logo"
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}

// ── Product Database ──────────────────────────────────────────────────────────
const PRODUCTS = [
  { id:1,  name:"Ever Pure Sulfate-Free Bond Repair Shampoo", brand:"L'Oreal",               category:"cleanser",   tier:"budget",   price:"$11",    porosity:["normal"],        goals:["definition"],          history:["none"],                   journey:["start"],                  img:"https://m.media-amazon.com/images/I/61ZPqFEQtNL._SL1500_.jpg" },
  { id:2,  name:"No. 4 Bond Maintenance Shampoo",             brand:"Olaplex",               category:"cleanser",   tier:"midrange", price:"$34",    porosity:["high"],          goals:["damage"],              history:["relaxer","color"],         journey:["transitioning"],          img:"https://yourhairshop.nl/wp-content/uploads/2021/03/Olaplex-No.4-Bond-Maintenance-Shampoo-250ml.jpg" },
  { id:3,  name:"Rice Water Shampoo",                         brand:"As I Am",               category:"cleanser",   tier:"budget",   price:"$9.92",  porosity:["high"],          goals:["volume"],              history:["heat","keratin"],          journey:["routine"],                img:"https://cgn-mig.farmaline.be/images/mp/prod/a618bda0b40548cb86e5118dda17bc8a" },
  { id:4,  name:"Pomegranate & Honey Moisturizing Shampoo",   brand:"Mielle",                category:"cleanser",   tier:"budget",   price:"$13",    porosity:["low"],           goals:["definition"],          history:["none"],                   journey:["levelup"],                img:"https://m.media-amazon.com/images/I/61pPpu6nowL._SL1500_.jpg" },
  { id:5,  name:"Intensive Hydration Hair Masque",            brand:"SheaMoisture",          category:"conditioner",tier:"budget",   price:"$12.97", porosity:["normal"],        goals:["definition"],          history:["none"],                   journey:["start"],                  img:"https://m.media-amazon.com/images/I/81IsTPffvqL._SL1500_.jpg" },
  { id:6,  name:"Curl Quenching Conditioning Co-Wash",        brand:"Curlsmith",             category:"conditioner",tier:"midrange", price:"$26",    porosity:["high"],          goals:["damage"],              history:["relaxer","color"],         journey:["transitioning"],          img:"https://m.media-amazon.com/images/I/61OOkmoL2zL._SX522_.jpg" },
  { id:7,  name:"Moisture Repair Conditioner",                brand:"Moroccanoil",           category:"conditioner",tier:"midrange", price:"$30",    porosity:["normal"],        goals:["volume","definition"], history:["heat"],                   journey:["routine","levelup"],      img:"https://m.media-amazon.com/images/I/71Q3rCIzRLL._SL1500_.jpg" },
  { id:8,  name:"Cica Chroma Strengthening Conditioner",      brand:"Kerastase",             category:"conditioner",tier:"premium",  price:"$50",    porosity:["high"],          goals:["damage"],              history:["color","relaxer"],         journey:["transitioning","levelup"],img:"https://m.media-amazon.com/images/I/51w8SUpkZIL._SL1500_.jpg" },
  { id:9,  name:"Curl Love Moisture Milk",                    brand:"Camille Rose",          category:"leave-in",   tier:"budget",   price:"$12.58", porosity:["low"],           goals:["definition"],          history:["none"],                   journey:["start","routine"],        img:"https://m.media-amazon.com/images/I/71nYMRPuSQL._SL1500_.jpg" },
  { id:10, name:"Thirsty Girl Coconut Milk Leave-In",         brand:"IGK",                   category:"leave-in",   tier:"midrange", price:"$33",    porosity:["normal"],        goals:["volume","definition"], history:["heat","none"],             journey:["routine","levelup"],      img:"https://m.media-amazon.com/images/I/41h0x-ZeAlL._SX522_.jpg" },
  { id:11, name:"Curl Quencher Hydrafusion Intense Curl Cream",brand:"Ouidad",               category:"styling",    tier:"midrange", price:"$23",    porosity:["normal"],        goals:["definition"],          history:["none","heat"],             journey:["start","routine"],        img:"https://m.media-amazon.com/images/I/61w0CaNjTLL._SL1500_.jpg" },
  { id:12, name:"Multi-Use Mousse Texture Foam",              brand:"The Doux",              category:"styling",    tier:"budget",   price:"$15",    porosity:["low"],           goals:["volume"],              history:["none"],                   journey:["start","routine","levelup"],img:"https://m.media-amazon.com/images/I/71w6AZS0qWL._SL1500_.jpg" },
  { id:13, name:"Anti-Frizz Hair Styling Cream",              brand:"Ouai",                  category:"styling",    tier:"midrange", price:"$30",    porosity:["high"],          goals:["definition"],          history:["heat","none"],             journey:["levelup"],                img:"https://m.media-amazon.com/images/I/51FxBMUiccL._SL1500_.jpg" },
  { id:14, name:"Two Step Protein Treatment",                 brand:"Aphogee",               category:"treatment",  tier:"budget",   price:"$12",    porosity:["high"],          goals:["damage","length"],     history:["relaxer","color","heat"],  journey:["transitioning"],          img:"https://m.media-amazon.com/images/I/61v3YnHOs7L._SL1500_.jpg" },
  { id:15, name:"Plant Power Mask",                           brand:"Sienna Naturals",       category:"treatment",  tier:"midrange", price:"$34",    porosity:["low"],           goals:["definition","damage"], history:["none","heat"],             journey:["routine","levelup"],      img:"https://m.media-amazon.com/images/I/61Q8bqVdHSL._SL1500_.jpg" },
  { id:16, name:"Leave-In Molecular Repair Hair Mask",        brand:"K18 Biomimetic Hairscience",category:"treatment",tier:"premium",price:"$75",   porosity:["high"],          goals:["damage"],              history:["color","relaxer","keratin"],journey:["transitioning","levelup"],img:"https://m.media-amazon.com/images/I/51qOHaxRk5L._SL1500_.jpg" },
  { id:17, name:"Goddess Strength 7 Oil Blend Hair & Scalp Oil",brand:"Carol's Daughter",   category:"scalp",      tier:"budget",   price:"$13.99", porosity:["low"],           goals:["length"],              history:["none","heat"],             journey:["routine","levelup"],      img:"https://m.media-amazon.com/images/I/61-Q6OkEKpL._SL1500_.jpg" },
  { id:18, name:"Restoring Hair & Edge Drops",                brand:"Cécred",               category:"scalp",      tier:"premium",  price:"$56",    porosity:["high"],          goals:["length","damage"],     history:["relaxer","color"],         journey:["transitioning","levelup"],img:"https://m.media-amazon.com/images/I/61w-Rn0KFLL._SL1500_.jpg" },
  { id:19, name:"HYDR-8 Weightless Repair Oil",               brand:"Vegamour",              category:"scalp",      tier:"midrange", price:"$48",    porosity:["low"],           goals:["length","damage"],     history:["none","heat"],             journey:["routine","levelup"],      img:"https://m.media-amazon.com/images/I/61Q8W0QVPZL._SL1500_.jpg" },
];

// ── 30-Day Challenge Data ─────────────────────────────────────────────────────
const CHALLENGE_WEEKS = [
  {
    week: 1, title: "Foundations", emoji: "🌱",
    color: "#E8D5F5", accent: C.primary,
    tagline: "Learn the basics of your curl type",
    days: [
      { day: 1,  challenge: "Read your full Pelora curl profile",          why: "Knowledge is power" },
      { day: 3,  challenge: "Try co-washing instead of shampooing",        why: "Moisture-first cleansing" },
      { day: 5,  challenge: "Finger-detangle on wet hair only",            why: "Reduce breakage at the source" },
      { day: 7,  challenge: "No heat — let your curls air dry today",      why: "See your true curl pattern" },
    ]
  },
  {
    week: 2, title: "Technique", emoji: "💧",
    color: "#D5E8F5", accent: "#4A7FA5",
    tagline: "Master wash day, styling, and drying",
    days: [
      { day: 8,  challenge: "Try the 'praying hands' conditioner method",  why: "Better product distribution" },
      { day: 10, challenge: "Sleep on satin tonight",                      why: "Prevents overnight frizz" },
      { day: 12, challenge: "Try scrunching out the crunch after drying",  why: "Softer, bouncier curls" },
      { day: 14, challenge: "Full Pelora wash day ritual — start to finish",why: "Putting it all together" },
    ]
  },
  {
    week: 3, title: "Deep Care", emoji: "✨",
    color: "#F5EDD5", accent: "#A07830",
    tagline: "Treatments, protein-moisture balance, scalp",
    days: [
      { day: 15, challenge: "Scalp massage with oil for 5 minutes",        why: "Stimulates growth" },
      { day: 17, challenge: "Deep condition for 30 minutes under heat",     why: "Intensive treatment" },
      { day: 20, challenge: "Protein treatment if hair feels mushy",        why: "Restore strength & elasticity" },
      { day: 21, challenge: "Check your ends — trim if needed",             why: "Healthy ends = more length" },
    ]
  },
  {
    week: 4, title: "Confidence", emoji: "🌟",
    color: "#D5F5E3", accent: "#2E8B57",
    tagline: "Experiment with styles, celebrate progress",
    days: [
      { day: 22, challenge: "Try a new style from your recommendations",    why: "Confidence building" },
      { day: 25, challenge: "Share your curl journey with someone",         why: "Community & accountability" },
      { day: 28, challenge: "Recreate your Day 1 look — feel the difference",why: "Celebrate the progress" },
      { day: 30, challenge: "Take a Day 30 photo — compare to Day 1!",     why: "You've earned it 💜" },
    ]
  },
];

const QUESTIONS = [
  { id:"goals",   screen:1, progress:1, micro:"Let's get to know your curls!", question:"What are you hoping to achieve with your curls?", sub:"Pick up to 2", type:"multi", max:2, options:[{value:"volume",label:"More volume & bounce",emoji:"✨"},{value:"definition",label:"Curl definition & frizz control",emoji:"🌀"},{value:"length",label:"Length & growth",emoji:"📏"},{value:"damage",label:"Damage repair",emoji:"💧"}] },
  { id:"porosity", screen:2, progress:2, micro:"Nice — you're already learning something new!", question:"Let's test your porosity!", sub:"Grab a clean strand, drop it in room-temp water, wait 2 minutes. What happened?", type:"single", options:[{value:"low",label:"Still floating on top",emoji:"🔝"},{value:"normal",label:"Sank slowly to the middle",emoji:"🔄"},{value:"high",label:"Went straight to the bottom",emoji:"⬇️"},{value:"skip",label:"Skip for now",emoji:"⏭️"}] },
  { id:"history",  screen:3, progress:3, micro:"Halfway to your custom curl plan 💜", question:"What has your hair been through?", sub:"Select all that apply", type:"multi", followUp:{ trigger:(v)=>v.length>0&&!v.includes("none"), id:"historyRecency", question:"How recently?", type:"single", options:[{value:"recent",label:"Within the last 3 months"},{value:"mid",label:"3–12 months ago"},{value:"old",label:"Over a year ago"}] }, options:[{value:"relaxer",label:"Relaxers or chemical straightening",emoji:"🧪"},{value:"keratin",label:"Keratin treatments",emoji:"💆"},{value:"color",label:"Hair color or bleach",emoji:"🎨"},{value:"heat",label:"Regular heat styling",emoji:"🔥"},{value:"extensions",label:"Extensions, weaves, or wigs",emoji:"💇"},{value:"none",label:"None — mostly natural",emoji:"🌿"}] },
  { id:"journey",  screen:4, progress:4, micro:"Almost there — your personalized routine is loading...", question:"Where are you in your curl care journey?", sub:"Pick one", type:"single", followUp:{ trigger:(v)=>v==="routine"||v==="levelup", id:"routineDetails", question:"What's in your routine?", type:"multi", options:[{value:"products",label:"Curl-specific products"},{value:"techniques",label:"Techniques like plopping or diffusing"},{value:"sleep",label:"Sleep protection (bonnet, satin pillowcase)"},{value:"basic",label:"Just shampoo and conditioner"}] }, options:[{value:"start",label:"Just getting started — no real routine yet",emoji:"🌱"},{value:"routine",label:"I have a basic routine but not sure it's working",emoji:"🔄"},{value:"levelup",label:"I know my hair pretty well and want to level up",emoji:"⬆️"},{value:"transitioning",label:"Transitioning from heat/chemical-treated hair",emoji:"🌿"}] },
  { id:"scalp",    screen:5, progress:5, micro:"All set! Time to show us those curls 📸", question:"One last thing — what's your scalp like?", sub:"Pick one", type:"single", options:[{value:"oily",label:"Oily",emoji:"💦"},{value:"dry",label:"Dry",emoji:"🏜️"},{value:"balanced",label:"Balanced",emoji:"⚖️"},{value:"flaky",label:"Flaky or irritated",emoji:"❄️"},{value:"unsure",label:"Not sure",emoji:"🤷"}] },
];

const PHOTO_SLOTS = [
  { id:"roots", label:"Roots / Crown",  hint:"Top of head — base curl pattern & density",    emoji:"👆" },
  { id:"mid",   label:"Mid-Length",     hint:"Primary curl pattern & current hair health",    emoji:"💇" },
  { id:"ends",  label:"Ends",           hint:"Curl tips — shows damage & how curls behave",   emoji:"👇" },
  { id:"face",  label:"Your Face",      hint:"For face shape & skin undertone analysis",       emoji:"🤳" },
];

const tierLabel     = { budget:"💰 Budget-friendly", midrange:"💎 Mid-range", premium:"✨ Premium" };
const categoryLabel = { cleanser:"Cleanser", conditioner:"Conditioner", "leave-in":"Leave-In", styling:"Styler", treatment:"Treatment", scalp:"Scalp" };

// ──────────────────────────────────────────────────────────────────────────────
// ── AI PROVIDER LAYER ─────────────────────────────────────────────────────────
//
//  This section is the single place you touch when switching from the external
//  API to your trained SLM. The rest of the app calls analyzeHairWithAI() and
//  never needs to know which backend is active.
//
//  To switch to your SLM when it's ready:
//    1. Set AI_PROVIDER below to "slm"
//    2. Fill in analyzeWithSLM() with your inference endpoint / WASM call
//    3. Done — nothing else in the file needs to change.
//
// ──────────────────────────────────────────────────────────────────────────────

// "groq" = Groq API with Llama 4 Scout vision model (current)
// "slm"  = Your trained on-device / self-hosted SLM (future)
const AI_PROVIDER = "groq";

// ── Shared image utility ──────────────────────────────────────────────────────
async function toBase64(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1024;
      let w = img.width, h = img.height;
      if (w > MAX || h > MAX) {
        if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
        else       { w = Math.round(w * MAX / h); h = MAX; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.8).split(",")[1]);
    };
    img.onerror = reject;
    img.src = url;
  });
}

// ── Shared prompt builder ─────────────────────────────────────────────────────
// Both the API path and the future SLM path use the same structured prompt and
// expected JSON output shape. Keeping them in sync is effortless this way.
function buildAnalysisPrompt(answers) {
  return `You are Pelora, a curl care expert performing a visual hair analysis.

STEP 1 — VISUAL ANALYSIS (use photos only, ignore everything below this line):
Look at the photos and determine:
- Curl type using the Andre Walker system (1A–4C)
- Face shape (oval, round, square, heart, oblong, diamond) — from the face photo only
- Skin undertone (warm, cool, neutral) — from the face photo only
- Hair health observations from all three hair photos

STEP 2 — CONTEXT (do NOT use this to change your visual classifications above):
The following quiz answers are for personalizing care advice only. They must NOT influence curl type, face shape, or undertone — those come exclusively from the photos.
- Goals: ${(answers.goals||[]).join(", ")||"not specified"}
- Porosity: ${answers.porosity||"skipped"}
- Hair history: ${(answers.history||[]).join(", ")||"none"}
- Journey: ${answers.journey||"not specified"}
- Scalp: ${answers.scalp||"not specified"}

Return ONLY this JSON, no markdown, no backticks, no explanation:
{
  "curlType": "e.g. 2B",
  "curlTypeName": "e.g. Beachy Waves",
  "rootsPattern": "e.g. 2A at roots",
  "midPattern": "e.g. 2B mid-length",
  "endsPattern": "e.g. 2B/2C at ends",
  "description": "2-3 warm affirming sentences about their curl pattern as a knowledgeable best friend.",
  "faceShape": "oval",
  "undertone": "cool",
  "healthPriorities": ["priority 1", "priority 2"],
  "healthSummary": "1 warm sentence about hair health"
}`;
}

// ── Groq / Llama 4 Scout (current provider) ───────────────────────────────────
// Free tier: 1,000 RPD, no credit card required.
// Rate limit headers on every response tell you exactly how many requests remain
// today: check x-ratelimit-remaining-requests in the browser Network tab.
// Upgrade path: swap model string to "meta-llama/llama-4-maverick-17b-128e-instruct"
// for higher accuracy once you want to move to a paid tier.
async function analyzeWithGroq(photos, answers) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error("No Groq API key found. Add VITE_GROQ_API_KEY to your .env file.");

  const slotNames = { roots:"roots/crown area", mid:"mid-length", ends:"ends/tips", face:"face (for face shape and undertone)" };
  const imageBlocks = [];

  for (const [slotId, file] of Object.entries(photos)) {
    const b64 = await toBase64(file);
    imageBlocks.push({ type:"text", text:`Photo: ${slotNames[slotId] || slotId}` });
    imageBlocks.push({ type:"image_url", image_url:{ url:`data:image/jpeg;base64,${b64}` } });
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      max_tokens: 800,
      messages: [{ role:"user", content: [...imageBlocks, { type:"text", text:buildAnalysisPrompt(answers) }] }],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || `Groq API error ${response.status}`);
  }

  const data = await response.json();
  const raw  = data.choices[0].message.content.trim();
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ── SLM stub (future provider) ────────────────────────────────────────────────
// When your SLM is trained and ready, implement this function.
// It receives the same inputs and must return the same JSON shape as Groq above.
// Then set AI_PROVIDER = "slm" at the top of this section and you're done.
//
// async function analyzeWithSLM(photos, answers) {
//   // Option A — self-hosted inference endpoint:
//   // const endpoint = import.meta.env.VITE_SLM_ENDPOINT;
//   // const payload  = { images: await prepareImagesForSLM(photos), quiz: answers };
//   // const response = await fetch(endpoint, { method:"POST", body: JSON.stringify(payload), ... });
//   // return await response.json(); // must match the JSON shape above
//
//   // Option B — on-device WASM / ONNX runtime:
//   // const model   = await loadOnnxModel("/pelora-slm.onnx");
//   // const tensors = await photosToTensors(photos);
//   // return await runInference(model, tensors, answers);
//
//   throw new Error("SLM not yet implemented.");
// }

// ── Data storage stub (called only when user has consented) ───────────────────
// When you have a backend, replace this with a real upload call.
// The app already calls this automatically when dataConsent === true.
async function storePhotosForTraining(photos, answers) {
  // TODO: implement when backend / storage bucket is ready.
  // Example:
  // const form = new FormData();
  // for (const [slotId, file] of Object.entries(photos)) form.append(slotId, file);
  // form.append("quiz", JSON.stringify(answers));
  // await fetch(import.meta.env.VITE_UPLOAD_ENDPOINT, { method: "POST", body: form });
  console.log("[Pelora] Data consent granted — photos queued for training upload (stub).");
}

// ── Main dispatch — the only function the rest of the app calls ───────────────
async function analyzeHairWithAI(photos, answers, dataConsent) {
  // Fire-and-forget training upload if the user opted in
  if (dataConsent && Object.keys(photos).length > 0) {
    storePhotosForTraining(photos, answers).catch(e =>
      console.warn("[Pelora] Training upload failed (non-fatal):", e.message)
    );
  }

  // ← SWITCH PROVIDER HERE when your SLM is ready
  if (AI_PROVIDER === "slm") {
    // return await analyzeWithSLM(photos, answers);
    throw new Error("SLM provider selected but not yet implemented.");
  }

  return await analyzeWithGroq(photos, answers);
}

// ── Recommendations ───────────────────────────────────────────────────────────
function getRecommendations(answers) {
  const { goals=[], porosity, history=[], journey, scalp } = answers;
  const skipPorosity = !porosity || porosity === "skip";
  const hasChemical = history.some(h => ["relaxer","keratin","color"].includes(h));

  const scored = PRODUCTS.map(p => {
    let score = 0, reasons = [];
    const goalMatches = goals.filter(g => p.goals.includes(g));
    score += goalMatches.length * 3;
    if (goalMatches.includes("definition")) reasons.push("great for curl definition and frizz control");
    if (goalMatches.includes("volume"))     reasons.push("helps add volume and bounce");
    if (goalMatches.includes("length"))     reasons.push("supports length retention and growth");
    if (goalMatches.includes("damage"))     reasons.push("targets damage repair");
    if (!skipPorosity && p.porosity.includes(porosity)) {
      score += 2;
      const pNames = { low:"low porosity", normal:"medium porosity", high:"high porosity" };
      reasons.push(`formulated for ${pNames[porosity]} hair`);
    }
    const histMatch = history.filter(h => p.history.includes(h));
    if (histMatch.length > 0) {
      score += 2;
      if (hasChemical && p.history.some(h => ["relaxer","keratin","color"].includes(h)))
        reasons.push("ideal for chemically treated or transitioning hair");
      else if (history.includes("heat") && p.history.includes("heat"))
        reasons.push("great for heat-styled hair");
    }
    if (journey && p.journey.includes(journey)) {
      score += 1;
      const jNames = { start:"beginners", routine:"those building a routine", levelup:"those leveling up", transitioning:"transitioning hair" };
      reasons.push(`recommended for ${jNames[journey]||"your hair journey stage"}`);
    }
    if (p.category === "scalp" && scalp && ["dry","flaky","oily"].includes(scalp)) {
      score += 1; reasons.push("supports scalp health");
    }
    const why = reasons.length > 0
      ? `This ${categoryLabel[p.category].toLowerCase()} is ${reasons.slice(0,3).join(", ")}.`
      : "";
    return { product:p, score, why };
  });

  scored.sort((a,b) => b.score - a.score);
  const seen = new Set(), results = [];
  for (const item of scored) {
    if (results.length >= 4) break;
    if (!seen.has(item.product.category) && item.score > 0) {
      seen.add(item.product.category); results.push(item);
    }
  }
  if (results.length < 3) {
    for (const item of scored) {
      if (results.length >= 3) break;
      if (!results.find(r => r.product.id === item.product.id)) results.push(item);
    }
  }
  return results;
}

// ── UI Components ─────────────────────────────────────────────────────────────
function ProgressBar({ step }) {
  return (
    <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:8}}>
      {[1,2,3,4,5].map(i=>(
        <div key={i} style={{width:36,height:6,borderRadius:99,background:i<=step?C.primary:C.light,transition:"background 0.3s"}}/>
      ))}
    </div>
  );
}

function OptionBtn({ selected, onClick, emoji, children }) {
  return (
    <button onClick={onClick} style={{
      width:"100%", padding:"12px 16px", borderRadius:14, marginBottom:8,
      border:`2px solid ${selected?C.primary:C.light}`,
      background: selected ? C.primary : "#fff",
      color: selected ? "#fff" : C.deep,
      fontFamily:"'Palatino Linotype',Palatino,serif", fontSize:15,
      cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:10,
      transition:"all 0.18s",
    }}>
      {emoji&&<span style={{fontSize:18}}>{emoji}</span>}{children}
    </button>
  );
}

function ProductCard({ product, why }) {
  return (
    <div style={{background:"#fff",borderRadius:20,padding:"20px 22px",border:`1.5px solid ${C.light}`,marginBottom:14,display:"flex",gap:16}}>
      <img
        src={product.img} alt={product.name}
        style={{width:90,height:90,objectFit:"contain",borderRadius:12,background:C.cream,flexShrink:0}}
        onError={e=>{
          e.target.style.display="none";
          e.target.nextSibling.style.display="flex";
        }}
      />
      <div style={{display:"none",width:90,height:90,borderRadius:12,background:C.light,flexShrink:0,alignItems:"center",justifyContent:"center",fontSize:28}}>
        {product.category==="cleanser"?"🧴":product.category==="conditioner"?"💧":product.category==="leave-in"?"✨":product.category==="styling"?"💨":product.category==="treatment"?"💜":"🌿"}
      </div>
      <div style={{flex:1}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:1,color:C.mid,textTransform:"uppercase",marginBottom:2}}>{categoryLabel[product.category]}</div>
            <div style={{fontFamily:"'Palatino Linotype',Palatino,serif",fontSize:16,fontWeight:700,color:C.deep}}>{product.name}</div>
            <div style={{fontSize:13,color:C.mid}}>{product.brand}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:17,fontWeight:700,color:C.primary}}>{product.price}</div>
            <div style={{fontSize:11,color:C.mid}}>{tierLabel[product.tier]}</div>
          </div>
        </div>
        {why && (
          <div style={{marginTop:10,fontSize:13,color:"#555",lineHeight:1.6}}>
            <strong style={{color:C.primary}}>Why it works for you: </strong>{why}
          </div>
        )}
      </div>
    </div>
  );
}

function PhotoSlot({ slot, file, onFile }) {
  const inputRef = useRef();
  const preview = file ? URL.createObjectURL(file) : null;
  return (
    <div onClick={()=>inputRef.current.click()} style={{
      flex:"1 1 calc(50% - 8px)", minWidth:140, aspectRatio:"1/1",
      borderRadius:20, border:`2px dashed ${file?C.primary:C.light}`,
      background: file?"#fff":C.cream, cursor:"pointer",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      overflow:"hidden", position:"relative", transition:"border-color 0.2s",
    }}>
      <input ref={inputRef} type="file" accept="image/*" style={{display:"none"}}
        onChange={e=>e.target.files[0]&&onFile(slot.id,e.target.files[0])} />
      {preview ? (
        <>
          <img src={preview} alt={slot.label} style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0}}/>
          <div style={{position:"absolute",inset:0,background:"rgba(118,83,146,0.55)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",padding:"12px 8px"}}>
            <div style={{fontSize:11,fontWeight:700,color:"#fff",textAlign:"center"}}>{slot.label}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.8)",marginTop:2}}>Tap to change</div>
          </div>
        </>
      ) : (
        <>
          <div style={{fontSize:28,marginBottom:6}}>{slot.emoji}</div>
          <div style={{fontSize:13,fontWeight:700,color:C.deep,textAlign:"center",paddingInline:8}}>{slot.label}</div>
          <div style={{fontSize:11,color:C.mid,textAlign:"center",paddingInline:12,marginTop:4,lineHeight:1.4}}>{slot.hint}</div>
          <div style={{marginTop:10,fontSize:11,color:C.primary,fontWeight:700}}>+ Upload</div>
        </>
      )}
    </div>
  );
}

// ── Curl Profile Card ─────────────────────────────────────────────────────────
function CurlProfileCard({ aiResult, answers }) {
  if (!aiResult) return null;
  return (
    <div style={{background:`linear-gradient(135deg,${C.deep},${C.primary})`,borderRadius:24,padding:"24px",marginBottom:20,color:"#fff"}}>
      <div style={{fontSize:12,fontWeight:700,letterSpacing:1.5,opacity:0.8,textTransform:"uppercase",marginBottom:4}}>Your Curl Pattern</div>
      <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:8}}>
        <div style={{fontSize:42,fontWeight:700,lineHeight:1}}>{aiResult.curlType||"—"}</div>
        <div style={{fontSize:18,opacity:0.9,fontStyle:"italic"}}>{aiResult.curlTypeName}</div>
      </div>
      {(aiResult.rootsPattern||aiResult.midPattern||aiResult.endsPattern) && (
        <div style={{background:"rgba(255,255,255,0.12)",borderRadius:12,padding:"10px 14px",marginBottom:12,fontSize:13,lineHeight:1.8}}>
          {aiResult.rootsPattern && <div>👆 <strong>Roots:</strong> {aiResult.rootsPattern}</div>}
          {aiResult.midPattern   && <div>💇 <strong>Mid-length:</strong> {aiResult.midPattern}</div>}
          {aiResult.endsPattern  && <div>👇 <strong>Ends:</strong> {aiResult.endsPattern}</div>}
        </div>
      )}
      {aiResult.description && <div style={{fontSize:14,lineHeight:1.7,opacity:0.95,marginBottom:12}}>{aiResult.description}</div>}
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        {answers?.porosity && answers.porosity !== "skip" && (
          <div style={{background:"rgba(255,255,255,0.15)",borderRadius:20,padding:"6px 14px",fontSize:12}}>
            Porosity: <strong>
              {answers.porosity === "low" ? "Low porosity" :
               answers.porosity === "normal" ? "Medium porosity" :
               answers.porosity === "high" ? "High porosity" : ""}
            </strong>
          </div>
        )}
        {aiResult.faceShape && (
          <div style={{background:"rgba(255,255,255,0.15)",borderRadius:20,padding:"6px 14px",fontSize:12}}>
            Face shape: <strong>{aiResult.faceShape}</strong>
          </div>
        )}
        {aiResult.undertone && (
          <div style={{background:"rgba(255,255,255,0.15)",borderRadius:20,padding:"6px 14px",fontSize:12}}>
            Undertone: <strong>{aiResult.undertone}</strong>
          </div>
        )}
      </div>
      {aiResult.healthPriorities?.length > 0 && (
        <div style={{marginTop:12,borderTop:"1px solid rgba(255,255,255,0.2)",paddingTop:12}}>
          <div style={{fontSize:12,fontWeight:700,opacity:0.8,marginBottom:6}}>TOP CARE PRIORITIES</div>
          {aiResult.healthPriorities.map((p,i)=>(
            <div key={i} style={{fontSize:13,display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <span style={{opacity:0.7}}>→</span>{p}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 30-Day Challenge Section ──────────────────────────────────────────────────
function ChallengeSection() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div style={{marginTop:8}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:24,fontWeight:700,color:C.deep,fontFamily:"'Palatino Linotype',Palatino,serif"}}>
          📅 Your 30-Day Curl Challenge
        </div>
        <div style={{fontSize:13,color:C.mid,marginTop:4}}>
          A personalized journey — one small habit at a time
        </div>
      </div>

      {CHALLENGE_WEEKS.map((week) => (
        <div key={week.week} style={{
          background:"#fff", borderRadius:20, marginBottom:14,
          border:`1.5px solid ${C.light}`, overflow:"hidden",
        }}>
          <div
            onClick={()=>setExpanded(expanded===week.week?null:week.week)}
            style={{
              background:week.color, padding:"16px 20px",
              display:"flex", alignItems:"center", justifyContent:"space-between",
              cursor:"pointer",
            }}
          >
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{
                width:40,height:40,borderRadius:50,
                background:week.accent,color:"#fff",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:18,fontWeight:700,flexShrink:0,
              }}>
                {week.week}
              </div>
              <div>
                <div style={{fontWeight:700,color:C.deep,fontSize:16,fontFamily:"'Palatino Linotype',Palatino,serif"}}>
                  {week.emoji} Week {week.week}: {week.title}
                </div>
                <div style={{fontSize:12,color:"#777",marginTop:2}}>{week.tagline}</div>
              </div>
            </div>
            <div style={{fontSize:18,color:week.accent,transition:"transform 0.2s",transform:expanded===week.week?"rotate(180deg)":"none"}}>
              ▾
            </div>
          </div>

          {expanded===week.week && (
            <div style={{padding:"12px 16px"}}>
              {week.days.map((d)=>(
                <div key={d.day} style={{
                  display:"flex", alignItems:"flex-start", gap:12,
                  padding:"12px 0", borderBottom:`1px solid ${C.light}`,
                }}>
                  <div style={{
                    minWidth:36,height:36,borderRadius:50,
                    background:`${week.accent}18`,color:week.accent,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:12,fontWeight:700,flexShrink:0,
                  }}>
                    {d.day}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,color:C.deep,fontWeight:600,lineHeight:1.4}}>{d.challenge}</div>
                    <div style={{fontSize:12,color:C.mid,marginTop:3}}>✦ {d.why}</div>
                  </div>
                </div>
              ))}
              <div style={{
                marginTop:10,padding:"10px 14px",borderRadius:12,
                background:`${week.accent}12`,fontSize:12,color:week.accent,fontWeight:600,textAlign:"center",
              }}>
                Days {(week.week-1)*7+1}–{week.week*7} · Tap any day to mark complete (coming soon)
              </div>
            </div>
          )}
        </div>
      ))}

      <div style={{
        background:`linear-gradient(135deg,${C.primary},${C.deep})`,
        borderRadius:20,padding:"20px 24px",textAlign:"center",color:"#fff",marginBottom:14,
      }}>
        <div style={{fontSize:32,marginBottom:8}}>🏆</div>
        <div style={{fontSize:18,fontWeight:700,fontFamily:"'Palatino Linotype',Palatino,serif",marginBottom:6}}>
          Day 30: Before & After
        </div>
        <div style={{fontSize:13,opacity:0.9,lineHeight:1.6}}>
          Take a photo and compare it to Day 1. You'll be amazed at what 30 days of intentional curl care can do.
        </div>
      </div>
    </div>
  );
}

// ── Data Consent Screen ───────────────────────────────────────────────────────
function ConsentScreen({ onAccept, onDecline }) {
  return (
    <div style={{minHeight:"100vh",background:C.cream,padding:"32px 20px",fontFamily:"'Palatino Linotype',Palatino,serif",display:"flex",alignItems:"center"}}>
      <div style={{maxWidth:480,margin:"0 auto",width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:28,display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
          <PeloraLogo size={52}/>
          <span style={{fontSize:24,fontWeight:700,color:C.deep}}>One quick thing 💜</span>
        </div>

        <div style={{background:"#fff",borderRadius:24,padding:"28px 24px",boxShadow:`0 2px 28px ${C.deep}12`,marginBottom:16}}>
          <div style={{fontSize:18,fontWeight:700,color:C.deep,marginBottom:12}}>
            Help us improve Pelora
          </div>
          <div style={{fontSize:14,color:"#555",lineHeight:1.8,marginBottom:20}}>
            We're building a curl classification model trained on real hair photos. Your photos and quiz answers could help us make Pelora's analysis faster and more accurate for everyone — especially for underrepresented curl types.
          </div>

          <div style={{background:`${C.primary}0D`,borderRadius:14,padding:"16px",marginBottom:20}}>
            <div style={{fontSize:13,fontWeight:700,color:C.primary,marginBottom:10}}>If you opt in, here's what that means:</div>
            {[
              ["📸", "Your 4 photos and quiz answers are securely stored"],
              ["🔒", "Data is never sold and never used for advertising"],
              ["🧠", "Photos are used only to train Pelora's own curl model"],
              ["✋", "You can request deletion at any time by emailing us"],
            ].map(([icon, text]) => (
              <div key={text} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:8}}>
                <span style={{fontSize:16,flexShrink:0}}>{icon}</span>
                <span style={{fontSize:13,color:"#555",lineHeight:1.5}}>{text}</span>
              </div>
            ))}
          </div>

          <div style={{fontSize:12,color:C.mid,lineHeight:1.6,marginBottom:4}}>
            Opting out has no effect on your results — you'll still get the full Pelora experience either way.
          </div>
        </div>

        <button onClick={onAccept} style={{
          display:"block",width:"100%",padding:"16px",borderRadius:50,border:"none",
          fontSize:16,fontFamily:"'Palatino Linotype',Palatino,serif",
          background:`linear-gradient(135deg,${C.primary},${C.deep})`,
          color:"#fff",cursor:"pointer",marginBottom:10,
          boxShadow:`0 4px 18px ${C.deep}33`,
        }}>
          Yes, I'd like to help 💜
        </button>
        <button onClick={onDecline} style={{
          display:"block",width:"100%",padding:"14px",borderRadius:50,
          border:`2px solid ${C.light}`,background:"transparent",
          fontSize:14,fontFamily:"'Palatino Linotype',Palatino,serif",
          color:C.mid,cursor:"pointer",
        }}>
          No thanks, continue without sharing
        </button>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]       = useState("landing");
  const [qIdx, setQIdx]           = useState(0);
  const [answers, setAnswers]     = useState({});
  const [showFU, setShowFU]       = useState(false);
  const [photos, setPhotos]       = useState({});
  const [recs, setRecs]           = useState(null);
  const [aiResult, setAiResult]   = useState(null);
  const [aiError, setAiError]     = useState(null);
  const [activeTab, setActiveTab] = useState("products");
  const [dataConsent, setDataConsent] = useState(null); // null = not yet asked

  const q    = QUESTIONS[qIdx];
  const val  = answers[q?.id];
  const fuVal = answers[q?.followUp?.id];
  const uploadedCount     = Object.keys(photos).length;
  const allPhotosUploaded = uploadedCount === PHOTO_SLOTS.length;

  const pick = (qId, v, type, max) => {
    if (type==="single") {
      setAnswers(a=>({...a,[qId]:v}));
      if (q.followUp) setShowFU(q.followUp.trigger(v));
    } else {
      setAnswers(a=>{
        const prev=a[qId]||[];
        const next=prev.includes(v)?prev.filter(x=>x!==v):(prev.length>=max?[...prev.slice(1),v]:[...prev,v]);
        if (q.followUp) setShowFU(q.followUp.trigger(next));
        return {...a,[qId]:next};
      });
    }
  };

  const pickFU = (fId, v, type) => {
    if (type==="single") setAnswers(a=>({...a,[fId]:v}));
    else setAnswers(a=>{const p=a[fId]||[];return{...a,[fId]:p.includes(v)?p.filter(x=>x!==v):[...p,v]};});
  };

  const canNext = () => { const v=answers[q?.id]; return v&&!(Array.isArray(v)&&v.length===0); };

  const advance = () => {
    if (qIdx < QUESTIONS.length-1) { setQIdx(i=>i+1); setShowFU(false); return; }
    setScreen("photos");
  };

  // After quiz, show consent screen before photos (only once per session)
  const goToPhotos = () => {
    if (dataConsent === null) {
      setScreen("consent");
    } else {
      setScreen("photos");
    }
  };

  const handleConsent = (accepted) => {
    setDataConsent(accepted);
    setScreen("photos");
  };

  const handleAnalyze = async () => {
    setScreen("loading");
    try {
      let aiData = null;
      if (Object.keys(photos).length > 0) {
        try {
          aiData = await analyzeHairWithAI(photos, answers, dataConsent === true);
        } catch(e) {
          setAiError(e.message);
        }
      }
      const results = getRecommendations(answers);
      setAiResult(aiData);
      setRecs(results);
      setScreen("results");
    } catch(e) {
      setAiError("Something went wrong: " + e.message);
      setRecs(getRecommendations(answers));
      setScreen("results");
    }
  };

  const reset = () => {
    setScreen("landing"); setQIdx(0); setAnswers({});
    setRecs(null); setShowFU(false); setAiResult(null);
    setAiError(null); setPhotos({}); setActiveTab("products");
    setDataConsent(null);
  };

  // ── LANDING ──────────────────────────────────────────────────────────────────
  if (screen==="landing") return (
    <div style={{minHeight:"100vh",background:C.cream,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Palatino Linotype',Palatino,serif"}}>
      <div style={{maxWidth:420,width:"100%",textAlign:"center"}}>
        <PeloraLogo size={90}/>
        <div style={{fontSize:46,fontWeight:700,color:C.deep,letterSpacing:-1,marginTop:16}}>Pelora</div>
        <div style={{fontSize:18,color:C.primary,fontStyle:"italic",marginTop:6,marginBottom:32}}>Expert curl care in your pocket.</div>
        <p style={{fontSize:15,color:"#666",lineHeight:1.75,marginBottom:40}}>
          Answer 5 quick questions, upload a few photos, and get a personalized product plan and 30-day curl challenge — curated just for you.
        </p>
        <button onClick={()=>setScreen("quiz")} style={{
          background:`linear-gradient(135deg,${C.primary},${C.deep})`,
          color:"#fff",border:"none",padding:"16px 44px",borderRadius:50,
          fontSize:17,fontFamily:"'Palatino Linotype',Palatino,serif",cursor:"pointer",
          boxShadow:`0 6px 24px ${C.deep}44`,letterSpacing:0.3,
        }}>Start Your Curl Journey ✨</button>
      </div>
    </div>
  );

  // ── CONSENT ──────────────────────────────────────────────────────────────────
  if (screen==="consent") return (
    <ConsentScreen
      onAccept={()=>handleConsent(true)}
      onDecline={()=>handleConsent(false)}
    />
  );

  // ── LOADING ──────────────────────────────────────────────────────────────────
  if (screen==="loading") return (
    <div style={{minHeight:"100vh",background:C.cream,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,fontFamily:"'Palatino Linotype',Palatino,serif"}}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <div style={{animation:"spin 2s linear infinite"}}><PeloraLogo size={72}/></div>
      <div style={{fontSize:22,color:C.deep,fontWeight:700}}>Analyzing your curls...</div>
      <div style={{fontSize:14,color:C.mid,textAlign:"center",maxWidth:280,lineHeight:1.6}}>
        Our AI is reviewing your photos and quiz answers to build your personalized curl plan
      </div>
    </div>
  );

  // ── PHOTO UPLOAD ──────────────────────────────────────────────────────────────
  if (screen==="photos") return (
    <div style={{minHeight:"100vh",background:C.cream,padding:"32px 20px",fontFamily:"'Palatino Linotype',Palatino,serif"}}>
      <div style={{maxWidth:480,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
          <PeloraLogo size={36}/>
          <span style={{fontFamily:"'Palatino Linotype',Palatino,serif",fontSize:24,fontWeight:700,color:C.deep}}>Pelora</span>
        </div>
        <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:8}}>
          {[1,2,3,4,5].map(i=>(<div key={i} style={{width:36,height:6,borderRadius:99,background:C.primary}}/>))}
        </div>
        <div style={{textAlign:"center",fontSize:13,color:C.mid,marginBottom:22}}>Almost there — your personalized plan is almost ready! 💜</div>

        {/* Show consent status as a subtle badge */}
        {dataConsent !== null && (
          <div style={{
            display:"flex",alignItems:"center",gap:8,justifyContent:"center",
            marginBottom:16,fontSize:12,color:dataConsent?C.primary:C.mid,
          }}>
            <span>{dataConsent ? "✅" : "🔒"}</span>
            <span>{dataConsent ? "Contributing to Pelora's training data — thank you!" : "Photos will not be stored"}</span>
          </div>
        )}

        <div style={{background:"#fff",borderRadius:24,padding:"28px 24px",boxShadow:`0 2px 28px ${C.deep}12`}}>
          <div style={{fontSize:21,fontWeight:700,color:C.deep,marginBottom:4}}>Now let's see those curls! 📸</div>
          <div style={{fontSize:13,color:"#999",marginBottom:8}}>Upload 4 photos with your hair dry and naturally styled</div>
          <div style={{display:"flex",alignItems:"center",gap:6,background:`${C.primary}12`,borderRadius:10,padding:"8px 12px",marginBottom:20}}>
            <span style={{fontSize:14}}>☀️</span>
            <span style={{fontSize:12,color:C.primary,fontWeight:600}}>For best results, use natural lighting</span>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
            {PHOTO_SLOTS.map(slot=>(
              <PhotoSlot key={slot.id} slot={slot} file={photos[slot.id]||null} onFile={(id,f)=>setPhotos(p=>({...p,[id]:f}))}/>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:16,fontSize:13,color:C.mid}}>
            {uploadedCount} of {PHOTO_SLOTS.length} photos uploaded
            {uploadedCount>0&&uploadedCount<PHOTO_SLOTS.length&&<span style={{color:C.primary,fontWeight:600}}> — keep going!</span>}
            {allPhotosUploaded&&<span style={{color:C.primary,fontWeight:600}}> — you're all set! ✨</span>}
          </div>
        </div>
        <button onClick={handleAnalyze} disabled={!allPhotosUploaded} style={{
          display:"block",width:"100%",marginTop:14,padding:"16px",borderRadius:50,border:"none",
          fontSize:16,fontFamily:"'Palatino Linotype',Palatino,serif",
          background:allPhotosUploaded?`linear-gradient(135deg,${C.primary},${C.deep})`:C.light,
          color:allPhotosUploaded?"#fff":"#aaa",cursor:allPhotosUploaded?"pointer":"not-allowed",transition:"all 0.2s",
        }}>Analyze My Curls 💜</button>
        <button onClick={handleAnalyze} style={{
          display:"block",width:"100%",marginTop:10,padding:"12px",borderRadius:50,
          border:`2px solid ${C.light}`,background:"transparent",
          fontSize:14,fontFamily:"'Palatino Linotype',Palatino,serif",color:C.mid,cursor:"pointer",
        }}>Skip photos for now →</button>
      </div>
    </div>
  );

  // ── RESULTS ──────────────────────────────────────────────────────────────────
  if (screen==="results") return (
    <div style={{minHeight:"100vh",background:C.cream,padding:"32px 20px",fontFamily:"'Palatino Linotype',Palatino,serif"}}>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <PeloraLogo size={60}/>
          <div style={{fontSize:30,fontWeight:700,color:C.deep,marginTop:12}}>Your Curl Care Plan</div>
          <div style={{fontSize:14,color:C.mid,marginTop:6}}>Curated just for you based on your answers & photos 💜</div>
        </div>

        {aiError && (
          <div style={{background:"#FFF3CD",border:"1px solid #FFEAA7",borderRadius:12,padding:"12px 16px",marginBottom:20,fontSize:13,color:"#856404"}}>
            ⚠️ Photo analysis unavailable ({aiError}). Showing product recommendations based on your quiz answers.
          </div>
        )}

        {aiResult && <CurlProfileCard aiResult={aiResult} answers={answers}/>}

        <div style={{display:"flex",gap:0,marginBottom:20,borderRadius:14,overflow:"hidden",border:`1.5px solid ${C.light}`}}>
          {[{id:"products",label:"🧴 My Products"},{id:"challenge",label:"📅 30-Day Challenge"}].map(tab=>(
            <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{
              flex:1,padding:"13px",border:"none",cursor:"pointer",
              background:activeTab===tab.id?C.primary:"#fff",
              color:activeTab===tab.id?"#fff":C.deep,
              fontFamily:"'Palatino Linotype',Palatino,serif",fontSize:14,fontWeight:600,
              transition:"all 0.18s",
            }}>{tab.label}</button>
          ))}
        </div>

        {activeTab==="products" && (
          <>
            {recs&&recs.length>0 ? recs.map(({product,why},i)=>(
              <div key={product.id}>
                <div style={{fontSize:13,fontWeight:700,color:C.mid,marginBottom:4,marginLeft:4}}>#{i+1} Match</div>
                <ProductCard product={product} why={why}/>
              </div>
            )) : <div style={{textAlign:"center",color:"#aaa",padding:40}}>No recommendations found.</div>}
          </>
        )}

        {activeTab==="challenge" && <ChallengeSection/>}

        <button onClick={reset} style={{display:"block",margin:"24px auto 0",background:"transparent",border:`2px solid ${C.primary}`,color:C.primary,padding:"12px 36px",borderRadius:50,fontSize:15,fontFamily:"'Palatino Linotype',Palatino,serif",cursor:"pointer"}}>
          Retake Quiz
        </button>
      </div>
    </div>
  );

  // ── QUIZ ─────────────────────────────────────────────────────────────────────
  return (
    <div style={{minHeight:"100vh",background:C.cream,padding:"32px 20px",fontFamily:"'Palatino Linotype',Palatino,serif"}}>
      <div style={{maxWidth:480,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
          <PeloraLogo size={36}/>
          <span style={{fontFamily:"'Palatino Linotype',Palatino,serif",fontSize:24,fontWeight:700,color:C.deep}}>Pelora</span>
        </div>
        <ProgressBar step={q.progress}/>
        <div style={{textAlign:"center",fontSize:13,color:C.mid,marginBottom:22}}>{q.micro}</div>
        <div style={{background:"#fff",borderRadius:24,padding:"28px 24px",boxShadow:`0 2px 28px ${C.deep}12`}}>
          <div style={{fontSize:21,fontWeight:700,color:C.deep,marginBottom:4}}>{q.question}</div>
          {q.sub&&<div style={{fontSize:13,color:"#999",marginBottom:18}}>{q.sub}</div>}
          {q.options.map(o=>(
            <OptionBtn key={o.value} emoji={o.emoji}
              selected={q.type==="single"?val===o.value:(val||[]).includes(o.value)}
              onClick={()=>pick(q.id,o.value,q.type,q.max)}>
              {o.label}
            </OptionBtn>
          ))}
          {showFU&&q.followUp&&(
            <div style={{marginTop:16,paddingTop:16,borderTop:`1.5px solid ${C.light}`}}>
              <div style={{fontSize:16,fontWeight:700,color:C.deep,marginBottom:12}}>{q.followUp.question}</div>
              {q.followUp.options.map(o=>(
                <OptionBtn key={o.value}
                  selected={q.followUp.type==="single"?fuVal===o.value:(fuVal||[]).includes(o.value)}
                  onClick={()=>pickFU(q.followUp.id,o.value,q.followUp.type)}>
                  {o.label}
                </OptionBtn>
              ))}
            </div>
          )}
        </div>
        <button disabled={!canNext()} onClick={qIdx<QUESTIONS.length-1?advance:goToPhotos} style={{
          display:"block",width:"100%",marginTop:20,padding:"16px",borderRadius:50,border:"none",
          fontSize:16,fontFamily:"'Palatino Linotype',Palatino,serif",
          background:canNext()?`linear-gradient(135deg,${C.primary},${C.deep})`:C.light,
          color:canNext()?"#fff":"#aaa",cursor:canNext()?"pointer":"not-allowed",transition:"all 0.2s",
        }}>
          {qIdx<QUESTIONS.length-1?"Next →":"Next: Upload Your Photos 📸"}
        </button>
      </div>
    </div>
  );
}
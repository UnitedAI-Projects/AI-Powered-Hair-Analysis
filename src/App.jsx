import { useState } from "react";

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
  // ── Cleansers ──
  { id:1, name:"Ever Pure Sulfate-Free Bond Repair Shampoo", brand:"L'Oreal", category:"cleanser", tier:"budget", price:"$11", porosity:["normal"], goals:["definition"], history:["none"], journey:["start"], img:"316-MThUbUL._SY300_SX300_QL70_FMwebp_.jpg", desc:"A gentle sulfate-free shampoo that repairs bonds while cleansing — great for natural hair seeking definition without stripping." },
  { id:2, name:"No. 4 Bond Maintenance Shampoo", brand:"Olaplex", category:"cleanser", tier:"midrange", price:"$34", porosity:["high"], goals:["damage"], history:["relaxer","color"], journey:["transitioning"], img:"https://yourhairshop.nl/wp-content/uploads/2021/03/Olaplex-No.4-Bond-Maintenance-Shampoo-250ml.jpg", desc:"Rebuilds broken bonds caused by color and chemical treatments — a go-to for transitioning hair that needs serious repair." },
  { id:3, name:"Rice Water Shampoo", brand:"As I Am", category:"cleanser", tier:"budget", price:"$9.92", porosity:["high"], goals:["volume"], history:["heat","keratin"], journey:["routine"], img:"https://cgn-mig.farmaline.be/images/mp/prod/a618bda0b40548cb86e5118dda17bc8a", desc:"Rice water strengthens and adds volume to heat-stressed hair while gently cleansing without over-drying." },
  { id:4, name:"Pomegranate & Honey Moisturizing Shampoo", brand:"Mielle", category:"cleanser", tier:"budget", price:"$13", porosity:["low"], goals:["definition"], history:["none"], journey:["levelup"], img:"61pPpu6nowL._SL1500_.jpg", desc:"Honey and pomegranate hydrate low porosity strands while enhancing curl definition — perfect for those leveling up their routine." },
  // ── Conditioners ──
  { id:5, name:"Intensive Hydration Hair Masque", brand:"SheaMoisture", category:"conditioner", tier:"budget", price:"$12.97", porosity:["normal"], goals:["definition"], history:["none"], journey:["start"], img:"81IsTPffvqL._SL1500_.jpg", desc:"A rich hydrating masque that softens and defines natural curls — ideal for beginners building their first real routine." },
  { id:6, name:"Curl Quenching Conditioning Co-Wash", brand:"Curlsmith", category:"conditioner", tier:"midrange", price:"$26", porosity:["high"], goals:["damage"], history:["relaxer","color"], journey:["transitioning"], img:"61OOkmoL2zL._SX522_.jpg", desc:"A cleansing conditioner that gently washes while deeply moisturizing — made for high porosity, chemically treated hair." },
  { id:7, name:"Moisture Repair Conditioner", brand:"Moroccanoil", category:"conditioner", tier:"midrange", price:"$30", porosity:["normal"], goals:["volume","definition"], history:["heat"], journey:["routine","levelup"], img:"moroccanoil-moisture-repair-conditioner-250-ml-morange.jpg", desc:"Argan oil and weightless proteins restore bounce and definition to heat-styled hair without heaviness." },
  { id:8, name:"Cica Chroma Strengthening Conditioner", brand:"Kerastase", category:"conditioner", tier:"premium", price:"$50", porosity:["high"], goals:["damage"], history:["color","relaxer"], journey:["transitioning","levelup"], img:"OIP.eEXpLJwOFiPaUdDB3z1J6QHaHa", desc:"A luxurious strengthening conditioner that repairs color and chemical damage while adding brilliant shine and resilience." },
  // ── Leave-Ins ──
  { id:9, name:"Curl Love Moisture Milk", brand:"Camille Rose", category:"leave-in", tier:"budget", price:"$12.58", porosity:["low"], goals:["definition"], history:["none"], journey:["start","routine"], img:"SBS-310322.jpg", desc:"A lightweight milk leave-in that penetrates low porosity strands and enhances curl definition without buildup." },
  { id:10, name:"Thirsty Girl Coconut Milk Leave-In", brand:"IGK", category:"leave-in", tier:"midrange", price:"$33", porosity:["normal"], goals:["volume","definition"], history:["heat","none"], journey:["routine","levelup"], img:"https://m.media-amazon.com/images/I/41h0x-ZeAlL._SX522_.jpg", desc:"Coconut milk quenches thirsty curls and boosts volume — great for those refining a routine with heat-styled hair." },
  // ── Stylers ──
  { id:11, name:"Curl Quencher Hydrafusion Intense Curl Cream", brand:"Ouidad", category:"styling", tier:"midrange", price:"$23", porosity:["normal"], goals:["definition"], history:["none","heat"], journey:["start","routine"], img:"CURL_QUENCHER_HYDRAFUSION_CREAM_5oz.jpg", desc:"An intense curl cream that locks in moisture and defines spirals all day — a great first styler for 3B curls." },
  { id:12, name:"Multi-Use Mousse Texture Foam", brand:"The Doux", category:"styling", tier:"budget", price:"$15", porosity:["low"], goals:["volume"], history:["none"], journey:["start","routine","levelup"], img:"OIP.5mafol6uY0Y3vAUP3RhO9AHaHa", desc:"A whipped mousse that lifts low porosity curls from root to tip — adds volume and hold without crunch or buildup." },
  { id:13, name:"Anti-Frizz Hair Styling Cream", brand:"Ouai", category:"styling", tier:"midrange", price:"$30", porosity:["high"], goals:["definition"], history:["heat","none"], journey:["levelup"], img:"OIP.y2aZSQITfus1mwGHjFkVCwHaHa", desc:"A smoothing cream that tames frizz and defines curls for high porosity hair — sophisticated hold for those who know their hair well." },
  // ── Treatments ──
  { id:14, name:"Two Step Protein Treatment", brand:"Aphogee", category:"treatment", tier:"budget", price:"$12", porosity:["high"], goals:["damage","length"], history:["relaxer","color","heat"], journey:["transitioning"], img:"aphogee-two-step-protein-treatment-16oz_2.jpg", desc:"A powerful two-step protein treatment that stops breakage in its tracks — essential for severely damaged or transitioning hair." },
  { id:15, name:"Plant Power Mask", brand:"Sienna Naturals", category:"treatment", tier:"midrange", price:"$34", porosity:["low"], goals:["definition","damage"], history:["none","heat"], journey:["routine","levelup"], img:"PlantPowerRepair_600x.png", desc:"A plant-powered repair mask that strengthens and defines low porosity curls without protein overload." },
  { id:16, name:"Leave-In Molecular Repair Hair Mask", brand:"K18 Biomimetic Hairscience", category:"treatment", tier:"premium", price:"$75", porosity:["high"], goals:["damage"], history:["color","relaxer","keratin"], journey:["transitioning","levelup"], img:"https://www.hair-shop.com/en/media/catalog/product/cache/4/image/1400x1400/9df78eab33525d08d6e5fb8d27136e95/k/1/k18-leave-in-molecular-repair-hair-mask-50ml.jpg", desc:"A science-backed leave-in mask that reconnects broken keratin chains — the gold standard for chemically damaged hair." },
  // ── Scalp ──
  { id:17, name:"Goddess Strength 7 Oil Blend Hair & Scalp Oil", brand:"Carol's Daughter", category:"scalp", tier:"budget", price:"$13.99", porosity:["low"], goals:["length"], history:["none","heat"], journey:["routine","levelup"], img:"61-Q6OkEKpL._SL1500_.jpg", desc:"Seven nourishing oils strengthen strands and stimulate the scalp — a ritual oil for those focused on length and retention." },
  { id:18, name:"Restoring Hair & Edge Drops", brand:"Cécred", category:"scalp", tier:"premium", price:"$56", porosity:["high"], goals:["length","damage"], history:["relaxer","color"], journey:["transitioning","levelup"], img:"https://cecred.com/cdn/shop/files/Restoring-Edge-Dropper-V1-Final.jpg?v=1759295164", desc:"A targeted serum that restores thinning edges and damaged scalp areas — ideal for hair recovering from chemical treatments." },
  { id:19, name:"HYDR-8 Weightless Repair Oil", brand:"Vegamour", category:"scalp", tier:"midrange", price:"$48", porosity:["low"], goals:["length","damage"], history:["none","heat"], journey:["routine","levelup"], img:"https://www.sephora.com/productimages/sku/s2737229-main-zoom.jpg?imwidth=630", desc:"A featherlight scalp oil that hydrates without weighing down low porosity strands — supports growth and scalp health." },
];

const QUESTIONS = [
  { id:"goals", screen:1, progress:1, micro:"Let's get to know your curls!", question:"What are you hoping to achieve with your curls?", sub:"Pick up to 2", type:"multi", max:2, options:[{value:"volume",label:"More volume & bounce",emoji:"✨"},{value:"definition",label:"Curl definition & frizz control",emoji:"🌀"},{value:"length",label:"Length & growth",emoji:"📏"},{value:"damage",label:"Damage repair",emoji:"💧"}] },
  { id:"porosity", screen:2, progress:2, micro:"Nice — you're already learning something new!", question:"Let's test your porosity!", sub:"Grab a clean strand, drop it in room-temp water, wait 2 minutes. What happened?", type:"single", options:[{value:"low",label:"Still floating on top",emoji:"🔝"},{value:"normal",label:"Sank slowly to the middle",emoji:"🔄"},{value:"high",label:"Went straight to the bottom",emoji:"⬇️"},{value:"skip",label:"Skip for now",emoji:"⏭️"}] },
  { id:"history", screen:3, progress:3, micro:"Halfway to your custom curl plan 💜", question:"What has your hair been through?", sub:"Select all that apply", type:"multi", followUp:{ trigger:(v)=>v.length>0&&!v.includes("none"), id:"historyRecency", question:"How recently?", type:"single", options:[{value:"recent",label:"Within the last 3 months"},{value:"mid",label:"3–12 months ago"},{value:"old",label:"Over a year ago"}] }, options:[{value:"relaxer",label:"Relaxers or chemical straightening",emoji:"🧪"},{value:"keratin",label:"Keratin treatments",emoji:"💆"},{value:"color",label:"Hair color or bleach",emoji:"🎨"},{value:"heat",label:"Regular heat styling",emoji:"🔥"},{value:"extensions",label:"Extensions, weaves, or wigs",emoji:"💇"},{value:"none",label:"None — mostly natural",emoji:"🌿"}] },
  { id:"journey", screen:4, progress:4, micro:"Almost there — your personalized routine is loading...", question:"Where are you in your curl care journey?", sub:"Pick one", type:"single", followUp:{ trigger:(v)=>v==="routine"||v==="levelup", id:"routineDetails", question:"What's in your routine?", type:"multi", options:[{value:"products",label:"Curl-specific products"},{value:"techniques",label:"Techniques like plopping or diffusing"},{value:"sleep",label:"Sleep protection (bonnet, satin pillowcase)"},{value:"basic",label:"Just shampoo and conditioner"}] }, options:[{value:"start",label:"Just getting started — no real routine yet",emoji:"🌱"},{value:"routine",label:"I have a basic routine but not sure it's working",emoji:"🔄"},{value:"levelup",label:"I know my hair pretty well and want to level up",emoji:"⬆️"},{value:"transitioning",label:"Transitioning from heat/chemical-treated hair",emoji:"🌿"}] },
  { id:"scalp", screen:5, progress:5, micro:"All set! Time for your personalized results 💜", question:"One last thing — what's your scalp like?", sub:"Pick one", type:"single", options:[{value:"oily",label:"Oily",emoji:"💦"},{value:"dry",label:"Dry",emoji:"🏜️"},{value:"balanced",label:"Balanced",emoji:"⚖️"},{value:"flaky",label:"Flaky or irritated",emoji:"❄️"},{value:"unsure",label:"Not sure",emoji:"🤷"}] },
];

const tierLabel = { budget:"💰 Budget-friendly", midrange:"💎 Mid-range", premium:"✨ Premium" };
const categoryLabel = { cleanser:"Cleanser", conditioner:"Conditioner", "leave-in":"Leave-In", styling:"Styler", treatment:"Treatment", scalp:"Scalp" };

function getRecommendations(answers) {
  const { goals=[], porosity, history=[], journey, scalp } = answers;
  const skipPorosity = !porosity || porosity === "skip";
  const hasChemical = history.some(h => ["relaxer","keratin","color"].includes(h));

  // Score each product
  const scored = PRODUCTS.map(p => {
    let score = 0;
    let reasons = [];

    // Goals match (highest weight — 3pts each)
    const goalMatches = goals.filter(g => p.goals.includes(g));
    score += goalMatches.length * 3;
    if (goalMatches.includes("definition")) reasons.push("great for curl definition and frizz control");
    if (goalMatches.includes("volume")) reasons.push("helps add volume and bounce");
    if (goalMatches.includes("length")) reasons.push("supports length retention and growth");
    if (goalMatches.includes("damage")) reasons.push("targets damage repair");

    // Porosity match (2pts)
    if (!skipPorosity && p.porosity.includes(porosity)) {
      score += 2;
      const porosityNames = { low:"low porosity", normal:"medium porosity", high:"high porosity" };
      reasons.push(`formulated for ${porosityNames[porosity]} hair`);
    }

    // Hair history match (2pts)
    const historyMatches = history.filter(h => p.history.includes(h));
    if (historyMatches.length > 0) {
      score += 2;
      if (hasChemical && p.history.some(h => ["relaxer","keratin","color"].includes(h))) {
        reasons.push("ideal for chemically treated or transitioning hair");
      } else if (history.includes("heat") && p.history.includes("heat")) {
        reasons.push("great for heat-styled hair");
      }
    }

    // Journey match (1pt)
    if (journey && p.journey.includes(journey)) {
      score += 1;
      const journeyNames = { start:"beginners", routine:"those building a routine", levelup:"those leveling up", transitioning:"transitioning hair" };
      reasons.push(`recommended for ${journeyNames[journey]||"your hair journey stage"}`);
    }

    // Scalp bonus for scalp products (1pt)
    if (p.category === "scalp" && scalp && ["dry","flaky","oily"].includes(scalp)) {
      score += 1;
      reasons.push("supports scalp health");
    }

    // Build warm why string
    const why = reasons.length > 0
      ? `This ${categoryLabel[p.category].toLowerCase()} is ${reasons.slice(0,3).join(", ")}. ${p.desc}`
      : p.desc;

    return { product: p, score, why };
  });

  // Sort by score, then pick top product per category (max 4 total)
  scored.sort((a, b) => b.score - a.score);
  const seen = new Set();
  const results = [];
  for (const item of scored) {
    if (results.length >= 4) break;
    if (!seen.has(item.product.category) && item.score > 0) {
      seen.add(item.product.category);
      results.push(item);
    }
  }
  // If we have fewer than 3, fill with next highest scoring regardless of category
  if (results.length < 3) {
    for (const item of scored) {
      if (results.length >= 3) break;
      if (!results.find(r => r.product.id === item.product.id)) {
        results.push(item);
      }
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
        src={product.img}
        alt={product.name}
        style={{width:90,height:90,objectFit:"contain",borderRadius:12,background:C.cream,flexShrink:0}}
        onError={e=>{ e.target.style.display="none"; }}
      />
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
        <div style={{marginTop:12,fontSize:14,color:"#555",lineHeight:1.65}}>
          <strong style={{color:C.primary}}>Why it works for you: </strong>{why}
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFU, setShowFU] = useState(false);
  const [recs, setRecs] = useState(null);
  const [error, setError] = useState(null);

  const q = QUESTIONS[qIdx];
  const val = answers[q?.id];
  const fuVal = answers[q?.followUp?.id];

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
    setScreen("loading");
    setTimeout(() => {
      try {
        const results = getRecommendations(answers);
        setRecs(results);
        setScreen("results");
      } catch(e) { setError("Something went wrong: " + e.message); setScreen("results"); setRecs([]); }
    }, 1500);
  };

  const reset = () => { setScreen("landing"); setQIdx(0); setAnswers({}); setRecs(null); setShowFU(false); setError(null); };

  // ── LANDING ──
  if (screen==="landing") return (
    <div style={{minHeight:"100vh",background:C.cream,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Palatino Linotype',Palatino,serif"}}>
      <div style={{maxWidth:420,width:"100%",textAlign:"center"}}>
        <PeloraLogo size={90}/>
        <div style={{fontSize:46,fontWeight:700,color:C.deep,letterSpacing:-1,marginTop:16}}>Pelora</div>
        <div style={{fontSize:18,color:C.primary,fontStyle:"italic",marginTop:6,marginBottom:32}}>Expert curl care in your pocket.</div>
        <p style={{fontSize:15,color:"#666",lineHeight:1.75,marginBottom:40}}>
          Answer 5 quick questions and get a personalized product plan curated just for your curls — no salon visit required.
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

  // ── LOADING ──
  if (screen==="loading") return (
    <div style={{minHeight:"100vh",background:C.cream,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,fontFamily:"'Palatino Linotype',Palatino,serif"}}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <div style={{animation:"spin 2s linear infinite"}}><PeloraLogo size={72}/></div>
      <div style={{fontSize:22,color:C.deep,fontWeight:700}}>Getting to know your curls...</div>
      <div style={{fontSize:14,color:C.mid}}>Analyzing your answers and picking your perfect products</div>
    </div>
  );

  // ── RESULTS ──
  if (screen==="results") return (
    <div style={{minHeight:"100vh",background:C.cream,padding:"32px 20px",fontFamily:"'Palatino Linotype',Palatino,serif"}}>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <PeloraLogo size={60}/>
          <div style={{fontSize:30,fontWeight:700,color:C.deep,marginTop:12}}>Your Curl Care Plan</div>
          <div style={{fontSize:14,color:C.mid,marginTop:6}}>Curated just for you based on your answers 💜</div>
        </div>
        {error && <div style={{textAlign:"center",color:"#c0392b",marginBottom:20}}>{error}</div>}
        {recs && recs.length>0 ? recs.map(({product,why},i)=>(
          <div key={product.id}>
            <div style={{fontSize:13,fontWeight:700,color:C.mid,marginBottom:4,marginLeft:4}}>#{i+1} Match</div>
            <ProductCard product={product} why={why}/>
          </div>
        )) : !error && <div style={{textAlign:"center",color:"#aaa"}}>No recommendations found.</div>}
        <button onClick={reset} style={{display:"block",margin:"24px auto 0",background:"transparent",border:`2px solid ${C.primary}`,color:C.primary,padding:"12px 36px",borderRadius:50,fontSize:15,fontFamily:"'Palatino Linotype',Palatino,serif",cursor:"pointer"}}>
          Retake Quiz
        </button>
      </div>
    </div>
  );

  // ── QUIZ ──
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
            <OptionBtn key={o.value} emoji={o.emoji} selected={q.type==="single"?val===o.value:(val||[]).includes(o.value)} onClick={()=>pick(q.id,o.value,q.type,q.max)}>
              {o.label}
            </OptionBtn>
          ))}
          {showFU && q.followUp && (
            <div style={{marginTop:16,paddingTop:16,borderTop:`1.5px solid ${C.light}`}}>
              <div style={{fontSize:16,fontWeight:700,color:C.deep,marginBottom:12}}>{q.followUp.question}</div>
              {q.followUp.options.map(o=>(
                <OptionBtn key={o.value} selected={q.followUp.type==="single"?fuVal===o.value:(fuVal||[]).includes(o.value)} onClick={()=>pickFU(q.followUp.id,o.value,q.followUp.type)}>
                  {o.label}
                </OptionBtn>
              ))}
            </div>
          )}
        </div>
        <button disabled={!canNext()} onClick={advance} style={{
          display:"block",width:"100%",marginTop:20,padding:"16px",borderRadius:50,border:"none",
          fontSize:16,fontFamily:"'Palatino Linotype',Palatino,serif",
          background:canNext()?`linear-gradient(135deg,${C.primary},${C.deep})`:C.light,
          color:canNext()?"#fff":"#aaa",cursor:canNext()?"pointer":"not-allowed",transition:"all 0.2s",
        }}>
          {qIdx<QUESTIONS.length-1?"Next →":"Get My Recommendations 💜"}
        </button>
      </div>
    </div>
  );
}
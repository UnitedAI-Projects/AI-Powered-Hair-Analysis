// src/components/ProductsPage.jsx
// Personalized product recommendations powered by the Pelora engine.
// Reads quiz answers + AI result → runs recommendation engine → renders routine.

import { useState, useMemo } from "react";
import { runRecommendationEngine, TIER_LABELS, TYPE_LABELS } from "../engine/recommendationEngine";

const T = {
  redDeep:"#7A0E1E", redMid:"#9B1B30",
  gold:"#C9A03C", goldLight:"#DFC06E", goldPale:"#F7EDCE",
  goldAccessible:"#8B6914",
  cream:"#FDFAF4", creamWarm:"#F8F2E8", creamMid:"#EFE6D6",
  brownText:"#3D2B1F", brownMuted:"#5C4A3A", brownLight:"#7A6858",
  green:"#2E7D4F", greenPale:"#E8F5EE",
};
const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'DM Sans', system-ui, sans-serif";

const TIER_ORDER  = ["drugstore","mid","luxury"];
const TIER_COLORS = {
  drugstore: { bg:"#F0F7F0", text:T.green,     border:"#C3E0CB" },
  mid:       { bg:T.redFaint, text:T.redDeep, border:"#C4485A" },
  luxury:    { bg:"#F5D5D8",  text:T.redDeep,   border:"#E8A0A8" },
};

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ onNavigate }) {
  const [mob, setMob] = useState(false);
  const NAV = [{label:"Home",screen:"landing"},{label:"My Results",screen:"results"},{label:"Challenge",screen:"challenge"},{label:"Tutorials",screen:"tutorials"},{label:"Products",screen:"products"}];
  return (
    <nav style={{position:"sticky",top:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 48px",background:"rgba(253,250,244,0.95)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",borderBottom:`1px solid ${T.creamMid}`}}>
      <button onClick={()=>onNavigate("landing")} style={{fontFamily:serif,fontSize:26,fontWeight:600,fontStyle:"italic",background:`linear-gradient(135deg,${T.redMid},${T.redSoft})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",border:"none",cursor:"pointer",padding:0}}>Pelora</button>
      <ul style={{display:"flex",gap:28,listStyle:"none",margin:0,padding:0}} className="pel-desk">
        {NAV.map(n=>(
          <li key={n.screen}><button onClick={()=>onNavigate(n.screen)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:sans,fontSize:13,color:n.screen==="products"?T.redMid:T.brownMuted,fontWeight:n.screen==="products"?600:400,letterSpacing:"0.06em",borderBottom:n.screen==="products"?`2px solid ${T.redMid}`:"none",paddingBottom:2,transition:"color 0.3s"}} onMouseEnter={e=>e.currentTarget.style.color=T.redMid} onMouseLeave={e=>e.currentTarget.style.color=n.screen==="products"?T.redMid:T.brownMuted}>{n.label}</button></li>
        ))}
      </ul>
      <button onClick={()=>onNavigate("quiz")} className="pel-desk" style={{fontSize:12,fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase",padding:"10px 24px",border:`1.5px solid ${T.redMid}`,borderRadius:100,background:"transparent",color:T.redMid,cursor:"pointer",fontFamily:sans,transition:"all 0.3s"}} onMouseEnter={e=>{e.currentTarget.style.background=T.redMid;e.currentTarget.style.color=T.cream}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.redMid}}>Retake Quiz</button>
      <button className="pel-mob" onClick={()=>setMob(o=>!o)} style={{display:"none",background:"none",border:"none",cursor:"pointer",padding:8,flexDirection:"column",gap:5}}>
        {[0,1,2].map(i=><div key={i} style={{width:22,height:1.5,background:T.brownText,borderRadius:2}}/>)}
      </button>
      {mob&&<div style={{position:"fixed",top:61,left:0,right:0,background:"rgba(253,250,244,0.98)",borderBottom:`1px solid ${T.creamMid}`,display:"flex",flexDirection:"column",padding:"12px 0",zIndex:99}}>
        {NAV.map(n=><button key={n.screen} onClick={()=>{onNavigate(n.screen);setMob(false)}} style={{padding:"14px 32px",textAlign:"left",background:"none",border:"none",cursor:"pointer",fontFamily:sans,fontSize:15,color:T.brownText}}>{n.label}</button>)}
      </div>}
      <style>{`@media(max-width:768px){.pel-desk{display:none!important}.pel-mob{display:flex!important}}`}</style>
    </nav>
  );
}

// ── Tier badge ────────────────────────────────────────────────────────────────
function TierBadge({ tier }) {
  const c = TIER_COLORS[tier] || {};
  return (
    <span style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:c.text,background:c.bg,border:`1px solid ${c.border}`,padding:"3px 10px",borderRadius:100}}>{TIER_LABELS[tier]||tier}</span>
  );
}

// ── Product card ──────────────────────────────────────────────────────────────
function ProductCard({ product, isTop }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div style={{background:"#fff",borderRadius:16,border:`1px solid ${T.creamMid}`,padding:"20px",display:"flex",gap:16,alignItems:"flex-start",position:"relative",boxShadow:isTop?"0 4px 20px rgba(122,14,30,0.07)":"none",transition:"box-shadow 0.2s"}} onMouseEnter={e=>e.currentTarget.style.boxShadow="0 6px 24px rgba(122,14,30,0.1)"} onMouseLeave={e=>e.currentTarget.style.boxShadow=isTop?"0 4px 20px rgba(122,14,30,0.07)":"none"}>
      {isTop&&<div style={{position:"absolute",top:-8,left:20,background:`linear-gradient(135deg,${T.redDeep},${T.redMid})`,color:"#fff",fontSize:9,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",padding:"3px 12px",borderRadius:100}}>Best Match</div>}
      {/* Image or fallback */}
      <div style={{width:80,height:80,borderRadius:12,background:T.creamWarm,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
        {!imgErr && product.image_url
          ? <img src={product.image_url} alt={product.product_name} referrerPolicy="no-referrer" style={{width:"100%",height:"100%",objectFit:"contain"}} onError={()=>setImgErr(true)}/>
          : <span style={{fontFamily:serif,fontSize:22,fontWeight:600,color:T.brownLight}}>{(product.brand||"?")[0]}</span>
        }
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
          <TierBadge tier={product.tier}/>
          <span style={{fontSize:10,color:T.brownLight,fontWeight:400}}>{TYPE_LABELS[product.product_type]||product.product_type}</span>
        </div>
        <div style={{fontFamily:serif,fontSize:18,fontWeight:500,color:T.brownText,marginBottom:2,lineHeight:1.25}}>{product.product_name}</div>
        <div style={{fontSize:12,color:T.brownLight,marginBottom:8,fontWeight:400}}>{product.brand}</div>
        {product.description&&<div style={{fontSize:13,fontWeight:400,color:T.brownMuted,lineHeight:1.55,marginBottom:10}}>{product.description}</div>}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <div style={{fontFamily:serif,fontSize:22,fontWeight:600,color:T.brownText}}>${product.price_usd?.toFixed(2)}</div>
          <a href={product.affiliate_url || "#"} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,fontFamily:sans,fontSize:12,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",color:T.redMid,textDecoration:"none",border:`1px solid ${T.redMid}`,padding:"7px 16px",borderRadius:100,transition:"all 0.2s",opacity:product.affiliate_url?1:0.45,cursor:product.affiliate_url?"pointer":"default"}} onMouseEnter={e=>{if(product.affiliate_url){e.currentTarget.style.background=T.redMid;e.currentTarget.style.color="#fff"}}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.redMid}}>
            Shop on Amazon ↗
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Routine step ──────────────────────────────────────────────────────────────
function RoutineStep({ step, stepNumber }) {
  const [expanded, setExpanded] = useState(true);
  const [activeTier, setActiveTier] = useState(null);

  // Determine which picks to show — filter by active tier if set
  const picks = step.picks || [];
  const filteredPicks = activeTier ? picks.filter(p => p.tier === activeTier) : picks;
  const availableTiers = TIER_ORDER.filter(t => picks.some(p => p.tier === t));

  return (
    <div style={{marginBottom:32}}>
      {/* Step header */}
      <button onClick={()=>setExpanded(e=>!e)} style={{width:"100%",display:"flex",alignItems:"center",gap:16,background:"none",border:"none",cursor:"pointer",padding:"16px 0",textAlign:"left"}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:step.unavailable?T.creamMid:`linear-gradient(135deg,${T.redDeep},${T.redMid})`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:serif,fontSize:16,fontWeight:600,flexShrink:0}}>
          {stepNumber}
        </div>
        <div style={{flex:1}}>
          <div style={{fontFamily:serif,fontSize:22,fontWeight:500,color:T.brownText,lineHeight:1.2}}>{step.step_label}</div>
          <div style={{fontSize:12,color:T.brownLight,fontWeight:400,marginTop:2}}>{step.frequency} • {TYPE_LABELS[step.product_type]||step.product_type}{!step.is_required?" • Optional":""}</div>
        </div>
        <svg style={{color:T.brownMuted,transform:expanded?"rotate(180deg)":"none",transition:"transform 0.3s",flexShrink:0}} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
      </button>

      {expanded&&<div>
        {step.unavailable ? (
          <div style={{background:T.creamWarm,borderRadius:14,padding:"20px 24px",border:`1px dashed ${T.creamMid}`,display:"flex",alignItems:"center",gap:12}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.brownLight} strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>
              <div style={{fontSize:14,fontWeight:500,color:T.brownMuted}}>Products coming soon</div>
              <div style={{fontSize:12,color:T.brownLight,fontWeight:400}}>We're curating {TYPE_LABELS[step.product_type]} options for your profile. Check back soon.</div>
            </div>
          </div>
        ) : (
          <>
            {/* Tier filter */}
            {availableTiers.length > 1 && (
              <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
                <button onClick={()=>setActiveTier(null)} style={{fontSize:12,fontWeight:500,padding:"6px 14px",borderRadius:100,border:`1px solid ${activeTier===null?T.redMid:T.creamMid}`,background:activeTier===null?T.redMid:"transparent",color:activeTier===null?"#fff":T.brownMuted,cursor:"pointer",fontFamily:sans,transition:"all 0.2s"}}>All tiers</button>
                {availableTiers.map(t=>(
                  <button key={t} onClick={()=>setActiveTier(t===activeTier?null:t)} style={{fontSize:12,fontWeight:500,padding:"6px 14px",borderRadius:100,border:`1px solid ${activeTier===t?T.redMid:T.creamMid}`,background:activeTier===t?T.redFaint:"transparent",color:activeTier===t?T.redDeep:T.brownMuted,cursor:"pointer",fontFamily:sans,transition:"all 0.2s"}}>{TIER_LABELS[t]||t}</button>
                ))}
              </div>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {filteredPicks.map((p,i)=>(
                <ProductCard key={p.product_id} product={p} isTop={i===0&&!activeTier}/>
              ))}
            </div>
          </>
        )}
      </div>}

      <div style={{height:1,background:T.creamMid,marginTop:16}}/>
    </div>
  );
}

// ── Profile summary pill row ──────────────────────────────────────────────────
function ProfilePills({ profile, curlType }) {
  const items = [
    { label:"Curl Type", value: curlType || profile.curl?.toUpperCase() || "—" },
    { label:"Porosity",  value: profile.porosity  },
    { label:"Density",   value: profile.density   },
    { label:"Scalp",     value: profile.scalp     },
  ].filter(i => i.value && i.value !== "—");

  return (
    <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:32}}>
      {items.map(item=>(
        <div key={item.label} style={{background:"#fff",border:`1px solid ${T.creamMid}`,borderRadius:100,padding:"8px 18px",display:"flex",gap:8,alignItems:"center"}}>
          <span style={{fontSize:10,fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:T.brownLight}}>{item.label}</span>
          <span style={{fontFamily:serif,fontSize:16,fontWeight:600,color:T.redDeep}}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── Warning banner ────────────────────────────────────────────────────────────
function WarningBanner({ warnings }) {
  if (!warnings || warnings.length === 0) return null;
  return (
    <div style={{background:T.redFaint,border:`1px solid ${T.redMid}`,borderRadius:14,padding:"16px 20px",marginBottom:28}}>
      <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
        <span style={{fontSize:18,flexShrink:0}}>💡</span>
        <div>
          <div style={{fontSize:14,fontWeight:500,color:T.brownText,marginBottom:4}}>A note about your routine</div>
          {warnings.map((w,i)=>(
            <div key={i} style={{fontSize:13,fontWeight:400,color:T.brownMuted,lineHeight:1.6,marginTop:i>0?6:0}}>{w}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main ProductsPage export ──────────────────────────────────────────────────
export function ProductsPage({ answers, aiResult, onNavigate }) {
  // Run the engine — memoised so it doesn't re-run on every render
  const { routine, warnings, profile } = useMemo(() => {
    try {
      return runRecommendationEngine(answers, aiResult);
    } catch(e) {
      console.error("Engine error:", e);
      return { routine: [], warnings: ["Unable to generate recommendations. Please retake the quiz."], profile: {} };
    }
  }, [answers, aiResult]);

  const curlType = aiResult?.curlType || (answers.visualCurlType ? answers.visualCurlType.toUpperCase() : null);
  const goalLabel = profile.goal || "your curls";

  return (
    <div style={{fontFamily:sans,background:T.cream,minHeight:"100vh"}}>
      <style>{`@keyframes pel-fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <Navbar onNavigate={onNavigate}/>

      {/* Hero */}
      <div style={{background:`linear-gradient(135deg,${T.redDeep},${T.redMid})`,padding:"80px 48px 56px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 80% 20%,rgba(201,160,60,0.25),transparent 55%),radial-gradient(circle at 20% 80%,rgba(253,250,244,0.06),transparent 55%)",pointerEvents:"none"}}/>
        <div style={{position:"relative"}}>
          <span style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:11,fontWeight:500,letterSpacing:"0.16em",textTransform:"uppercase",color:"rgba(255,255,255,0.7)",background:"rgba(255,255,255,0.1)",padding:"7px 18px",borderRadius:100,marginBottom:20,animation:"pel-fadeUp 0.6s ease both"}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:T.redMid,display:"inline-block"}}/>Your Personalized Routine
          </span>
          <h1 style={{fontFamily:serif,fontSize:"clamp(28px,5vw,48px)",fontWeight:500,lineHeight:1.15,color:"#fff",marginBottom:12,animation:"pel-fadeUp 0.6s ease 0.1s both"}}>
            Products matched to <em style={{fontStyle:"italic",color:T.redSoft}}>your curls.</em>
          </h1>
          <p style={{fontSize:15,fontWeight:400,color:"rgba(255,255,255,0.8)",maxWidth:500,margin:"0 auto",lineHeight:1.65,animation:"pel-fadeUp 0.6s ease 0.2s both"}}>
            Every recommendation below is scored against your hair profile, porosity, history, and goal — not just your curl type.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div style={{maxWidth:780,margin:"0 auto",padding:"48px 24px 80px"}}>

        {/* Profile pills */}
        <ProfilePills profile={profile} curlType={curlType}/>

        {/* Goal + routine intro */}
        <div style={{marginBottom:32}}>
          <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.16em",textTransform:"uppercase",color:T.redMid,marginBottom:6}}>Your goal: {goalLabel}</div>
          <h2 style={{fontFamily:serif,fontSize:"clamp(24px,4vw,32px)",fontWeight:500,color:T.brownText,lineHeight:1.2,marginBottom:8}}>
            Your {routine.length}-step routine
          </h2>
          <p style={{fontSize:14,fontWeight:400,color:T.brownMuted,lineHeight:1.6}}>
            Each step shows up to 3 options — one per price tier — so you can build the routine that fits your budget. Best Match is the highest-scoring product across all tiers.
          </p>
        </div>

        {/* Warnings */}
        <WarningBanner warnings={warnings}/>

        {/* Routine steps */}
        {routine.length > 0
          ? routine.map((step, i) => (
              <RoutineStep key={step.product_type + i} step={step} stepNumber={i + 1}/>
            ))
          : <div style={{textAlign:"center",padding:"48px 24px",color:T.brownMuted}}>
              <p style={{fontFamily:serif,fontSize:22,marginBottom:16}}>No routine generated.</p>
              <button onClick={()=>onNavigate("quiz")} style={{padding:"12px 32px",borderRadius:100,background:`linear-gradient(135deg,${T.redDeep},${T.redMid})`,border:"none",color:"#fff",fontFamily:sans,fontSize:14,fontWeight:500,cursor:"pointer"}}>Retake Quiz</button>
            </div>
        }

        {/* Retake CTA */}
        <div style={{background:T.creamWarm,borderRadius:20,padding:"32px 28px",textAlign:"center",marginTop:48,border:`1px solid ${T.creamMid}`}}>
          <div style={{fontFamily:serif,fontSize:20,fontWeight:500,color:T.brownText,marginBottom:8}}>Not quite right?</div>
          <p style={{fontSize:14,color:T.brownMuted,lineHeight:1.6,maxWidth:400,margin:"0 auto 20px",fontWeight:400}}>Upload photos for more personalized results, or retake the quiz to update your profile.</p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>onNavigate("quiz")} style={{padding:"12px 28px",borderRadius:100,border:`1.5px solid ${T.redMid}`,background:"transparent",color:T.redMid,fontFamily:sans,fontSize:13,fontWeight:500,cursor:"pointer",transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.background=T.redMid;e.currentTarget.style.color="#fff"}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.redMid}}>Retake Quiz</button>
            <button onClick={()=>onNavigate("results")} style={{padding:"12px 28px",borderRadius:100,border:`1.5px solid ${T.creamMid}`,background:"transparent",color:T.brownMuted,fontFamily:sans,fontSize:13,fontWeight:500,cursor:"pointer",transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.background=T.creamMid}} onMouseLeave={e=>{e.currentTarget.style.background="transparent"}}>← Back to Results</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{padding:"36px 48px",borderTop:`1px solid ${T.creamMid}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <span style={{fontFamily:serif,fontSize:20,fontWeight:600,fontStyle:"italic",background:`linear-gradient(135deg,${T.redMid},${T.redSoft})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>pelora</span>
        <p style={{fontSize:12,color:T.brownLight,fontWeight:400}}>Built for waves, curls, coils & all textures in between.</p>
        <p style={{fontSize:12,color:T.brownLight,fontWeight:400}}>© 2026 Pelora</p>
      </footer>
    </div>
  );
}
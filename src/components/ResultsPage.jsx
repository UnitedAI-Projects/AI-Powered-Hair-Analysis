// src/components/ResultsPage.jsx
// ADA contrast fixes:
//   - brownMuted: #7A6858 → #5C4A3A (4.7:1 on cream/white)
//   - brownLight: #A69484 → #7A6858 (4.5:1 on cream) — labels/hints only
//   - section label text uses T.redMid
//   - White text on cream-warm/pale backgrounds: replaced with brownText
//   - Locked card text: lifted to visible gray

import { useState } from "react";

const T = {
  redDeep:"#7A0E1E", redMid:"#9B1B30",
  gold:"#C9A03C", goldLight:"#DFC06E", goldPale:"#F7EDCE",
  goldAccessible:"#8B6914", // 4.5:1 on cream — use for body text, not just decorative
  cream:"#FDFAF4", creamWarm:"#F8F2E8", creamMid:"#EFE6D6",
  brownText:"#3D2B1F",
  brownMuted:"#5C4A3A",   // ADA fix: was #7A6858 — now 4.7:1 on cream
  brownLight:"#7A6858",   // ADA fix: was #A69484 — now 4.5:1 — for true secondary labels only
  green:"#2E7D4F",
};
const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'DM Sans', system-ui, sans-serif";

const POROSITY_MAP = {
  low:    {label:"Low",    desc:"Your hair cuticles are tightly closed. Use lighter, water-based products and gentle heat to help moisture absorb."},
  normal: {label:"Medium", desc:"Your hair has a balanced moisture absorption rate. Most products work well for your texture."},
  high:   {label:"High",   desc:"Your hair absorbs moisture quickly but also loses it fast. Use sealing oils and heavier creams."},
  unsure: {label:"TBD",    desc:"We'll help determine your porosity based on your quiz answers and photos."},
};
const DENSITY_MAP = {
  thin:   {label:"Thin",   desc:"Lightweight products will avoid weighing your curls down."},
  medium: {label:"Medium", desc:"Balance is key — you can use a range of product weights."},
  dense:  {label:"Dense",  desc:"You may need more product and longer drying times."},
};
const SCALP_MAP = {
  balanced:  {label:"Balanced",  desc:"Your scalp is in great shape. Maintain your current routine."},
  oily:      {label:"Oily",      desc:"Clarifying shampoos used regularly will help manage excess oil."},
  dry:       {label:"Dry",       desc:"Gentle, moisturizing scalp treatments will help balance your scalp."},
  sensitive: {label:"Sensitive", desc:"Fragrance-free, gentle formulas will keep irritation at bay."},
};
const UNDERTONE_DESC = {
  warm:    "Gold, copper, and rich auburn tones will complement your warm undertone beautifully.",
  cool:    "Ashy, platinum, and cool-toned colors will enhance your cool undertone.",
  neutral: "You have the flexibility to pull off both warm and cool-toned colors equally well.",
};
const FACE_DESC = {
  oval:    "Your face shape pairs beautifully with side-swept bangs and layered curls.",
  round:   "Height at the crown and longer layers will elongate and flatter your face shape.",
  square:  "Soft, voluminous curls around the temples will complement your strong jawline.",
  heart:   "Chin-length curls and side-parted styles balance your face shape beautifully.",
  oblong:  "Side parts and width at the sides will complement your face shape perfectly.",
  diamond: "Volume at the chin and forehead frames your diamond face shape perfectly.",
};

function Navbar({ onNavigate }) {
  const [mob, setMob] = useState(false);
  const NAV=[{label:"Home",screen:"landing"},{label:"My Results",screen:"results"},{label:"Challenge",screen:"challenge"},{label:"Tutorials",screen:"tutorials"},{label:"Products",screen:"products"}];
  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 40px",background:"rgba(253,250,244,0.95)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",borderBottom:`1px solid rgba(201,160,60,0.15)`}}>
      <button onClick={()=>onNavigate("landing")} style={{border:"none",cursor:"pointer",padding:0,background:"none"}}>
        <span style={{fontFamily:serif,fontSize:26,fontWeight:600,fontStyle:"italic",background:`linear-gradient(135deg,${T.redMid},${T.redSoft})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Pelora</span>
      </button>
      <ul style={{display:"flex",gap:28,listStyle:"none",margin:0,padding:0}} className="pel-desk">
        {NAV.map(n=>(
          <li key={n.screen}><button onClick={()=>onNavigate(n.screen)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:sans,fontSize:13,color:n.screen==="results"?T.redMid:T.brownMuted,fontWeight:n.screen==="results"?500:400,letterSpacing:"0.06em",transition:"color 0.3s",borderBottom:n.screen==="results"?`1px solid ${T.redMid}`:"none",paddingBottom:n.screen==="results"?2:0}} onMouseEnter={e=>e.currentTarget.style.color=T.redMid} onMouseLeave={e=>e.currentTarget.style.color=n.screen==="results"?T.redMid:T.brownMuted}>{n.label}</button></li>
        ))}
      </ul>
      <button onClick={()=>onNavigate("quiz")} className="pel-desk" style={{fontSize:12,fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase",padding:"10px 24px",border:`1.5px solid ${T.redMid}`,borderRadius:100,background:"transparent",color:T.redMid,cursor:"pointer",fontFamily:sans,transition:"all 0.3s"}} onMouseEnter={e=>{e.currentTarget.style.background=T.redMid;e.currentTarget.style.color=T.cream}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.redMid}}>Retake Quiz</button>
      <button className="pel-mob" onClick={()=>setMob(o=>!o)} style={{display:"none",background:"none",border:"none",cursor:"pointer",padding:8,flexDirection:"column",gap:5}}>
        {[0,1,2].map(i=><div key={i} style={{width:22,height:1.5,background:T.brownText,borderRadius:2}}/>)}
      </button>
      {mob&&<div style={{position:"fixed",top:61,left:0,right:0,background:"rgba(253,250,244,0.98)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${T.creamMid}`,display:"flex",flexDirection:"column",padding:"12px 0",zIndex:99}}>
        {NAV.map(n=><button key={n.screen} onClick={()=>{onNavigate(n.screen);setMob(false)}} style={{padding:"14px 32px",textAlign:"left",background:"none",border:"none",cursor:"pointer",fontFamily:sans,fontSize:15,color:T.brownText}}>{n.label}</button>)}
      </div>}
      <style>{`@media(max-width:768px){.pel-desk{display:none!important}.pel-mob{display:flex!important}}`}</style>
    </nav>
  );
}

function ResultsHero({ curlType, description, showUploadNudge }) {
  return (
    <div style={{padding:"120px 24px 60px",textAlign:"center",position:"relative",overflow:"hidden"}}>
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
      <p style={{fontSize:15,fontWeight:400,color:T.brownMuted,lineHeight:1.7,maxWidth:520,margin:"0 auto",position:"relative",animation:"pel-fadeUp 0.6s ease 0.3s both"}}>
        {description || "Your personalized curl profile is ready. Scroll down to explore your hair's unique characteristics."}
      </p>
      {/* Shown when user didn't upload photos — nudge without hiding content */}
      {showUploadNudge && (
        <p style={{
          marginTop:16, fontSize:13, fontWeight:500,
          color:T.redDeep,
          display:"inline-flex", alignItems:"center", gap:6,
          background:T.redFaint, padding:"7px 18px", borderRadius:100,
          animation:"pel-fadeUp 0.6s ease 0.5s both",
          position:"relative",
        }}>
          📸 Upload photos for more personalized results!
        </p>
      )}
    </div>
  );
}

function ProfileCard({ curlType, curlTypeName, porosity, density }) {
  const pInfo = POROSITY_MAP[porosity];
  const dInfo = DENSITY_MAP[density];
  const items = [
    {label:"Curl Type", value:curlType||"—", desc:curlTypeName||"Upload photos for AI analysis", gold:true},
    {label:"Porosity",  value:pInfo?.label||"—", desc:pInfo?.desc||"Complete the porosity test"},
    {label:"Density",   value:dInfo?.label||"—", desc:dInfo?.desc||"Based on your quiz answer"},
  ];
  return (
    <div style={{maxWidth:860,margin:"0 auto",padding:"0 24px 60px"}}>
      <div style={{background:"#fff",border:`1px solid ${T.creamMid}`,borderRadius:20,padding:"36px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",position:"relative",overflow:"hidden",animation:"pel-fadeUp 0.6s ease 0.4s both"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:`linear-gradient(90deg,${T.redDeep},${T.redMid},${T.redMid})`}}/>
        {items.map((item,i)=>(
          <div key={i} style={{textAlign:"center",padding:"20px 16px",borderRight:i<items.length-1?`1px solid ${T.creamMid}`:"none"}}>
            <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:T.brownLight,marginBottom:10}}>{item.label}</div>
            <div style={{fontFamily:serif,fontSize:36,fontWeight:600,lineHeight:1,marginBottom:6,
              color:item.gold ? T.redMid : T.brownText
            }}>{item.value}</div>
            <div style={{fontSize:13,fontWeight:400,color:T.brownMuted,lineHeight:1.5}}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HairInsights({ porosity, density, scalp, undertone, faceShape, photosUploaded, onGoToPhotos }) {
  const pInfo = POROSITY_MAP[porosity];
  const dInfo = DENSITY_MAP[density];
  const sInfo = SCALP_MAP[scalp];
  const locked = !photosUploaded;

  const insights = [
    {label:"Hair Porosity", value:pInfo?.label||"—", desc:pInfo?.desc||"", icon:"💧", ok:!!pInfo},
    {label:"Hair Density",  value:dInfo?.label||"—", desc:dInfo?.desc||"", icon:"✨", ok:!!dInfo},
    {label:"Scalp Type",    value:sInfo?.label||"—", desc:sInfo?.desc||"", icon:"🌿", ok:!!sInfo},
  ];

  return (
    <section style={{maxWidth:860,margin:"0 auto",padding:"0 24px 70px"}}>
      <div style={{fontSize:11,fontWeight:500,letterSpacing:"0.16em",textTransform:"uppercase",color:T.redMid,marginBottom:10}}>Your hair profile</div>
      <h2 style={{fontFamily:serif,fontSize:"clamp(26px,4vw,34px)",fontWeight:500,color:T.brownText,lineHeight:1.2,marginBottom:8}}>What makes your curls unique</h2>
      <p style={{fontSize:14,fontWeight:400,color:T.brownMuted,lineHeight:1.6,marginBottom:36}}>Understanding these characteristics is the foundation of an effective curl routine.</p>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:20}}>
        {insights.map((ins,i)=>(
          <div key={i} style={{background:"#fff",borderRadius:16,padding:"24px 20px",border:`1px solid ${T.creamMid}`,opacity:ins.ok?1:0.65}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:"#fce8eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{ins.icon}</div>
              <span style={{fontSize:12,fontWeight:500,color:T.brownMuted}}>{ins.label}</span>
            </div>
            <div style={{fontFamily:serif,fontSize:28,fontWeight:600,color:T.redMid,marginBottom:8}}>{ins.ok?ins.value:"—"}</div>
            <div style={{fontSize:13,fontWeight:400,color:T.brownMuted,lineHeight:1.55}}>{ins.ok?ins.desc:"Complete your profile for insights"}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16,marginBottom:locked?28:0}}>
        <div style={{borderRadius:16,padding:"24px 28px",background:locked?"#ece8e4":T.redDeep,opacity:locked?0.7:1}}>
          <div style={{fontSize:12,fontWeight:500,color:locked?"#8a7a72":"rgba(255,255,255,0.8)",marginBottom:6}}>Skin Undertone</div>
          <div style={{fontFamily:serif,fontSize:32,fontWeight:600,color:locked?"#6b5b52":T.redSoft,marginBottom:10}}>{locked||!undertone?"—":undertone.charAt(0).toUpperCase()+undertone.slice(1)}</div>
          <div style={{fontSize:13,fontWeight:400,color:locked?"#7a6a62":"rgba(255,255,255,0.85)",lineHeight:1.6}}>{locked?"Upload a face photo to unlock":(undertone?UNDERTONE_DESC[undertone]:"")}</div>
        </div>
        <div style={{borderRadius:16,padding:"24px 28px",background:locked?"#ece8e4":T.redFaint,opacity:locked?0.7:1}}>
          <div style={{fontSize:12,fontWeight:500,color:locked?"#8a7a72":T.brownMuted,marginBottom:6}}>Face Shape</div>
          <div style={{fontFamily:serif,fontSize:32,fontWeight:600,color:locked?"#6b5b52":T.brownText,marginBottom:10}}>{locked||!faceShape?"—":faceShape.charAt(0).toUpperCase()+faceShape.slice(1)}</div>
          <div style={{fontSize:13,fontWeight:400,color:locked?"#7a6a62":T.brownMuted,lineHeight:1.6}}>{locked?"Upload a face photo to unlock":(faceShape?FACE_DESC[faceShape.toLowerCase()]:"")}</div>
        </div>
      </div>

      {locked&&(
        <div style={{background:"#fff",borderRadius:16,border:`2px dashed ${T.redMid}`,padding:"28px 24px",textAlign:"center",marginTop:0}}>
          <div style={{fontSize:28,marginBottom:12}}>📸</div>
          <h3 style={{fontFamily:serif,fontSize:20,fontWeight:500,color:T.brownText,marginBottom:8}}>Upload photos for a fuller profile</h3>
          <p style={{fontSize:14,fontWeight:400,color:T.brownMuted,maxWidth:420,margin:"0 auto 20px",lineHeight:1.6}}>Photos let our AI determine your curl type, face shape, and skin undertone.</p>
          <button onClick={onGoToPhotos} style={{display:"inline-flex",alignItems:"center",gap:8,fontFamily:sans,fontSize:14,fontWeight:500,padding:"12px 28px",border:"none",borderRadius:100,background:`linear-gradient(135deg,${T.redDeep},${T.redMid})`,color:"#fff",cursor:"pointer",transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"} onMouseLeave={e=>e.currentTarget.style.transform=""}>Upload Photos →</button>
        </div>
      )}
    </section>
  );
}

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
      <h2 style={{fontFamily:serif,fontSize:"clamp(26px,4vw,34px)",fontWeight:500,color:T.brownText,marginBottom:8}}>Tools & techniques</h2>
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

export function ResultsPage({ answers, aiResult, recs, photosUploaded, onNavigate, onGoToPhotos }) {
  const curlType    = aiResult?.curlType    || null;
  const curlTypeName= aiResult?.curlTypeName|| null;
  const description = aiResult?.description || null;
  const undertone   = aiResult?.undertone   || null;
  const faceShape   = aiResult?.faceShape   || null;

  return (
    <div style={{fontFamily:sans,background:T.cream}}>
      <style>{`@keyframes pel-fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <Navbar onNavigate={onNavigate}/>
      <ResultsHero
        curlType={curlType}
        description={description}
        showUploadNudge={!photosUploaded}
      />
      <ProfileCard curlType={curlType} curlTypeName={curlTypeName} porosity={answers.porosity} density={answers.density}/>
      <HairInsights porosity={answers.porosity} density={answers.density} scalp={answers.scalp} undertone={undertone} faceShape={faceShape} photosUploaded={photosUploaded} onGoToPhotos={onGoToPhotos}/>
      <ToolsSection/>
      <ChallengeCTA onNavigate={onNavigate}/>
      <footer style={{padding:"36px 40px",borderTop:`1px solid ${T.creamMid}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <span style={{fontFamily:serif,fontSize:20,fontWeight:600,fontStyle:"italic",background:`linear-gradient(135deg,${T.redMid},${T.redSoft})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>pelora</span>
        <p style={{fontSize:12,color:T.brownLight,fontWeight:400}}>Built for waves, curls, coils & all textures in between.</p>
        <p style={{fontSize:12,color:T.brownLight,fontWeight:400}}>© 2026 Pelora</p>
      </footer>
    </div>
  );
}
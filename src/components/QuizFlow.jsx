// src/components/QuizFlow.jsx
// Quiz order: [AgeConsent] → Goals → Density → Porosity → History → Journey → Scalp → VisualHairType → Results

import { useState } from "react";

const T = {
  redDeep:"#7A0E1E", redMid:"#9B1B30", redSoft:"#C4485A",
  redFaint:"#F5D5D8",
  gold:"#C9A03C",
  cream:"#FDFAF4", creamWarm:"#F8F2E8", creamMid:"#EFE6D6",
  brownText:"#3D2B1F",
  brownMuted:"#5C4A3A",
  brownLight:"#7A6858",
};
const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'DM Sans', system-ui, sans-serif";

const TOTAL_STEPS = 8; // 7 quiz questions + 1 visual hair type screen

export const CURL_TYPE_MAP = {
  "2a": { curlType:"2A", curlTypeName:"Loose Wave",    description:"You have beautiful loose S-waves that form naturally when wet. Your waves are lightweight and respond well to mousse and light creams — heavy products can weigh them down." },
  "2b": { curlType:"2B", curlTypeName:"Defined Wave",  description:"Your hair forms defined S-waves that hug the head slightly. You're right in the sweet spot between wavy and curly — a good curl cream and diffuser can really make your waves pop." },
  "2c": { curlType:"2C", curlTypeName:"Wavy/Curly",    description:"Your waves are thick and coarse with a tendency toward frizz. You're on the border of wavy and curly — styling on soaking wet hair and using the praying hands method works best for you." },
  "3a": { curlType:"3A", curlTypeName:"Loose Curl",    description:"You have large, loose spirals with a lot of shine and movement. Your curls define easily but can get weighed down — lightweight leave-ins and scrunching are your best friends." },
  "3b": { curlType:"3B", curlTypeName:"Springy Curl",  description:"Your curls are springy, medium-sized corkscrews that need consistent moisture. Deep conditioning regularly and sealing with a light oil will keep your curls bouncy and defined." },
  "3c": { curlType:"3C", curlTypeName:"Tight Curl",    description:"You have tight, voluminous corkscrew curls packed closely together. Your curls are prone to frizz and dryness — the LOC method and regular protein treatments will keep them strong and defined." },
  "4a": { curlType:"4A", curlTypeName:"Soft Coil",     description:"Your hair forms defined S-coils that are soft and springy. Though it may not look it, your hair can hold a lot of moisture — co-washing and rich leave-ins will keep your coils thriving." },
  "4b": { curlType:"4B", curlTypeName:"Zigzag Coil",   description:"Your hair bends in sharp angles rather than a defined curl pattern. Shrinkage is significant, which means your hair is longer than it looks — gentle detangling and heavy moisturizers are essential." },
  "4c": { curlType:"4C", curlTypeName:"Tight Coil",    description:"You have the tightest coil pattern with the most shrinkage of any curl type. Your hair is incredibly versatile and strong — but it needs serious moisture, gentle handling, and protective styles to retain length." },
};

// ── Headers ───────────────────────────────────────────────────────────────────
function QuizHeader({ step, total }) {
  const pct = (step / total) * 100;
  return (
    <header style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(253,250,244,0.95)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",borderBottom:`1px solid rgba(201,160,60,0.15)`,padding:"16px 24px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",maxWidth:600,margin:"0 auto 10px"}}>
        <span style={{fontFamily:serif,fontSize:22,fontWeight:600,fontStyle:"italic",background:`linear-gradient(135deg,${T.redMid},${T.redSoft})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>pelora</span>
        <span style={{fontSize:12,color:T.brownMuted,fontWeight:400}}>Step {step} of {total}</span>
      </div>
      <div style={{maxWidth:600,margin:"0 auto",height:4,background:T.creamMid,borderRadius:4,overflow:"hidden"}}>
        <div style={{height:"100%",background:`linear-gradient(90deg,${T.redDeep},${T.redMid})`,borderRadius:4,width:`${pct}%`,transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)"}}/>
      </div>
    </header>
  );
}

function InterstitialHeader({ label }) {
  return (
    <header style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(253,250,244,0.95)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",borderBottom:`1px solid rgba(201,160,60,0.15)`,padding:"16px 24px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",maxWidth:600,margin:"0 auto 10px"}}>
        <span style={{fontFamily:serif,fontSize:22,fontWeight:600,fontStyle:"italic",background:`linear-gradient(135deg,${T.redMid},${T.redSoft})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>pelora</span>
        <span style={{fontSize:12,color:T.brownMuted,fontWeight:400}}>{label}</span>
      </div>
      <div style={{maxWidth:600,margin:"0 auto",height:4,background:T.creamMid,borderRadius:4,overflow:"hidden"}}>
        <div style={{height:"100%",background:`linear-gradient(90deg,${T.redDeep},${T.redMid})`,borderRadius:4,width:"0%"}}/>
      </div>
    </header>
  );
}

// ── Nav row ───────────────────────────────────────────────────────────────────
function NavRow({ onBack, onNext, nextDisabled, nextLabel="Continue", showBack=true }) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"auto",paddingTop:36}}>
      {showBack
        ? <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,fontFamily:sans,fontSize:13,fontWeight:400,color:T.brownMuted,background:"none",border:"none",cursor:"pointer",padding:"10px 0",transition:"color 0.2s"}} onMouseEnter={e=>e.currentTarget.style.color=T.brownText} onMouseLeave={e=>e.currentTarget.style.color=T.brownMuted}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>Back
          </button>
        : <div/>
      }
      <button onClick={nextDisabled?undefined:onNext} style={{display:"flex",alignItems:"center",gap:8,fontFamily:sans,fontSize:14,fontWeight:500,letterSpacing:"0.04em",padding:"14px 36px",border:"none",borderRadius:100,background:nextDisabled?T.creamMid:`linear-gradient(135deg,${T.redDeep},${T.redMid})`,color:nextDisabled?T.brownLight:"#fff",cursor:nextDisabled?"not-allowed":"pointer",transition:"all 0.3s ease"}}
        onMouseEnter={e=>{if(!nextDisabled){e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow=`0 8px 24px rgba(122,14,30,0.2)`}}}
        onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
        {nextLabel}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </button>
    </div>
  );
}

// ── Option components ─────────────────────────────────────────────────────────
function SingleOption({ label, desc, selected, onClick }) {
  return (
    <div onClick={onClick} style={{display:"flex",alignItems:"flex-start",gap:14,padding:"18px 20px",borderRadius:14,background:selected?T.redFaint:T.creamWarm,border:`1.5px solid ${selected?T.redMid:"transparent"}`,cursor:"pointer",transition:"all 0.2s ease",marginBottom:10}}
      onMouseEnter={e=>{if(!selected){e.currentTarget.style.borderColor=T.creamMid;e.currentTarget.style.background="#fff"}}}
      onMouseLeave={e=>{if(!selected){e.currentTarget.style.borderColor="transparent";e.currentTarget.style.background=T.creamWarm}}}>
      <div style={{width:20,height:20,borderRadius:"50%",border:`1.5px solid ${selected?T.redMid:T.brownLight}`,flexShrink:0,marginTop:1,display:"flex",alignItems:"center",justifyContent:"center",background:selected?T.redMid:"transparent",transition:"all 0.2s"}}>
        {selected&&<div style={{width:7,height:7,background:"#fff",borderRadius:"50%"}}/>}
      </div>
      <div style={{flex:1}}>
        <div style={{fontSize:14,fontWeight:500,color:selected?T.redDeep:T.brownText,marginBottom:desc?3:0}}>{label}</div>
        {desc&&<div style={{fontSize:13,fontWeight:400,color:selected?T.redSoft:T.brownMuted,lineHeight:1.5}}>{desc}</div>}
      </div>
    </div>
  );
}

function MultiOption({ label, desc, selected, onClick }) {
  return (
    <div onClick={onClick} style={{display:"flex",alignItems:"flex-start",gap:14,padding:"18px 20px",borderRadius:14,background:selected?T.redFaint:T.creamWarm,border:`1.5px solid ${selected?T.redMid:"transparent"}`,cursor:"pointer",transition:"all 0.2s ease",marginBottom:10}}
      onMouseEnter={e=>{if(!selected){e.currentTarget.style.borderColor=T.creamMid;e.currentTarget.style.background="#fff"}}}
      onMouseLeave={e=>{if(!selected){e.currentTarget.style.borderColor="transparent";e.currentTarget.style.background=T.creamWarm}}}>
      <div style={{width:20,height:20,borderRadius:5,border:`1.5px solid ${selected?T.redMid:T.brownLight}`,flexShrink:0,marginTop:1,display:"flex",alignItems:"center",justifyContent:"center",background:selected?T.redMid:"transparent",transition:"all 0.2s"}}>
        {selected&&<svg width="11" height="9" viewBox="0 0 11 9" fill="none"><polyline points="1,5 4,8 10,1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <div style={{flex:1}}>
        <div style={{fontSize:14,fontWeight:500,color:selected?T.redDeep:T.brownText,marginBottom:desc?3:0}}>{label}</div>
        {desc&&<div style={{fontSize:13,fontWeight:400,color:selected?T.redSoft:T.brownMuted,lineHeight:1.5}}>{desc}</div>}
      </div>
    </div>
  );
}

function QWrap({ category, title, subtitle, footnote, children, onBack, onNext, nextDisabled, nextLabel, showBack=true }) {
  return (
    <div style={{maxWidth:520,margin:"0 auto",padding:"110px 24px 40px",minHeight:"100vh",display:"flex",flexDirection:"column",animation:"pel-slideIn 0.4s ease forwards"}}>
      {category&&<div style={{fontSize:10,fontWeight:500,letterSpacing:"0.16em",textTransform:"uppercase",color:T.redMid,marginBottom:8}}>{category}</div>}
      <div style={{fontFamily:serif,fontSize:"clamp(26px,5vw,34px)",fontWeight:500,lineHeight:1.2,color:T.brownText,marginBottom:subtitle?8:20}}>{title}</div>
      {subtitle&&<div style={{fontSize:14,fontWeight:400,color:T.brownMuted,lineHeight:1.55,marginBottom:28}}>{subtitle}</div>}
      <div style={{flex:1}}>{children}</div>
      {footnote&&<p style={{textAlign:"center",fontSize:13,color:T.brownMuted,fontStyle:"italic",margin:"16px 0 0",fontWeight:400}}>{footnote}</p>}
      <NavRow onBack={onBack} onNext={onNext} nextDisabled={nextDisabled} nextLabel={nextLabel} showBack={showBack}/>
    </div>
  );
}

// ── Age verification consent ──────────────────────────────────────────────────
export function AgeConsent({ onAccept, onBack, onExit, onNavigate }) {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <InterstitialHeader label="Before we begin" />
      <div style={{
        maxWidth:520, margin:"0 auto", padding:"110px 24px 40px",
        minHeight:"100vh", display:"flex", flexDirection:"column",
        fontFamily:sans, animation:"pel-slideIn 0.4s ease forwards",
      }}>
        <style>{`@keyframes pel-slideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>

        {/* Icon */}
        <div style={{width:52,height:52,borderRadius:14,background:T.redFaint,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,color:T.redMid}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>

        <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.16em",textTransform:"uppercase",color:T.redMid,marginBottom:8}}>Age &amp; consent</div>
        <div style={{fontFamily:serif,fontSize:"clamp(26px,5vw,32px)",fontWeight:500,lineHeight:1.2,color:T.brownText,marginBottom:12}}>
          You must be 13 or older to use Pelora.
        </div>
        <div style={{fontSize:14,fontWeight:400,color:T.brownMuted,lineHeight:1.65,marginBottom:32}}>
          Pelora generates personalized hair recommendations based on your quiz answers. Please confirm you are old enough to continue.
        </div>

        {/* Age checkbox */}
        <label
          style={{display:"flex",gap:14,alignItems:"flex-start",background:checked?"#fff":T.creamWarm,border:`1.5px solid ${checked?T.redMid:"transparent"}`,borderRadius:14,padding:"18px 20px",cursor:"pointer",marginBottom:16,transition:"all 0.2s"}}
          onMouseEnter={e=>{if(!checked){e.currentTarget.style.borderColor=T.creamMid;e.currentTarget.style.background="#fff";}}}
          onMouseLeave={e=>{if(!checked){e.currentTarget.style.borderColor="transparent";e.currentTarget.style.background=T.creamWarm;}}}
        >
          <div style={{width:20,height:20,borderRadius:5,flexShrink:0,marginTop:2,border:`1.5px solid ${checked?T.redMid:T.brownLight}`,background:checked?T.redMid:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>
            {checked&&<svg width="11" height="9" viewBox="0 0 11 9" fill="none"><polyline points="1,5 4,8 10,1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <input type="checkbox" checked={checked} onChange={e=>setChecked(e.target.checked)} style={{display:"none"}}/>
          <span style={{fontSize:14,color:checked?T.brownText:T.brownMuted,lineHeight:1.6,fontWeight:checked?500:400,transition:"color 0.2s"}}>
            I confirm that I am 13 years of age or older.
          </span>
        </label>

        {/* Privacy policy note */}
        <p style={{fontSize:13,color:T.brownMuted,lineHeight:1.65,marginBottom:0}}>
          By continuing you also agree to Pelora's{" "}
          <button
            onClick={()=>onNavigate?.("privacy")}
            style={{fontSize:13,color:T.redMid,fontWeight:500,textDecoration:"underline",textUnderlineOffset:3,background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:sans}}
          >
            Privacy Policy
          </button>.
        </p>

        {/* CTA */}
        <div style={{marginTop:"auto",paddingTop:36}}>
          <button
            onClick={checked?onAccept:undefined}
            style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:sans,fontSize:14,fontWeight:500,letterSpacing:"0.04em",padding:"16px 36px",border:"none",borderRadius:100,background:checked?`linear-gradient(135deg,${T.redDeep},${T.redMid})`:T.creamMid,color:checked?"#fff":T.brownLight,cursor:checked?"pointer":"not-allowed",transition:"all 0.3s ease"}}
            onMouseEnter={e=>{if(checked){e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow=`0 8px 24px rgba(122,14,30,0.2)`;}}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}
          >
            Start My Hair Profile
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>

          {/* Under-13 exit link */}
          <div style={{textAlign:"center",marginTop:16}}>
            <button
              onClick={onExit}
              style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:T.brownMuted,fontFamily:sans,textDecoration:"underline",textUnderlineOffset:3,padding:"8px",fontWeight:400}}
              onMouseEnter={e=>e.currentTarget.style.color=T.brownText}
              onMouseLeave={e=>e.currentTarget.style.color=T.brownMuted}
            >
              I am under 13 — exit quiz
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Q1 — Goals ────────────────────────────────────────────────────────────────
function Q1_Goals({ answers, onAnswer, onBack, onNext }) {
  const OPTIONS = [
    {value:"definition",label:"More Definition",     desc:"I want my curls to look more structured and bouncy"},
    {value:"frizz",     label:"Less Frizz",          desc:"Humidity is my worst enemy — I need smoother curls"},
    {value:"moisture",  label:"Moisture & Softness", desc:"My hair feels dry and rough — I need deep hydration"},
    {value:"length",    label:"Length Retention",    desc:"I want my hair to grow longer without breakage"},
    {value:"scalp",     label:"Healthier Scalp",     desc:"My scalp needs attention — dryness, oiliness, or irritation"},
  ];
  const val = answers.goals || null;
  return (
    <QWrap category="Hair goals" title="What is your #1 hair goal right now?" subtitle="Pick the one that matters most to you." onBack={onBack} onNext={onNext} nextDisabled={!val} showBack={true}>
      {OPTIONS.map(o=><SingleOption key={o.value} label={o.label} desc={o.desc} selected={val===o.value} onClick={()=>onAnswer("goals",o.value)}/>)}
    </QWrap>
  );
}

// ── Q2 — Density ──────────────────────────────────────────────────────────────
function Q2_Density({ answers, onAnswer, onBack, onNext }) {
  const OPTIONS = [
    {value:"thin",   label:"Thin",   desc:"You can clearly see scalp through your hair"},
    {value:"medium", label:"Medium", desc:"You can see some scalp through your hair"},
    {value:"dense",  label:"Dense",  desc:"You can barely see scalp through your hair"},
  ];
  const val = answers.density;
  return (
    <QWrap category="Hair density" title="What is your hair density?" subtitle="This is the amount of hair strands per square inch of scalp." onBack={onBack} onNext={onNext} nextDisabled={!val}>
      {OPTIONS.map(o=><SingleOption key={o.value} label={o.label} desc={o.desc} selected={val===o.value} onClick={()=>onAnswer("density",o.value)}/>)}
    </QWrap>
  );
}

// ── Q3 — Porosity ─────────────────────────────────────────────────────────────
function Q3_Porosity({ answers, onAnswer, onBack, onNext }) {
  const OPTIONS = [
    {value:"high",   label:"Sooner than 40 minutes"},
    {value:"normal", label:"Between 40 minutes and 2 hours"},
    {value:"low",    label:"Between 2 and 7 hours"},
  ];
  const val = answers.porosity;
  return (
    <QWrap category="Hair porosity" title="Let's test your hair porosity." subtitle="How long does it take your hair to air-dry out of the shower without any products?" onBack={onBack} onNext={onNext} nextDisabled={!val}>
      {OPTIONS.map(o=><SingleOption key={o.value} label={o.label} desc={o.desc} selected={val===o.value} onClick={()=>onAnswer("porosity",o.value)}/>)}
    </QWrap>
  );
}

// ── Q4 — History ──────────────────────────────────────────────────────────────
function Q4_History({ answers, onAnswer, onBack, onNext }) {
  const OPTIONS = [
    {value:"heat",       label:"Heat styling",               desc:"Flat irons, blow dryers, or curling wands regularly"},
    {value:"relaxer",    label:"Chemical relaxers or perms", desc:"Past or current chemical straightening/texturizing"},
    {value:"color",      label:"Color or bleach",            desc:"Dyed, highlighted, or bleached hair"},
    {value:"protective", label:"Protective styles",          desc:"Braids, twists, locs, or wigs frequently"},
    {value:"none",       label:"None of the above",          desc:"My hair is mostly untreated"},
  ];
  const val = answers.history || [];
  const toggle = v => {
    if(v==="none"){ onAnswer("history", val.includes("none")?[]:["none"]); return; }
    onAnswer("history", val.includes(v)?val.filter(x=>x!==v):[...val.filter(x=>x!=="none"),v]);
  };
  return (
    <QWrap category="Hair history" title="What has your hair been through?" subtitle="Select all that apply." onBack={onBack} onNext={onNext} nextDisabled={val.length===0}>
      {OPTIONS.map(o=><MultiOption key={o.value} label={o.label} desc={o.desc} selected={val.includes(o.value)} onClick={()=>toggle(o.value)}/>)}
    </QWrap>
  );
}

// ── Q5 — Journey ──────────────────────────────────────────────────────────────
function Q5_Journey({ answers, onAnswer, onBack, onNext }) {
  const OPTIONS = [
    {value:"start",   label:"Just starting out",           desc:"I'm brand new to caring for my natural texture"},
    {value:"routine", label:"I have a basic routine",      desc:"Shampoo, conditioner, maybe a leave-in — but I know it could be better"},
    {value:"levelup", label:"Experienced curl enthusiast", desc:"I follow a multi-step routine but want to optimize it"},
  ];
  const val = answers.journey;
  return (
    <QWrap category="Your journey" title="Where are you in your curl care journey?" subtitle="This helps us calibrate your recommendations." onBack={onBack} onNext={onNext} nextDisabled={!val}>
      {OPTIONS.map(o=><SingleOption key={o.value} label={o.label} desc={o.desc} selected={val===o.value} onClick={()=>onAnswer("journey",o.value)}/>)}
    </QWrap>
  );
}

// ── Q6 — Scalp ────────────────────────────────────────────────────────────────
function Q6_Scalp({ answers, onAnswer, onBack, onNext }) {
  const OPTIONS = [
    {value:"balanced",  label:"Normal",      desc:"No major issues — balanced and comfortable"},
    {value:"oily",      label:"Oily",        desc:"Gets greasy within a day or two after washing"},
    {value:"dry",       label:"Dry & Flaky", desc:"Itchy, tight feeling, visible flakes"},
    {value:"sensitive", label:"Sensitive",   desc:"Reacts easily to products — redness or irritation"},
  ];
  const val = answers.scalp;
  return (
    <QWrap category="Scalp health" title="What's your scalp like?" subtitle="Healthy hair starts at the scalp." onBack={onBack} onNext={onNext} nextDisabled={!val}>
      {OPTIONS.map(o=><SingleOption key={o.value} label={o.label} desc={o.desc} selected={val===o.value} onClick={()=>onAnswer("scalp",o.value)}/>)}
    </QWrap>
  );
}

// ── Q7 — Budget ───────────────────────────────────────────────────────────────
function Q7_Budget({ answers, onAnswer, onBack, onNext }) {
  const OPTIONS = [
    {value:"drugstore", label:"Drugstore",   desc:"Under $15 per product"},
    {value:"mid",       label:"Mid-range",   desc:"$15–$30 per product"},
    {value:"luxury",    label:"Luxury",      desc:"$30+ per product"},
    {value:"mix",       label:"Mix it up",   desc:"Show me options at every price point"},
  ];
  const val = answers.budget;
  return (
    <QWrap
      category="Budget"
      title="What's your product price range?"
      subtitle="We'll tailor recommendations to fit your budget."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!val}
      nextLabel="Choose My Curl Type"
    >
      {OPTIONS.map(o => (
        <SingleOption
          key={o.value}
          label={o.label}
          desc={o.desc}
          selected={val === o.value}
          onClick={() => onAnswer("budget", o.value)}
        />
      ))}
    </QWrap>
  );
}

// ── Visual hair type selector ─────────────────────────────────────────────────
const CURL_STRANDS = [
  {type:"2a",label:"2A"},{type:"2b",label:"2B"},{type:"2c",label:"2C"},
  {type:"3a",label:"3A"},{type:"3b",label:"3B"},{type:"3c",label:"3C"},
  {type:"4a",label:"4A"},{type:"4b",label:"4B"},{type:"4c",label:"4C"},
];
const USE_PLACEHOLDER = false;

function StrandItem({ strand, selected, anySelected, onClick, height }) {
  const isGreyed = anySelected && !selected;
  return (
    <button onClick={onClick} style={{flex:"1 1 0",minWidth:0,background:"none",border:"none",cursor:"pointer",padding:"0 3px",display:"flex",flexDirection:"column",alignItems:"center",transition:"all 0.2s ease",outline:"none",opacity:isGreyed?0.22:1,filter:isGreyed?"grayscale(55%)":"none",transform:selected?"scale(1.04)":"scale(1)"}}>
      <div style={{width:"100%",height:height||340,borderRadius:12,overflow:"hidden",position:"relative",background:T.cream,boxShadow:selected?`0 0 0 3px ${T.redMid}, 0 6px 20px rgba(122,14,30,0.22)`:"none",transition:"box-shadow 0.2s ease",display:"flex",alignItems:"center",justifyContent:"center"}}>
        {USE_PLACEHOLDER
          ? <div style={{width:"100%",height:"100%",background:selected?`linear-gradient(180deg,${T.creamMid} 0%,#b8906a 100%)`:`linear-gradient(180deg,${T.creamWarm} 0%,#c8a882 100%)`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontFamily:serif,fontSize:"clamp(14px,2.5vw,20px)",fontWeight:700,color:selected?T.redDeep:T.brownMuted}}>{strand.label}</span></div>
          : <img src={`/curl-types/${strand.type}.png`} alt={`Curl type ${strand.label}`} style={{width:"100%",height:"100%",objectFit:"contain",objectPosition:"center",display:"block"}}/>
        }
        {selected&&<div style={{position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",width:22,height:22,borderRadius:"50%",background:T.redMid,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 6px rgba(0,0,0,0.2)"}}>
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><polyline points="1,5 4,8 10,1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>}
      </div>
    </button>
  );
}

export function VisualHairType({ answers, onAnswer, onBack, onNext }) {
  const selected = answers.visualCurlType || null;
  const anySelected = !!selected;
  const rows = [CURL_STRANDS.slice(0,3), CURL_STRANDS.slice(3,6), CURL_STRANDS.slice(6,9)];
  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"110px 24px 40px",minHeight:"100vh",display:"flex",flexDirection:"column",fontFamily:sans,animation:"pel-slideIn 0.4s ease forwards"}}>
      <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.16em",textTransform:"uppercase",color:T.redMid,marginBottom:8}}>Curl type</div>
      <div style={{fontFamily:serif,fontSize:"clamp(22px,4vw,30px)",fontWeight:500,lineHeight:1.2,color:T.brownText,marginBottom:8}}>Which of these looks most like your wet hair with no products?</div>
      <div style={{fontSize:14,fontWeight:400,color:T.brownMuted,lineHeight:1.55,marginBottom:24}}>Tap the strand that matches your natural texture right out of the shower.</div>
      <style>{`
        @keyframes pel-slideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .pel-strand-desktop{display:flex;gap:8px;flex:1;}
        .pel-strand-mobile{display:none;}
        @media(max-width:640px){.pel-strand-desktop{display:none!important;}.pel-strand-mobile{display:flex!important;}}
      `}</style>
      <div className="pel-strand-desktop" style={{alignItems:"stretch"}}>
        {CURL_STRANDS.map(s=><StrandItem key={s.type} strand={s} selected={selected===s.type} anySelected={anySelected} onClick={()=>onAnswer("visualCurlType",s.type)} height="calc(100vh - 340px)"/>)}
      </div>
      <div className="pel-strand-mobile" style={{flexDirection:"column",gap:12,marginBottom:8}}>
        {rows.map((row,ri)=><div key={ri} style={{display:"flex",gap:8}}>{row.map(s=><StrandItem key={s.type} strand={s} selected={selected===s.type} anySelected={anySelected} onClick={()=>onAnswer("visualCurlType",s.type)} height={180}/>)}</div>)}
      </div>
      <div style={{marginTop:24}}>
        <NavRow onBack={onBack} onNext={onNext} nextDisabled={!selected} nextLabel="See My Results"/>
      </div>
    </div>
  );
}

// ── Main QuizFlow export ──────────────────────────────────────────────────────
export function QuizFlow({ answers, onAnswer, currentQ, onNext, onBack }) {
  const screens = [
    <Q1_Goals    key={0} answers={answers} onAnswer={onAnswer} onBack={onBack} onNext={onNext}/>,
    <Q2_Density  key={1} answers={answers} onAnswer={onAnswer} onBack={onBack} onNext={onNext}/>,
    <Q3_Porosity key={2} answers={answers} onAnswer={onAnswer} onBack={onBack} onNext={onNext}/>,
    <Q4_History  key={3} answers={answers} onAnswer={onAnswer} onBack={onBack} onNext={onNext}/>,
    <Q5_Journey  key={4} answers={answers} onAnswer={onAnswer} onBack={onBack} onNext={onNext}/>,
    <Q6_Scalp    key={5} answers={answers} onAnswer={onAnswer} onBack={onBack} onNext={onNext}/>,
    <Q7_Budget   key={6} answers={answers} onAnswer={onAnswer} onBack={onBack} onNext={onNext}/>,
  ];
  const stepNum = currentQ + 1;
  return (
    <div style={{fontFamily:sans,background:T.cream,minHeight:"100vh"}}>
      <style>{`@keyframes pel-slideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <QuizHeader step={stepNum} total={TOTAL_STEPS}/>
      {screens[currentQ]}
    </div>
  );
}
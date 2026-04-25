// src/components/LandingPage.jsx
import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";

const T = {
  redDeep:"#7A0E1E", redMid:"#9B1B30", redSoft:"#C4485A",
  redBlush:"#E8A0A8", redFaint:"#F5D5D8",
  gold:"#C9A03C", goldLight:"#DFC06E", goldShimmer:"#EDD99B", goldPale:"#F7EDCE",
  cream:"#FDFAF4", creamWarm:"#F8F2E8", creamMid:"#EFE6D6",
  brownText:"#3D2B1F",
  brownMuted:"#5C4A3A",
  brownLight:"#7A6858",
};
const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'DM Sans', system-ui, sans-serif";

function injectFonts() {
  if (document.getElementById("pelora-fonts")) return;
  const l = document.createElement("link");
  l.id = "pelora-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap";
  document.head.appendChild(l);
  const s = document.createElement("style");
  s.id = "pelora-global";
  s.textContent = `
    @keyframes pel-fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pel-shimmer { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
    @keyframes pel-loadBar { 0%{width:0%} 100%{width:100%} }
    @keyframes pel-spin { to{transform:rotate(360deg)} }
    @keyframes pel-slideIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    * { box-sizing:border-box; }
    body { font-family:${sans}; background:#FDFAF4; color:#3D2B1F; overflow-x:hidden; -webkit-font-smoothing:antialiased; }
    @media(max-width:768px){.pel-desk{display:none!important}.pel-mob{display:flex!important}}
    @media(min-width:769px){.pel-mob{display:none!important}}
  `;
  document.head.appendChild(s);
}

function Splash({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3400); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:T.cream}}>
      <div style={{fontFamily:serif,fontSize:64,fontWeight:600,fontStyle:"italic",letterSpacing:"0.04em",background:`linear-gradient(135deg,${T.redMid} 0%,${T.redSoft} 40%,${T.redBlush} 60%,${T.redMid} 100%)`,backgroundSize:"200% 200%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",animation:"pel-shimmer 3s ease-in-out infinite,pel-fadeUp 1s ease forwards",opacity:0}}>Pelora</div>
      <div style={{fontSize:13,fontWeight:400,letterSpacing:"0.18em",textTransform:"uppercase",color:T.brownMuted,marginTop:12,animation:"pel-fadeUp 1s ease 0.4s forwards",opacity:0}}>Your curls, finally understood</div>
      <div style={{width:120,height:2,background:T.creamMid,borderRadius:2,marginTop:36,overflow:"hidden",animation:"pel-fadeUp 1s ease 0.7s forwards",opacity:0}}>
        <div style={{height:"100%",width:"0%",background:`linear-gradient(90deg,${T.redMid},${T.redSoft})`,borderRadius:2,animation:"pel-loadBar 2.4s ease-in-out 0.9s forwards"}}/>
      </div>
    </div>
  );
}

// NavbarWrapper fades in after splash — wraps the shared Navbar with opacity transition
function NavbarWrapper({ onStartQuiz, onNavigate, visible }) {
  return (
    <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease" }}>
      <Navbar onNavigate={(screen) => screen === "quiz" ? onStartQuiz() : onNavigate(screen)} activeScreen="landing" />
    </div>
  );
}

function Hero({ onStartQuiz, visible }) {
  return (
    <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"120px 24px 40px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",borderRadius:"50%",filter:"blur(120px)",pointerEvents:"none",opacity:0.12,width:500,height:500,background:T.redBlush,top:"-100px",left:"-100px"}}/>
      <div style={{position:"absolute",borderRadius:"50%",filter:"blur(120px)",pointerEvents:"none",opacity:0.12,width:400,height:400,background:T.redFaint,bottom:"-50px",right:"-80px"}}/>
      {visible&&<>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:11,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:T.redMid,background:T.redFaint,padding:"8px 20px",borderRadius:100,marginBottom:32,animation:"pel-fadeUp 0.7s ease forwards"}}>
          <span style={{width:6,height:6,background:T.redMid,borderRadius:"50%",display:"inline-block"}}/>Personalized Hair Analysis
        </div>
        <h1 style={{fontFamily:serif,fontSize:"clamp(42px,6vw,72px)",fontWeight:500,lineHeight:1.1,color:T.brownText,maxWidth:700,marginBottom:20,animation:"pel-fadeUp 0.8s ease 0.2s both"}}>
          Your curls,<br/><em style={{fontStyle:"italic",background:`linear-gradient(135deg,${T.redDeep},${T.redMid})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>finally understood.</em>
        </h1>
        <p style={{fontSize:16,fontWeight:400,lineHeight:1.7,color:T.brownMuted,maxWidth:460,marginBottom:40,animation:"pel-fadeUp 0.8s ease 0.4s both"}}>
          Answer a few questions and get your curl pattern, porosity score, and a personalized hair routine — no guesswork, no salon visit needed.
        </p>
        <button onClick={onStartQuiz} style={{display:"inline-flex",alignItems:"center",gap:10,fontFamily:sans,fontSize:15,fontWeight:500,letterSpacing:"0.06em",padding:"16px 40px",border:"none",borderRadius:100,background:`linear-gradient(135deg,${T.redDeep},${T.redMid})`,color:"#fff",cursor:"pointer",transition:"transform 0.3s ease,box-shadow 0.3s ease",animation:"pel-fadeUp 0.8s ease 0.6s both"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 12px 32px rgba(122,14,30,0.25)`}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
          Start My Free Analysis
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
        <p style={{fontSize:13,color:T.brownLight,marginTop:16,animation:"pel-fadeUp 0.7s ease 0.8s both",fontWeight:400}}>5 minutes to your personalized hair analysis — no credit card needed.</p>
      </>}
    </section>
  );
}

function PhoneMockup() {
  const [sel, setSel] = useState(1);
  const opts=["More Definition","Less Frizz","Moisture & Softness","Length Retention"];
  return (
    <section style={{padding:"0 24px 100px",display:"flex",flexDirection:"column",alignItems:"center"}}>
      <div style={{width:300,background:T.creamWarm,borderRadius:32,border:`1px solid ${T.creamMid}`,padding:16,boxShadow:`0 40px 80px rgba(61,43,31,0.08),0 8px 24px rgba(61,43,31,0.04)`}}>
        <div style={{width:80,height:6,background:T.creamMid,borderRadius:3,margin:"0 auto 14px"}}/>
        <div style={{background:T.cream,borderRadius:20,padding:20,border:`1px solid ${T.creamMid}`,minHeight:360}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <span style={{fontFamily:serif,fontSize:16,fontWeight:600,fontStyle:"italic",color:T.redMid}}>pelora</span>
            <span style={{fontSize:10,color:T.brownLight,fontWeight:400}}>Step 2 of 7</span>
          </div>
          <div style={{height:3,background:T.creamMid,borderRadius:3,marginBottom:16,overflow:"hidden"}}>
            <div style={{width:"25%",height:"100%",background:`linear-gradient(90deg,${T.redDeep},${T.redMid})`,borderRadius:3}}/>
          </div>
          <div style={{fontSize:9,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:T.redMid,marginBottom:6}}>Hair goals</div>
          <div style={{fontFamily:serif,fontSize:18,fontWeight:500,color:T.brownText,marginBottom:4,lineHeight:1.2}}>What are you hoping to achieve?</div>
          <div style={{fontSize:11,color:T.brownMuted,fontWeight:400,marginBottom:14}}>Pick the one that matters most.</div>
          {opts.map((o,i)=>(
            <div key={i} onClick={()=>setSel(i)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,marginBottom:6,cursor:"pointer",background:sel===i?T.redFaint:T.creamWarm,border:`1.5px solid ${sel===i?T.redMid:"transparent"}`,transition:"all 0.2s"}}>
              <div style={{width:14,height:14,borderRadius:"50%",border:`1.5px solid ${sel===i?T.redMid:T.brownLight}`,background:sel===i?T.redMid:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {sel===i&&<div style={{width:5,height:5,background:"#fff",borderRadius:"50%"}}/>}
              </div>
              <span style={{fontSize:12,fontWeight:sel===i?500:400,color:sel===i?T.redDeep:T.brownText}}>{o}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const cards=[
    {title:"Curl classification",desc:"Select your curl type from our visual guide and get a full 2A–4C curl profile, porosity score, and density breakdown.",icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>},
    {title:"Transform in 30 days",desc:"The 30-day challenge that makes healthy hair habits feel like a game — not a chore.",icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>},
    {title:"Product matches",desc:"Real recs — names, prices, links — matched to your exact curl type, porosity, and hair goals.",icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>},
  ];
  return (
    <section style={{padding:"80px 24px",background:T.creamWarm}}>
      <div style={{maxWidth:860,margin:"0 auto"}}>
        <p style={{fontSize:11,fontWeight:500,letterSpacing:"0.16em",textTransform:"uppercase",color:T.redMid,marginBottom:10}}>How Pelora works</p>
        <h2 style={{fontFamily:serif,fontSize:"clamp(28px,4vw,38px)",fontWeight:500,color:T.brownText,lineHeight:1.2,marginBottom:48}}>No more guesswork.<br/><em>Just your perfect routine.</em></h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:20}}>
          {cards.map((c,i)=>(
            <div key={i} style={{background:T.cream,borderRadius:16,padding:"28px 24px",border:`1px solid ${T.creamMid}`}}>
              <div style={{width:44,height:44,borderRadius:12,marginBottom:16,background:T.redFaint,color:T.redMid,display:"flex",alignItems:"center",justifyContent:"center"}}>{c.icon}</div>
              <h3 style={{fontFamily:serif,fontSize:20,fontWeight:500,color:T.brownText,marginBottom:8}}>{c.title}</h3>
              <p style={{fontSize:14,fontWeight:400,color:T.brownMuted,lineHeight:1.65}}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CurlTypes() {
  const types=[["2A","Wavy loose"],["2B","Wavy defined"],["2C","Wavy coarse"],["3A","Curly loose"],["3B","Curly springy"],["3C","Curly tight"],["4A","Coily soft"],["4B","Coily zigzag"],["4C","Coily tight"]];
  return (
    <section style={{padding:"72px 24px",textAlign:"center"}}>
      <p style={{fontSize:11,fontWeight:500,letterSpacing:"0.16em",textTransform:"uppercase",color:T.redMid,marginBottom:32}}>Every curl type, covered</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",maxWidth:700,margin:"0 auto"}}>
        {types.map(([code,label])=>(
          <div key={code} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 20px",borderRadius:100,background:T.creamWarm,border:`1px solid ${T.creamMid}`,fontSize:13,color:T.brownMuted,transition:"all 0.2s",cursor:"default"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=T.redMid;e.currentTarget.style.color=T.brownText}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.creamMid;e.currentTarget.style.color=T.brownMuted}}>
            <span style={{fontFamily:serif,fontSize:16,fontWeight:600,color:T.redMid}}>{code}</span>{label}
          </div>
        ))}
      </div>
    </section>
  );
}

function Steps() {
  const steps=[{num:"01",title:"Take the quiz",desc:"Answer a few questions about your hair goals, history, and scalp health."},{num:"02",title:"Pick your curl type",desc:"Choose from our visual curl type guide — no photos needed."},{num:"03",title:"Get your plan",desc:"Receive personalized product recs, styling techniques, and your 4-week challenge."}];
  return (
    <section style={{padding:"72px 24px",background:T.creamWarm}}>
      <div style={{maxWidth:720,margin:"0 auto",textAlign:"center"}}>
        <p style={{fontSize:11,fontWeight:500,letterSpacing:"0.16em",textTransform:"uppercase",color:T.redMid,marginBottom:10}}>3 simple steps</p>
        <h2 style={{fontFamily:serif,fontSize:"clamp(26px,4vw,34px)",fontWeight:500,color:T.brownText,marginBottom:48}}>Your journey starts here</h2>
        <div style={{display:"flex",gap:32,justifyContent:"center",flexWrap:"wrap"}}>
          {steps.map((s,i)=>(
            <div key={i} style={{flex:"1 1 180px",maxWidth:220,textAlign:"center"}}>
              <div style={{fontFamily:serif,fontSize:40,fontWeight:600,fontStyle:"italic",color:T.redMid,marginBottom:12,lineHeight:1}}>{s.num}</div>
              <h4 style={{fontFamily:serif,fontSize:18,fontWeight:500,color:T.brownText,marginBottom:8}}>{s.title}</h4>
              <p style={{fontSize:13,fontWeight:400,color:T.brownMuted,lineHeight:1.65}}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ onStartQuiz }) {
  return (
    <section style={{padding:"100px 24px",textAlign:"center"}}>
      <div style={{maxWidth:560,margin:"0 auto"}}>
        <h2 style={{fontFamily:serif,fontSize:"clamp(32px,5vw,48px)",fontWeight:500,color:T.brownText,lineHeight:1.15,marginBottom:16}}>
          Ready to meet<br/>your <em style={{fontStyle:"italic",background:`linear-gradient(135deg,${T.redDeep},${T.redMid})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>curl identity?</em>
        </h2>
        <p style={{fontSize:15,fontWeight:400,color:T.brownMuted,lineHeight:1.7,marginBottom:36}}>Five minutes. One quiz. A personalized breakdown of your curl pattern, porosity, density, and a routine built around your hair.</p>
        <button onClick={onStartQuiz} style={{display:"inline-flex",alignItems:"center",gap:10,fontFamily:sans,fontSize:15,fontWeight:500,letterSpacing:"0.06em",padding:"16px 44px",border:"none",borderRadius:100,background:`linear-gradient(135deg,${T.redDeep},${T.redMid})`,color:"#fff",cursor:"pointer",transition:"transform 0.3s ease,box-shadow 0.3s ease"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 12px 32px rgba(122,14,30,0.25)`}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
          Start my curl quiz — it's free
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      </div>
    </section>
  );
}

export function PlaceholderPage({ activePage, onStartQuiz, onNavigate }) {
  useEffect(()=>{ injectFonts(); },[]);
  return (
    <div style={{fontFamily:sans}}>
      <Navbar onNavigate={(screen) => screen === "quiz" ? onStartQuiz() : onNavigate(screen)} activeScreen={activePage}/>
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 24px",textAlign:"center",background:T.cream}}>
        <p style={{fontFamily:serif,fontSize:"clamp(22px,4vw,32px)",fontWeight:500,fontStyle:"italic",color:T.brownText,marginBottom:32,lineHeight:1.4,maxWidth:440}}>Take the quiz to<br/>discover more.</p>
        <button onClick={onStartQuiz} style={{display:"inline-flex",alignItems:"center",gap:10,fontFamily:sans,fontSize:15,fontWeight:500,padding:"16px 40px",border:"none",borderRadius:100,background:`linear-gradient(135deg,${T.redDeep},${T.redMid})`,color:"#fff",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform=""}>
          Find Your Curl Profile
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  );
}

export function LandingPage({ onStartQuiz, onNavigate, quizCompleted }) {
  const [splashDone, setSplashDone] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  useEffect(()=>{ injectFonts(); },[]);
  const handleSplashDone = () => { setSplashDone(true); setTimeout(()=>setNavVisible(true),200); };
  return (
    <div style={{fontFamily:sans}}>
      {!splashDone&&<Splash onDone={handleSplashDone}/>}
      <NavbarWrapper onStartQuiz={onStartQuiz} onNavigate={onNavigate} visible={navVisible}/>
      <Hero onStartQuiz={onStartQuiz} visible={splashDone}/>
      <PhoneMockup/>
      <HowItWorks/>
      <CurlTypes/>
      <Steps/>
      <FinalCTA onStartQuiz={onStartQuiz}/>
      <footer style={{padding:"36px 40px",borderTop:`1px solid ${T.creamMid}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <span style={{fontFamily:serif,fontSize:20,fontWeight:600,fontStyle:"italic",background:`linear-gradient(135deg,${T.redMid},${T.redSoft})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>pelora</span>
        <p style={{fontSize:12,color:T.brownLight,fontWeight:400}}>Built for waves, curls, coils &amp; all textures in between.</p>
        <p style={{fontSize:12,color:T.brownLight,fontWeight:400}}>© 2026 Pelora</p>
      </footer>
    </div>
  );
}
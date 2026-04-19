// src/App.jsx
import { useState, useEffect } from "react";
import { LandingPage, PlaceholderPage } from "./components/LandingPage";
import { QuizFlow, PhotoConsent, VisualHairType, AgeConsent, CURL_TYPE_MAP } from "./components/QuizFlow";
import { ResultsPage } from "./components/ResultsPage";
import { ChallengePage } from "./components/ChallengePage";
import { TutorialsPage } from "./components/TutorialsPage";
import { ProductsPage } from "./components/ProductsPage";
import { PrivacyPage } from "./components/PrivacyPage";

const TOTAL_Q         = 7;
const CONSENT_AFTER_Q = 5;

// ── Visual tile classification ────────────────────────────────────────────────
function classifyFromVisualTile(answers) {
  const tileKey = answers.visualCurlType;
  if (!tileKey || !CURL_TYPE_MAP[tileKey]) {
    return { curlType:null, curlTypeName:null, description:"Complete the quiz to see your curl profile.", faceShape:null, undertone:null, source:"visual" };
  }
  return { ...CURL_TYPE_MAP[tileKey], faceShape:null, undertone:null, source:"visual" };
}

// ── AI analysis helpers ───────────────────────────────────────────────────────
async function toBase64(file) {
  return new Promise((resolve, reject) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX=1024; let w=img.width, h=img.height;
      if(w>MAX||h>MAX){ if(w>h){h=Math.round(h*MAX/w);w=MAX;}else{w=Math.round(w*MAX/h);h=MAX;} }
      const c=document.createElement("canvas"); c.width=w; c.height=h;
      c.getContext("2d").drawImage(img,0,0,w,h); URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg",0.8).split(",")[1]);
    };
    img.onerror=reject; img.src=url;
  });
}

async function runAIAnalysis(photos, answers) {
  const slotNames = {roots:"roots/crown area", mid:"mid-length", ends:"ends/tips", face:"face"};
  const imageBlocks = [];
  for(const [id, file] of Object.entries(photos)){
    if(!file) continue;
    const b64 = await toBase64(file);
    imageBlocks.push({type:"text", text:`Photo: ${slotNames[id]||id}`});
    imageBlocks.push({type:"image_url", image_url:{url:`data:image/jpeg;base64,${b64}`}});
  }
  const res = await fetch("/api/analyze", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({imageBlocks, answers}),
  });
  if(!res.ok){ const e=await res.json().catch(()=>({})); throw new Error(e.error||`Analysis failed (${res.status})`); }
  return await res.json();
}

// ── Screen → URL path mapping ─────────────────────────────────────────────────
// Maps internal screen names to clean URL paths and back.
const SCREEN_TO_PATH = {
  landing:       "/",
  ageConsent:    "/quiz/start",
  quiz:          "/quiz",
  photoConsent:  "/quiz/photos",
  visualHairType:"/quiz/curl-type",
  loading:       "/quiz/analyzing",
  results:       "/results",
  challenge:     "/challenge",
  products:      "/products",
  tutorials:     "/tutorials",
  privacy:       "/privacy",
};

const PATH_TO_SCREEN = Object.fromEntries(
  Object.entries(SCREEN_TO_PATH).map(([screen, path]) => [path, screen])
);

// Derive initial screen from the current URL path on first load
function screenFromPath(pathname) {
  // Strip trailing slash except for root
  const clean = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  return PATH_TO_SCREEN[clean] || "landing";
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]                 = useState(() => screenFromPath(window.location.pathname));
  const [currentQ, setCurrentQ]             = useState(0);
  const [answers, setAnswers]               = useState({});
  const [photos, setPhotos]                 = useState({});
  const [recs, setRecs]                     = useState(null);
  const [aiResult, setAiResult]             = useState(null);
  const [dataConsent, setDataConsent]       = useState(false);
  const [photosUploaded, setPhotosUploaded] = useState(false);
  const [ageVerified, setAgeVerified]       = useState(false);

  const quizCompleted = recs !== null || aiResult !== null;

  // ── go() — the only function that changes screens ────────────────────────────
  // Pushes a new entry into browser history so the back button works correctly.
  const go = (s) => {
    const path = SCREEN_TO_PATH[s] || "/";
    window.history.pushState({ screen: s }, "", path);
    setScreen(s);
    window.scrollTo(0, 0);
  };

  // ── Listen for browser back/forward button presses ───────────────────────────
  useEffect(() => {
    const handlePop = (e) => {
      const s = e.state?.screen || screenFromPath(window.location.pathname);
      setScreen(s);
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  // Replace the initial history entry so it carries screen state too,
  // allowing back navigation all the way back to the first screen.
  useEffect(() => {
    const initialScreen = screenFromPath(window.location.pathname);
    window.history.replaceState({ screen: initialScreen }, "", window.location.pathname);
  }, []);

  const handleAnswer = (id, val) => setAnswers(p => ({...p, [id]:val}));
  const handlePhoto  = (id, file) => setPhotos(p => ({...p, [id]:file}));

  // ── Start quiz — always routes through age consent first ─────────────────────
  const startQuiz = () => {
    setCurrentQ(0);
    go("ageConsent");
  };

  // ── Age consent ───────────────────────────────────────────────────────────────
  const handleAgeAccept = () => { setAgeVerified(true); setCurrentQ(0); go("quiz"); };
  const handleAgeBack   = () => go("landing");
  const handleAgeExit   = () => go("landing");

  // ── Quiz next / back ──────────────────────────────────────────────────────────
  const handleQuizNext = () => {
    if (currentQ === CONSENT_AFTER_Q) {
      go("photoConsent");
    } else if (currentQ < TOTAL_Q - 1) {
      setCurrentQ(q => q + 1);
      window.scrollTo(0, 0);
    } else {
      const has = Object.values(photos).some(f => f);
      setPhotosUploaded(has);
      doAIAnalysis();
    }
  };

  const handleQuizBack = () => {
    if (currentQ === TOTAL_Q - 1) {
      go("photoConsent");
    } else if (currentQ > 0) {
      setCurrentQ(q => q - 1);
      window.scrollTo(0, 0);
    } else {
      go("ageConsent");
    }
  };

  // ── Photo consent ─────────────────────────────────────────────────────────────
  const handleConsentAccept = () => { setDataConsent(true); setCurrentQ(TOTAL_Q - 1); go("quiz"); };
  const handleSkipPhotos    = () => { setPhotosUploaded(false); go("visualHairType"); };
  const handleConsentSkip   = () => { setPhotosUploaded(false); go("visualHairType"); };
  const handleConsentBack   = () => { setCurrentQ(CONSENT_AFTER_Q); go("quiz"); };

  // ── Visual hair type ──────────────────────────────────────────────────────────
  const handleVisualNext = () => { setAiResult(classifyFromVisualTile(answers)); setRecs(null); go("results"); };
  const handleVisualBack = () => go("photoConsent");
  const handleGoToPhotos = () => go("photoConsent");

  // ── Global navigation ─────────────────────────────────────────────────────────
  const handleNavigate = (target) => {
    if (target === "landing")  { go("landing");  return; }
    if (target === "privacy")  { go("privacy");  return; }
    if (target === "quiz")     { startQuiz();    return; }
    if (quizCompleted && ["results","products","challenge","tutorials"].includes(target)) { go(target); return; }
    go(`placeholder_${target}`);
  };

  // ── AI analysis ───────────────────────────────────────────────────────────────
  const doAIAnalysis = async () => {
    go("loading");
    try {
      let result = null;
      try { result = await runAIAnalysis(photos, answers); result.source = "ai"; }
      catch(e) { console.warn("AI failed, using visual tile:", e.message); result = classifyFromVisualTile(answers); result.aiFailed = true; }
      setAiResult(result); setRecs(null); go("results");
    } catch(e) {
      console.warn("Analysis error:", e.message);
      setAiResult(classifyFromVisualTile(answers)); setRecs(null); go("results");
    }
  };

  // ── Design tokens (used in inline screens) ────────────────────────────────────
  const serif      = "'Cormorant Garamond',Georgia,serif";
  const sans       = "'DM Sans',system-ui,sans-serif";
  const cream      = "#FDFAF4";
  const creamMid   = "#EFE6D6";
  const redDeep    = "#7A0E1E";
  const redMid     = "#9B1B30";
  const gold       = "#9B1B30";
  const brownMuted = "#5C4A3A";
  const brownText  = "#3D2B1F";

  // ── Routing ───────────────────────────────────────────────────────────────────

  if (screen === "landing") return (
    <LandingPage onStartQuiz={startQuiz} onNavigate={handleNavigate} quizCompleted={quizCompleted}/>
  );

  if (screen.startsWith("placeholder_")) {
    const key = screen.replace("placeholder_", "");
    return <PlaceholderPage activePage={key} onStartQuiz={startQuiz} onNavigate={handleNavigate}/>;
  }

  if (screen === "ageConsent") return (
    <div style={{fontFamily:sans, background:cream, minHeight:"100vh"}}>
      <style>{`@keyframes pel-slideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <AgeConsent
        onAccept={handleAgeAccept}
        onBack={handleAgeBack}
        onExit={handleAgeExit}
        onNavigate={handleNavigate}
      />
    </div>
  );

  if (screen === "quiz") {
    if (!ageVerified) { go("ageConsent"); return null; }
    return (
      <QuizFlow
        answers={answers}
        onAnswer={handleAnswer}
        currentQ={currentQ}
        onNext={handleQuizNext}
        onBack={handleQuizBack}
        onSkipPhotos={handleSkipPhotos}
        photos={photos}
        onPhoto={handlePhoto}
        consentGiven={dataConsent}
      />
    );
  }

  if (screen === "photoConsent") return (
    <PhotoConsent
      onAccept={handleConsentAccept}
      onSkip={handleConsentSkip}
      onBack={handleConsentBack}
      onNavigate={handleNavigate}
    />
  );

  if (screen === "visualHairType") return (
    <div style={{fontFamily:sans, background:cream, minHeight:"100vh"}}>
      <style>{`@keyframes pel-slideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <header style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(253,250,244,0.95)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",borderBottom:"1px solid rgba(201,160,60,0.15)",padding:"16px 24px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",maxWidth:600,margin:"0 auto 10px"}}>
          <span style={{fontFamily:serif,fontSize:22,fontWeight:600,fontStyle:"italic",background:`linear-gradient(135deg,${gold},#C4485A)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>pelora</span>
          <span style={{fontSize:12,color:brownMuted,fontWeight:400}}>Step 7 of 7</span>
        </div>
        <div style={{maxWidth:600,margin:"0 auto",height:4,background:creamMid,borderRadius:4,overflow:"hidden"}}>
          <div style={{height:"100%",background:`linear-gradient(90deg,${redDeep},${redMid})`,borderRadius:4,width:"100%",transition:"width 0.5s"}}/>
        </div>
      </header>
      <VisualHairType answers={answers} onAnswer={handleAnswer} onBack={handleVisualBack} onNext={handleVisualNext}/>
    </div>
  );

  if (screen === "loading") return (
    <div style={{minHeight:"100vh",background:cream,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24,fontFamily:sans,padding:24,textAlign:"center"}}>
      <style>{`@keyframes pel-spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{width:56,height:56,borderRadius:"50%",border:`3px solid ${creamMid}`,borderTopColor:gold,animation:"pel-spin 1s linear infinite"}}/>
      <div style={{fontFamily:serif,fontSize:28,fontWeight:500,color:brownText}}>Analyzing your curls...</div>
      <div style={{fontSize:14,fontWeight:400,color:brownMuted,maxWidth:300,lineHeight:1.65}}>Our AI is identifying your curl pattern, face shape, and undertone from your photos.</div>
    </div>
  );

  if (screen === "results")   return <ResultsPage answers={answers} aiResult={aiResult} recs={recs} photosUploaded={photosUploaded} onNavigate={handleNavigate} onGoToPhotos={handleGoToPhotos}/>;
  if (screen === "challenge") return <ChallengePage onNavigate={handleNavigate}/>;
  if (screen === "products")  return <ProductsPage answers={answers} aiResult={aiResult} onNavigate={handleNavigate}/>;
  if (screen === "tutorials") return <TutorialsPage onNavigate={handleNavigate}/>;
  if (screen === "privacy")   return <PrivacyPage onNavigate={handleNavigate}/>;

  return null;
}
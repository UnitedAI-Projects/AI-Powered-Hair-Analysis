// src/App.jsx
import { useState, useEffect } from "react";
import { LandingPage, PlaceholderPage } from "./components/LandingPage";
import { QuizFlow, AgeConsent, VisualHairType, CURL_TYPE_MAP } from "./components/QuizFlow";
import { ResultsPage } from "./components/ResultsPage";
import { ChallengePage } from "./components/ChallengePage";
import { TutorialsPage } from "./components/TutorialsPage";
import { ProductsPage } from "./components/ProductsPage";
import { PrivacyPage } from "./components/PrivacyPage";

const TOTAL_Q = 7; // 7 quiz questions (Goals, Density, Porosity, History, Journey, Scalp, Budget)

// ── Visual tile classification ────────────────────────────────────────────────
function classifyFromVisualTile(answers) {
  const tileKey = answers.visualCurlType;
  if (!tileKey || !CURL_TYPE_MAP[tileKey]) {
    return { curlType: null, curlTypeName: null, description: "Complete the quiz to see your curl profile.", source: "visual" };
  }
  return { ...CURL_TYPE_MAP[tileKey], source: "visual" };
}

// ── Screen → URL path mapping ─────────────────────────────────────────────────
const SCREEN_TO_PATH = {
  landing:        "/",
  ageConsent:     "/quiz/start",
  quiz:           "/quiz",
  visualHairType: "/quiz/curl-type",
  results:        "/results",
  challenge:      "/challenge",
  products:       "/products",
  tutorials:      "/tutorials",
  privacy:        "/privacy",
};

const PATH_TO_SCREEN = Object.fromEntries(
  Object.entries(SCREEN_TO_PATH).map(([screen, path]) => [path, screen])
);

function screenFromPath(pathname) {
  const clean = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  return PATH_TO_SCREEN[clean] || "landing";
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]         = useState(() => screenFromPath(window.location.pathname));
  const [currentQ, setCurrentQ]     = useState(0);
  const [answers, setAnswers]       = useState({});
  const [recs, setRecs]             = useState(null);
  const [aiResult, setAiResult]     = useState(null);
  const [ageVerified, setAgeVerified] = useState(false);

  const quizCompleted = recs !== null || aiResult !== null;

  // ── go() — the only function that changes screens ─────────────────────────
  const go = (s) => {
    const path = SCREEN_TO_PATH[s] || "/";
    window.history.pushState({ screen: s }, "", path);
    setScreen(s);
    window.scrollTo(0, 0);
  };

  // ── Listen for browser back/forward button presses ────────────────────────
  useEffect(() => {
    const handlePop = (e) => {
      const s = e.state?.screen || screenFromPath(window.location.pathname);
      setScreen(s);
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  useEffect(() => {
    const initialScreen = screenFromPath(window.location.pathname);
    window.history.replaceState({ screen: initialScreen }, "", window.location.pathname);
  }, []);

  const handleAnswer = (id, val) => setAnswers(p => ({ ...p, [id]: val }));

  // ── Start quiz ─────────────────────────────────────────────────────────────
  const startQuiz = () => {
    setCurrentQ(0);
    go("ageConsent");
  };

  // ── Age consent ────────────────────────────────────────────────────────────
  const handleAgeAccept = () => { setAgeVerified(true); setCurrentQ(0); go("quiz"); };
  const handleAgeBack   = () => go("landing");
  const handleAgeExit   = () => go("landing");

  // ── Quiz next / back ───────────────────────────────────────────────────────
  const handleQuizNext = () => {
    if (currentQ < TOTAL_Q - 1) {
      setCurrentQ(q => q + 1);
      window.scrollTo(0, 0);
    } else {
      // Q7 (Budget) done — go to visual hair type selector
      go("visualHairType");
    }
  };

  const handleQuizBack = () => {
    if (currentQ > 0) {
      setCurrentQ(q => q - 1);
      window.scrollTo(0, 0);
    } else {
      go("ageConsent");
    }
  };

  // ── Visual hair type ───────────────────────────────────────────────────────
  // Compute the result synchronously and pass it directly to setAiResult
  // before navigating, so ResultsPage always receives a populated aiResult.
  const handleVisualNext = () => {
    const result = classifyFromVisualTile(answers);
    setAiResult(result);
    setRecs(null);
    go("results");
  };

  const handleVisualBack = () => { setCurrentQ(TOTAL_Q - 1); go("quiz"); };

  // ── Global navigation ──────────────────────────────────────────────────────
  const handleNavigate = (target) => {
    if (target === "landing") { go("landing"); return; }
    if (target === "privacy") { go("privacy"); return; }
    if (target === "quiz")    { startQuiz();   return; }
    if (quizCompleted && ["results", "products", "challenge", "tutorials"].includes(target)) { go(target); return; }
    go(`placeholder_${target}`);
  };

  // ── Design tokens (used in inline screens) ────────────────────────────────
  const serif      = "'Cormorant Garamond',Georgia,serif";
  const sans       = "'DM Sans',system-ui,sans-serif";
  const cream      = "#FDFAF4";
  const creamMid   = "#EFE6D6";
  const redDeep    = "#7A0E1E";
  const redMid     = "#9B1B30";
  const gold       = "#9B1B30";
  const brownMuted = "#5C4A3A";

  // ── Routing ────────────────────────────────────────────────────────────────

  if (screen === "landing") return (
    <LandingPage onStartQuiz={startQuiz} onNavigate={handleNavigate} quizCompleted={quizCompleted} />
  );

  if (screen.startsWith("placeholder_")) {
    const key = screen.replace("placeholder_", "");
    return <PlaceholderPage activePage={key} onStartQuiz={startQuiz} onNavigate={handleNavigate} />;
  }

  if (screen === "ageConsent") return (
    <div style={{ fontFamily: sans, background: cream, minHeight: "100vh" }}>
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
      />
    );
  }

  if (screen === "visualHairType") return (
    <div style={{ fontFamily: sans, background: cream, minHeight: "100vh" }}>
      <style>{`@keyframes pel-slideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(253,250,244,0.95)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid rgba(201,160,60,0.15)", padding: "16px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 600, margin: "0 auto 10px" }}>
          <span style={{ fontFamily: serif, fontSize: 22, fontWeight: 600, fontStyle: "italic", background: `linear-gradient(135deg,${gold},#C4485A)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>pelora</span>
          <span style={{ fontSize: 12, color: brownMuted, fontWeight: 400 }}>Step 8 of 8</span>
        </div>
        <div style={{ maxWidth: 600, margin: "0 auto", height: 4, background: creamMid, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", background: `linear-gradient(90deg,${redDeep},${redMid})`, borderRadius: 4, width: "100%", transition: "width 0.5s" }} />
        </div>
      </header>
      <VisualHairType answers={answers} onAnswer={handleAnswer} onBack={handleVisualBack} onNext={handleVisualNext} />
    </div>
  );

  if (screen === "results") return (
    <ResultsPage
      answers={answers}
      aiResult={aiResult}
      recs={recs}
      onNavigate={handleNavigate}
    />
  );

  if (screen === "challenge")  return <ChallengePage onNavigate={handleNavigate} />;
  if (screen === "products")   return <ProductsPage answers={answers} aiResult={aiResult} onNavigate={handleNavigate} />;
  if (screen === "tutorials")  return <TutorialsPage onNavigate={handleNavigate} />;
  if (screen === "privacy")    return <PrivacyPage onNavigate={handleNavigate} />;

  return null;
}
// src/components/Navbar.jsx
// Shared navigation bar used across all Pelora pages.
//
// Props:
//   onNavigate   — (screen: string) => void
//   activeScreen — string matching a NAV screen key, used to highlight the active link
//   quizLabel    — optional override for the CTA button text (default "Take the Quiz")
//   variant      — "light" (default, cream bg) | "dark" (deep red bg, for ChallengePage)

import { useState } from "react";

const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'DM Sans', system-ui, sans-serif";

const LIGHT = {
  bg:         "rgba(253,250,244,0.95)",
  border:     "rgba(201,160,60,0.15)",
  logo:       { background: "linear-gradient(135deg,#9B1B30,#C4485A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" },
  linkDefault:"#5C4A3A",
  linkActive: "#9B1B30",
  linkHover:  "#9B1B30",
  btnBorder:  "#9B1B30",
  btnColor:   "#9B1B30",
  btnHoverBg: "#9B1B30",
  btnHoverTx: "#FDFAF4",
  mobBg:      "rgba(253,250,244,0.98)",
  mobBorder:  "#EFE6D6",
  mobText:    "#3D2B1F",
  hamburger:  "#3D2B1F",
};

const DARK = {
  bg:         "#7A0E1E",
  border:     "rgba(201,160,60,0.15)",
  logo:       { color: "#DFC06E" },          // gold text, no gradient clip
  linkDefault:"rgba(255,255,255,0.7)",
  linkActive: "#ffffff",
  linkHover:  "#ffffff",
  btnBorder:  "rgba(255,255,255,0.5)",
  btnColor:   "rgba(255,255,255,0.85)",
  btnHoverBg: "rgba(255,255,255,0.15)",
  btnHoverTx: "#ffffff",
  mobBg:      "#7A0E1E",
  mobBorder:  "rgba(201,160,60,0.2)",
  mobText:    "rgba(255,255,255,0.85)",
  hamburger:  "#ffffff",
};

const NAV = [
  { label: "Home",       screen: "landing"   },
  { label: "My Results", screen: "results"   },
  { label: "Challenge",  screen: "challenge" },
  { label: "Tutorials",  screen: "tutorials" },
  { label: "Products",   screen: "products"  },
];

export function Navbar({ onNavigate, activeScreen, quizLabel = "Take the Quiz", variant = "light" }) {
  const [mob, setMob] = useState(false);
  const C = variant === "dark" ? DARK : LIGHT;

  const isLight = variant !== "dark";

  return (
    <nav style={{
      position:        "sticky",
      top:             0,
      left:            0,
      right:           0,
      zIndex:          100,
      display:         "flex",
      alignItems:      "center",
      justifyContent:  "space-between",
      padding:         "18px 40px",
      background:      C.bg,
      backdropFilter:  isLight ? "blur(16px)" : undefined,
      WebkitBackdropFilter: isLight ? "blur(16px)" : undefined,
      borderBottom:    `1px solid ${C.border}`,
    }}>

      {/* Logo */}
      <button
        onClick={() => onNavigate("landing")}
        style={{ border: "none", cursor: "pointer", padding: 0, background: "none" }}
      >
        {isLight ? (
          <span style={{
            fontFamily: serif, fontSize: 26, fontWeight: 600, fontStyle: "italic",
            ...C.logo,
          }}>Pelora</span>
        ) : (
          <span style={{
            fontFamily: serif, fontSize: 26, fontWeight: 600, fontStyle: "italic",
            color: C.logo.color,
          }}>pelora</span>
        )}
      </button>

      {/* Desktop links */}
      <ul style={{ display: "flex", gap: 28, listStyle: "none", margin: 0, padding: 0 }} className="pel-nav-desk">
        {NAV.map(n => {
          const isActive = n.screen === activeScreen;
          return (
            <li key={n.screen}>
              <button
                onClick={() => onNavigate(n.screen)}
                style={{
                  background:    "none",
                  border:        "none",
                  cursor:        "pointer",
                  fontFamily:    sans,
                  fontSize:      13,
                  fontWeight:    isActive ? 500 : 400,
                  letterSpacing: "0.06em",
                  color:         isActive ? C.linkActive : C.linkDefault,
                  borderBottom:  isActive ? `1.5px solid ${C.linkActive}` : "none",
                  paddingBottom: isActive ? 2 : 0,
                  transition:    "color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = C.linkHover}
                onMouseLeave={e => e.currentTarget.style.color = isActive ? C.linkActive : C.linkDefault}
              >
                {n.label}
              </button>
            </li>
          );
        })}
      </ul>

      {/* CTA button */}
      <button
        onClick={() => onNavigate("quiz")}
        className="pel-nav-desk"
        style={{
          fontSize:      12,
          fontWeight:    500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding:       "10px 24px",
          border:        `1.5px solid ${C.btnBorder}`,
          borderRadius:  100,
          background:    "transparent",
          color:         C.btnColor,
          cursor:        "pointer",
          fontFamily:    sans,
          transition:    "all 0.3s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = C.btnHoverBg;
          e.currentTarget.style.color      = C.btnHoverTx;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color      = C.btnColor;
        }}
      >
        {quizLabel}
      </button>

      {/* Mobile hamburger */}
      <button
        className="pel-nav-mob"
        onClick={() => setMob(o => !o)}
        style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8, flexDirection: "column", gap: 5 }}
      >
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 22, height: 1.5, background: C.hamburger, borderRadius: 2 }} />
        ))}
      </button>

      {/* Mobile dropdown */}
      {mob && (
        <div style={{
          position:    "fixed",
          top:         61,
          left:        0,
          right:       0,
          background:  C.mobBg,
          backdropFilter: isLight ? "blur(16px)" : undefined,
          borderBottom:`1px solid ${C.mobBorder}`,
          display:     "flex",
          flexDirection:"column",
          padding:     "12px 0",
          zIndex:      99,
        }}>
          {NAV.map(n => (
            <button
              key={n.screen}
              onClick={() => { onNavigate(n.screen); setMob(false); }}
              style={{
                padding:   "14px 32px",
                textAlign: "left",
                background:"none",
                border:    "none",
                cursor:    "pointer",
                fontFamily: sans,
                fontSize:  15,
                color:     C.mobText,
              }}
            >
              {n.label}
            </button>
          ))}
          <div style={{ padding: "12px 32px" }}>
            <button
              onClick={() => { onNavigate("quiz"); setMob(false); }}
              style={{
                width:        "100%",
                padding:      12,
                borderRadius: 100,
                background:   isLight ? "linear-gradient(135deg,#7A0E1E,#9B1B30)" : "rgba(255,255,255,0.15)",
                border:       "none",
                color:        "#fff",
                fontFamily:   sans,
                fontSize:     14,
                fontWeight:   500,
                cursor:       "pointer",
              }}
            >
              {quizLabel}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:768px){
          .pel-nav-desk{display:none!important}
          .pel-nav-mob{display:flex!important}
        }
      `}</style>
    </nav>
  );
}
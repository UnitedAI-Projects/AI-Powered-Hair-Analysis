// src/components/TutorialsPage.jsx
// Matches tutorials__3_.html design exactly, converted to React
// All interactivity preserved: filter chips, scroll rows, bookmark toggle, search

import { useState, useRef } from "react";
import { Navbar } from "./Navbar";

const T = {
  crimson:     "#7a1024",
  crimsonDeep: "#5a0c1b",
  crimsonSoft: "#9a2a3e",
  gold:        "#9B1B30",
  goldSoft:    "#D9BB7D",
  goldPale:    "#F5D5D8",
  cream:       "#f8f1e4",
  creamWarm:   "#f4ead4",
  ivory:       "#fdfaf2",
  ink:         "#2a1a18",
  muted:       "#6b5a55",
  line:        "rgba(122,16,36,0.12)",
};
const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'DM Sans', system-ui, sans-serif";

// ── Tutorial data ─────────────────────────────────────────────────────────────
const TUTORIALS = {
  personal: [
    {title:"Defining Your 3B Ringlets",           duration:"8 min",  tags:["3B","3C"],              difficulty:"beginner",     level:"Beginner"},
    {title:"The Pineapple Method for 3B",          duration:"4 min",  tags:["3B","3A"],              difficulty:"beginner",     level:"Beginner"},
    {title:"Humidity Defense Routine",             duration:"15 min", tags:["3B","3C"],              difficulty:"intermediate", level:"Intermediate"},
    {title:"Refresh Day 3 Curls",                  duration:"6 min",  tags:["3B"],                   difficulty:"beginner",     level:"Beginner"},
    {title:"Sleeping in a Silk Bonnet",            duration:"3 min",  tags:["3B","3C","4A"],         difficulty:"beginner",     level:"Beginner"},
    {title:"LOC Method for 3B Curls",              duration:"10 min", tags:["3B"],                   difficulty:"intermediate", level:"Intermediate"},
  ],
  styling: [
    {title:"The Perfect Slick-Back Bun",           duration:"5 min",  tags:["3A","3B","3C"],         difficulty:"beginner",     level:"Beginner"},
    {title:"Effortless Half-Up, Half-Down",        duration:"4 min",  tags:["2B","2C","3A"],         difficulty:"beginner",     level:"Beginner"},
    {title:"Gym-Ready Curly Ponytail",             duration:"3 min",  tags:["All"],                  difficulty:"beginner",     level:"Beginner"},
    {title:"The Pineapple Method",                 duration:"4 min",  tags:["3A","3B","3C"],         difficulty:"beginner",     level:"Beginner"},
    {title:"Space Buns for Curly Hair",            duration:"7 min",  tags:["3B","3C","4A"],         difficulty:"intermediate", level:"Intermediate"},
    {title:"Romantic Updo for Date Night",         duration:"12 min", tags:["3A","3B"],              difficulty:"intermediate", level:"Intermediate"},
  ],
  wash: [
    {title:"Pre-Poo 101",                          duration:"6 min",  tags:["All"],                  difficulty:"beginner",     level:"Beginner"},
    {title:"Co-Washing for Beginners",             duration:"5 min",  tags:["3B","3C","4A","4B"],    difficulty:"beginner",     level:"Beginner"},
    {title:"The LOC Method Explained",             duration:"8 min",  tags:["3C","4A","4B","4C"],    difficulty:"intermediate", level:"Intermediate"},
    {title:"Plopping Step-by-Step",                duration:"4 min",  tags:["2C","3A","3B"],         difficulty:"beginner",     level:"Beginner"},
    {title:"Clarifying Wash Routine",              duration:"10 min", tags:["All"],                  difficulty:"intermediate", level:"Intermediate"},
    {title:"LCO vs LOC — What's Right for You",   duration:"7 min",  tags:["3B","3C","4A"],         difficulty:"intermediate", level:"Intermediate"},
  ],
  edges: [
    {title:"Basic Edge Swoop for Beginners",       duration:"6 min",  tags:["All"],                  difficulty:"beginner",     level:"Beginner"},
    {title:"Sleek Edges with Gel",                 duration:"8 min",  tags:["3C","4A","4B","4C"],    difficulty:"intermediate", level:"Intermediate"},
    {title:"Natural-Looking Baby Hairs",           duration:"5 min",  tags:["3B","3C","4A"],         difficulty:"intermediate", level:"Intermediate"},
    {title:"Edge Control Comparison",              duration:"4 min",  tags:["All"],                  difficulty:"beginner",     level:"Beginner"},
    {title:"Laying Edges for Weddings",            duration:"15 min", tags:["3C","4A","4B","4C"],    difficulty:"advanced",     level:"Advanced"},
  ],
  heatless: [
    {title:"Diffusing Without Frizz",              duration:"9 min",  tags:["2C","3A","3B","3C"],    difficulty:"intermediate", level:"Intermediate"},
    {title:"Air-Drying for Maximum Volume",        duration:"6 min",  tags:["All"],                  difficulty:"beginner",     level:"Beginner"},
    {title:"Flexi Rod Set Tutorial",               duration:"18 min", tags:["3A","3B","3C"],         difficulty:"advanced",     level:"Advanced"},
    {title:"Bantu Knot Out",                       duration:"14 min", tags:["3C","4A","4B","4C"],    difficulty:"advanced",     level:"Advanced"},
    {title:"Curlformers for Beginners",            duration:"12 min", tags:["2B","2C","3A"],         difficulty:"intermediate", level:"Intermediate"},
    {title:"Overnight Braid-Out",                  duration:"10 min", tags:["3B","3C","4A"],         difficulty:"intermediate", level:"Intermediate"},
  ],
  protective: [
    {title:"Sleep-Friendly Bun",                   duration:"3 min",  tags:["All"],                  difficulty:"beginner",     level:"Beginner"},
    {title:"Two-Strand Twists",                    duration:"20 min", tags:["3C","4A","4B","4C"],    difficulty:"intermediate", level:"Intermediate"},
    {title:"Halo Braid Protective Style",          duration:"15 min", tags:["3A","3B","3C"],         difficulty:"intermediate", level:"Intermediate"},
    {title:"Silk Wrap Method",                     duration:"6 min",  tags:["All"],                  difficulty:"beginner",     level:"Beginner"},
    {title:"Mini Braids at Home",                  duration:"45 min", tags:["3C","4A","4B","4C"],    difficulty:"advanced",     level:"Advanced"},
  ],
  treatments: [
    {title:"Weekly Deep Conditioning",             duration:"30 min", tags:["All"],                  difficulty:"beginner",     level:"Beginner"},
    {title:"Scalp Massage Routine",                duration:"5 min",  tags:["All"],                  difficulty:"beginner",     level:"Beginner"},
    {title:"Protein vs Moisture — How to Tell",    duration:"8 min",  tags:["All"],                  difficulty:"intermediate", level:"Intermediate"},
    {title:"DIY Dusting (At-Home Trim)",           duration:"12 min", tags:["3A","3B","3C"],         difficulty:"advanced",     level:"Advanced"},
    {title:"Hot Oil Treatment Guide",              duration:"20 min", tags:["3C","4A","4B","4C"],    difficulty:"intermediate", level:"Intermediate"},
    {title:"Rice Water Rinse Truth",               duration:"7 min",  tags:["All"],                  difficulty:"beginner",     level:"Beginner"},
  ],
  tools: [
    {title:"How to Use a Diffuser",                duration:"6 min",  tags:["2C","3A","3B","3C"],    difficulty:"beginner",     level:"Beginner"},
    {title:"Denman Brush 101",                     duration:"5 min",  tags:["3A","3B","3C"],         difficulty:"beginner",     level:"Beginner"},
    {title:"Wide-Tooth Comb Technique",            duration:"3 min",  tags:["All"],                  difficulty:"beginner",     level:"Beginner"},
    {title:"Microfiber Towel vs T-Shirt",          duration:"4 min",  tags:["All"],                  difficulty:"beginner",     level:"Beginner"},
    {title:"Choosing the Right Bonnet",            duration:"5 min",  tags:["All"],                  difficulty:"beginner",     level:"Beginner"},
  ],
};

// ── SVG thumbnail illustrations ───────────────────────────────────────────────
const ILLUSTRATIONS = [
  `<svg width="100%" height="100%" viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g1" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#f4ead4"/><stop offset="1" stop-color="#F5D5D8"/></linearGradient></defs><rect width="300" height="180" fill="url(#g1)"/><g stroke="#7a1024" fill="none" strokeLinecap="round" strokeWidth="3"><path d="M20 55 Q60 30 100 55 T180 55 T260 55 T340 55" opacity="0.45"/><path d="M20 85 Q60 60 100 85 T180 85 T260 85 T340 85" opacity="0.65"/><path d="M20 115 Q60 90 100 115 T180 115 T260 115 T340 115" opacity="0.85"/><path d="M20 145 Q60 120 100 145 T180 145 T260 145 T340 145" opacity="0.55" stroke="#9B1B30"/></g></svg>`,
  `<svg width="100%" height="100%" viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g2" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#F5D5D8"/><stop offset="1" stop-color="#f4ead4"/></linearGradient></defs><rect width="300" height="180" fill="url(#g2)"/><g stroke="#7a1024" fill="none" strokeLinecap="round" strokeWidth="2.5" opacity="0.7"><path d="M75 20 C55 30 55 50 75 55 C95 60 95 80 75 85 C55 90 55 110 75 115 C95 120 95 140 75 145 C65 148 60 155 65 165"/><path d="M150 15 C130 25 130 45 150 50 C170 55 170 75 150 80 C130 85 130 105 150 110 C170 115 170 135 150 140 C140 143 135 150 140 160"/><path d="M225 25 C205 35 205 55 225 60 C245 65 245 85 225 90 C205 95 205 115 225 120 C245 125 245 145 225 150 C215 153 210 160 215 170" stroke="#9B1B30"/></g></svg>`,
  `<svg width="100%" height="100%" viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g3" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#C4485A"/><stop offset="1" stop-color="#F5D5D8"/></linearGradient></defs><rect width="300" height="180" fill="url(#g3)"/><g stroke="#7a1024" fill="none" strokeWidth="2" opacity="0.6"><circle cx="60" cy="50" r="12"/><circle cx="60" cy="50" r="7"/><circle cx="95" cy="75" r="14"/><circle cx="95" cy="75" r="8"/><circle cx="135" cy="45" r="11"/><circle cx="135" cy="45" r="6"/><circle cx="170" cy="80" r="13"/><circle cx="170" cy="80" r="7"/><circle cx="210" cy="55" r="12"/><circle cx="210" cy="55" r="7"/><circle cx="245" cy="85" r="14"/><circle cx="245" cy="85" r="8"/><circle cx="75" cy="120" r="13" stroke="#9B1B30"/><circle cx="75" cy="120" r="7" stroke="#9B1B30"/><circle cx="155" cy="120" r="14" stroke="#9B1B30"/><circle cx="155" cy="120" r="8" stroke="#9B1B30"/></g></svg>`,
  `<svg width="100%" height="100%" viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g4" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#F5D5D8"/><stop offset="1" stop-color="#C4485A"/></linearGradient></defs><rect width="300" height="180" fill="url(#g4)"/><g stroke="#7a1024" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"><path d="M30 40 L45 50 L30 60 L45 70 L30 80 L45 90 L30 100 L45 110 L30 120 L45 130 L30 140" opacity="0.65"/><path d="M80 30 L95 40 L80 50 L95 60 L80 70 L95 80 L80 90 L95 100 L80 110 L95 120 L80 130 L95 140 L80 150" opacity="0.7"/><path d="M130 40 L145 50 L130 60 L145 70 L130 80 L145 90 L130 100 L145 110 L130 120 L145 130 L130 140" opacity="0.6"/><path d="M180 30 L195 40 L180 50 L195 60 L180 70 L195 80 L180 90 L195 100 L180 110 L195 120 L180 130 L195 140 L180 150" opacity="0.7" stroke="#9B1B30"/><path d="M230 40 L245 50 L230 60 L245 70 L230 80 L245 90 L230 100 L245 110 L230 120 L245 130 L230 140" opacity="0.6" stroke="#9B1B30"/></g></svg>`,
  `<svg width="100%" height="100%" viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g5" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#C4485A"/><stop offset="1" stop-color="#f4ead4"/></linearGradient></defs><rect width="300" height="180" fill="url(#g5)"/><g fill="none" strokeLinecap="round" strokeWidth="3"><path d="M70 20 Q80 35 70 50 Q60 65 70 80 Q80 95 70 110 Q60 125 70 140 Q80 155 70 170" stroke="#7a1024" opacity="0.7"/><path d="M90 20 Q80 35 90 50 Q100 65 90 80 Q80 95 90 110 Q100 125 90 140 Q80 155 90 170" stroke="#7a1024" opacity="0.5"/><path d="M150 20 Q160 35 150 50 Q140 65 150 80 Q160 95 150 110 Q140 125 150 140 Q160 155 150 170" stroke="#9B1B30" opacity="0.8"/><path d="M170 20 Q160 35 170 50 Q180 65 170 80 Q160 95 170 110 Q180 125 170 140 Q160 155 170 170" stroke="#9B1B30" opacity="0.6"/><path d="M230 20 Q240 35 230 50 Q220 65 230 80 Q240 95 230 110 Q220 125 230 140 Q240 155 230 170" stroke="#7a1024" opacity="0.7"/><path d="M250 20 Q240 35 250 50 Q260 65 250 80 Q240 95 250 110 Q260 125 250 140 Q240 155 250 170" stroke="#7a1024" opacity="0.5"/></g></svg>`,
  `<svg width="100%" height="100%" viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g6" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#F5D5D8"/><stop offset="1" stop-color="#f4ead4"/></linearGradient></defs><rect width="300" height="180" fill="url(#g6)"/><g opacity="0.7"><circle cx="150" cy="95" r="60" fill="#7a1024" opacity="0.2"/><circle cx="110" cy="65" r="15" fill="#7a1024" opacity="0.45"/><circle cx="140" cy="50" r="18" fill="#7a1024" opacity="0.5"/><circle cx="175" cy="55" r="16" fill="#7a1024" opacity="0.45"/><circle cx="200" cy="75" r="14" fill="#7a1024" opacity="0.5"/><circle cx="210" cy="105" r="15" fill="#7a1024" opacity="0.45"/><circle cx="195" cy="135" r="14" fill="#7a1024" opacity="0.5"/><circle cx="160" cy="145" r="16" fill="#7a1024" opacity="0.45"/><circle cx="125" cy="140" r="14" fill="#9B1B30" opacity="0.7"/><circle cx="95" cy="115" r="15" fill="#9B1B30" opacity="0.7"/><circle cx="100" cy="85" r="13" fill="#9B1B30" opacity="0.65"/></g></svg>`,
  `<svg width="100%" height="100%" viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g7" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#f4ead4"/><stop offset="1" stop-color="#F5D5D8"/></linearGradient></defs><rect width="300" height="180" fill="url(#g7)"/><g opacity="0.7"><ellipse cx="75" cy="55" rx="18" ry="14" fill="#7a1024" opacity="0.35"/><path d="M65 55 Q75 45 85 55" stroke="#7a1024" strokeWidth="2" fill="none"/><ellipse cx="150" cy="50" rx="18" ry="14" fill="#7a1024" opacity="0.35"/><path d="M140 50 Q150 40 160 50" stroke="#7a1024" strokeWidth="2" fill="none"/><ellipse cx="225" cy="55" rx="18" ry="14" fill="#7a1024" opacity="0.35"/><path d="M215 55 Q225 45 235 55" stroke="#7a1024" strokeWidth="2" fill="none"/><ellipse cx="110" cy="115" rx="18" ry="14" fill="#9B1B30" opacity="0.55"/><path d="M100 115 Q110 105 120 115" stroke="#7a1024" strokeWidth="2" fill="none"/><ellipse cx="190" cy="115" rx="18" ry="14" fill="#9B1B30" opacity="0.55"/><path d="M180 115 Q190 105 200 115" stroke="#7a1024" strokeWidth="2" fill="none"/></g></svg>`,
  `<svg width="100%" height="100%" viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g8" x1="0" x2="1" y1="1" y2="0"><stop offset="0" stop-color="#f4ead4"/><stop offset="1" stop-color="#C4485A"/></linearGradient></defs><rect width="300" height="180" fill="url(#g8)"/><g opacity="0.75"><path d="M130 35 Q100 35 85 60 Q70 80 75 110 Q80 140 110 150 Q90 145 80 130 Q75 115 85 100 Q70 95 75 75 Q85 55 105 50" fill="#7a1024" opacity="0.35"/><circle cx="100" cy="60" r="8" fill="#7a1024" opacity="0.4"/><circle cx="85" cy="85" r="10" fill="#7a1024" opacity="0.5"/><circle cx="95" cy="115" r="9" fill="#7a1024" opacity="0.45"/><circle cx="115" cy="145" r="8" fill="#7a1024" opacity="0.35"/><path d="M155 40 Q160 50 155 60 Q165 65 158 75 Q170 80 160 92" stroke="#9B1B30" strokeWidth="2" fill="none" strokeLinecap="round"/></g></svg>`,
];

// ── Tutorial card ─────────────────────────────────────────────────────────────
function TutorialCard({ tutorial, index, locked }) {
  const [saved, setSaved] = useState(false);
  const [hovered, setHovered] = useState(false);
  const illus = ILLUSTRATIONS[index % ILLUSTRATIONS.length];
  const diffColor = tutorial.difficulty === "advanced" ? T.crimsonDeep : tutorial.difficulty === "intermediate" ? T.crimsonSoft : T.gold;

  return (
    <article
      style={{flex:"0 0 300px",background:T.ivory,borderRadius:14,overflow:"hidden",scrollSnapAlign:"start",cursor:"pointer",transition:"transform .28s ease, box-shadow .28s ease",display:"flex",flexDirection:"column",border:`1px solid ${hovered?"rgba(122,16,36,0.12)":"transparent"}`,position:"relative",transform:hovered?"translateY(-6px)":"none",boxShadow:hovered?"0 20px 40px -18px rgba(122,16,36,0.25)":"none"}}
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
    >
      <div style={{position:"relative",aspectRatio:"16/10",background:`linear-gradient(135deg,${T.creamWarm},${T.goldPale})`,overflow:"hidden",filter:locked?"saturate(0.6) brightness(0.92)":"none"}}>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",color:T.crimson,opacity:0.85}} dangerouslySetInnerHTML={{__html:illus}}/>
        {locked&&<>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(42,26,24,0) 0%,rgba(42,26,24,0.35) 100%)",zIndex:2,pointerEvents:"none"}}/>
          <div style={{position:"absolute",top:10,left:10,zIndex:3,display:"inline-flex",alignItems:"center",gap:5,background:`linear-gradient(135deg,${T.crimson},${T.crimsonDeep})`,color:"#fff",fontFamily:sans,fontSize:10,fontWeight:600,letterSpacing:"1.2px",textTransform:"uppercase",padding:"5px 10px",borderRadius:999,boxShadow:"0 4px 12px rgba(122,16,36,0.3)"}}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Coming Soon
          </div>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:56,height:56,borderRadius:"50%",background:"rgba(253,250,242,0.96)",display:"flex",alignItems:"center",justifyContent:"center",color:T.crimson,boxShadow:"0 10px 24px rgba(42,26,24,0.25),0 0 0 6px rgba(201,163,90,0.25)",zIndex:3}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
        </>}
        <div style={{position:"absolute",top:10,left:10,display:"flex",alignItems:"center",gap:6,background:"rgba(253,250,242,0.92)",padding:"4px 10px",borderRadius:999,fontFamily:sans,fontSize:10,fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",color:T.ink,zIndex:locked?0:2}}>
          <span style={{width:7,height:7,borderRadius:"50%",background:diffColor,display:"inline-block"}}/>{tutorial.level}
        </div>
        {!locked&&<button onClick={e=>{e.stopPropagation();setSaved(s=>!s)}} style={{position:"absolute",top:10,right:10,width:32,height:32,borderRadius:"50%",background:saved?T.crimson:"rgba(253,250,242,0.92)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:saved?T.goldPale:T.crimson,border:"none",transition:"all .2s",zIndex:2}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={saved?"currentColor":"none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </button>}
        <div style={{position:"absolute",bottom:10,right:10,background:"rgba(42,26,24,0.82)",color:T.ivory,fontFamily:sans,fontSize:11,fontWeight:500,padding:"4px 10px",borderRadius:999,letterSpacing:"0.3px",zIndex:2}}>{tutorial.duration}</div>
      </div>
      <div style={{padding:"18px 20px 20px",flex:1,display:"flex",flexDirection:"column",filter:locked?"opacity(0.55)":"none"}}>
        <h3 style={{fontFamily:serif,fontSize:22,fontWeight:500,lineHeight:1.22,color:T.ink,marginBottom:10,letterSpacing:"-0.2px"}}>{tutorial.title}</h3>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:"auto",paddingTop:12,borderTop:`1px dashed ${T.line}`}}>
          {tutorial.tags.map(tag=><span key={tag} style={{fontFamily:sans,fontSize:10,fontWeight:600,letterSpacing:"0.8px",color:T.crimson,background:"rgba(122,16,36,0.06)",padding:"3px 8px",borderRadius:4}}>{tag}</span>)}
        </div>
      </div>
    </article>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
function TutorialSection({ eyebrow, title, titleEm, subtitle, items, personalized }) {
  const rowRef = useRef();
  const scroll = dir => rowRef.current?.scrollBy({left: dir * 340, behavior:"smooth"});
  return (
    <section style={{maxWidth:1400,margin:"0 auto",padding:"48px 48px 16px",...(personalized?{background:"linear-gradient(180deg,transparent,rgba(201,163,90,0.08) 40%,rgba(201,163,90,0.08) 60%,transparent)",position:"relative"}:{})}}>
      {personalized&&<div style={{position:"absolute",left:48,right:48,top:0,height:1,background:`linear-gradient(90deg,transparent,${T.gold},transparent)`}}/>}
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:28,paddingBottom:14,borderBottom:`1px solid ${T.line}`}}>
        <div>
          <div style={{fontFamily:sans,fontSize:11,fontWeight:600,letterSpacing:"2px",textTransform:"uppercase",color:T.gold,marginBottom:6}}>{eyebrow}</div>
          <h2 style={{fontFamily:serif,fontSize:36,fontWeight:500,color:T.ink,letterSpacing:"-0.5px",lineHeight:1.1}}>
            {title}{titleEm&&<> <em style={{color:personalized?T.gold:T.crimson,fontStyle:"italic"}}>{titleEm}</em></>}
          </h2>
          {subtitle&&<p style={{fontFamily:serif,fontSize:16,fontStyle:"italic",color:T.muted,marginTop:6}}>{subtitle}</p>}
        </div>
        <div style={{display:"flex",gap:8,flexShrink:0}}>
          {[[-1,"←"],[1,"→"]].map(([dir,arrow])=>(
            <button key={dir} onClick={()=>scroll(dir)} style={{width:38,height:38,borderRadius:"50%",border:`1px solid ${T.line}`,background:T.ivory,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.crimson,transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.background=T.crimson;e.currentTarget.style.color=T.ivory;e.currentTarget.style.borderColor=T.crimson;e.currentTarget.style.transform="translateY(-1px)"}} onMouseLeave={e=>{e.currentTarget.style.background=T.ivory;e.currentTarget.style.color=T.crimson;e.currentTarget.style.borderColor=T.line;e.currentTarget.style.transform=""}}>
              {arrow==="←"?<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>}
            </button>
          ))}
        </div>
      </div>
      <div ref={rowRef} style={{display:"flex",gap:20,overflowX:"auto",scrollSnapType:"x mandatory",padding:"6px 4px 28px",scrollbarWidth:"thin",scrollbarColor:`${T.crimson} transparent`}}>
        {items.map((t,i)=><TutorialCard key={i} tutorial={t} index={i} locked={i>0}/>)}
      </div>
    </section>
  );
}

// ── Main TutorialsPage export ─────────────────────────────────────────────────
export function TutorialsPage({ onNavigate }) {
  const [curlFilter, setCurlFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [search, setSearch] = useState("");

  return (
    <div style={{fontFamily:sans,background:T.cream,color:T.ink,overflowX:"hidden"}}>
      <style>{`
        @keyframes pel-fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .tut-scroll::-webkit-scrollbar{height:6px}
        .tut-scroll::-webkit-scrollbar-track{background:transparent}
        .tut-scroll::-webkit-scrollbar-thumb{background:${T.crimson};border-radius:3px}
        @media(max-width:900px){
          .tut-featured-grid{grid-template-columns:1fr!important}
          .tut-section{padding-left:20px!important;padding-right:20px!important}
          .tut-filter-bar{padding:14px 20px!important}
          .tut-ask-inner{grid-template-columns:1fr!important;text-align:center!important;padding:32px 24px!important}
          .tut-unlock-inner{grid-template-columns:1fr!important;text-align:center!important;padding:32px 24px!important}
        }
      `}</style>

      <Navbar onNavigate={onNavigate} activeScreen="tutorials" />

      {/* Hero */}
      <section style={{position:"relative",padding:"80px 48px 64px",textAlign:"center",background:`radial-gradient(ellipse at top,rgba(201,163,90,0.18),transparent 60%),radial-gradient(ellipse at bottom,rgba(122,16,36,0.08),transparent 70%),${T.cream}`,borderBottom:`1px solid ${T.line}`,overflow:"hidden"}}>
        <span style={{display:"inline-block",fontFamily:sans,fontSize:11,fontWeight:600,letterSpacing:"2.5px",textTransform:"uppercase",color:T.gold,padding:"8px 22px",background:"rgba(201,163,90,0.14)",borderRadius:999,marginBottom:28,animation:"pel-fadeUp .8s ease both"}}>The Pelora Tutorial Library</span>
        <h1 style={{fontFamily:serif,fontSize:"clamp(44px,6.5vw,76px)",fontWeight:400,lineHeight:1.02,color:T.ink,marginBottom:22,letterSpacing:"-1px",animation:"pel-fadeUp .8s ease .1s both"}}>
          Learn your curls,<br/><em style={{color:T.crimson,fontStyle:"italic",fontWeight:400}}>one tutorial at a time.</em>
        </h1>
        <p style={{fontFamily:sans,fontSize:16,fontWeight:400,color:T.muted,maxWidth:560,margin:"0 auto",lineHeight:1.6,animation:"pel-fadeUp .8s ease .2s both"}}>
          Expert-crafted guides for every coil, wave, and ringlet — matched to your hair profile and updated weekly.
        </p>
      </section>

      {/* Filter bar */}
      <div style={{position:"sticky",top:61,zIndex:90,background:"rgba(253,250,242,0.96)",backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)",borderBottom:`1px solid ${T.line}`,padding:"18px 48px"}} className="tut-filter-bar">
        <div style={{maxWidth:1400,margin:"0 auto",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <span style={{fontFamily:sans,fontSize:11,fontWeight:600,letterSpacing:"1.8px",textTransform:"uppercase",color:T.muted,marginRight:4}}>Curl Type</span>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {["All","2A–2C","3A–3C","4A–4C"].map(f=>(
              <button key={f} onClick={()=>setCurlFilter(f)} style={{background:curlFilter===f?T.crimson:"transparent",border:`1px solid ${curlFilter===f?T.crimson:T.line}`,color:curlFilter===f?T.ivory:T.ink,fontFamily:sans,fontSize:13,fontWeight:500,padding:"7px 14px",borderRadius:999,cursor:"pointer",transition:"all .18s"}}>{f}</button>
            ))}
          </div>
          <div style={{width:1,height:22,background:T.line,margin:"0 6px"}}/>
          <span style={{fontFamily:sans,fontSize:11,fontWeight:600,letterSpacing:"1.8px",textTransform:"uppercase",color:T.muted,marginRight:4}}>Level</span>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {["All","Beginner","Intermediate","Advanced"].map(f=>(
              <button key={f} onClick={()=>setLevelFilter(f)} style={{background:levelFilter===f?T.crimson:"transparent",border:`1px solid ${levelFilter===f?T.crimson:T.line}`,color:levelFilter===f?T.ivory:T.ink,fontFamily:sans,fontSize:13,fontWeight:500,padding:"7px 14px",borderRadius:999,cursor:"pointer",transition:"all .18s"}}>{f}</button>
            ))}
          </div>
          <div style={{marginLeft:"auto",position:"relative"}}>
            <svg style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:T.muted}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tutorials..." style={{fontFamily:sans,fontSize:13,padding:"9px 16px 9px 38px",border:`1px solid ${T.line}`,borderRadius:999,background:T.ivory,width:220,color:T.ink,outline:"none"}} onFocus={e=>{e.target.style.borderColor=T.crimson;e.target.style.width="260px"}} onBlur={e=>{e.target.style.borderColor=T.line;e.target.style.width="220px"}}/>
          </div>
        </div>
      </div>

      {/* Featured tutorial */}
      <section style={{maxWidth:1400,margin:"0 auto",padding:"56px 48px 24px"}} className="tut-section">
        <div className="tut-featured-grid" style={{position:"relative",background:`linear-gradient(135deg,${T.crimsonDeep} 0%,${T.crimson} 55%,${T.crimsonSoft} 100%)`,borderRadius:20,overflow:"hidden",display:"grid",gridTemplateColumns:"1.1fr 1fr",minHeight:360,boxShadow:"0 24px 60px -20px rgba(122,16,36,0.35)"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 85% 20%,rgba(201,163,90,0.35),transparent 50%),radial-gradient(circle at 15% 80%,rgba(236,217,176,0.15),transparent 50%)",pointerEvents:"none"}}/>
          <div style={{padding:"56px 56px 48px",display:"flex",flexDirection:"column",justifyContent:"center",color:T.ivory,position:"relative",zIndex:1}}>
            <span style={{display:"inline-flex",alignItems:"center",gap:8,fontFamily:sans,fontSize:10,fontWeight:600,letterSpacing:"2.5px",textTransform:"uppercase",color:"rgba(255,255,255,0.85)",marginBottom:20}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:T.goldSoft,display:"inline-block",boxShadow:`0 0 12px ${T.goldSoft}`}}/>Tutorial of the Week
            </span>
            <h2 style={{fontFamily:serif,fontSize:44,fontWeight:500,lineHeight:1.08,letterSpacing:"-0.5px",marginBottom:14}}>
              The Humidity-Proof <em style={{color:"rgba(255,255,255,0.9)",fontStyle:"italic"}}>Wash Day</em>
            </h2>
            <p style={{fontFamily:serif,fontSize:18,fontStyle:"italic",color:"rgba(253,250,242,0.82)",marginBottom:28,maxWidth:460}}>A complete routine for high-porosity curls that holds its shape through summer air — featuring the LOC method, proper plopping, and a diffusing finish.</p>
            <div style={{display:"flex",gap:18,alignItems:"center",marginBottom:32,fontFamily:sans,fontSize:12,color:"rgba(253,250,242,0.75)",letterSpacing:"0.5px",flexWrap:"wrap"}}>
              <span style={{display:"flex",alignItems:"center",gap:6}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>22 min</span>
              <span style={{width:3,height:3,borderRadius:"50%",background:T.goldSoft,display:"inline-block"}}/>
              <span>All curl types</span>
              <span style={{width:3,height:3,borderRadius:"50%",background:T.goldSoft,display:"inline-block"}}/>
              <span>Intermediate</span>
            </div>
            <a href="#" style={{display:"inline-flex",alignItems:"center",gap:10,background:T.goldSoft,color:T.crimsonDeep,padding:"14px 28px",borderRadius:999,fontFamily:sans,fontSize:13,fontWeight:600,letterSpacing:"0.8px",textTransform:"uppercase",textDecoration:"none",width:"fit-content",transition:"transform .2s,box-shadow .2s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 30px -8px rgba(201,163,90,0.6)"}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
              Watch Now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
          </div>
          <div style={{position:"relative",background:"linear-gradient(135deg,rgba(0,0,0,0.15),transparent),repeating-linear-gradient(45deg,rgba(201,163,90,0.06) 0 2px,transparent 2px 14px)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at center,transparent 35%,rgba(90,12,27,0.4) 100%)"}}/>
            <div style={{position:"relative",zIndex:1,width:96,height:96,borderRadius:"50%",background:"rgba(253,250,242,0.95)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 0 8px rgba(201,163,90,0.25),0 20px 50px rgba(0,0,0,0.3)",cursor:"pointer",transition:"transform .25s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"} onMouseLeave={e=>e.currentTarget.style.transform=""}>
              <div style={{width:0,height:0,borderStyle:"solid",borderWidth:"14px 0 14px 22px",borderColor:`transparent transparent transparent ${T.crimson}`,marginLeft:6}}/>
            </div>
          </div>
        </div>
      </section>

      <TutorialSection eyebrow="Your Profile"  title="Made for"      titleEm="Your Curls"         subtitle="Tutorials matched to your curl profile."              items={TUTORIALS.personal}   personalized/>
      <TutorialSection eyebrow="Category 01"   title="Styling &"     titleEm="Updos"              subtitle="Looks that work with your curls, not against them."   items={TUTORIALS.styling}/>
      <TutorialSection eyebrow="Category 02"   title="Wash Day"      titleEm="Rituals"            subtitle="Build a wash day routine that actually works."         items={TUTORIALS.wash}/>
      <TutorialSection eyebrow="Category 03"   title="Edges &"       titleEm="Laid Baby Hairs"    subtitle="From sleek to natural — the art of the perfect swoop." items={TUTORIALS.edges}/>
      <TutorialSection eyebrow="Category 04"   title="Heatless"      titleEm="Methods"            subtitle="Beautiful curls without the damage."                   items={TUTORIALS.heatless}/>
      <TutorialSection eyebrow="Category 05"   title="Protective"    titleEm="Styles"             subtitle="Styles that keep your curls thriving between wash days." items={TUTORIALS.protective}/>
      <TutorialSection eyebrow="Category 06"   title="Treatments &"  titleEm="Hair Health"        subtitle="Deep care rituals for long-term curl wellness."        items={TUTORIALS.treatments}/>
      <TutorialSection eyebrow="Category 07"   title="Tools"         titleEm="101"                subtitle="Master your diffuser, brush, and towel."               items={TUTORIALS.tools}/>

      {/* Unlock banner */}
      <div style={{maxWidth:1400,margin:"40px auto 0",padding:"0 48px"}}>
        <div style={{position:"relative",background:`radial-gradient(ellipse at top right,rgba(201,163,90,0.25),transparent 55%),linear-gradient(135deg,${T.crimsonDeep} 0%,${T.crimson} 100%)`,borderRadius:20,padding:"40px 48px",display:"grid",gridTemplateColumns:"auto 1fr auto",gap:28,alignItems:"center",overflow:"hidden",color:T.ivory}} className="tut-unlock-inner">
          <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(45deg,rgba(201,163,90,0.04) 0 2px,transparent 2px 18px)",pointerEvents:"none"}}/>
          <div style={{position:"relative",zIndex:1,width:64,height:64,borderRadius:"50%",background:T.goldSoft,display:"flex",alignItems:"center",justifyContent:"center",color:T.crimsonDeep,boxShadow:"0 0 0 8px rgba(201,163,90,0.2)"}}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{fontFamily:sans,fontSize:10,fontWeight:600,letterSpacing:"2.5px",textTransform:"uppercase",color:"rgba(255,255,255,0.8)",marginBottom:6}}>Unlock Everything</div>
            <h3 style={{fontFamily:serif,fontSize:30,fontWeight:500,letterSpacing:"-0.3px",lineHeight:1.15,marginBottom:4}}>All tutorials, <em style={{color:"rgba(255,255,255,0.9)",fontStyle:"italic"}}>zero limits.</em></h3>
            <p style={{fontFamily:sans,fontSize:14,color:"rgba(253,250,242,0.78)",maxWidth:520}}>Complete your hair profile to unlock personalized tutorials for your exact curl type, porosity, and goals.</p>
          </div>
          <button onClick={()=>onNavigate("quiz")} style={{position:"relative",zIndex:1,background:T.goldSoft,color:T.crimsonDeep,padding:"14px 28px",borderRadius:999,fontFamily:sans,fontSize:13,fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",border:"none",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:10,transition:"all .2s",whiteSpace:"nowrap"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 14px 30px -8px rgba(201,163,90,0.5)"}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
            Take the Quiz
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      {/* Ask Pelora CTA */}
      <section style={{maxWidth:1400,margin:"72px auto 0",padding:"0 48px"}}>
        <div style={{position:"relative",background:T.ivory,border:`1px solid ${T.line}`,borderRadius:20,padding:"48px 56px",display:"grid",gridTemplateColumns:"auto 1fr auto",gap:32,alignItems:"center",overflow:"hidden"}} className="tut-ask-inner">
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${T.crimson},${T.gold},${T.crimson})`}}/>
          <div style={{width:72,height:72,borderRadius:"50%",background:`linear-gradient(135deg,${T.crimson},${T.crimsonDeep})`,display:"flex",alignItems:"center",justifyContent:"center",color:T.goldSoft,boxShadow:"0 12px 30px -8px rgba(122,16,36,0.4)"}}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="8.5" cy="10" r="0.5" fill="currentColor"/><circle cx="12" cy="10" r="0.5" fill="currentColor"/><circle cx="15.5" cy="10" r="0.5" fill="currentColor"/></svg>
          </div>
          <div>
            <h3 style={{fontFamily:serif,fontSize:28,fontWeight:500,color:T.ink,letterSpacing:"-0.3px",marginBottom:4}}>Can't find what you're <em style={{color:T.crimson,fontStyle:"italic"}}>looking for?</em></h3>
            <p style={{fontFamily:serif,fontSize:16,fontStyle:"italic",color:T.muted}}>Ask Pelora — your 24/7 curl expert has answers for every question.</p>
          </div>
          <button style={{background:T.crimson,color:T.ivory,padding:"14px 28px",borderRadius:999,fontFamily:sans,fontSize:13,fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",border:"none",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:10,transition:"all .2s",whiteSpace:"nowrap"}} onMouseEnter={e=>{e.currentTarget.style.background=T.crimsonDeep;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 30px -8px rgba(122,16,36,0.5)"}} onMouseLeave={e=>{e.currentTarget.style.background=T.crimson;e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
            Ask Pelora
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{marginTop:96,padding:"48px 48px 32px",background:T.crimsonDeep,color:"rgba(253,250,242,0.7)",textAlign:"center",fontFamily:serif,fontStyle:"italic",fontSize:15}}>
        <div style={{fontFamily:serif,fontSize:32,fontWeight:500,fontStyle:"italic",color:T.goldSoft,letterSpacing:"-0.5px",marginBottom:8}}>pelora</div>
        <p>Your curls, beautifully decoded.</p>
      </footer>
    </div>
  );
}
// src/components/ChallengePage.jsx
// Rebuilt to match challenge__3_.html — alternating timeline, gold milestone circles,
// gold-pale week cards, gold progress gradient, gold badge circles.

import { useState } from "react";

const T = {
  redDeep:"#7A0E1E", redMid:"#9B1B30", redSoft:"#C4485A",
  redBlush:"#E8A0A8", redFaint:"#F5D5D8",
  gold:"#C9A03C", goldLight:"#DFC06E", goldShimmer:"#EDD99B", goldPale:"#F7EDCE",
  cream:"#FDFAF4", creamWarm:"#F8F2E8", creamMid:"#EFE6D6",
  brownText:"#3D2B1F", brownMuted:"#7A6858", brownLight:"#A69484",
  green:"#2E7D4F", greenPale:"#E6F4EC",
};
const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'DM Sans', system-ui, sans-serif";
const XP_PER   = 50;
const TOTAL_XP = 1000;

const WEEKS = [
  { week:1, title:"Clarify & Reset", tagline:"Build your foundation",
    challenges:[
      {day:1,  t:"Clarifying wash to remove buildup",            why:"Start fresh — remove silicones and product buildup so your curls can absorb moisture properly.",    tip:"Use a sulfate-free clarifying shampoo. Focus on the scalp, let it rinse through the lengths."},
      {day:2,  t:"Deep condition for 30 minutes",                why:"After clarifying, your hair needs intense moisture replenishment.",                                   tip:"Apply under a shower cap with a warm towel for deeper penetration."},
      {day:3,  t:"Try the squish-to-condish method",             why:"Helps your high-porosity curls absorb and lock in maximum moisture.",                                 tip:"Cup water in your hands and squish it into conditioner-coated hair until you hear a squelching sound."},
      {day:5,  t:"Finger-detangle on wet hair only",             why:"Reduces breakage compared to brushing dry hair.",                                                     tip:"Work in small sections from ends to roots with slippery conditioner."},
      {day:7,  t:"Air dry with no heat — see your true pattern", why:"Heat distorts your natural curl pattern. Let your curls show themselves.",                            tip:"Apply styler to soaking wet hair, scrunch upward, and don't touch until fully dry."},
    ]},
  { week:2, title:"Deep Condition & Moisture", tagline:"Hydrate and nourish",
    challenges:[
      {day:8,  t:"Deep condition twice this week",  why:"High-porosity hair loses moisture fast. Two sessions keep you balanced.",             tip:"One mid-week, one on wash day. Alternate between a moisture and protein mask."},
      {day:10, t:"Try the LOC method",              why:"Layering Liquid-Oil-Cream seals moisture into high-porosity curls effectively.",       tip:"Start with a water-based leave-in, then a light oil, then cream styler."},
      {day:12, t:"Drink 8 glasses of water daily",  why:"Hydration from the inside directly affects your hair's moisture and elasticity.",      tip:"Set hourly reminders. Your curls reflect what's happening internally."},
      {day:14, t:"Sleep on a satin pillowcase",     why:"Cotton absorbs moisture and creates friction. Satin preserves your curls overnight.",  tip:"Pillowcase or bonnet — use whichever you'll actually keep up with."},
      {day:15, t:"Try pineappling before bed",      why:"Preserves curl definition overnight so Day 2 hair looks almost as good as Day 1.",   tip:"Loose, high ponytail with a silk scrunchie. Don't pull tight."},
    ]},
  { week:3, title:"Define & Style", tagline:"Master your techniques",
    challenges:[
      {day:16, t:"Try the praying hands method",   why:"Better product distribution means less frizz and more definition.",                   tip:"Smooth product down with flat palms, then scrunch upward at the ends."},
      {day:18, t:"Scrunch out the crunch (SOTC)",  why:"Breaking the gel cast reveals soft, touchable, frizz-free curls.",                    tip:"Wait until hair is 100% dry. Scrunch with a tiny drop of oil on your palms."},
      {day:20, t:"Full Pelora wash day ritual",    why:"Combine everything you've learned into one complete routine.",                        tip:"Set aside 45 minutes. Play music. Make it a self-care ritual."},
      {day:21, t:"Try diffusing on low heat",      why:"Speeds up drying without disrupting curl pattern when done right.",                   tip:"Cup curls toward scalp, low speed low heat. Don't move the diffuser around."},
    ]},
  { week:4, title:"Protect & Retain", tagline:"Lock in your progress",
    challenges:[
      {day:22, t:"Try a new style from your recommendations", why:"Confidence means stepping outside your comfort zone.",          tip:"Pick one face-shape matched style and wear it all day."},
      {day:24, t:"Scalp massage with oil — 5 minutes",        why:"Stimulates blood flow for healthier growth and feels amazing.", tip:"Jojoba or castor oil. Small circles with fingertips, not nails."},
      {day:26, t:"Check and trim your ends",                  why:"Healthy ends mean more length retention over time.",            tip:"Look for split ends, fairy knots, and thinning. Even a micro-trim helps."},
      {day:28, t:"Share your journey with someone",           why:"Community and accountability make habits stick.",               tip:"Post a before/after or send it to a friend who'd relate."},
      {day:30, t:"Day 30 photo — compare to Day 1!",          why:"You've earned this moment. See how far your curls have come.", tip:"Upload your Day 30 photo to Pelora for an AI progress comparison."},
    ]},
];

const BADGE_DATA = [
  {name:"Week 1", sub:"Clarify & Reset",           icon:"💎"},
  {name:"Week 2", sub:"Deep Condition & Moisture",  icon:"💧"},
  {name:"Week 3", sub:"Define & Style",             icon:"✨"},
  {name:"Week 4", sub:"Protect & Retain",           icon:"👑"},
];

function weekStatus(w, done) {
  if (w.challenges.every(c => done.has(c.day))) return "done";
  // find the first week that isn't fully done — that's "current"
  for (const wk of WEEKS) {
    if (!wk.challenges.every(c => done.has(c.day))) {
      return wk.week === w.week ? "current" : "locked";
    }
  }
  return "done";
}

// ── Navbar ─────────────────────────────────────────────────────────────────────
function Navbar({ onNavigate }) {
  const [mob, setMob] = useState(false);
  const NAV = [
    {label:"Home",screen:"landing"},
    {label:"My Results",screen:"results"},
    {label:"Challenge",screen:"challenge"},
    {label:"Tutorials",screen:"tutorials"},
    {label:"Products",screen:"products"},
  ];
  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 40px",background:T.redDeep,borderBottom:"1px solid rgba(201,160,60,0.15)"}}>
      <button onClick={()=>onNavigate("landing")} style={{fontFamily:serif,fontSize:26,fontWeight:600,fontStyle:"italic",color:T.goldLight,background:"none",border:"none",cursor:"pointer",padding:0}}>
        pelora
      </button>
      <ul style={{display:"flex",gap:32,listStyle:"none",margin:0,padding:0}} className="ch-desk">
        {NAV.map(n=>(
          <li key={n.screen}>
            <button onClick={()=>onNavigate(n.screen)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:sans,fontSize:13,fontWeight:n.screen==="challenge"?500:400,letterSpacing:"0.06em",color:n.screen==="challenge"?"#fff":"rgba(255,255,255,0.7)",transition:"color 0.3s"}}
              onMouseEnter={e=>e.currentTarget.style.color="#fff"}
              onMouseLeave={e=>e.currentTarget.style.color=n.screen==="challenge"?"#fff":"rgba(255,255,255,0.7)"}>
              {n.label}
            </button>
          </li>
        ))}
      </ul>
      <button className="ch-mob" onClick={()=>setMob(o=>!o)} style={{display:"none",background:"none",border:"none",cursor:"pointer",padding:8,flexDirection:"column",gap:5}}>
        {[0,1,2].map(i=><div key={i} style={{width:22,height:1.5,background:"#fff",borderRadius:2}}/>)}
      </button>
      {mob && (
        <div style={{position:"fixed",top:61,left:0,right:0,background:T.redDeep,display:"flex",flexDirection:"column",padding:"12px 0",zIndex:99}}>
          {NAV.map(n=>(
            <button key={n.screen} onClick={()=>{onNavigate(n.screen);setMob(false);}} style={{padding:"14px 32px",textAlign:"left",background:"none",border:"none",cursor:"pointer",fontFamily:sans,fontSize:15,color:"rgba(255,255,255,0.85)"}}>
              {n.label}
            </button>
          ))}
        </div>
      )}
      <style>{`@media(max-width:768px){.ch-desk{display:none!important}.ch-mob{display:flex!important}}`}</style>
    </nav>
  );
}

// ── Stats strip ────────────────────────────────────────────────────────────────
function StatsStrip({ done }) {
  const xp     = done.size * XP_PER;
  const earned = WEEKS.filter(w => w.challenges.every(c => done.has(c.day))).length;
  const pct    = Math.min(100, (xp / TOTAL_XP) * 100);
  return (
    <div style={{background:T.creamWarm,borderBottom:`1px solid ${T.creamMid}`,padding:"20px 40px",display:"flex",alignItems:"center",justifyContent:"center",gap:40,flexWrap:"wrap"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:36,height:36,borderRadius:"50%",border:`2px solid ${T.gold}`,color:T.gold,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🔥</div>
        <div>
          <div style={{fontFamily:serif,fontSize:22,fontWeight:700,color:T.brownText,lineHeight:1}}>{done.size}</div>
          <div style={{fontSize:11,color:T.brownLight,fontWeight:300}}>day streak</div>
        </div>
      </div>
      <div style={{flex:1,maxWidth:360,minWidth:200}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
          <span style={{fontWeight:500,color:T.brownText}}>Progress</span>
          <span style={{color:T.gold,fontWeight:500}}>{xp} / {TOTAL_XP} XP</span>
        </div>
        <div style={{height:10,background:T.creamMid,borderRadius:10,overflow:"hidden"}}>
          <div style={{height:"100%",borderRadius:10,background:`linear-gradient(90deg,${T.redDeep},${T.gold})`,width:`${pct}%`,transition:"width 0.5s"}}/>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:36,height:36,borderRadius:"50%",border:`2px solid ${T.gold}`,color:T.gold,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>🏅</div>
        <div>
          <div style={{fontFamily:serif,fontSize:22,fontWeight:700,color:T.brownText,lineHeight:1}}>{earned} / 4</div>
          <div style={{fontSize:11,color:T.brownLight,fontWeight:300}}>Badges earned</div>
        </div>
      </div>
    </div>
  );
}

// ── Week card ──────────────────────────────────────────────────────────────────
function WeekCard({ w, status, done, onOpenModal }) {
  const [open, setOpen] = useState(status === "current");

  const cardBg     = status==="done" ? T.gold     : status==="locked" ? T.creamWarm : T.goldPale;
  const cardBorder = status==="done" ? T.gold     : status==="locked" ? T.creamMid  : T.goldLight;
  const weekColor  = status==="done" ? T.redDeep  : status==="locked" ? T.brownLight: T.gold;
  const titleColor = status==="done" ? T.redDeep  : status==="locked" ? T.brownLight: T.brownText;

  return (
    <div
      onClick={status!=="locked" ? ()=>setOpen(o=>!o) : undefined}
      style={{
        background:cardBg,border:`2px solid ${cardBorder}`,borderRadius:16,
        padding:"22px 20px",display:"inline-block",textAlign:"left",
        position:"relative",maxWidth:320,width:"100%",
        cursor:status!=="locked"?"pointer":"default",
        transition:"transform 0.2s ease",
        opacity:status==="locked"?0.6:1,
      }}
      onMouseEnter={e=>{ if(status!=="locked") e.currentTarget.style.transform="translateY(-2px)"; }}
      onMouseLeave={e=>{ e.currentTarget.style.transform="none"; }}
    >
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
        <span style={{fontSize:11,fontWeight:500,color:weekColor,letterSpacing:"0.06em"}}>Week {w.week}</span>
        {status!=="locked" && (
          <svg style={{width:20,height:20,color:weekColor,transition:"transform 0.3s",transform:open?"rotate(180deg)":"none",flexShrink:0}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        )}
      </div>
      <div style={{fontFamily:serif,fontSize:22,fontWeight:700,color:titleColor,lineHeight:1.2,marginBottom:2}}>{w.title}</div>

      {status==="done" && (
        <div style={{display:"inline-flex",alignItems:"center",gap:5,marginTop:8,fontSize:11,fontWeight:500,color:T.redDeep,background:"rgba(122,14,30,0.12)",padding:"4px 12px",borderRadius:100}}>
          🏅 Badge Earned
        </div>
      )}

      {open && status!=="locked" && (
        <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:8}}>
          {w.challenges.map((c, ci) => {
            const cDone = done.has(c.day);
            const isNext = !cDone && !w.challenges.slice(0, ci).some(cc => !done.has(cc.day));
            return (
              <div key={c.day}>
                {isNext && (
                  <div style={{background:T.gold,color:T.redDeep,borderRadius:8,padding:"10px 14px",textAlign:"center",fontSize:12,fontWeight:500,marginBottom:4}}>
                    Your next step is ready — let's keep going.
                  </div>
                )}
                <div
                  onClick={e=>{e.stopPropagation();onOpenModal(c.day);}}
                  style={{
                    background: isNext ? T.goldPale : (cDone ? "transparent" : T.creamWarm),
                    border:`1px solid ${isNext ? T.gold : T.creamMid}`,
                    borderRadius:10,padding:"12px 14px",
                    fontSize:13,fontWeight:400,
                    color: cDone ? T.brownMuted : T.brownText,
                    textDecoration: cDone ? "line-through" : "none",
                    opacity: cDone ? 0.6 : 1,
                    cursor:"pointer",transition:"all 0.2s",
                  }}
                  onMouseEnter={e=>{if(!cDone){e.currentTarget.style.borderColor=T.goldLight;e.currentTarget.style.background="#fff";}}}
                  onMouseLeave={e=>{if(!cDone){e.currentTarget.style.borderColor=isNext?T.gold:T.creamMid;e.currentTarget.style.background=isNext?T.goldPale:T.creamWarm;}}}
                >
                  {c.t}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Timeline ───────────────────────────────────────────────────────────────────
function Timeline({ done, onOpenModal }) {
  return (
    <section style={{position:"relative",maxWidth:900,margin:"0 auto",padding:"60px 24px 40px"}}>
      <div className="ch-tl-line" style={{position:"absolute",left:"50%",top:0,bottom:0,width:3,background:T.goldLight,transform:"translateX(-50%)"}}/>
      <style>{`
        @keyframes ch-pulse{0%,100%{box-shadow:0 0 0 0 rgba(201,160,60,0.3)}50%{box-shadow:0 0 0 16px rgba(201,160,60,0)}}
        @media(max-width:768px){
          .ch-tl-line{left:24px!important;transform:none!important}
          .ch-week-wrap{width:100%!important;padding-left:80px!important;padding-right:0!important;text-align:left!important;margin-left:0!important;margin-right:0!important}
          .ch-milestone{left:24px!important;transform:none!important}
          .ch-ms-circle{width:56px!important;height:56px!important}
          .ch-ms-icon{font-size:18px!important}
          .ch-ms-label{font-size:8px!important}
        }
      `}</style>

      {WEEKS.map((w, wi) => {
        const status = weekStatus(w, done);
        const isLeft = wi % 2 !== 0; // even indices go right, odd go left

        const mcBg     = status==="done"    ? T.gold     : status==="current" ? T.goldPale : T.creamMid;
        const mcBorder = status==="done"    ? T.redDeep  : status==="current" ? T.gold     : T.creamMid;
        const mcAnim   = status==="current" ? "ch-pulse 2s ease-in-out infinite" : "none";
        const mcIcon   = status==="done"    ? "✔"       : status==="current"  ? "✨"        : "🔒";
        const mcLabel  = status==="done"    ? "Done ✓"  : `Week ${w.week}`;
        const mcLblClr = status==="locked"  ? T.brownLight : T.redDeep;

        return (
          <div key={w.week} style={{position:"relative",display:"flex",alignItems:"flex-start",marginBottom: wi < WEEKS.length-1 ? 60 : 20}}>

            {/* Milestone */}
            <div className="ch-milestone" style={{position:"absolute",left:"50%",top:0,transform:"translateX(-50%)",zIndex:2}}>
              <div className="ch-ms-circle" style={{width:100,height:100,borderRadius:"50%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",border:`4px solid ${mcBorder}`,background:mcBg,animation:mcAnim,position:"relative"}}>
                <span className="ch-ms-icon" style={{fontSize:28,lineHeight:1}}>{mcIcon}</span>
                <span className="ch-ms-label" style={{fontSize:10,fontWeight:600,color:mcLblClr,marginTop:2,letterSpacing:"0.04em"}}>{mcLabel}</span>
              </div>
              {status!=="locked" && (
                <>
                  <span style={{position:"absolute",top:-8,left:-12,color:T.goldShimmer,fontSize:14,pointerEvents:"none"}}>✦</span>
                  <span style={{position:"absolute",top:-6,right:-14,color:T.goldShimmer,fontSize:14,pointerEvents:"none"}}>✧</span>
                  <span style={{position:"absolute",bottom:-8,left:-10,color:T.goldShimmer,fontSize:14,pointerEvents:"none"}}>✦</span>
                  <span style={{position:"absolute",bottom:-4,right:-12,color:T.goldShimmer,fontSize:14,pointerEvents:"none"}}>✧</span>
                </>
              )}
            </div>

            {/* Week card — alternating left/right */}
            <div
              className="ch-week-wrap"
              style={isLeft
                ? {marginRight:"auto",paddingRight:60,textAlign:"right",width:"45%"}
                : {marginLeft:"auto",paddingLeft:60,textAlign:"left",width:"45%"}
              }
            >
              <WeekCard w={w} status={status} done={done} onOpenModal={onOpenModal}/>
            </div>
          </div>
        );
      })}
    </section>
  );
}

// ── Badges ─────────────────────────────────────────────────────────────────────
function Badges({ done }) {
  return (
    <section style={{padding:"60px 24px",textAlign:"center"}}>
      <div style={{fontFamily:serif,fontSize:30,fontWeight:700,color:T.brownText,marginBottom:32}}>Your Badge Collection</div>
      <div style={{display:"flex",justifyContent:"center",gap:40,flexWrap:"wrap",maxWidth:700,margin:"0 auto"}}>
        {BADGE_DATA.map((b,i) => {
          const earned = WEEKS[i].challenges.every(c => done.has(c.day));
          return (
            <div key={b.name} style={{textAlign:"center",width:120}}>
              <div
                style={{width:90,height:90,borderRadius:"50%",margin:"0 auto 10px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,transition:"transform 0.2s",cursor:"default",background:earned?`linear-gradient(145deg,${T.gold},#8B6914)`:T.creamMid,boxShadow:earned?`0 4px 16px rgba(201,160,60,0.3)`:"none"}}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"}
                onMouseLeave={e=>e.currentTarget.style.transform=""}
              >
                {earned ? b.icon : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={T.brownLight} strokeWidth="1.5">
                    <rect x="5" y="11" width="14" height="10" rx="2"/>
                    <path d="M8 11V7a4 4 0 1 1 8 0v4"/>
                  </svg>
                )}
              </div>
              <div style={{fontSize:12,fontWeight:600,marginBottom:2,color:earned?T.gold:T.brownLight}}>{b.name}</div>
              <div style={{fontSize:10,color:T.brownLight,fontWeight:300}}>{b.sub}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────────
function Modal({ day, done, onComplete, onClose }) {
  const challenge = WEEKS.flatMap(w => w.challenges).find(c => c.day === day);
  if (!challenge) return null;
  const isDone = done.has(day);

  return (
    <div
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}
      style={{display:"flex",position:"fixed",inset:0,zIndex:200,background:"rgba(61,43,31,0.4)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",alignItems:"center",justifyContent:"center",padding:24}}
    >
      <div style={{background:T.cream,borderRadius:20,width:"100%",maxWidth:420,padding:"32px 28px",position:"relative",animation:"ch-fadeUp 0.3s ease"}}>
        <style>{`@keyframes ch-fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

        <button
          onClick={onClose}
          style={{position:"absolute",top:14,right:14,width:32,height:32,borderRadius:"50%",border:`1.5px solid ${T.redMid}`,background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:T.redMid,fontSize:18,fontWeight:300,lineHeight:1,transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.background=T.redMid;e.currentTarget.style.color="#fff";}}
          onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.redMid;}}
        >
          ×
        </button>

        <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:T.redMid,marginBottom:6}}>Day {challenge.day}</div>
        <div style={{fontFamily:serif,fontSize:24,fontWeight:600,color:T.brownText,marginBottom:8}}>{challenge.t}</div>
        <div style={{fontSize:14,fontWeight:300,color:T.brownMuted,lineHeight:1.6,marginBottom:20}}>{challenge.why}</div>

        <div style={{background:T.goldPale,borderRadius:12,padding:"14px 16px",marginBottom:20}}>
          <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",color:T.redMid,marginBottom:4}}>Pro tip</div>
          <div style={{fontSize:13,fontWeight:300,color:T.brownText,lineHeight:1.5}}>{challenge.tip}</div>
        </div>

        {isDone ? (
          <div style={{width:"100%",padding:16,borderRadius:100,background:T.greenPale,color:T.green,fontFamily:sans,fontSize:14,fontWeight:500,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>Completed
          </div>
        ) : (
          <button
            onClick={()=>onComplete(day)}
            style={{width:"100%",fontFamily:sans,fontSize:14,fontWeight:500,padding:16,border:"none",borderRadius:100,background:`linear-gradient(135deg,${T.redDeep},${T.redMid})`,color:"#fff",cursor:"pointer",transition:"transform 0.2s,box-shadow 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(122,14,30,0.2)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}
          >
            Mark as Complete
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export function ChallengePage({ onNavigate }) {
  const [done, setDone]         = useState(new Set());
  const [modalDay, setModalDay] = useState(null);

  const completeDay = day => {
    setDone(prev => new Set([...prev, day]));
    setModalDay(null);
  };

  return (
    <div style={{fontFamily:sans,background:T.cream,minHeight:"100vh"}}>
      <Navbar onNavigate={onNavigate}/>

      {/* Hero */}
      <div style={{background:T.redDeep,padding:"100px 24px 56px",textAlign:"center"}}>
        <h1 style={{fontFamily:serif,fontSize:"clamp(30px,5vw,46px)",fontWeight:500,fontStyle:"italic",color:T.goldLight,marginBottom:10}}>Your 4-Week Curl Journey</h1>
        <p style={{fontSize:15,fontWeight:300,color:"rgba(255,255,255,0.7)",maxWidth:460,margin:"0 auto"}}>Small steps. Real results. Your curls will thank you.</p>
      </div>

      <StatsStrip done={done}/>
      <Timeline done={done} onOpenModal={setModalDay}/>
      <Badges done={done}/>

      {/* Motivational footer */}
      <div style={{background:T.redDeep,padding:"64px 24px",textAlign:"center"}}>
        <div style={{color:T.gold,fontSize:40,marginBottom:16}}>✨</div>
        <div style={{fontFamily:serif,fontSize:"clamp(26px,4vw,36px)",fontWeight:700,fontStyle:"italic",color:"#fff",marginBottom:10}}>You're doing amazing!</div>
        <p style={{fontSize:15,fontWeight:300,color:"rgba(255,255,255,0.7)",maxWidth:460,margin:"0 auto"}}>Keep showing up for your curls. Every step counts.</p>
      </div>

      {/* Footer */}
      <footer style={{padding:"36px 40px",borderTop:`1px solid ${T.creamMid}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <span style={{fontFamily:serif,fontSize:20,fontWeight:600,fontStyle:"italic",background:`linear-gradient(135deg,${T.gold},${T.goldLight})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>pelora</span>
        <p style={{fontSize:12,color:T.brownLight,fontWeight:300}}>Built for waves, curls, coils & all textures in between.</p>
        <p style={{fontSize:12,color:T.brownLight}}>© 2026 Pelora</p>
      </footer>

      {modalDay !== null && (
        <Modal day={modalDay} done={done} onComplete={completeDay} onClose={()=>setModalDay(null)}/>
      )}
    </div>
  );
}
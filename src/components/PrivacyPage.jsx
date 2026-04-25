// src/components/PrivacyPage.jsx

import { useState, useEffect } from "react";
import { Navbar } from "./Navbar";

const T = {
  redDeep:    "#7A0E1E",
  redMid:     "#9B1B30",
  redSoft:    "#C4485A",
  redFaint:   "#F5D5D8",
  cream:      "#FDFAF4",
  creamWarm:  "#F8F2E8",
  creamMid:   "#EFE6D6",
  brownText:  "#3D2B1F",
  brownMuted: "#5C4A3A",
  brownLight: "#7A6858",
};
const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'DM Sans', system-ui, sans-serif";

// ── Table of contents ─────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "s1", label: "Information We Collect" },
  { id: "s2", label: "How We Use Your Information" },
  { id: "s3", label: "Who We Share Information With" },
  { id: "s4", label: "Data Retention" },
  { id: "s5", label: "Your Privacy Rights" },
  { id: "s6", label: "Age Requirement" },
  { id: "s7", label: "International Users" },
  { id: "s8", label: "Changes to This Policy" },
  { id: "s9", label: "Contact Us" },
];

function TOC({ active }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <aside style={{position:"sticky",top:100,alignSelf:"flex-start",width:220,flexShrink:0}} className="pel-toc">
      <div style={{fontSize:10,fontWeight:500,letterSpacing:"0.16em",textTransform:"uppercase",color:T.redMid,marginBottom:14}}>Contents</div>
      <nav>
        {SECTIONS.map((s, i) => (
          <button key={s.id} onClick={() => scrollTo(s.id)} style={{display:"block",width:"100%",textAlign:"left",background:"none",border:"none",cursor:"pointer",fontFamily:sans,fontSize:13,color:active===s.id?T.redMid:T.brownMuted,fontWeight:active===s.id?500:400,padding:"7px 0 7px 12px",borderLeft:`2px solid ${active===s.id?T.redMid:T.creamMid}`,lineHeight:1.4,transition:"all 0.2s",marginBottom:2}}
            onMouseEnter={e => { if (active !== s.id) e.currentTarget.style.color = T.brownText; }}
            onMouseLeave={e => { if (active !== s.id) e.currentTarget.style.color = T.brownMuted; }}>
            <span style={{color:T.brownLight,marginRight:6,fontSize:11}}>{String(i+1).padStart(2,"0")}</span>{s.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function Section({ id, number, title, children }) {
  return (
    <section id={id} style={{marginBottom:56,scrollMarginTop:100}}>
      <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:16}}>
        <span style={{fontFamily:serif,fontSize:13,fontWeight:400,fontStyle:"italic",color:T.redMid,opacity:0.7,flexShrink:0}}>{number}.</span>
        <h2 style={{fontFamily:serif,fontSize:"clamp(20px,2.5vw,26px)",fontWeight:500,color:T.brownText,lineHeight:1.2,margin:0}}>{title}</h2>
      </div>
      <div style={{paddingLeft:28,borderLeft:`2px solid ${T.creamMid}`,fontSize:15,fontWeight:400,color:T.brownMuted,lineHeight:1.8}}>
        {children}
      </div>
    </section>
  );
}

function Callout({ icon, title, children, accent }) {
  return (
    <div style={{background:accent?T.redFaint:"#fff",border:`1px solid ${accent?T.redMid:T.creamMid}`,borderRadius:14,padding:"20px 22px",marginBottom:16,display:"flex",gap:14,alignItems:"flex-start"}}>
      <span style={{fontSize:20,flexShrink:0,marginTop:2}}>{icon}</span>
      <div>
        {title&&<div style={{fontFamily:sans,fontSize:13,fontWeight:600,color:T.brownText,marginBottom:6}}>{title}</div>}
        <div style={{fontSize:14,color:T.brownMuted,lineHeight:1.7}}>{children}</div>
      </div>
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul style={{margin:"12px 0",padding:0,listStyle:"none"}}>
      {items.map((item, i) => (
        <li key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:T.redMid,flexShrink:0,marginTop:8}}/>
          <span style={{fontSize:15,color:T.brownMuted,lineHeight:1.75}}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function PrivacyPage({ onNavigate }) {
  const [activeSection, setActiveSection] = useState("s1");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(entry => { if (entry.isIntersecting) setActiveSection(entry.target.id); }); },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    SECTIONS.forEach(s => { const el = document.getElementById(s.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{fontFamily:sans,background:T.cream,minHeight:"100vh"}}>
      <style>{`
        @keyframes pel-fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:900px){.pel-toc{display:none!important}}
        a{color:${T.redMid};text-underline-offset:3px;}
        a:hover{color:${T.redDeep};}
      `}</style>

      <Navbar onNavigate={onNavigate} activeScreen="privacy" />

      {/* Hero */}
      <div style={{paddingTop:40,background:`linear-gradient(180deg,${T.creamWarm} 0%,${T.cream} 100%)`,borderBottom:`1px solid ${T.creamMid}`}}>
        <div style={{maxWidth:860,margin:"0 auto",padding:"60px 40px 48px"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:11,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:T.redDeep,background:T.redFaint,padding:"7px 18px",borderRadius:100,marginBottom:20,animation:"pel-fadeUp 0.5s ease both"}}>
            Legal
          </div>
          <h1 style={{fontFamily:serif,fontSize:"clamp(36px,5vw,58px)",fontWeight:500,lineHeight:1.1,color:T.brownText,marginBottom:16,animation:"pel-fadeUp 0.6s ease 0.1s both"}}>
            Privacy{" "}
            <em style={{fontStyle:"italic",background:`linear-gradient(135deg,${T.redDeep},${T.redMid})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Policy</em>
          </h1>
          <p style={{fontSize:15,color:T.brownMuted,lineHeight:1.7,maxWidth:560,marginBottom:24,animation:"pel-fadeUp 0.6s ease 0.2s both"}}>
            We built Pelora to help you understand your curls — not to collect your data. Pelora doesn't require an account, doesn't collect photos, and doesn't store your results. Here's exactly what we do gather and the rights you have over it.
          </p>
          <div style={{display:"flex",gap:24,flexWrap:"wrap",fontSize:13,color:T.brownLight,animation:"pel-fadeUp 0.6s ease 0.3s both"}}>
            <span>Effective: <strong style={{color:T.brownText}}>April 18, 2026</strong></span>
            <span>·</span>
            <span>Questions? <a href="mailto:agutie19@syr.edu">agutie19@syr.edu</a></span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"64px 40px 80px",display:"flex",gap:64,alignItems:"flex-start"}}>
        <TOC active={activeSection}/>
        <article style={{flex:1,minWidth:0}}>

          <Section id="s1" number="01" title="Information We Collect">
            <p style={{marginBottom:16}}>We collect only what's needed to generate your personalized hair profile and recommendations.</p>
            <p style={{fontFamily:sans,fontSize:13,fontWeight:600,color:T.brownText,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.1em"}}>Information You Provide Directly</p>
            <BulletList items={[
              "Quiz responses, including your curl goals, hair density, porosity, damage history, current routine, and scalp condition.",
              "Your self-selected curl type from our visual hair type selector.",
            ]}/>
            <p style={{fontFamily:sans,fontSize:13,fontWeight:600,color:T.brownText,marginBottom:8,marginTop:20,textTransform:"uppercase",letterSpacing:"0.1em"}}>Information Collected Automatically</p>
            <BulletList items={[
              "Approximate location inferred from your IP address (city or region level only, not precise GPS) — collected by our hosting provider, Netlify.",
            ]}/>
            <p style={{fontFamily:sans,fontSize:13,fontWeight:600,color:T.brownText,marginBottom:8,marginTop:20,textTransform:"uppercase",letterSpacing:"0.1em"}}>Information We Do Not Collect</p>
            <BulletList items={[
              "We do not collect photos, facial images, or any biometric data.",
              "We do not collect precise GPS location.",
              "We do not collect government ID numbers, payment card information, or health records.",
              "We do not create or store accounts — your results exist only in your browser session.",
            ]}/>
          </Section>

          <Section id="s2" number="02" title="How We Use Your Information">
            <BulletList items={[
              "To generate your curl profile, product recommendations, and routine suggestions based on your quiz answers.",
              "To operate, maintain, and improve the Pelora service.",
              "To debug, troubleshoot, and secure the service against fraud and abuse.",
              "To understand how the service performs in aggregate, using anonymized data.",
              "To comply with legal obligations and enforce our Terms of Service.",
            ]}/>
            <div style={{marginTop:20,padding:"16px 20px",borderRadius:12,background:"#fff",border:`1px solid ${T.creamMid}`,display:"flex",gap:10,alignItems:"flex-start"}}>
              <span style={{fontSize:18}}>🔒</span>
              <p style={{margin:0,fontSize:14,color:T.brownMuted,lineHeight:1.7}}>
                <strong style={{color:T.brownText}}>We do not sell your personal information.</strong> We do not use your data for advertising. Pelora is ad-free.
              </p>
            </div>
          </Section>

          <Section id="s3" number="03" title="Who We Share Information With">
            <p style={{fontFamily:sans,fontSize:13,fontWeight:600,color:T.brownText,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.1em"}}>Infrastructure Providers</p>
            <BulletList items={[
              "Netlify — our website hosting provider, which handles site delivery and basic traffic logs per their own privacy policy.",
            ]}/>
            <p style={{fontFamily:sans,fontSize:13,fontWeight:600,color:T.brownText,marginBottom:10,marginTop:20,textTransform:"uppercase",letterSpacing:"0.1em"}}>Legal and Safety Disclosures</p>
            <p style={{marginBottom:20}}>We may disclose information if required by law, court order, or government request, or if we believe in good faith that disclosure is necessary to protect our rights or the safety of others.</p>
            <p style={{fontFamily:sans,fontSize:13,fontWeight:600,color:T.brownText,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.1em"}}>What We Never Do</p>
            <BulletList items={[
              "We never sell your personal information to advertisers or data brokers.",
              "We never share your quiz answers or curl profile publicly without your explicit permission.",
            ]}/>
          </Section>

          <Section id="s4" number="04" title="Data Retention">
            <p style={{marginBottom:16}}>Pelora is designed to be session-only by default:</p>
            <BulletList items={[
              "Quiz responses and curl profile results: Not stored on Pelora's servers. Your results live only in your browser session while you're using the service. Once you close the tab or end the session, they are gone.",
              "Website traffic logs (via Netlify): Retained by Netlify according to their own data practices, typically for a short period for security and performance purposes.",
            ]}/>
            <Callout icon="✅" title="No account required, no data stored">
              Because Pelora doesn't require you to create an account or upload photos, there's very little personal data for us to hold onto. Your curl profile exists only on your device during your session.
            </Callout>
          </Section>

          <Section id="s5" number="05" title="Your Privacy Rights">
            <p style={{marginBottom:16}}>You have meaningful control over your data. Because Pelora does not require an account and does not store your quiz answers or results on our servers, most of your data lives only in your own browser session — you can clear it at any time by closing your browser or clearing your site data.</p>
            <p style={{marginBottom:16}}>If privacy laws in your region give you additional rights, those rights still apply to any information we do hold:</p>
            <BulletList items={[
              "Right to access — request a copy of the personal information we hold about you.",
              "Right to correct — ask us to fix inaccurate or incomplete information.",
              "Right to delete — request that we delete your data.",
              "Right to opt out — withdraw consent for optional data uses.",
              "Right to portability — request your data in a portable, machine-readable format.",
              "Right to non-discrimination — we will not treat you differently for exercising any of these rights.",
            ]}/>
            <Callout icon="⚖️" title="California, EU & UK Users">
              If you are in California (CCPA/CPRA), the European Union or United Kingdom (GDPR), or another jurisdiction with specific privacy laws, you have additional rights under those laws, including the right to lodge a complaint with your local data protection authority.
            </Callout>
            <p>To exercise any of these rights, email us at <a href="mailto:agutie19@syr.edu">agutie19@syr.edu</a>. We will respond within 30 days.</p>
          </Section>

          <Section id="s6" number="06" title="Age Requirement">
            <p style={{marginBottom:16}}>Pelora is intended for users who are <strong style={{color:T.brownText}}>13 years of age or older.</strong> By using the service, you represent that you meet this requirement.</p>
            <p style={{marginBottom:16}}>We do not knowingly collect personal information from children under 13. If you are under 13, please do not use Pelora or submit any information to us. If we become aware that we have collected information from a child under 13, we will delete it promptly.</p>
            <p>If you are a parent or guardian and believe a child under 13 has used our service, please contact us at <a href="mailto:agutie19@syr.edu">agutie19@syr.edu</a>.</p>
          </Section>

          <Section id="s7" number="07" title="International Users">
            <p>Pelora is operated from the United States. If you access the service from outside the U.S., your information may be transferred to, stored, and processed in the United States or other countries where our service providers (including Netlify) operate. These countries may have data protection laws that differ from those in your home country.</p>
          </Section>

          <Section id="s8" number="08" title="Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. When we do, we will update the Effective Date at the top of this document and, for material changes, notify you through the service or by email. Your continued use of Pelora after changes are posted means you accept the updated policy.</p>
          </Section>

          <Section id="s9" number="09" title="Contact Us">
            <p style={{marginBottom:20}}>If you have any questions, concerns, or requests about this Privacy Policy or how your information is handled, please reach out:</p>
            <div style={{background:"#fff",border:`1px solid ${T.creamMid}`,borderRadius:16,padding:"28px",display:"inline-flex",flexDirection:"column",gap:8}}>
              <div style={{fontSize:14,color:T.brownMuted}}><span style={{fontWeight:500,color:T.brownText}}>Email: </span><a href="mailto:agutie19@syr.edu">agutie19@syr.edu</a></div>
              <div style={{fontSize:14,color:T.brownMuted}}><span style={{fontWeight:500,color:T.brownText}}>Location: </span>Syracuse, New York, USA</div>
            </div>
          </Section>

          <div style={{marginTop:16,textAlign:"center"}}>
            <button onClick={() => window.scrollTo({top:0,behavior:"smooth"})} style={{display:"inline-flex",alignItems:"center",gap:6,fontFamily:sans,fontSize:13,fontWeight:400,color:T.brownMuted,background:"none",border:"none",cursor:"pointer",textDecoration:"underline",textUnderlineOffset:3}}>
              ↑ Back to top
            </button>
          </div>
        </article>
      </div>

      <footer style={{padding:"36px 40px",borderTop:`1px solid ${T.creamMid}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <span style={{fontFamily:serif,fontSize:20,fontWeight:600,fontStyle:"italic",background:`linear-gradient(135deg,${T.redMid},${T.redSoft})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>pelora</span>
        <p style={{fontSize:12,color:T.brownLight,fontWeight:400}}>Built for waves, curls, coils &amp; all textures in between.</p>
        <p style={{fontSize:12,color:T.brownLight,fontWeight:400}}>© 2026 Pelora</p>
      </footer>
    </div>
  );
}
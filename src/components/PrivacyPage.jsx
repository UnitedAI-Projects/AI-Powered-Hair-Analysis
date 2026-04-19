// src/components/PrivacyPage.jsx
// Pelora Privacy Policy page — matches site design system exactly
// Add to App.jsx routing: if(screen==="privacy") return <PrivacyPage onNavigate={handleNavigate}/>

import { useState, useEffect } from "react";

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

// ── Navbar (matches site pattern) ─────────────────────────────────────────────
function Navbar({ onNavigate }) {
  const [mob, setMob] = useState(false);
  const NAV = [
    { label: "Home",       screen: "landing"   },
    { label: "My Results", screen: "results"   },
    { label: "Challenge",  screen: "challenge" },
    { label: "Tutorials",  screen: "tutorials" },
    { label: "Products",   screen: "products"  },
  ];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "18px 40px",
      background: "rgba(253,250,244,0.95)",
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(201,160,60,0.15)",
    }}>
      <button onClick={() => onNavigate("landing")} style={{ border: "none", cursor: "pointer", padding: 0, background: "none" }}>
        <span style={{
          fontFamily: serif, fontSize: 26, fontWeight: 600, fontStyle: "italic",
          background: `linear-gradient(135deg,${T.redMid},${T.redSoft})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>Pelora</span>
      </button>
      <ul style={{ display: "flex", gap: 28, listStyle: "none", margin: 0, padding: 0 }} className="pel-desk">
        {NAV.map(n => (
          <li key={n.screen}>
            <button onClick={() => onNavigate(n.screen)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: sans, fontSize: 13, color: T.brownMuted,
              fontWeight: 400, letterSpacing: "0.06em", transition: "color 0.3s",
            }}
              onMouseEnter={e => e.currentTarget.style.color = T.redMid}
              onMouseLeave={e => e.currentTarget.style.color = T.brownMuted}>
              {n.label}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => onNavigate("quiz")} className="pel-desk" style={{
        fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase",
        padding: "10px 24px", border: `1.5px solid ${T.redMid}`, borderRadius: 100,
        background: "transparent", color: T.redMid, cursor: "pointer", fontFamily: sans, transition: "all 0.3s",
      }}
        onMouseEnter={e => { e.currentTarget.style.background = T.redMid; e.currentTarget.style.color = T.cream; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.redMid; }}>
        Take the Quiz
      </button>
      <button className="pel-mob" onClick={() => setMob(o => !o)} style={{
        display: "none", background: "none", border: "none", cursor: "pointer",
        padding: 8, flexDirection: "column", gap: 5,
      }}>
        {[0, 1, 2].map(i => <div key={i} style={{ width: 22, height: 1.5, background: T.brownText, borderRadius: 2 }} />)}
      </button>
      {mob && (
        <div style={{
          position: "fixed", top: 61, left: 0, right: 0,
          background: "rgba(253,250,244,0.98)", backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${T.creamMid}`,
          display: "flex", flexDirection: "column", padding: "12px 0", zIndex: 99,
        }}>
          {NAV.map(n => (
            <button key={n.screen} onClick={() => { onNavigate(n.screen); setMob(false); }} style={{
              padding: "14px 32px", textAlign: "left", background: "none",
              border: "none", cursor: "pointer", fontFamily: sans, fontSize: 15, color: T.brownText,
            }}>{n.label}</button>
          ))}
        </div>
      )}
      <style>{`@media(max-width:768px){.pel-desk{display:none!important}.pel-mob{display:flex!important}}`}</style>
    </nav>
  );
}

// ── Table of contents ─────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "s1",  label: "Information We Collect" },
  { id: "s2",  label: "How Your Photos Are Handled" },
  { id: "s3",  label: "How We Use Your Information" },
  { id: "s4",  label: "Who We Share Information With" },
  { id: "s5",  label: "Data Retention" },
  { id: "s6",  label: "Your Privacy Rights" },
  { id: "s7",  label: "Age Requirement" },
  { id: "s8",  label: "International Users" },
  { id: "s9",  label: "Changes to This Policy" },
  { id: "s10", label: "Contact Us" },
];

function TOC({ active }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <aside style={{
      position: "sticky", top: 100, alignSelf: "flex-start",
      width: 220, flexShrink: 0,
    }} className="pel-toc">
      <div style={{
        fontSize: 10, fontWeight: 500, letterSpacing: "0.16em",
        textTransform: "uppercase", color: T.redMid, marginBottom: 14,
      }}>Contents</div>
      <nav>
        {SECTIONS.map((s, i) => (
          <button key={s.id} onClick={() => scrollTo(s.id)} style={{
            display: "block", width: "100%", textAlign: "left",
            background: "none", border: "none", cursor: "pointer",
            fontFamily: sans, fontSize: 13,
            color: active === s.id ? T.redMid : T.brownMuted,
            fontWeight: active === s.id ? 500 : 400,
            padding: "7px 0 7px 12px",
            borderLeft: `2px solid ${active === s.id ? T.redMid : T.creamMid}`,
            lineHeight: 1.4, transition: "all 0.2s",
            marginBottom: 2,
          }}
            onMouseEnter={e => { if (active !== s.id) e.currentTarget.style.color = T.brownText; }}
            onMouseLeave={e => { if (active !== s.id) e.currentTarget.style.color = T.brownMuted; }}>
            <span style={{ color: T.brownLight, marginRight: 6, fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</span>
            {s.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ id, number, title, children }) {
  return (
    <section id={id} style={{ marginBottom: 56, scrollMarginTop: 100 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
        <span style={{
          fontFamily: serif, fontSize: 13, fontWeight: 400, fontStyle: "italic",
          color: T.redMid, opacity: 0.7, flexShrink: 0,
        }}>{number}.</span>
        <h2 style={{
          fontFamily: serif, fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 500,
          color: T.brownText, lineHeight: 1.2, margin: 0,
        }}>{title}</h2>
      </div>
      <div style={{
        paddingLeft: 28, borderLeft: `2px solid ${T.creamMid}`,
        fontSize: 15, fontWeight: 400, color: T.brownMuted, lineHeight: 1.8,
      }}>
        {children}
      </div>
    </section>
  );
}

// ── Callout box ───────────────────────────────────────────────────────────────
function Callout({ icon, title, children, accent }) {
  return (
    <div style={{
      background: accent ? T.redFaint : "#fff",
      border: `1px solid ${accent ? T.redMid : T.creamMid}`,
      borderRadius: 14, padding: "20px 22px", marginBottom: 16,
      display: "flex", gap: 14, alignItems: "flex-start",
    }}>
      <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{icon}</span>
      <div>
        {title && <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: T.brownText, marginBottom: 6 }}>{title}</div>}
        <div style={{ fontSize: 14, color: T.brownMuted, lineHeight: 1.7 }}>{children}</div>
      </div>
    </div>
  );
}

// ── Bullet list ───────────────────────────────────────────────────────────────
function BulletList({ items }) {
  return (
    <ul style={{ margin: "12px 0", padding: 0, listStyle: "none" }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%", background: T.redMid,
            flexShrink: 0, marginTop: 8,
          }} />
          <span style={{ fontSize: 15, color: T.brownMuted, lineHeight: 1.75 }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function PrivacyPage({ onNavigate }) {
  const [activeSection, setActiveSection] = useState("s1");

  // Track scroll position to highlight active TOC item
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ fontFamily: sans, background: T.cream, minHeight: "100vh" }}>
      <style>{`
        @keyframes pel-fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:900px){.pel-toc{display:none!important}}
        @media(max-width:768px){.pel-desk{display:none!important}.pel-mob{display:flex!important}}
        a{color:${T.redMid};text-underline-offset:3px;}
        a:hover{color:${T.redDeep};}
      `}</style>

      <Navbar onNavigate={onNavigate} />

      {/* Hero */}
      <div style={{
        paddingTop: 100,
        background: `linear-gradient(180deg, ${T.creamWarm} 0%, ${T.cream} 100%)`,
        borderBottom: `1px solid ${T.creamMid}`,
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "60px 40px 48px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 11, fontWeight: 500, letterSpacing: "0.14em",
            textTransform: "uppercase", color: T.redDeep,
            background: T.redFaint, padding: "7px 18px", borderRadius: 100,
            marginBottom: 20, animation: "pel-fadeUp 0.5s ease both",
          }}>
            Legal
          </div>
          <h1 style={{
            fontFamily: serif, fontSize: "clamp(36px,5vw,58px)", fontWeight: 500,
            lineHeight: 1.1, color: T.brownText, marginBottom: 16,
            animation: "pel-fadeUp 0.6s ease 0.1s both",
          }}>
            Privacy{" "}
            <em style={{
              fontStyle: "italic",
              background: `linear-gradient(135deg,${T.redDeep},${T.redMid})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Policy</em>
          </h1>
          <p style={{
            fontSize: 15, color: T.brownMuted, lineHeight: 1.7, maxWidth: 560,
            marginBottom: 24, animation: "pel-fadeUp 0.6s ease 0.2s both",
          }}>
            We built Pelora to help you understand your curls — not to collect your data. Here's exactly what we gather, how we use it, and the rights you have over it.
          </p>
          <div style={{
            display: "flex", gap: 24, flexWrap: "wrap",
            fontSize: 13, color: T.brownLight,
            animation: "pel-fadeUp 0.6s ease 0.3s both",
          }}>
            <span>Effective: <strong style={{ color: T.brownText }}>April 18, 2026</strong></span>
            <span>·</span>
            <span>Questions? <a href="mailto:agutie19@syr.edu">agutie19@syr.edu</a></span>
          </div>
        </div>
      </div>

      {/* Body: TOC + content */}
      <div style={{
        maxWidth: 1100, margin: "0 auto", padding: "64px 40px 80px",
        display: "flex", gap: 64, alignItems: "flex-start",
      }}>

        <TOC active={activeSection} />

        {/* Main content */}
        <article style={{ flex: 1, minWidth: 0 }}>

          <Section id="s1" number="01" title="Information We Collect">
            <p style={{ marginBottom: 16 }}>
              We collect only what we need to analyze your hair and deliver personalized recommendations.
            </p>
            <p style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: T.brownText, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Information You Provide Directly</p>
            <BulletList items={[
              "Quiz responses, including your curl goals, hair density, porosity, damage history, current routine, and scalp condition.",
              "Photos you upload of your hair (roots, mid-lengths, ends) and an optional photo of your face for skin undertone and face shape analysis.",
            ]} />
            <p style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: T.brownText, marginBottom: 8, marginTop: 20, textTransform: "uppercase", letterSpacing: "0.1em" }}>Information Collected Automatically</p>
            <BulletList items={[
              "Approximate location inferred from your IP address (city or region level, not precise GPS).",
            ]} />
            <p style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: T.brownText, marginBottom: 8, marginTop: 20, textTransform: "uppercase", letterSpacing: "0.1em" }}>Information We Do Not Collect</p>
            <BulletList items={[
              "We do not collect precise GPS location.",
              "We do not collect government ID numbers, payment card information, or health records.",
            ]} />
          </Section>

          <Section id="s2" number="02" title="How Your Photos Are Handled">
            <p style={{ marginBottom: 20 }}>
              Photos are the most sensitive information Pelora processes, so we want to be extremely clear about how they work.
            </p>

            <Callout icon="🗑️" title="Photos Are Processed, Not Stored">
              When you upload a photo for analysis, it is sent through our system to a third-party AI provider, Groq, which runs the vision model that identifies curl pattern, hair health, and related characteristics. Once analysis is complete and the results are returned to your device, <strong>the photo itself is not retained by Pelora.</strong> We do not keep copies of your uploaded images on our servers.
              <br /><br />
              What we do keep is the analysis output — your estimated curl type, porosity indicators, frizz level, and similar text-based observations. These results are what power your personalized recommendations.
            </Callout>

            <Callout icon="🤖" title="Third-Party AI Processing (Groq)" accent>
              To produce your curl analysis, your photo is transmitted to Groq, an AI infrastructure provider, for processing. While the image is being processed by Groq, it is subject to Groq's own privacy policies, terms, and data handling practices — not solely Pelora's.
              <br /><br />
              We encourage you to review{" "}
              <a href="https://groq.com/privacy-policy" target="_blank" rel="noopener noreferrer">Groq's privacy practices</a>{" "}
              before uploading any photo. By uploading a photo, you acknowledge and consent to your image being transmitted to and processed by Groq.
            </Callout>

            <p style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: T.brownText, marginBottom: 10, marginTop: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>What We Recommend</p>
            <BulletList items={[
              "Do not upload photos that include other people without their explicit consent.",
              "Avoid photos with background details you would not want processed by an AI system (license plates, documents, screens showing personal info).",
              "You must be 18 or older to upload any photo to Pelora.",
            ]} />
          </Section>

          <Section id="s3" number="03" title="How We Use Your Information">
            <BulletList items={[
              "To analyze your hair and generate your curl profile, product recommendations, and routine suggestions.",
              "To operate, maintain, and improve the Pelora Services.",
              "To debug, troubleshoot, and secure the Services against fraud and abuse.",
              "To understand product performance in aggregate, using anonymized or de-identified data.",
              "To comply with legal obligations and enforce our Terms of Service.",
            ]} />
            <div style={{
              marginTop: 20, padding: "16px 20px", borderRadius: 12,
              background: "#fff", border: `1px solid ${T.creamMid}`,
              display: "flex", gap: 10, alignItems: "flex-start",
            }}>
              <span style={{ fontSize: 18 }}>🔒</span>
              <p style={{ margin: 0, fontSize: 14, color: T.brownMuted, lineHeight: 1.7 }}>
                <strong style={{ color: T.brownText }}>We do not sell your personal information.</strong> We do not use your photos or personal data to train our own AI models without your explicit, separate consent.
              </p>
            </div>
          </Section>

          <Section id="s4" number="04" title="Who We Share Information With">
            <p style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: T.brownText, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>AI and Infrastructure Providers</p>
            <BulletList items={[
              "Groq — for AI vision analysis of uploaded photos.",
              "Netlify — our website hosting provider, which handles site delivery and basic traffic logs.",
            ]} />
            <p style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: T.brownText, marginBottom: 10, marginTop: 20, textTransform: "uppercase", letterSpacing: "0.1em" }}>Legal and Safety Disclosures</p>
            <p style={{ marginBottom: 20 }}>
              We may disclose information if required by law, court order, or government request, or if we believe in good faith that disclosure is necessary to protect our rights, your safety, or the safety of others.
            </p>
            <p style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, color: T.brownText, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>What We Never Do</p>
            <BulletList items={[
              "We never sell your personal information to advertisers or data brokers.",
              "We never share your photos with third parties beyond what is needed to run the AI analysis.",
              "We never share your quiz answers or curl profile publicly without your explicit permission.",
            ]} />
          </Section>

          <Section id="s5" number="05" title="Data Retention">
            <p style={{ marginBottom: 16 }}>How long we keep your information depends on what it is:</p>
            <BulletList items={[
              "Photos: Not retained by Pelora. Transmitted to Groq for processing and then discarded. Groq's privacy policy governs their own retention practices.",
              "Curl analysis results and quiz responses: Pelora does not currently store these on our servers. Your results live only in your browser session while you are using the Service. Once you close the tab or end the session, they are gone.",
              "Website traffic logs (via Netlify): Retained by Netlify according to its own data practices, typically for a short period, for security and performance purposes.",
            ]} />
          </Section>

          <Section id="s6" number="06" title="Your Privacy Rights">
            <p style={{ marginBottom: 16 }}>
              You have meaningful control over your data. Because Pelora does not collect your email or store your quiz answers, photos, or analysis results on our servers, most of your data lives only in your own browser session — you can clear it at any time by closing your browser or clearing your site data.
            </p>
            <p style={{ marginBottom: 16 }}>If privacy laws in your region give you additional rights, those rights still apply to any information we do hold:</p>
            <BulletList items={[
              "Right to access — request a copy of the personal information we hold about you.",
              "Right to correct — ask us to fix inaccurate or incomplete information.",
              "Right to delete — request that we delete your data, including your curl profile and quiz responses.",
              "Right to opt out — unsubscribe from marketing emails or withdraw consent for optional data uses.",
              "Right to portability — request your data in a portable, machine-readable format.",
              "Right to non-discrimination — we will not treat you differently for exercising any of these rights.",
            ]} />
            <Callout icon="⚖️" title="California, EU & UK Users">
              If you are in California (CCPA/CPRA), the European Union or United Kingdom (GDPR), or another jurisdiction with specific privacy laws, you have additional rights under those laws, including the right to lodge a complaint with your local data protection authority.
            </Callout>
            <p>
              To exercise any of these rights, email us at <a href="mailto:agutie19@syr.edu">agutie19@syr.edu</a>. We will respond within 30 days.
            </p>
          </Section>

          <Section id="s7" number="07" title="Age Requirement">
            <p style={{ marginBottom: 16 }}>
              Pelora is intended for users who are <strong style={{ color: T.brownText }}>18 years of age or older</strong>. By creating an account, uploading photos, or otherwise using the Service, you represent and confirm that you are at least 18 years old.
            </p>
            <p style={{ marginBottom: 16 }}>
              We do not knowingly collect personal information from anyone under the age of 18. If you are under 18, please do not use Pelora or submit any information to us.
            </p>
            <p>
              If we become aware that we have collected personal information from a person under 18, we will delete that information from our records as quickly as possible. If you are a parent or guardian and believe that someone under 18 has provided us with personal information, please contact us at <a href="mailto:agutie19@syr.edu">agutie19@syr.edu</a>.
            </p>
          </Section>

          <Section id="s8" number="08" title="International Users">
            <p>
              Pelora is operated from the United States. If you access the Service from outside the U.S., your information may be transferred to, stored, and processed in the United States or other countries where our service providers (including Groq) operate. These countries may have data protection laws that differ from those in your home country.
            </p>
          </Section>

          <Section id="s9" number="09" title="Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. When we do, we will update the Effective Date at the top of this document and, for material changes, notify you through the Service or by email. Your continued use of Pelora after changes are posted means you accept the updated policy.
            </p>
          </Section>

          <Section id="s10" number="10" title="Contact Us">
            <p style={{ marginBottom: 20 }}>
              If you have any questions, concerns, or requests about this Privacy Policy or how your information is handled, please reach out:
            </p>
            <div style={{
              background: "#fff", border: `1px solid ${T.creamMid}`, borderRadius: 16,
              padding: "28px 28px", display: "inline-flex", flexDirection: "column", gap: 8,
            }}>
              <div style={{ fontSize: 14, color: T.brownMuted }}>
                <span style={{ fontWeight: 500, color: T.brownText }}>Email: </span>
                <a href="mailto:agutie19@syr.edu">agutie19@syr.edu</a>
              </div>
              <div style={{ fontSize: 14, color: T.brownMuted }}>
                <span style={{ fontWeight: 500, color: T.brownText }}>Location: </span>
                Syracuse, New York, USA
              </div>
            </div>
          </Section>

          {/* Back to top */}
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontFamily: sans, fontSize: 13, fontWeight: 400, color: T.brownMuted,
              background: "none", border: "none", cursor: "pointer",
              textDecoration: "underline", textUnderlineOffset: 3,
            }}>
              ↑ Back to top
            </button>
          </div>
        </article>
      </div>

      {/* Footer */}
      <footer style={{
        padding: "36px 40px", borderTop: `1px solid ${T.creamMid}`,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <span style={{
          fontFamily: serif, fontSize: 20, fontWeight: 600, fontStyle: "italic",
          background: `linear-gradient(135deg,${T.redMid},${T.redSoft})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>pelora</span>
        <p style={{ fontSize: 12, color: T.brownLight, fontWeight: 400 }}>Built for waves, curls, coils & all textures in between.</p>
        <p style={{ fontSize: 12, color: T.brownLight, fontWeight: 400 }}>© 2026 Pelora</p>
      </footer>
    </div>
  );
}
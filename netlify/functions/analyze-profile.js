// netlify/functions/analyze-profile.js
//
// Generates a short AI synthesis blurb connecting all quiz factors to the
// user's stated goal. One call per quiz session — cached in sessionStorage.
//
// Model: llama-3.3-70b-versatile
// ─────────────────────────────────────────────────────────────────────────────

export default async (request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "GROQ_API_KEY is not set." }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }

  let body;
  try { body = await request.json(); }
  catch {
    return new Response(JSON.stringify({ error: "Invalid JSON." }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  const { answers, curlType, curlTypeName } = body;
  if (!answers || !curlType) {
    return new Response(JSON.stringify({ error: "Missing required fields." }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  // ── Readable labels ──────────────────────────────────────────────────────────
  const GOAL_LABELS = {
    definition: "more curl definition",
    frizz:      "less frizz",
    moisture:   "more moisture and softness",
    length:     "length retention and reduced breakage",
    scalp:      "a healthier scalp",
  };
  const POROSITY_LABELS  = { high:"high porosity",   normal:"medium porosity", low:"low porosity" };
  const DENSITY_LABELS   = { thin:"thin density",    medium:"medium density",  dense:"dense (thick) density" };
  const SCALP_LABELS     = { balanced:"balanced scalp", oily:"oily scalp", dry:"dry scalp", sensitive:"sensitive scalp" };
  const JOURNEY_LABELS   = {
    start:   "a beginner just starting out with curl care",
    routine: "someone with a basic routine looking to improve",
    levelup: "an experienced curl enthusiast optimizing their routine",
  };
  const BUDGET_LABELS    = {
    drugstore: "a drugstore budget (under $15/product)",
    mid:       "a mid-range budget ($15–$30/product)",
    luxury:    "a luxury budget ($30+/product)",
    mix:       "a mixed budget across price points",
  };
  const HISTORY_LABELS   = {
    heat:       "regular heat styling",
    relaxer:    "chemical relaxers or perms",
    color:      "color or bleach",
    protective: "frequent protective styles",
    none:       "no chemical or heat treatments (virgin hair)",
  };

  const goal     = GOAL_LABELS[answers.goals]      || answers.goals      || "general hair health";
  const porosity = POROSITY_LABELS[answers.porosity] || answers.porosity  || "unknown porosity";
  const density  = DENSITY_LABELS[answers.density]   || answers.density   || "unknown density";
  const scalp    = SCALP_LABELS[answers.scalp]       || answers.scalp     || "unknown scalp type";
  const journey  = JOURNEY_LABELS[answers.journey]   || answers.journey   || "unknown experience level";
  const budget   = BUDGET_LABELS[answers.budget]     || answers.budget    || "unknown budget";
  const history  = (answers.history || [])
    .map(h => HISTORY_LABELS[h] || h)
    .filter(h => h !== "no chemical or heat treatments (virgin hair)")
    .join(", ") || "virgin hair";

  // ── Prompt ───────────────────────────────────────────────────────────────────
  const prompt = `You are Pelora, a curl care expert. A user has just reviewed detailed cards explaining their hair profile. Your job is to write a SHORT synthesis that connects their profile factors to their specific goal — without repeating what the cards already said.

USER PROFILE:
- Curl type: ${curlType} (${curlTypeName})
- Porosity: ${porosity}
- Density: ${density}
- Scalp: ${scalp}
- Hair history: ${history}
- Experience level: ${journey}
- Budget: ${budget}
- Goal: ${goal}

CRITICAL RULES — follow exactly:
1. DO NOT explain what any term means. The user already knows. Never say "high porosity means..." or "thin density causes...". Use the terms as shorthand only.
2. ONLY talk about how the factors INTERACT with each other in the context of the goal. Example of good interaction: "Your high porosity combined with a drugstore budget means silicone-heavy products — common at that price point — will build up faster and make frizz worse, not better."
3. Write ONE short intro sentence (1 sentence max) connecting the profile to the goal. Then give EXACTLY 4–6 bullet recommendations that are a mix of product guidance and technique guidance — both specific to this user's combination of factors.
4. Bullets must be actionable and specific. No vague advice like "moisturize regularly." Say what, how, and why it matters for THIS profile.
5. Bullets should not repeat anything already covered in the profile cards (porosity tips, density tips, scalp tips, challenge tips, budget pros/cons, history recovery steps). This is NEW synthesis only.
6. Keep the entire response under 200 words.
7. Do not use headers, markdown, or section labels. Just the intro sentence and bullets.

Return ONLY valid JSON with two keys — no markdown, no backticks:
{
  "intro": "one sentence connecting their profile to their goal",
  "bullets": ["bullet 1", "bullet 2", "bullet 3", "bullet 4"]
}`;

  // ── Call Groq ────────────────────────────────────────────────────────────────
  let groqResponse;
  try {
    groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model:       "llama-3.3-70b-versatile",
        max_tokens:  400,
        temperature: 0.4,
        messages: [{ role: "user", content: prompt }],
      }),
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Failed to reach Groq: ${err.message}` }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!groqResponse.ok) {
    const errData = await groqResponse.json().catch(() => ({}));
    return new Response(
      JSON.stringify({ error: errData.error?.message || `Groq error ${groqResponse.status}` }),
      { status: groqResponse.status, headers: { "Content-Type": "application/json" } }
    );
  }

  const data = await groqResponse.json();
  const raw  = data.choices?.[0]?.message?.content?.trim();
  if (!raw) {
    return new Response(
      JSON.stringify({ error: "Empty response from Groq." }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  const clean = raw.replace(/```json|```/g, "").trim();
  let result;
  try { result = JSON.parse(clean); }
  catch {
    return new Response(
      JSON.stringify({ error: "Groq returned non-JSON output.", raw }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const config = { path: "/api/analyze-profile" };
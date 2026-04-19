// ── Pelora / Netlify Function: analyze.js ────────────────────────────────────
//
// This function runs on Netlify's servers, never in the user's browser.
// The GROQ_API_KEY environment variable is set in the Netlify dashboard and
// is never included in the built frontend JS.
//
// The frontend calls:  POST /api/analyze
// This function calls: POST https://api.groq.com/openai/v1/chat/completions
// Then returns the parsed result back to the frontend.
// ─────────────────────────────────────────────────────────────────────────────

export default async (request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "GROQ_API_KEY is not set in Netlify environment variables." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON in request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { imageBlocks, answers } = body;

  if (!imageBlocks || !answers) {
    return new Response(
      JSON.stringify({ error: "Request must include imageBlocks and answers." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // ── Build the analysis prompt ───────────────────────────────────────────────
  // Note: answers.goals is a single string (e.g. "frizz"), not an array.
  // answers.history is still an array.
  const prompt = `You are Pelora, a curl care expert performing a visual hair analysis.

STEP 1 — VISUAL ANALYSIS (use photos only, ignore everything below this line):
Look at the photos and determine:
- Curl type using the Andre Walker system (1A–4C)
- Face shape (oval, round, square, heart, oblong, diamond) — from the face photo only
- Skin undertone (warm, cool, neutral) — from the face photo only
- Hair health observations from all three hair photos

STEP 2 — CONTEXT (do NOT use this to change your visual classifications above):
The following quiz answers are for personalizing care advice only. They must NOT influence curl type, face shape, or undertone — those come exclusively from the photos.
- Goals: ${answers.goals || "not specified"}
- Porosity: ${answers.porosity || "skipped"}
- Hair history: ${(answers.history || []).join(", ") || "none"}
- Journey: ${answers.journey || "not specified"}
- Scalp: ${answers.scalp || "not specified"}

Return ONLY this JSON, no markdown, no backticks, no explanation:
{
  "curlType": "e.g. 2B",
  "curlTypeName": "e.g. Beachy Waves",
  "rootsPattern": "e.g. 2A at roots",
  "midPattern": "e.g. 2B mid-length",
  "endsPattern": "e.g. 2B/2C at ends",
  "description": "2-3 warm affirming sentences about their curl pattern as a knowledgeable best friend.",
  "faceShape": "oval",
  "undertone": "cool",
  "healthPriorities": ["priority 1", "priority 2"],
  "healthSummary": "1 warm sentence about hair health"
}`;

  // ── Call Groq ───────────────────────────────────────────────────────────────
  let groqResponse;
  try {
    groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        max_tokens: 800,
        messages: [{
          role: "user",
          content: [...imageBlocks, { type: "text", text: prompt }],
        }],
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
  const raw = data.choices?.[0]?.message?.content?.trim();

  if (!raw) {
    return new Response(
      JSON.stringify({ error: "Empty response from Groq." }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  // Strip markdown fences if the model wraps its JSON anyway
  const clean = raw.replace(/```json|```/g, "").trim();

  let result;
  try {
    result = JSON.parse(clean);
  } catch {
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

// Tell Netlify to use the newer "functions v2" format
export const config = {
  path: "/api/analyze",
};
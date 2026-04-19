// ── Pelora / Netlify Function: analyze.js ────────────────────────────────────
//
// This function runs on Netlify's servers, never in the user's browser.
// The GEMINI_API_KEY environment variable is set in the Netlify dashboard and
// is never included in the built frontend JS.
//
// The frontend calls:  POST /api/analyze
// This function calls: POST https://generativelanguage.googleapis.com/...
// Then returns the parsed result back to the frontend.
// ─────────────────────────────────────────────────────────────────────────────

export default async (request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "GEMINI_API_KEY is not set in Netlify environment variables." }),
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

  // ── Convert imageBlocks to Gemini's content format ──────────────────────────
  // Groq used { type: "image_url", image_url: { url: "data:..." } }
  // Gemini uses { inlineData: { mimeType: "image/jpeg", data: "<base64>" } }
  const geminiParts = [];

  for (const block of imageBlocks) {
    if (block.type === "text") {
      geminiParts.push({ text: block.text });
    } else if (block.type === "image_url") {
      const dataUrl = block.image_url?.url || "";
      // dataUrl is "data:image/jpeg;base64,<base64data>"
      const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        geminiParts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        });
      }
    }
  }

  // Add the analysis prompt as the final text part
  geminiParts.push({ text: prompt });

  // ── Call Gemini 2.5 Pro ─────────────────────────────────────────────────────
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;

  let geminiResponse;
  try {
    geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: geminiParts,
          },
        ],
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.4,
        },
      }),
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Failed to reach Gemini: ${err.message}` }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!geminiResponse.ok) {
    const errData = await geminiResponse.json().catch(() => ({}));
    return new Response(
      JSON.stringify({ error: errData.error?.message || `Gemini error ${geminiResponse.status}` }),
      { status: geminiResponse.status, headers: { "Content-Type": "application/json" } }
    );
  }

  const data = await geminiResponse.json();

  // Gemini response shape:
  // data.candidates[0].content.parts[0].text
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!raw) {
    return new Response(
      JSON.stringify({ error: "Empty response from Gemini." }),
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
      JSON.stringify({ error: "Gemini returned non-JSON output.", raw }),
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
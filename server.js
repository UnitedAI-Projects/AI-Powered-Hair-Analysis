import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))

const ANTHROPIC_API_KEY = process.env.VITE_ANTHROPIC_API_KEY
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

const SYSTEM_PROMPT = `You are Pelora's AI curl care expert — a warm, knowledgeable best friend who knows everything about curly and coily hair. You use the Andre Walker Hair Typing System.

You are analyzing 4 photos of the same person:
- Photo 1: Roots/crown area
- Photo 2: Mid-length hair
- Photo 3: Hair ends
- Photo 4: Face (for face shape and undertone)

The user also completed a quiz with their hair care information.

Analyze all 4 photos and return ONLY valid JSON (no markdown, no backticks) with this exact structure. Be warm, affirming, and personalized based on their quiz answers. Every curl type is beautiful.

Return ONLY the JSON object, nothing else:
{
  "curl_profile": {
    "primary_type": "e.g. 3B",
    "primary_type_name": "e.g. Springy Ringlets",
    "roots_type": "e.g. 3A",
    "midlength_type": "e.g. 3B",
    "ends_type": "e.g. 3B/3C",
    "description": "A warm, affirming 3-4 sentence description of their unique curl pattern"
  },
  "face_shape": "oval/round/square/heart/oblong/diamond",
  "undertone": "warm/cool/neutral",
  "hair_health": {
    "frizz_level": "low/moderate/high",
    "moisture_level": "dry/balanced/over-moisturized",
    "damage_signs": "none/mild/moderate/significant",
    "health_description": "2-3 sentences about their hair health"
  },
  "care_priorities": ["priority 1", "priority 2", "priority 3"],
  "product_recommendations": [
    {
      "category": "Cleanser",
      "product_name": "Product name",
      "brand": "Brand",
      "price_range": "$X-$Y",
      "why_it_works": "Why this works for their curl type"
    },
    {
      "category": "Conditioner",
      "product_name": "Product name",
      "brand": "Brand",
      "price_range": "$X-$Y",
      "why_it_works": "Why this works"
    },
    {
      "category": "Styling",
      "product_name": "Product name",
      "brand": "Brand",
      "price_range": "$X-$Y",
      "why_it_works": "Why this works"
    },
    {
      "category": "Deep Treatment",
      "product_name": "Product name",
      "brand": "Brand",
      "price_range": "$X-$Y",
      "why_it_works": "Why this works"
    }
  ],
  "style_recommendations": [
    {
      "style_name": "Style name",
      "why_it_suits": "Why this suits their face and curls"
    },
    {
      "style_name": "Style name",
      "why_it_suits": "Why this suits them"
    },
    {
      "style_name": "Style name",
      "why_it_suits": "Why this suits them"
    }
  ],
  "color_suggestions": [
    {
      "color_name": "Color description",
      "why_it_complements": "Why with undertone"
    }
  ],
  "thirty_day_challenge_preview": [
    {"day": 1, "challenge": "Challenge name", "why": "Why this matters"},
    {"day": 7, "challenge": "Challenge name", "why": "Why this matters"},
    {"day": 14, "challenge": "Challenge name", "why": "Why this matters"},
    {"day": 21, "challenge": "Challenge name", "why": "Why this matters"},
    {"day": 30, "challenge": "Challenge name", "why": "Why this matters"}
  ]
}`

app.post('/api/analyze', async (req, res) => {
  try {
    const { quizAnswers, photos } = req.body

    if (!ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' })
    }

    // Format the user message with quiz data and image references
    const userMessage = formatUserMessage(quizAnswers, photos)

    // Call Claude API with vision
    const response = await axios.post(
      ANTHROPIC_API_URL,
      {
        model: 'claude-opus-4-6',
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
      }
    )

    // Extract the text response
    const responseText = response.data.content[0].text

    // Parse the JSON response
    let analysis
    try {
      analysis = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText)
      return res.status(500).json({ error: 'Invalid response from AI' })
    }

    res.json({ success: true, analysis })
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message)
    res.status(500).json({
      error: error.response?.data?.error?.message || 'Failed to analyze photos',
    })
  }
})

function formatUserMessage(quizAnswers, photos) {
  const photoKeys = Object.keys(photos).filter(key => photos[key])

  let message = `Please analyze these hair photos and my quiz responses to create a personalized curl care profile:

QUIZ ANSWERS:
- Hair goals: ${quizAnswers.goals?.join(', ') || 'Not specified'}
- Hair porosity: ${quizAnswers.porosity || 'Not specified'}
- Hair treatments history: ${quizAnswers.treatments?.length > 0 ? quizAnswers.treatments.join(', ') : 'None or not specified'}
- Treatment timing: ${quizAnswers.treatmentTiming || 'N/A'}
- Current routine stage: ${quizAnswers.journey || 'Not specified'}
- Current routine elements: ${quizAnswers.routine?.length > 0 ? quizAnswers.routine.join(', ') : 'Just starting'}
- Scalp type: ${quizAnswers.scalp || 'Not specified'}

PHOTOS TO ANALYZE:`

  // Add image content blocks
  if (photos.roots) {
    message += '\n- Roots/Crown photo'
  }
  if (photos.midLength) {
    message += '\n- Mid-length photo'
  }
  if (photos.ends) {
    message += '\n- Ends photo'
  }
  if (photos.face) {
    message += '\n- Face photo (for face shape and undertone analysis)'
  }

  message += '\n\nPlease provide a warm, affirming, and personalized analysis in the specified JSON format.'

  return [
    {
      type: 'text',
      text: message,
    },
    // Add image blocks for each photo
    ...(photos.roots
      ? [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: photos.roots.split(',')[1], // Remove data:image/jpeg;base64, prefix
            },
          },
        ]
      : []),
    ...(photos.midLength
      ? [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: photos.midLength.split(',')[1],
            },
          },
        ]
      : []),
    ...(photos.ends
      ? [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: photos.ends.split(',')[1],
            },
          },
        ]
      : []),
    ...(photos.face
      ? [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: photos.face.split(',')[1],
            },
          },
        ]
      : []),
  ]
}

app.listen(PORT, () => {
  console.log(`Pelora API server running on http://localhost:${PORT}`)
})

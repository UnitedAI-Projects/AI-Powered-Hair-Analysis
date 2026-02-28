# Pelora — AI-Powered Curl Care Companion

A beautiful, AI-powered web app that analyzes curl patterns from photos and provides personalized hair care recommendations using the Anthropic Claude API.

## Features

### 🌀 Interactive Quiz Flow (5 screens)
- **Screen 1**: Curl care goals (multi-select, max 2)
- **Screen 2**: Interactive porosity test with visual steps
- **Screen 3**: Hair treatment history with conditional follow-up
- **Screen 4**: Curl care journey stage with routine details
- **Screen 5**: Scalp type assessment
- Progress tracking with animated progress bar
- Smooth transitions between screens

### 📸 Photo Upload
- Drag-and-drop photo upload (4 angles)
- Real-time image preview
- Base64 encoding for API submission
- Fallback option for fewer photos
- Progress tracking

### 🤖 AI Analysis
- Claude Opus 4.6 vision model analyzes photos
- Curl pattern identification (Andre Walker Hair Typing System)
- Face shape detection
- Undertone analysis
- Hair health assessment
- Personalized product recommendations
- Style suggestions
- 30-day curl challenge

### 🎨 Beautiful Design
- Pelora brand color palette (cream, lavender, purples)
- Playfair Display serif font for headings
- Smooth animations and transitions
- Fully responsive design
- Warm, affirming messaging

## Tech Stack

**Frontend:**
- React 19
- React Router 7
- Vite (fast bundler)
- Tailwind CSS 3
- Playfair Display font

**Backend:**
- Node.js with Express
- Anthropic Claude API
- CORS for cross-origin requests
- Base64 image handling

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd AI-Powered-Hair-Analysis
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```
VITE_ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

**⚠️ Important**:
- Get your API key from [console.anthropic.com](https://console.anthropic.com)
- The API key is ONLY used on the backend (never exposed to the client)
- The `VITE_` prefix is for Vite, but the backend reads from the .env directly

### 3. Run the Project

You need to run both the frontend dev server and the backend server:

**Terminal 1 - Frontend (Vite dev server):**
```bash
npm run dev
```
Runs on `http://localhost:5173`

**Terminal 2 - Backend (Express server):**
```bash
npm run server
```
Runs on `http://localhost:5000`

Both need to be running for the app to work end-to-end.

### 4. Build for Production

```bash
npm run build
```

Generates optimized frontend build in `dist/` folder.

## Project Structure

```
├── src/
│   ├── pages/
│   │   ├── Landing.jsx          # Home page with hero
│   │   ├── Quiz.jsx             # Quiz container
│   │   ├── PhotoUpload.jsx       # Photo upload interface
│   │   ├── Analyzing.jsx         # Loading screen
│   │   └── Results.jsx           # Results display
│   ├── components/
│   │   ├── Screen1Goals.jsx      # Quiz screen 1
│   │   ├── Screen2Porosity.jsx   # Quiz screen 2
│   │   ├── Screen3Treatments.jsx # Quiz screen 3
│   │   ├── Screen4Journey.jsx    # Quiz screen 4
│   │   ├── Screen5Scalp.jsx      # Quiz screen 5
│   │   ├── QuizProgress.jsx      # Progress indicator
│   │   ├── MotivationalMessage.jsx
│   │   ├── QuizComplete.jsx
│   │   └── PhotoUploadZone.jsx   # Drag-drop upload
│   ├── context/
│   │   └── QuizContext.jsx       # State management
│   ├── App.jsx                   # Main router
│   └── index.css                 # Tailwind + animations
├── server.js                     # Express backend
├── tailwind.config.js            # Tailwind configuration
├── vite.config.js                # Vite configuration
└── package.json
```

## API Endpoints

### POST `/api/analyze`

Analyzes quiz responses and photos with Claude API.

**Request:**
```json
{
  "quizAnswers": {
    "goals": ["curl definition", "length & growth"],
    "porosity": "medium",
    "treatments": ["hair color"],
    "treatmentTiming": "Within the last 3 months",
    "journey": "I know my hair pretty well...",
    "routine": ["Curl-specific products"],
    "scalp": "Balanced"
  },
  "photos": {
    "roots": "data:image/jpeg;base64,...",
    "midLength": "data:image/jpeg;base64,...",
    "ends": "data:image/jpeg;base64,...",
    "face": "data:image/jpeg;base64,..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "curl_profile": {
      "primary_type": "3B",
      "primary_type_name": "Springy Ringlets",
      "description": "..."
    },
    "face_shape": "oval",
    "undertone": "warm",
    "hair_health": {...},
    "care_priorities": [...],
    "product_recommendations": [...],
    "style_recommendations": [...],
    "color_suggestions": [...],
    "thirty_day_challenge_preview": [...]
  }
}
```

## Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Landing | Home page with intro |
| `/quiz` | Quiz | Multi-screen quiz flow |
| `/upload` | PhotoUpload | Photo upload interface |
| `/analyzing` | Analyzing | Loading screen during API call |
| `/results` | Results | Personalized analysis results |

## Color Palette

```
- Cream: #F5EDE3
- Lavender: #C8B8D4
- Purple Medium: #9B7BB5
- Purple Primary: #6B4D8A
- Purple Deep: #2E1A47
```

## Key Features in Code

### State Management
Quiz data is stored in React Context (`QuizContext`) and persists through the entire flow:
- Quiz answers (screens 1-5)
- Uploaded photos (base64 encoded)
- AI analysis results

### Security
- ANTHROPIC_API_KEY only used on backend
- Sensitive data never exposed to client
- Images stored as base64 for easy transmission

### Image Handling
- Drag-and-drop support
- Automatic base64 encoding
- Multiple file upload zones
- Preview on successful upload

### Animations
- Fade-in transitions between screens
- Smooth state changes
- Pulsing loading indicators
- Floating background shapes

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Requires modern JavaScript (ES6+)

## Future Enhancements

- 30-day challenge tracking system
- User accounts and saved profiles
- Community hair care tips
- Product review system
- Before/after transformation gallery
- Integration with e-commerce for product purchases

## Troubleshooting

### API Key Error
- Verify API key is in `.env`
- Check key is valid at [console.anthropic.com](https://console.anthropic.com)
- Backend must be running on `http://localhost:5000`

### Photos Not Uploading
- Check file size (max 50MB per request)
- Ensure browser supports drag-and-drop
- Try direct click upload if drag-drop fails

### CORS Errors
- Verify backend server is running
- Check frontend is trying to reach `http://localhost:5000`
- Enable CORS in Express (already configured)

### Build Issues
- Delete `node_modules` and `dist` folders
- Run `npm install` again
- Try `npm run build`

## License

ISC

## Made with ❤️
Built by Team Pelora | In partnership with United AI

import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import PhotoUploadZone from '../components/PhotoUploadZone'

const PHOTO_TYPES = [
  {
    key: 'roots',
    emoji: '📸',
    label: 'Roots / Crown',
    description: 'Show us your curl pattern at the top',
  },
  {
    key: 'midLength',
    emoji: '📸',
    label: 'Mid-length',
    description: 'Your curls in the middle',
  },
  {
    key: 'ends',
    emoji: '📸',
    label: 'Ends',
    description: 'How your curls behave at the tips',
  },
  {
    key: 'face',
    emoji: '📸',
    label: 'Face',
    description: 'For face shape and undertone analysis',
  },
]

export default function PhotoUpload() {
  const { answers, updateAnswers } = useQuiz()
  const navigate = useNavigate()
  const [showFallback, setShowFallback] = useState(false)

  const photos = answers.photos || {}
  const uploadedCount = Object.values(photos).filter(Boolean).length

  const handlePhotoUpload = (key, base64) => {
    updateAnswers('photos', {
      ...photos,
      [key]: base64,
    })
  }

  const handleContinue = () => {
    // Navigate to analyzing screen which will trigger the API call
    navigate('/analyzing')
  }

  const handleSkipWithFewer = () => {
    // Allow proceeding with fewer photos
    if (uploadedCount > 0) {
      navigate('/analyzing')
    }
  }

  const allPhotosUploaded = uploadedCount === 4

  return (
    <div className="min-h-screen bg-cream py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-serif text-purple-deep mb-4">
            Let's see your curls from every angle!
          </h1>
          <p className="text-purple-deep opacity-70 text-lg">
            Upload 4 photos with your hair dry and normally styled. For best results, use natural lighting.
          </p>
        </div>

        {/* Photo Upload Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {PHOTO_TYPES.map(photoType => (
            <PhotoUploadZone
              key={photoType.key}
              photoType={photoType}
              image={photos[photoType.key]}
              onUpload={(base64) => handlePhotoUpload(photoType.key, base64)}
            />
          ))}
        </div>

        {/* Progress indicator */}
        <div className="text-center mb-8">
          <p className="text-purple-deep font-semibold">
            {uploadedCount} of 4 photos uploaded
          </p>
          <div className="mt-3 flex justify-center gap-2">
            {PHOTO_TYPES.map(photoType => (
              <div
                key={photoType.key}
                className={`w-2 h-2 rounded-full transition-all ${
                  photos[photoType.key] ? 'bg-purple-primary' : 'bg-lavender'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleContinue}
            disabled={!allPhotosUploaded}
            className={`w-full py-3 rounded-full font-semibold transition-all duration-200 ${
              allPhotosUploaded
                ? 'bg-purple-primary text-cream hover:bg-purple-deep shadow-lg'
                : 'bg-lavender text-purple-deep opacity-50 cursor-not-allowed'
            }`}
          >
            Continue with all 4 photos
          </button>

          {uploadedCount > 0 && !allPhotosUploaded && (
            <button
              onClick={() => setShowFallback(!showFallback)}
              className="w-full py-3 rounded-full font-semibold border-2 border-purple-primary text-purple-primary hover:bg-purple-primary hover:text-cream transition-all duration-200"
            >
              {showFallback ? 'Close' : 'I only have 1-2 photos'}
            </button>
          )}
        </div>

        {/* Fallback Option */}
        {showFallback && uploadedCount > 0 && (
          <div className="mt-6 p-6 rounded-2xl bg-lavender border-2 border-purple-medium animate-fade-in">
            <p className="text-purple-deep font-semibold mb-4">
              No problem! We can work with what you have.
            </p>
            <p className="text-purple-deep opacity-80 mb-4">
              You've uploaded {uploadedCount} {uploadedCount === 1 ? 'photo' : 'photos'}. You can proceed now and upload more later if needed.
            </p>
            <button
              onClick={handleSkipWithFewer}
              className="w-full py-3 rounded-full font-semibold bg-purple-primary text-cream hover:bg-purple-deep transition-all duration-200"
            >
              Continue with {uploadedCount} {uploadedCount === 1 ? 'photo' : 'photos'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

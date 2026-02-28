import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'

export default function Analyzing() {
  const navigate = useNavigate()
  const location = useLocation()
  const { answers, updateAnswers } = useQuiz()
  const [error, setError] = useState(null)

  useEffect(() => {
    const analyzePhotos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quizAnswers: answers,
            photos: answers.photos,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to analyze photos')
        }

        const data = await response.json()

        // Store analysis results in context
        updateAnswers('analysis', data.analysis)

        // Navigate to results page
        setTimeout(() => {
          navigate('/results')
        }, 500)
      } catch (err) {
        console.error('Analysis error:', err)
        setError(err.message)
      }
    }

    analyzePhotos()
  }, [answers, navigate, updateAnswers])

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {error ? (
          <>
            <p className="text-5xl mb-6">⚠️</p>
            <h1 className="text-3xl sm:text-4xl font-serif text-purple-deep mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-purple-deep opacity-80 mb-8">{error}</p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-purple-primary text-cream rounded-full font-semibold hover:bg-purple-deep transition-colors"
            >
              Go back and try again
            </button>
          </>
        ) : (
          <>
            {/* Animated curl spinner */}
            <div className="mb-8 flex justify-center">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-lavender rounded-full opacity-30"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-purple-primary border-r-purple-primary rounded-full animate-spin"></div>
                <div className="absolute inset-3 border-4 border-transparent border-b-purple-medium rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-serif text-purple-deep mb-4">
              Getting to know your curls...
            </h1>

            <p className="text-purple-deep opacity-70 text-lg mb-8">
              Our AI is analyzing your photos and creating your personalized curl care profile
            </p>

            <div className="flex justify-center gap-2">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-purple-primary animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </div>

            <p className="text-purple-medium text-sm mt-8 opacity-80">
              This usually takes 5-10 seconds
            </p>
          </>
        )}
      </div>
    </div>
  )
}

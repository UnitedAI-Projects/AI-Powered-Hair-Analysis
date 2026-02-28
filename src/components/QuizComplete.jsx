import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function QuizComplete() {
  const navigate = useNavigate()

  useEffect(() => {
    // Transition to photo upload after 2 seconds
    const timer = setTimeout(() => {
      navigate('/upload')
    }, 2000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-[300px] animate-fade-in">
      <div className="text-center">
        <p className="text-6xl mb-4">📸</p>
        <h2 className="text-3xl sm:text-4xl font-serif text-purple-deep">
          All set! Time to show us those curls 📸
        </h2>
        <p className="text-purple-deep opacity-60 mt-4">
          Redirecting you in just a moment...
        </p>
      </div>
    </div>
  )
}

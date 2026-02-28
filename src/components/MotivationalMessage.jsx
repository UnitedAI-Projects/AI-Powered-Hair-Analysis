import { useEffect } from 'react'

export default function MotivationalMessage({ onNext }) {
  useEffect(() => {
    // Auto-advance after 1.5 seconds
    const timer = setTimeout(() => {
      onNext()
    }, 1500)

    return () => clearTimeout(timer)
  }, [onNext])

  return (
    <div className="flex items-center justify-center min-h-[300px] animate-fade-in">
      <div className="text-center">
        <p className="text-5xl mb-4">💜</p>
        <h2 className="text-3xl sm:text-4xl font-serif text-purple-deep">
          Halfway to your custom curl plan!
        </h2>
        <p className="text-purple-deep opacity-60 mt-4">
          Just a few more questions...
        </p>
      </div>
    </div>
  )
}

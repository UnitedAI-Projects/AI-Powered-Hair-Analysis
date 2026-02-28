import { useState } from 'react'
import { useQuiz } from '../context/QuizContext'

const JOURNEY_OPTIONS = [
  'Just getting started — no real routine yet',
  'I have a basic routine but not sure it\'s working',
  'I know my hair pretty well and want to level up',
  'Transitioning from heat/chemical-treated hair',
]

const ROUTINE_OPTIONS = [
  'Curl-specific products (gels, creams, leave-ins)',
  'Techniques like plopping, scrunching, or diffusing',
  'Sleep protection (bonnet, satin pillowcase)',
  'Just shampoo and conditioner',
]

export default function Screen4Journey({ onNext }) {
  const { answers, updateAnswers } = useQuiz()
  const [showRoutinePrompt, setShowRoutinePrompt] = useState(
    answers.journey && answers.journey !== 'Just getting started — no real routine yet'
  )

  const handleJourneySelect = (journey) => {
    updateAnswers('journey', journey)

    // Show routine follow-up only if NOT "Just getting started"
    if (journey !== 'Just getting started — no real routine yet') {
      setShowRoutinePrompt(true)
    } else {
      setShowRoutinePrompt(false)
      updateAnswers('routine', [])
    }
  }

  const toggleRoutine = (routine) => {
    const currentRoutine = answers.routine || []
    if (currentRoutine.includes(routine)) {
      updateAnswers('routine', currentRoutine.filter(r => r !== routine))
    } else {
      updateAnswers('routine', [...currentRoutine, routine])
    }
  }

  const handleSkipRoutine = () => {
    setShowRoutinePrompt(false)
    updateAnswers('routine', [])
  }

  const handleNext = () => {
    onNext()
  }

  const canContinue = answers.journey

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl sm:text-4xl font-serif text-purple-deep mb-2">
        Where are you in your curl care journey?
      </h2>
      <p className="text-purple-deep opacity-70 mb-8">
        Pick the one that resonates most
      </p>

      <div className="space-y-3 mb-8">
        {JOURNEY_OPTIONS.map(journey => (
          <button
            key={journey}
            onClick={() => handleJourneySelect(journey)}
            className={`w-full p-4 rounded-xl text-left transition-all duration-200 font-medium ${
              answers.journey === journey
                ? 'bg-purple-primary text-cream border-2 border-purple-primary shadow-lg'
                : 'bg-lavender text-purple-deep border-2 border-transparent hover:border-purple-medium'
            }`}
          >
            {journey}
          </button>
        ))}
      </div>

      {/* Conditional Follow-up for Routine */}
      {showRoutinePrompt && (
        <div className="bg-cream border-2 border-purple-medium rounded-2xl p-6 mb-8 animate-fade-in">
          <p className="text-purple-deep font-semibold mb-4">What's in your routine?</p>
          <div className="space-y-3">
            {ROUTINE_OPTIONS.map(routine => (
              <button
                key={routine}
                onClick={() => toggleRoutine(routine)}
                className={`w-full p-3 rounded-lg text-left transition-all duration-200 font-medium ${
                  (answers.routine || []).includes(routine)
                    ? 'bg-purple-primary text-cream border-2 border-purple-primary'
                    : 'bg-white text-purple-deep border-2 border-purple-medium hover:bg-lavender'
                }`}
              >
                {routine}
              </button>
            ))}
          </div>
          <button
            onClick={handleSkipRoutine}
            className="mt-4 text-purple-medium hover:text-purple-primary underline text-sm font-medium"
          >
            Skip this
          </button>
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={!canContinue}
        className={`w-full py-3 rounded-full font-semibold transition-all duration-200 ${
          canContinue
            ? 'bg-purple-primary text-cream hover:bg-purple-deep shadow-lg'
            : 'bg-lavender text-purple-deep opacity-50 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  )
}

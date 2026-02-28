import { useQuiz } from '../context/QuizContext'

const SCALP_OPTIONS = ['Oily', 'Dry', 'Balanced', 'Flaky or irritated', 'Not sure']

export default function Screen5Scalp({ onNext }) {
  const { answers, updateAnswers } = useQuiz()

  const handleSelect = (scalp) => {
    updateAnswers('scalp', scalp)
    // Auto-advance on selection
    setTimeout(() => onNext(), 300)
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl sm:text-4xl font-serif text-purple-deep mb-2">
        One last thing — what's your scalp like?
      </h2>
      <p className="text-purple-deep opacity-70 mb-8">
        This helps us personalize product recommendations
      </p>

      <div className="space-y-3">
        {SCALP_OPTIONS.map(scalp => (
          <button
            key={scalp}
            onClick={() => handleSelect(scalp)}
            className={`w-full p-4 rounded-xl text-left transition-all duration-200 font-medium text-lg ${
              answers.scalp === scalp
                ? 'bg-purple-primary text-cream border-2 border-purple-primary shadow-lg'
                : 'bg-lavender text-purple-deep border-2 border-transparent hover:border-purple-medium'
            }`}
          >
            {scalp}
          </button>
        ))}
      </div>
    </div>
  )
}

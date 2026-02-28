import { useQuiz } from '../context/QuizContext'

const GOAL_OPTIONS = [
  'More volume & bounce',
  'Curl definition & frizz control',
  'Length & growth',
  'Damage repair',
]

export default function Screen1Goals({ onNext }) {
  const { answers, updateAnswers } = useQuiz()

  const toggleGoal = (goal) => {
    const currentGoals = answers.goals
    if (currentGoals.includes(goal)) {
      updateAnswers('goals', currentGoals.filter(g => g !== goal))
    } else {
      // Max 2 selections
      if (currentGoals.length < 2) {
        updateAnswers('goals', [...currentGoals, goal])
      }
    }
  }

  const canContinue = answers.goals.length > 0

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl sm:text-4xl font-serif text-purple-deep mb-2">
        What are you hoping to achieve with your curls?
      </h2>
      <p className="text-purple-deep opacity-70 mb-8">
        Select up to 2 goals
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {GOAL_OPTIONS.map(goal => (
          <button
            key={goal}
            onClick={() => toggleGoal(goal)}
            className={`p-6 rounded-2xl text-left transition-all duration-200 font-medium ${
              answers.goals.includes(goal)
                ? 'bg-purple-primary text-cream border-2 border-purple-primary shadow-lg'
                : 'bg-lavender text-purple-deep border-2 border-transparent hover:border-purple-medium'
            }`}
          >
            {goal}
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
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

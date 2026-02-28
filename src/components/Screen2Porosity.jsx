import { useQuiz } from '../context/QuizContext'

const POROSITY_OPTIONS = [
  { label: '🔝 Still floating on top', value: 'low' },
  { label: '🔄 Sank slowly to the middle', value: 'medium' },
  { label: '⬇️ Went straight to the bottom', value: 'high' },
  { label: '⏭️ Skip for now', value: 'skip' },
]

export default function Screen2Porosity({ onNext }) {
  const { answers, updateAnswers } = useQuiz()

  const handleSelect = (value) => {
    updateAnswers('porosity', value)
    // Auto-advance on selection
    setTimeout(() => onNext(), 300)
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl sm:text-4xl font-serif text-purple-deep mb-6">
        Let's test your porosity!
      </h2>

      {/* Tutorial Steps */}
      <div className="bg-lavender rounded-3xl p-8 mb-8">
        <div className="space-y-6">
          {[
            { num: 1, text: 'Grab a clean strand of hair (one that shed naturally is perfect)' },
            { num: 2, text: 'Fill a glass with room temperature water' },
            { num: 3, text: 'Drop the strand in and wait 2 minutes' },
            { num: 4, text: 'Tell us what happened 👇' },
          ].map(step => (
            <div key={step.num} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-primary text-cream flex items-center justify-center font-bold">
                {step.num}
              </div>
              <div className="flex-grow flex items-center">
                <p className="text-purple-deep font-medium">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Answer Buttons */}
      <div className="space-y-3">
        {POROSITY_OPTIONS.map(option => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`w-full p-4 rounded-xl text-left transition-all duration-200 font-medium text-lg ${
              answers.porosity === option.value
                ? 'bg-purple-primary text-cream border-2 border-purple-primary shadow-lg'
                : 'bg-lavender text-purple-deep border-2 border-transparent hover:border-purple-medium'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useQuiz } from '../context/QuizContext'

const TREATMENT_OPTIONS = [
  'Relaxers or chemical straightening',
  'Keratin treatments',
  'Hair color or bleach',
  'Regular heat styling (flat iron, blow dryer)',
  'Extensions, weaves, or wigs',
  'None — mostly natural',
]

const TIMING_OPTIONS = [
  'Within the last 3 months',
  '3-12 months ago',
  'Over a year ago',
]

export default function Screen3Treatments({ onNext }) {
  const { answers, updateAnswers } = useQuiz()
  const [showTimingPrompt, setShowTimingPrompt] = useState(false)

  const toggleTreatment = (treatment) => {
    let newTreatments = answers.treatments

    // If selecting "None", clear all other selections
    if (treatment === 'None — mostly natural') {
      newTreatments = ['None — mostly natural']
      setShowTimingPrompt(false)
    } else {
      // Remove "None" if something else is selected
      newTreatments = newTreatments.filter(t => t !== 'None — mostly natural')

      if (newTreatments.includes(treatment)) {
        newTreatments = newTreatments.filter(t => t !== treatment)
      } else {
        newTreatments = [...newTreatments, treatment]
      }

      // Show timing prompt if any treatment is selected (besides None)
      setShowTimingPrompt(newTreatments.length > 0)
    }

    updateAnswers('treatments', newTreatments)
  }

  const handleTimingSelect = (timing) => {
    updateAnswers('treatmentTiming', timing)
  }

  const handleSkipTiming = () => {
    setShowTimingPrompt(false)
  }

  const handleNext = () => {
    // If they selected treatments and didn't fill timing, that's okay (it's skippable)
    onNext()
  }

  const canContinue = answers.treatments.length > 0

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl sm:text-4xl font-serif text-purple-deep mb-2">
        What has your hair been through?
      </h2>
      <p className="text-purple-deep opacity-70 mb-8">
        Select all that apply
      </p>

      <div className="space-y-3 mb-8">
        {TREATMENT_OPTIONS.map(treatment => (
          <button
            key={treatment}
            onClick={() => toggleTreatment(treatment)}
            className={`w-full p-4 rounded-xl text-left transition-all duration-200 font-medium ${
              answers.treatments.includes(treatment)
                ? 'bg-purple-primary text-cream border-2 border-purple-primary shadow-lg'
                : 'bg-lavender text-purple-deep border-2 border-transparent hover:border-purple-medium'
            }`}
          >
            {treatment}
          </button>
        ))}
      </div>

      {/* Conditional Follow-up for Timing */}
      {showTimingPrompt &&
        !answers.treatments.includes('None — mostly natural') && (
          <div className="bg-cream border-2 border-purple-medium rounded-2xl p-6 mb-8 animate-fade-in">
            <p className="text-purple-deep font-semibold mb-4">How recently?</p>
            <div className="space-y-3">
              {TIMING_OPTIONS.map(timing => (
                <button
                  key={timing}
                  onClick={() => handleTimingSelect(timing)}
                  className={`w-full p-3 rounded-lg text-left transition-all duration-200 font-medium ${
                    answers.treatmentTiming === timing
                      ? 'bg-purple-primary text-cream border-2 border-purple-primary'
                      : 'bg-white text-purple-deep border-2 border-purple-medium hover:bg-lavender'
                  }`}
                >
                  {timing}
                </button>
              ))}
            </div>
            <button
              onClick={handleSkipTiming}
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

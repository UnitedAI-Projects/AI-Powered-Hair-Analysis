import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QuizProvider } from '../context/QuizContext'
import QuizProgress from '../components/QuizProgress'
import Screen1Goals from '../components/Screen1Goals'
import Screen2Porosity from '../components/Screen2Porosity'
import Screen3Treatments from '../components/Screen3Treatments'
import MotivationalMessage from '../components/MotivationalMessage'

const SCREENS = [
  { id: 'goals', component: Screen1Goals },
  { id: 'porosity', component: Screen2Porosity },
  { id: 'treatments', component: Screen3Treatments },
  { id: 'motivational', component: MotivationalMessage },
]

function QuizContent() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const navigate = useNavigate()

  const handleNext = () => {
    if (currentScreen < SCREENS.length - 1) {
      setCurrentScreen(currentScreen + 1)
    } else {
      // Quiz complete - navigate to results or next page
      navigate('/results')
    }
  }

  const handleBack = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1)
    }
  }

  const CurrentComponent = SCREENS[currentScreen].component

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Progress Bar */}
        <QuizProgress currentScreen={currentScreen + 1} totalScreens={SCREENS.length} />

        {/* Screen Content */}
        <div className="mb-12">
          <CurrentComponent onNext={handleNext} />
        </div>

        {/* Navigation Buttons */}
        {currentScreen > 0 && currentScreen < SCREENS.length - 1 && (
          <button
            onClick={handleBack}
            className="text-purple-primary hover:text-purple-deep font-medium underline"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  )
}

export default function Quiz() {
  return (
    <QuizProvider>
      <QuizContent />
    </QuizProvider>
  )
}

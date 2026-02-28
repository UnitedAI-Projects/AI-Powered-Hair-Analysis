import { useState } from 'react'
import { QuizProvider } from '../context/QuizContext'
import QuizProgress from '../components/QuizProgress'
import Screen1Goals from '../components/Screen1Goals'
import Screen2Porosity from '../components/Screen2Porosity'
import Screen3Treatments from '../components/Screen3Treatments'
import MotivationalMessage from '../components/MotivationalMessage'
import Screen4Journey from '../components/Screen4Journey'
import Screen5Scalp from '../components/Screen5Scalp'
import QuizComplete from '../components/QuizComplete'

const SCREENS = [
  { id: 'goals', component: Screen1Goals },
  { id: 'porosity', component: Screen2Porosity },
  { id: 'treatments', component: Screen3Treatments },
  { id: 'motivational', component: MotivationalMessage },
  { id: 'journey', component: Screen4Journey },
  { id: 'scalp', component: Screen5Scalp },
  { id: 'complete', component: QuizComplete },
]

function QuizContent() {
  const [currentScreen, setCurrentScreen] = useState(0)

  const handleNext = () => {
    if (currentScreen < SCREENS.length - 1) {
      setCurrentScreen(currentScreen + 1)
    }
    // QuizComplete component handles navigation to /upload
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

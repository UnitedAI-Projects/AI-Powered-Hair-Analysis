import React, { createContext, useState } from 'react'

export const QuizContext = createContext()

export function QuizProvider({ children }) {
  const [answers, setAnswers] = useState({
    goals: [],
    porosity: null,
    treatments: [],
    treatmentTiming: null,
  })

  const updateAnswers = (field, value) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <QuizContext.Provider value={{ answers, updateAnswers }}>
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  const context = React.useContext(QuizContext)
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider')
  }
  return context
}

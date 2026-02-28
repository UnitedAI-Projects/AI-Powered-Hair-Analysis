import React, { createContext, useState } from 'react'

export const QuizContext = createContext()

export function QuizProvider({ children }) {
  const [answers, setAnswers] = useState({
    goals: [],
    porosity: null,
    treatments: [],
    treatmentTiming: null,
    journey: null,
    routine: [],
    scalp: null,
    photos: {}, // Will store { roots: base64, midLength: base64, ends: base64, face: base64 }
    analysis: null, // Will store the AI analysis results
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

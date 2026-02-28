export default function QuizProgress({ currentScreen, totalScreens }) {
  return (
    <div className="flex justify-center gap-3 mb-8">
      {Array.from({ length: totalScreens }).map((_, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            index < currentScreen ? 'bg-purple-primary' : 'bg-lavender'
          }`}
        />
      ))}
    </div>
  )
}

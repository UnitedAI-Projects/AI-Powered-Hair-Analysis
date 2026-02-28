import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  const handleStartJourney = () => {
    // Navigate to curl journey page when created
    navigate('/curl-journey')
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating organic shapes */}
        <div className="floating-shape shape-1 absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-lavender to-purple-medium rounded-full opacity-30 blur-3xl"></div>
        <div className="floating-shape shape-2 absolute top-40 right-20 w-40 h-40 bg-gradient-to-br from-purple-medium to-purple-primary rounded-full opacity-20 blur-3xl"></div>
        <div className="floating-shape shape-3 absolute bottom-20 left-1/2 w-36 h-36 bg-gradient-to-br from-lavender to-purple-primary rounded-full opacity-25 blur-3xl"></div>
      </div>

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          {/* Brand name */}
          <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl font-bold text-purple-deep mb-4 tracking-tight">
            Pelora
          </h1>

          {/* Tagline */}
          <p className="text-lg sm:text-xl text-purple-deep mb-12 font-light">
            Expert curl care in your pocket.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleStartJourney}
            className="btn-primary text-lg sm:text-xl mb-16 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Start Your Curl Journey
          </button>

          {/* Descriptive text (optional) */}
          <p className="text-purple-deep text-sm sm:text-base opacity-80 max-w-md mx-auto">
            Your AI-powered companion for personalized curl care advice, product recommendations, and routine optimization.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-4 text-center text-sm text-purple-deep opacity-70">
        <p>Built by Team Pelora | In partnership with United AI</p>
      </footer>
    </div>
  )
}

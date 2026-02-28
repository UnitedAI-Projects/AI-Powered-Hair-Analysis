import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'

const HealthIndicator = ({ level }) => {
  const levels = {
    low: { color: 'bg-green-400', label: 'Low' },
    moderate: { color: 'bg-yellow-400', label: 'Moderate' },
    high: { color: 'bg-orange-400', label: 'High' },
    dry: { color: 'bg-orange-300', label: 'Dry' },
    balanced: { color: 'bg-green-400', label: 'Balanced' },
    'over-moisturized': { color: 'bg-blue-400', label: 'Over-moisturized' },
    none: { color: 'bg-green-500', label: 'None' },
    mild: { color: 'bg-yellow-300', label: 'Mild' },
    significant: { color: 'bg-red-400', label: 'Significant' },
  }

  const config = levels[level] || { color: 'bg-purple-medium', label: 'Moderate' }

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
      <span className="text-purple-deep capitalize">{level}</span>
    </div>
  )
}

export default function Results() {
  const navigate = useNavigate()
  const { answers } = useQuiz()
  const analysis = answers.analysis
  const photos = answers.photos || {}

  if (!analysis) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-serif text-purple-deep mb-4">
            No analysis found. Please start over.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-purple-primary text-cream rounded-full font-semibold hover:bg-purple-deep transition-colors"
          >
            Go to home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream py-8 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION 1: CURL PROFILE HERO */}
        <div className="mb-16 animate-fade-in">
          <div className="text-center mb-12">
            <p className="text-purple-medium font-semibold text-sm tracking-wide mb-4">
              YOUR PERSONALIZED CURL PROFILE
            </p>
            <h1 className="text-6xl sm:text-7xl font-serif text-purple-deep mb-6">
              {analysis.curl_profile?.primary_type}
            </h1>
            <p className="text-2xl font-serif text-purple-primary mb-8">
              {analysis.curl_profile?.primary_type_name}
            </p>
            <p className="text-lg text-purple-deep opacity-90 max-w-2xl mx-auto leading-relaxed">
              {analysis.curl_profile?.description}
            </p>
          </div>

          {/* Photos + Curl Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Photos */}
            {(photos.roots || photos.midLength || photos.ends || photos.face) && (
              <div className="grid grid-cols-2 gap-4">
                {photos.roots && (
                  <img
                    src={photos.roots}
                    alt="Roots"
                    className="w-full h-48 object-cover rounded-2xl shadow-lg"
                  />
                )}
                {photos.midLength && (
                  <img
                    src={photos.midLength}
                    alt="Mid-length"
                    className="w-full h-48 object-cover rounded-2xl shadow-lg"
                  />
                )}
                {photos.ends && (
                  <img
                    src={photos.ends}
                    alt="Ends"
                    className="w-full h-48 object-cover rounded-2xl shadow-lg"
                  />
                )}
                {photos.face && (
                  <img
                    src={photos.face}
                    alt="Face"
                    className="w-full h-48 object-cover rounded-2xl shadow-lg"
                  />
                )}
              </div>
            )}

            {/* Curl Breakdown */}
            <div className="bg-lavender rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <p className="text-purple-medium font-semibold text-xs tracking-wide mb-6">
                  YOUR CURL PATTERN
                </p>
                <div className="space-y-6">
                  <div>
                    <p className="text-purple-medium text-sm font-semibold mb-2">ROOTS</p>
                    <p className="text-4xl font-serif text-purple-deep">
                      {analysis.curl_profile?.roots_type}
                    </p>
                  </div>
                  <div>
                    <p className="text-purple-medium text-sm font-semibold mb-2">MID-LENGTH</p>
                    <p className="text-4xl font-serif text-purple-deep">
                      {analysis.curl_profile?.midlength_type}
                    </p>
                  </div>
                  <div>
                    <p className="text-purple-medium text-sm font-semibold mb-2">ENDS</p>
                    <p className="text-4xl font-serif text-purple-deep">
                      {analysis.curl_profile?.ends_type}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-purple-deep text-sm opacity-70 pt-6 border-t border-purple-medium mt-6">
                Your curls show beautiful variation from roots to ends. This is completely normal and means you'll benefit from targeted care at each section.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: FACE & UNDERTONE */}
        <div className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div
              className="bg-purple-primary text-cream rounded-3xl p-8 shadow-lg transform hover:scale-105 transition-transform duration-300 animate-fade-in"
              style={{ animationDelay: '0.1s' }}
            >
              <p className="text-sm font-semibold opacity-90 mb-4 tracking-wide">FACE SHAPE</p>
              <p className="text-5xl font-serif mb-4">👤</p>
              <p className="text-3xl font-serif capitalize">{analysis.face_shape}</p>
              <p className="text-cream opacity-80 text-sm mt-4">
                This informs which cuts and styles will frame your features best.
              </p>
            </div>

            <div
              className="bg-purple-medium text-cream rounded-3xl p-8 shadow-lg transform hover:scale-105 transition-transform duration-300 animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              <p className="text-sm font-semibold opacity-90 mb-4 tracking-wide">UNDERTONE</p>
              <p className="text-5xl font-serif mb-4">🎨</p>
              <p className="text-3xl font-serif capitalize">{analysis.undertone}</p>
              <p className="text-cream opacity-80 text-sm mt-4">
                Perfect for choosing colors and highlights that complement your natural glow.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: CARE PRIORITIES & HAIR HEALTH */}
        <div className="mb-16">
          <h2 className="text-4xl font-serif text-purple-deep mb-8 animate-fade-in">
            Your Hair's Needs
          </h2>

          {/* Care Priorities as Tags */}
          <div
            className="bg-white border-2 border-purple-medium rounded-3xl p-8 mb-8 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            <p className="text-purple-medium font-semibold text-sm tracking-wide mb-6">
              CARE PRIORITIES
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              {analysis.care_priorities?.map((priority, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-purple-primary text-cream px-4 py-2 rounded-full font-semibold text-sm"
                >
                  {idx + 1}. {priority}
                </span>
              ))}
            </div>
          </div>

          {/* Hair Health Metrics */}
          <div
            className="bg-lavender rounded-3xl p-8 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <p className="text-purple-medium font-semibold text-sm tracking-wide mb-6">
              HAIR HEALTH ASSESSMENT
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div>
                <p className="text-purple-deep font-semibold mb-3">Frizz Level</p>
                <HealthIndicator level={analysis.hair_health?.frizz_level} />
              </div>
              <div>
                <p className="text-purple-deep font-semibold mb-3">Moisture Level</p>
                <HealthIndicator level={analysis.hair_health?.moisture_level} />
              </div>
              <div>
                <p className="text-purple-deep font-semibold mb-3">Damage Signs</p>
                <HealthIndicator level={analysis.hair_health?.damage_signs} />
              </div>
            </div>

            <div className="bg-white bg-opacity-50 rounded-2xl p-6">
              <p className="text-purple-deep leading-relaxed">
                {analysis.hair_health?.health_description}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 4: PRODUCTS FOR YOU */}
        <div className="mb-16 animate-fade-in">
          <h2 className="text-4xl font-serif text-purple-deep mb-8">🧴 Products For You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {analysis.product_recommendations?.map((product, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-lavender rounded-3xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <p className="text-purple-medium font-semibold text-xs tracking-widest mb-3">
                  {product.category?.toUpperCase()}
                </p>
                <h3 className="text-2xl font-serif text-purple-deep mb-1">
                  {product.product_name}
                </h3>
                <p className="text-purple-medium font-medium text-sm mb-4">
                  {product.brand}
                </p>
                <div className="bg-purple-primary text-cream px-3 py-1 rounded-full inline-block mb-4 text-sm font-semibold">
                  {product.price_range}
                </div>
                <p className="text-purple-deep opacity-90 leading-relaxed">
                  {product.why_it_works}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: STYLES & CUTS */}
        {analysis.style_recommendations && analysis.style_recommendations.length > 0 && (
          <div className="mb-16 animate-fade-in">
            <h2 className="text-4xl font-serif text-purple-deep mb-8">💇 Styles & Cuts For You</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analysis.style_recommendations.map((style, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-lavender to-purple-medium text-purple-deep rounded-3xl p-8 shadow-lg transform hover:scale-105 transition-transform duration-300"
                >
                  <h3 className="text-2xl font-serif mb-4">{style.style_name}</h3>
                  <p className="leading-relaxed opacity-95">{style.why_it_suits}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 6: COLOR IDEAS */}
        {analysis.color_suggestions && analysis.color_suggestions.length > 0 && (
          <div className="mb-16 animate-fade-in">
            <h2 className="text-4xl font-serif text-purple-deep mb-8">🎨 Color Ideas</h2>
            <div className="space-y-4">
              {analysis.color_suggestions.map((color, idx) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-purple-medium rounded-3xl p-8 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-2xl font-serif text-purple-deep mb-3">
                    {color.color_name}
                  </h3>
                  <p className="text-purple-deep opacity-80 leading-relaxed">
                    {color.why_it_complements}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 7: 30-DAY CHALLENGE */}
        {analysis.thirty_day_challenge_preview && (
          <div className="mb-16 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-4xl font-serif text-purple-deep">📅 30-Day Curl Challenge</h2>
              <span className="inline-block bg-purple-primary text-cream px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap">
                Coming Soon — Full Plan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {analysis.thirty_day_challenge_preview.map((challenge, idx) => (
                <div
                  key={idx}
                  className="bg-purple-primary text-cream rounded-2xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="text-4xl font-serif mb-3">Day {challenge.day}</div>
                  <h3 className="font-serif text-lg mb-3 leading-tight">
                    {challenge.challenge}
                  </h3>
                  <p className="text-sm opacity-90">{challenge.why}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 8: FOOTER CTA */}
        <div className="text-center py-12 border-t-2 border-purple-medium animate-fade-in">
          <p className="text-purple-deep opacity-70 mb-6 font-medium">
            Ready to start your curl transformation?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-purple-primary text-cream rounded-full font-semibold hover:bg-purple-deep transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Started on Your Challenge
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-8 py-4 border-2 border-purple-primary text-purple-primary rounded-full font-semibold hover:bg-purple-primary hover:text-cream transition-all duration-200"
            >
              Retake Quiz
            </button>
          </div>
          <p className="text-purple-deep opacity-60 text-sm">
            Built by Team Pelora | In partnership with United AI
          </p>
        </div>
      </div>
    </div>
  )
}

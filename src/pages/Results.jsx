import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'

export default function Results() {
  const navigate = useNavigate()
  const { answers } = useQuiz()
  const analysis = answers.analysis

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
    <div className="min-h-screen bg-cream py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl sm:text-6xl font-serif text-purple-deep mb-4">
            Your Curl Profile
          </h1>
          <p className="text-purple-deep opacity-70 text-lg">
            Personalized insights based on your photos and preferences
          </p>
        </div>

        {/* Curl Profile Card */}
        <div className="bg-lavender rounded-3xl p-8 mb-8 animate-fade-in">
          <div className="mb-6">
            <div className="text-5xl mb-4">💜</div>
            <h2 className="text-3xl font-serif text-purple-deep mb-2">
              {analysis.curl_profile?.primary_type} - {analysis.curl_profile?.primary_type_name}
            </h2>
            <p className="text-purple-deep opacity-80 leading-relaxed">
              {analysis.curl_profile?.description}
            </p>
          </div>

          {/* Curl breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t-2 border-purple-medium">
            <div>
              <p className="text-purple-medium text-sm font-semibold">ROOTS</p>
              <p className="text-2xl font-serif text-purple-deep">
                {analysis.curl_profile?.roots_type}
              </p>
            </div>
            <div>
              <p className="text-purple-medium text-sm font-semibold">MID-LENGTH</p>
              <p className="text-2xl font-serif text-purple-deep">
                {analysis.curl_profile?.midlength_type}
              </p>
            </div>
            <div>
              <p className="text-purple-medium text-sm font-semibold">ENDS</p>
              <p className="text-2xl font-serif text-purple-deep">
                {analysis.curl_profile?.ends_type}
              </p>
            </div>
          </div>
        </div>

        {/* Face & Undertone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-purple-primary text-cream rounded-2xl p-6 animate-fade-in">
            <p className="text-sm font-semibold opacity-90 mb-2">FACE SHAPE</p>
            <p className="text-3xl font-serif capitalize">{analysis.face_shape}</p>
          </div>
          <div className="bg-purple-medium text-cream rounded-2xl p-6 animate-fade-in">
            <p className="text-sm font-semibold opacity-90 mb-2">UNDERTONE</p>
            <p className="text-3xl font-serif capitalize">{analysis.undertone}</p>
          </div>
        </div>

        {/* Hair Health */}
        <div className="bg-white border-2 border-lavender rounded-2xl p-6 mb-8 animate-fade-in">
          <h3 className="text-2xl font-serif text-purple-deep mb-4">Hair Health</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-purple-medium text-sm font-semibold">FRIZZ LEVEL</p>
              <p className="text-lg text-purple-deep capitalize">
                {analysis.hair_health?.frizz_level}
              </p>
            </div>
            <div>
              <p className="text-purple-medium text-sm font-semibold">MOISTURE</p>
              <p className="text-lg text-purple-deep capitalize">
                {analysis.hair_health?.moisture_level}
              </p>
            </div>
            <div>
              <p className="text-purple-medium text-sm font-semibold">DAMAGE SIGNS</p>
              <p className="text-lg text-purple-deep capitalize">
                {analysis.hair_health?.damage_signs}
              </p>
            </div>
          </div>
          <p className="text-purple-deep leading-relaxed">
            {analysis.hair_health?.health_description}
          </p>
        </div>

        {/* Care Priorities */}
        <div className="bg-cream border-2 border-purple-medium rounded-2xl p-6 mb-8 animate-fade-in">
          <h3 className="text-2xl font-serif text-purple-deep mb-4">Care Priorities</h3>
          <ol className="space-y-3">
            {analysis.care_priorities?.map((priority, idx) => (
              <li key={idx} className="flex gap-4">
                <span className="text-2xl font-serif text-purple-primary w-8 h-8 flex items-center justify-center bg-lavender rounded-full">
                  {idx + 1}
                </span>
                <span className="text-purple-deep text-lg font-medium leading-relaxed pt-1">
                  {priority}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Product Recommendations */}
        <div className="mb-8 animate-fade-in">
          <h3 className="text-2xl font-serif text-purple-deep mb-6">
            Product Recommendations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {analysis.product_recommendations?.map((product, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-lavender rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <p className="text-purple-medium text-sm font-semibold mb-2">
                  {product.category?.toUpperCase()}
                </p>
                <h4 className="text-lg font-serif text-purple-deep mb-2">
                  {product.product_name}
                </h4>
                <p className="text-purple-medium text-sm mb-3">
                  {product.brand} • {product.price_range}
                </p>
                <p className="text-purple-deep text-sm leading-relaxed">
                  {product.why_it_works}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Style Recommendations */}
        {analysis.style_recommendations && analysis.style_recommendations.length > 0 && (
          <div className="mb-8 animate-fade-in">
            <h3 className="text-2xl font-serif text-purple-deep mb-6">
              Style Ideas for You
            </h3>
            <div className="space-y-4">
              {analysis.style_recommendations.map((style, idx) => (
                <div
                  key={idx}
                  className="bg-lavender rounded-2xl p-6 border-l-4 border-purple-primary"
                >
                  <h4 className="text-lg font-serif text-purple-deep mb-2">
                    {style.style_name}
                  </h4>
                  <p className="text-purple-deep opacity-90">{style.why_it_suits}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Color Suggestions */}
        {analysis.color_suggestions && analysis.color_suggestions.length > 0 && (
          <div className="mb-8 animate-fade-in">
            <h3 className="text-2xl font-serif text-purple-deep mb-6">
              Color Ideas
            </h3>
            <div className="space-y-4">
              {analysis.color_suggestions.map((color, idx) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-purple-medium rounded-2xl p-6"
                >
                  <h4 className="text-lg font-serif text-purple-deep mb-2">
                    {color.color_name}
                  </h4>
                  <p className="text-purple-deep opacity-80">
                    {color.why_it_complements}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 30-Day Challenge Preview */}
        {analysis.thirty_day_challenge_preview && (
          <div className="mb-12 animate-fade-in">
            <h3 className="text-2xl font-serif text-purple-deep mb-6">
              30-Day Curl Challenge Preview
            </h3>
            <div className="space-y-4">
              {analysis.thirty_day_challenge_preview.map((challenge, idx) => (
                <div
                  key={idx}
                  className="bg-purple-primary text-cream rounded-2xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-2xl font-serif bg-cream text-purple-primary w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      {challenge.day}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-1">
                        {challenge.challenge}
                      </h4>
                      <p className="opacity-90">{challenge.why}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mb-8 animate-fade-in">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-purple-primary text-cream rounded-full font-semibold hover:bg-purple-deep transition-colors shadow-lg"
          >
            Get Started on Your Challenge
          </button>
        </div>
      </div>
    </div>
  )
}

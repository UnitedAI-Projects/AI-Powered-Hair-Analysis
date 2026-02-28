import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Quiz from './pages/Quiz'
import PhotoUpload from './pages/PhotoUpload'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/upload" element={<PhotoUpload />} />
      </Routes>
    </Router>
  )
}

export default App

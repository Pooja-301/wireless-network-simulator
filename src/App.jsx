import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import TechnologyDetail from './pages/TechnologyDetail'
import Comparison from './pages/Comparison'
import CoverageMap from './pages/CoverageMap'
import Simulator from './pages/Simulator'
import SignalAttenuation from './pages/SignalAttenuation'
import ThroughputCalc from './pages/ThroughputCalc'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/technology/:id" element={<TechnologyDetail />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="/coverage" element={<CoverageMap />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/signal" element={<SignalAttenuation />} />
          <Route path="/throughput" element={<ThroughputCalc />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App

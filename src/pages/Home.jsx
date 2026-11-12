import { Link } from 'react-router-dom'
import TechCard from '../components/TechCard'
import techData from '../data/technologies.json'

const features = [
  {
    icon: '📊',
    title: 'Performance Comparison',
    desc: 'Interactive charts comparing coverage, speed, latency, and cost across technologies.',
    to: '/comparison',
  },
  {
    icon: '🗺️',
    title: 'Coverage Visualization',
    desc: 'See how different wireless technologies cover geographic areas with color-coded maps.',
    to: '/coverage',
  },
  {
    icon: '🔄',
    title: 'Ad-hoc Simulator',
    desc: 'Build a network of devices, send messages, and watch how routing adapts when links break.',
    to: '/simulator',
  },
  {
    icon: '📡',
    title: 'Signal Attenuation',
    desc: 'Visualize how signal strength degrades with distance using the inverse-square law.',
    to: '/signal',
  },
  {
    icon: '📈',
    title: 'Throughput Calculator',
    desc: "Calculate maximum channel capacity using Shannon's theorem with interactive controls.",
    to: '/throughput',
  },
]

export default function Home() {
  const technologies = Object.values(techData)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-transparent to-blue-50/40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14 relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-1 bg-amber-500 rounded-full" />
              <span className="text-sm font-medium text-amber-600 uppercase tracking-wider">
                Interactive Learning Platform
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight mb-6">
              Wireless Network
              <br />
              <span className="text-amber-500">Simulator Dashboard</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-2xl">
              Explore, compare, and simulate wireless communication technologies
              through an interactive web-based platform. Understand how Cellular,
              Satellite, Wi-Fi, and Broadcast networks work — all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/comparison"
                className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl 
                           hover:bg-amber-600 transition-colors shadow-sm"
              >
                Compare Technologies
              </Link>
              <Link
                to="/simulator"
                className="px-6 py-3 border border-gray-300 text-slate-600 font-medium rounded-xl 
                           hover:border-gray-400 hover:text-slate-800 transition-all"
              >
                Try Simulator →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Wireless Technologies
          </h2>
          <p className="text-slate-500">
            Explore the architecture, working principles, and specifications of each technology.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {technologies.map(tech => (
            <TechCard key={tech.id} tech={tech} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Interactive Features
          </h2>
          <p className="text-slate-500">
            Go beyond reading — interact with data, visualize coverage, and simulate networks.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(f => (
            <Link
              key={f.to}
              to={f.to}
              className="group bg-white border border-gray-200 rounded-2xl p-6 
                         hover:border-amber-300 hover:shadow-md transition-all duration-300"
            >
              <span className="text-3xl mb-4 block">{f.icon}</span>
              <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

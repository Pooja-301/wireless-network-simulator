import { useParams, Link } from 'react-router-dom'
import techData from '../data/technologies.json'

export default function TechnologyDetail() {
  const { id } = useParams()
  const tech = techData[id]

  if (!tech) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Technology Not Found</h2>
        <Link to="/" className="text-amber-600 hover:underline">← Back to Home</Link>
      </div>
    )
  }

  const techIds = Object.keys(techData)
  const currentIdx = techIds.indexOf(id)
  const prevTech = currentIdx > 0 ? techData[techIds[currentIdx - 1]] : null
  const nextTech = currentIdx < techIds.length - 1 ? techData[techIds[currentIdx + 1]] : null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
        <Link to="/" className="hover:text-slate-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-slate-600">{tech.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-10">
        <span className="text-5xl">{tech.icon}</span>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-1">{tech.name}</h1>
          <p className="text-lg text-slate-400">{tech.subtitle}</p>
        </div>
      </div>

      {/* Overview */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: tech.color }} />
          Overview
        </h2>
        <p className="text-slate-600 leading-relaxed">{tech.overview}</p>
      </section>

      {/* How It Works */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: tech.color }} />
          How It Works
        </h2>
        <p className="text-slate-600 leading-relaxed">{tech.howItWorks}</p>
      </section>

      {/* Architecture */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: tech.color }} />
          Network Architecture
        </h2>
        <div className="space-y-3">
          {tech.architecture.layers.map((layer, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ backgroundColor: tech.color + '18', color: tech.color }}
                >
                  L{i + 1}
                </div>
                {i < tech.architecture.layers.length - 1 && (
                  <div className="w-0.5 h-6 bg-gray-200 mt-1" />
                )}
              </div>
              <div className="pt-1">
                <h4 className="font-medium text-slate-700 text-sm">{layer.name}</h4>
                <p className="text-sm text-slate-500">{layer.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Specifications */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: tech.color }} />
          Key Specifications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(tech.specs).map(([key, value]) => (
            <div key={key} className="bg-white border border-gray-200 rounded-xl px-4 py-3">
              <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">{key}</div>
              <div className="text-sm font-medium text-slate-700">{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: tech.color }} />
          Key Features
        </h2>
        <ul className="space-y-2">
          {tech.keyFeatures.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: tech.color }} />
              {feature}
            </li>
          ))}
        </ul>
      </section>

      {/* Use Cases */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: tech.color }} />
          Real-World Applications
        </h2>
        <div className="flex flex-wrap gap-2">
          {tech.useCases.map((uc, i) => (
            <span key={i} className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-slate-600 bg-gray-50">
              {uc}
            </span>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        {prevTech ? (
          <Link to={`/technology/${prevTech.id}`} className="text-sm text-slate-400 hover:text-amber-600 transition-colors">
            ← {prevTech.name}
          </Link>
        ) : <span />}
        {nextTech ? (
          <Link to={`/technology/${nextTech.id}`} className="text-sm text-slate-400 hover:text-amber-600 transition-colors">
            {nextTech.name} →
          </Link>
        ) : <span />}
      </div>
    </div>
  )
}

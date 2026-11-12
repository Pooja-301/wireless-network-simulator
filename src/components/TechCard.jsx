import { Link } from 'react-router-dom'

export default function TechCard({ tech }) {
  return (
    <Link
      to={`/technology/${tech.id}`}
      className="group block bg-white border border-gray-200 rounded-2xl p-6 
                 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-200/60
                 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-4xl">{tech.icon}</span>
        <span
          className="w-3 h-3 rounded-full mt-1"
          style={{ backgroundColor: tech.color }}
        />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-1 group-hover:text-amber-600 transition-colors">
        {tech.name}
      </h3>
      <p className="text-sm text-slate-400 mb-3">{tech.subtitle}</p>
      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
        {tech.overview}
      </p>
      <div className="mt-4 flex items-center gap-1 text-xs text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Explore details</span>
        <span>→</span>
      </div>
    </Link>
  )
}

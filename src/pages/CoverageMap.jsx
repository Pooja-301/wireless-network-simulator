import { useState } from 'react'

const layers = [
  { id: 'wifi', name: 'Wi-Fi', color: '#22c55e', radius: 60, description: 'Local coverage — 30-100m indoor range', icon: '📶' },
  { id: 'cellular', name: 'Cellular (4G/5G)', color: '#3b82f6', radius: 140, description: 'Wide-area coverage — up to 30km per tower', icon: '📡' },
  { id: 'broadcast', name: 'Broadcast (FM/TV)', color: '#a855f7', radius: 220, description: 'Large-area transmission — 50-300km per transmitter', icon: '📻' },
  { id: 'satellite', name: 'Satellite', color: '#f59e0b', radius: 300, description: 'Global coverage — entire hemisphere per GEO satellite', icon: '🛰️' },
]

export default function CoverageMap() {
  const [visible, setVisible] = useState(() => Object.fromEntries(layers.map(l => [l.id, true])))
  const [hovered, setHovered] = useState(null)

  const toggle = id => setVisible(prev => ({ ...prev, [id]: !prev[id] }))
  const cx = 350, cy = 280

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Coverage Visualization</h1>
        <p className="text-slate-500">Compare the coverage range of different wireless technologies. Toggle layers on and off.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm overflow-hidden">
          <svg viewBox="0 0 700 560" className="w-full h-auto" style={{ maxHeight: '560px' }}>
            {Array.from({ length: 15 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={560} stroke="#f1f5f9" strokeWidth={0.5} />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={i * 50} x2={700} y2={i * 50} stroke="#f1f5f9" strokeWidth={0.5} />
            ))}

            {[...layers].reverse().map(layer =>
              visible[layer.id] ? (
                <g key={layer.id}>
                  <circle cx={cx} cy={cy} r={layer.radius}
                    fill={layer.color + '12'} stroke={layer.color}
                    strokeWidth={hovered === layer.id ? 2.5 : 1.5}
                    strokeDasharray={layer.id === 'satellite' ? '8 4' : 'none'}
                    className="transition-all duration-300"
                    onMouseEnter={() => setHovered(layer.id)}
                    onMouseLeave={() => setHovered(null)}
                  />
                  <text x={cx} y={cy - layer.radius + 18} textAnchor="middle"
                    fill={layer.color} fontSize={11} fontWeight={600}
                    className="pointer-events-none select-none">
                    {layer.name}
                  </text>
                </g>
              ) : null
            )}

            <circle cx={cx} cy={cy} r={6} fill="#f59e0b" />
            <circle cx={cx} cy={cy} r={12} fill="none" stroke="#f59e0b" strokeWidth={1} opacity={0.4} />
            <text x={cx} y={cy + 28} textAnchor="middle" fill="#64748b" fontSize={11}>Transmitter</text>

            {[
              { x: 290, y: 260, label: '🏠' }, { x: 410, y: 300, label: '🏢' },
              { x: 340, y: 240, label: '🏫' }, { x: 370, y: 330, label: '🏥' },
              { x: 450, y: 230, label: '🏭' }, { x: 250, y: 340, label: '🏘️' },
            ].map((b, i) => (
              <text key={i} x={b.x} y={b.y} fontSize={16} className="pointer-events-none select-none">{b.label}</text>
            ))}

            <g>
              <line x1={30} y1={530} x2={130} y2={530} stroke="#94a3b8" strokeWidth={1.5} />
              <line x1={30} y1={525} x2={30} y2={535} stroke="#94a3b8" strokeWidth={1.5} />
              <line x1={130} y1={525} x2={130} y2={535} stroke="#94a3b8" strokeWidth={1.5} />
              <text x={80} y={548} textAnchor="middle" fill="#94a3b8" fontSize={10}>~10 km</text>
            </g>
          </svg>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4">Technology Layers</h3>
            <div className="space-y-3">
              {layers.map(layer => (
                <button key={layer.id} onClick={() => toggle(layer.id)}
                  onMouseEnter={() => setHovered(layer.id)} onMouseLeave={() => setHovered(null)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left ${
                    visible[layer.id] ? 'border-gray-200 bg-gray-50' : 'border-gray-100 bg-transparent opacity-50'
                  }`}>
                  <div className="w-4 h-4 rounded-full shrink-0 border-2"
                    style={{ borderColor: layer.color, backgroundColor: visible[layer.id] ? layer.color : 'transparent' }} />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                      <span>{layer.icon}</span>{layer.name}
                    </div>
                    <div className="text-xs text-slate-400 truncate">{layer.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-3">Coverage Details</h3>
            {hovered ? (() => {
              const layer = layers.find(l => l.id === hovered)
              return (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{layer.icon}</span>
                    <span className="font-medium text-slate-700">{layer.name}</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{layer.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layer.color }} />
                    <span className="text-xs text-slate-400">Relative radius: {layer.radius} units</span>
                  </div>
                </div>
              )
            })() : <p className="text-sm text-slate-400">Hover over a layer or circle to see details.</p>}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">•</span>Satellite provides global coverage but at higher latency and cost.</li>
              <li className="flex items-start gap-2"><span className="text-purple-500 mt-0.5">•</span>Broadcast covers large areas efficiently for one-way transmission.</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span>Cellular balances coverage and mobility for mobile users.</li>
              <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">•</span>Wi-Fi has the smallest range but highest speed for local access.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

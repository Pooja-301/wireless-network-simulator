import { useState, useMemo } from 'react'

const CANVAS_W = 700
const CANVAS_H = 500

const presets = [
  { name: 'Wi-Fi (2.4 GHz)', freq: 2400, txPower: 20, color: '#22c55e' },
  { name: 'Wi-Fi (5 GHz)', freq: 5000, txPower: 18, color: '#06b6d4' },
  { name: 'Cellular 4G', freq: 1800, txPower: 43, color: '#3b82f6' },
  { name: 'Cellular 5G (mmWave)', freq: 28000, txPower: 30, color: '#8b5cf6' },
  { name: 'FM Radio', freq: 100, txPower: 50, color: '#a855f7' },
]

// Free-Space Path Loss: FSPL(dB) = 20·log10(d) + 20·log10(f) - 147.55
// where d is in meters and f is in Hz
// Signal at distance d: P_rx = P_tx - FSPL
function calcSignalStrength(txPowerDbm, freqMhz, distMeters) {
  if (distMeters <= 0) return txPowerDbm
  const freqHz = freqMhz * 1e6
  const fspl = 20 * Math.log10(distMeters) + 20 * Math.log10(freqHz) - 147.55
  return txPowerDbm - fspl
}

function signalToQuality(dbm) {
  if (dbm >= -30) return { label: 'Excellent', color: '#22c55e', pct: 100 }
  if (dbm >= -50) return { label: 'Very Good', color: '#84cc16', pct: 85 }
  if (dbm >= -60) return { label: 'Good', color: '#f59e0b', pct: 70 }
  if (dbm >= -70) return { label: 'Fair', color: '#f97316', pct: 50 }
  if (dbm >= -80) return { label: 'Weak', color: '#ef4444', pct: 30 }
  if (dbm >= -90) return { label: 'Very Weak', color: '#dc2626', pct: 15 }
  return { label: 'No Signal', color: '#6b7280', pct: 0 }
}

export default function SignalAttenuation() {
  const [frequency, setFrequency] = useState(2400)
  const [txPower, setTxPower] = useState(20)
  const [selectedPreset, setSelectedPreset] = useState(0)
  const [obstacles, setObstacles] = useState([
    { x: 350, y: 200, loss: 12, label: 'Concrete Wall' },
    { x: 500, y: 300, loss: 3, label: 'Glass Window' },
  ])
  const [showObstacles, setShowObstacles] = useState(true)

  const txX = 120
  const txY = 250

  const applyPreset = (idx) => {
    setSelectedPreset(idx)
    setFrequency(presets[idx].freq)
    setTxPower(presets[idx].txPower)
  }

  // Generate signal strength rings
  const rings = useMemo(() => {
    const result = []
    const maxDist = 500 // pixels representing ~500m for Wi-Fi, scaled per freq
    const steps = 60
    for (let i = 1; i <= steps; i++) {
      const r = (maxDist / steps) * i
      const distMeters = r * (frequency < 500 ? 200 : frequency < 3000 ? 1 : 0.5)
      let signal = calcSignalStrength(txPower, frequency, distMeters)
      // Apply obstacle losses
      if (showObstacles) {
        obstacles.forEach(obs => {
          const obsDist = Math.sqrt((txX + r - obs.x) ** 2 + (txY - obs.y) ** 2)
          if (obsDist < 40) {
            signal -= obs.loss * (1 - obsDist / 40)
          }
        })
      }
      const q = signalToQuality(signal)
      result.push({ r, signal, ...q })
    }
    return result
  }, [frequency, txPower, obstacles, showObstacles])

  // Distance markers
  const distanceMarkers = useMemo(() => {
    const markers = []
    const scaleFactor = frequency < 500 ? 200 : frequency < 3000 ? 1 : 0.5
    const distances = [10, 50, 100, 200, 300, 400, 500]
    distances.forEach(d => {
      const r = d / scaleFactor
      if (r > 0 && r < 500) {
        const signal = calcSignalStrength(txPower, frequency, d)
        markers.push({ r, d, signal })
      }
    })
    return markers.slice(0, 5)
  }, [frequency, txPower])

  // Probe points for the table
  const probeDistances = frequency < 500
    ? [100, 500, 1000, 5000, 10000, 50000]
    : frequency < 3000
      ? [1, 5, 10, 25, 50, 100]
      : [1, 5, 10, 20, 50, 100]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Signal Attenuation Visualizer</h1>
        <p className="text-slate-500">
          See how signal strength degrades with distance using the Free-Space Path Loss model.
          The formula: <span className="font-mono text-sm text-slate-600">FSPL(dB) = 20·log₁₀(d) + 20·log₁₀(f) − 147.55</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visualization */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} className="w-full h-auto">
            {/* Background grid */}
            {Array.from({ length: 15 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={CANVAS_H} stroke="#f1f5f9" strokeWidth={0.5} />
            ))}
            {Array.from({ length: 11 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={i * 50} x2={CANVAS_W} y2={CANVAS_H} stroke="#f1f5f9" strokeWidth={0.5} />
            ))}

            {/* Signal rings — drawn as semi-circles extending right from transmitter */}
            {[...rings].reverse().map((ring, i) => (
              <circle
                key={i}
                cx={txX}
                cy={txY}
                r={ring.r}
                fill={ring.color + '08'}
                stroke={ring.color}
                strokeWidth={0.3}
                opacity={0.6}
              />
            ))}

            {/* Obstacle markers */}
            {showObstacles && obstacles.map((obs, i) => (
              <g key={`obs-${i}`}>
                <rect x={obs.x - 20} y={obs.y - 25} width={40} height={50}
                  fill="#ef444418" stroke="#ef4444" strokeWidth={1.5} rx={4} strokeDasharray="4 2" />
                <text x={obs.x} y={obs.y - 30} textAnchor="middle" fill="#ef4444" fontSize={9} fontWeight={600}>
                  {obs.label}
                </text>
                <text x={obs.x} y={obs.y} textAnchor="middle" fill="#ef4444" fontSize={10}>
                  -{obs.loss} dB
                </text>
              </g>
            ))}

            {/* Transmitter */}
            <circle cx={txX} cy={txY} r={10} fill={presets[selectedPreset].color} />
            <circle cx={txX} cy={txY} r={16} fill="none" stroke={presets[selectedPreset].color} strokeWidth={1.5} opacity={0.4}>
              <animate attributeName="r" from="14" to="28" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
            </circle>
            <text x={txX} y={txY - 24} textAnchor="middle" fill="#475569" fontSize={11} fontWeight={600}>
              📡 Transmitter
            </text>
            <text x={txX} y={txY + 30} textAnchor="middle" fill="#64748b" fontSize={9}>
              {txPower} dBm @ {frequency >= 1000 ? `${(frequency/1000).toFixed(1)} GHz` : `${frequency} MHz`}
            </text>

            {/* Distance labels along the center line */}
            <line x1={txX + 16} y1={txY} x2={CANVAS_W - 20} y2={txY} stroke="#cbd5e1" strokeWidth={0.5} strokeDasharray="4 4" />
            {distanceMarkers.map((m, i) => (
              <g key={`dm-${i}`}>
                <line x1={txX + m.r} y1={txY - 5} x2={txX + m.r} y2={txY + 5} stroke="#94a3b8" strokeWidth={1} />
                <text x={txX + m.r} y={txY + 18} textAnchor="middle" fill="#94a3b8" fontSize={8}>
                  {m.d >= 1000 ? `${(m.d/1000).toFixed(0)}km` : `${m.d}m`}
                </text>
                <text x={txX + m.r} y={txY - 10} textAnchor="middle" fill={signalToQuality(m.signal).color} fontSize={8} fontWeight={600}>
                  {m.signal.toFixed(0)} dBm
                </text>
              </g>
            ))}

            {/* Color legend */}
            <g transform="translate(20, 440)">
              {[
                { label: 'Excellent', color: '#22c55e' },
                { label: 'Good', color: '#f59e0b' },
                { label: 'Weak', color: '#ef4444' },
                { label: 'Dead', color: '#6b7280' },
              ].map((item, i) => (
                <g key={i} transform={`translate(${i * 100}, 0)`}>
                  <rect width={12} height={12} rx={2} fill={item.color + '30'} stroke={item.color} strokeWidth={1} />
                  <text x={16} y={10} fill="#64748b" fontSize={9}>{item.label}</text>
                </g>
              ))}
            </g>
          </svg>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Presets */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-3">Technology Preset</h3>
            <div className="space-y-2">
              {presets.map((p, i) => (
                <button key={i} onClick={() => applyPreset(i)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-all ${
                    selectedPreset === i
                      ? 'border-amber-300 bg-amber-50 text-slate-700'
                      : 'border-gray-100 text-slate-500 hover:border-gray-200'
                  }`}>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="font-medium">{p.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Controls */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4">Parameters</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Frequency</span>
                  <span className="text-slate-800 font-mono font-medium">
                    {frequency >= 1000 ? `${(frequency/1000).toFixed(1)} GHz` : `${frequency} MHz`}
                  </span>
                </div>
                <input type="range" min={50} max={40000} step={50} value={frequency}
                  onChange={e => setFrequency(Number(e.target.value))}
                  className="w-full accent-amber-500" />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>50 MHz</span><span>40 GHz</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">TX Power</span>
                  <span className="text-slate-800 font-mono font-medium">{txPower} dBm</span>
                </div>
                <input type="range" min={0} max={60} step={1} value={txPower}
                  onChange={e => setTxPower(Number(e.target.value))}
                  className="w-full accent-amber-500" />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0 dBm</span><span>60 dBm</span>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={showObstacles} onChange={e => setShowObstacles(e.target.checked)}
                  className="accent-amber-500 w-4 h-4" />
                <span className="text-sm text-slate-600">Show obstacles (walls/windows)</span>
              </label>
            </div>
          </div>

          {/* Signal Table */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-3">Signal at Distance</h3>
            <div className="space-y-2">
              {probeDistances.map(d => {
                const sig = calcSignalStrength(txPower, frequency, d)
                const q = signalToQuality(sig)
                return (
                  <div key={d} className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-mono">
                      {d >= 1000 ? `${(d/1000).toFixed(0)} km` : `${d} m`}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-700">{sig.toFixed(1)} dBm</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: q.color + '18', color: q.color }}>
                        {q.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Formula explanation */}
      <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-3">How It Works — Free-Space Path Loss</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              The <strong>Free-Space Path Loss (FSPL)</strong> model calculates how much signal power is lost
              as a radio wave travels through free space. Signal strength decreases with both distance and frequency
              following the inverse-square law.
            </p>
            <div className="bg-gray-50 rounded-xl px-4 py-3 font-mono text-sm text-slate-700">
              FSPL(dB) = 20·log₁₀(d) + 20·log₁₀(f) − 147.55
            </div>
            <p className="text-xs text-slate-400 mt-2">where d = distance in meters, f = frequency in Hz</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">Key Observations</h4>
            <ul className="space-y-1.5 text-sm text-slate-500">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                Doubling the distance reduces signal by ~6 dB
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                Higher frequencies attenuate faster (5 GHz Wi-Fi has shorter range than 2.4 GHz)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                Obstacles like walls introduce additional loss (12 dB for concrete, 3 dB for glass)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                Higher TX power extends usable range but does not change the rate of decay
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

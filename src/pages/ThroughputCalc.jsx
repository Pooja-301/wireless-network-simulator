import { useState, useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

// Shannon–Hartley theorem: C = B × log₂(1 + SNR)
// where C = capacity (bps), B = bandwidth (Hz), SNR = linear signal-to-noise ratio
function shannonCapacity(bandwidthMhz, snrDb) {
  const B = bandwidthMhz * 1e6
  const snrLinear = Math.pow(10, snrDb / 10)
  return B * Math.log2(1 + snrLinear)
}

function formatBits(bps) {
  if (bps >= 1e9) return `${(bps / 1e9).toFixed(2)} Gbps`
  if (bps >= 1e6) return `${(bps / 1e6).toFixed(2)} Mbps`
  if (bps >= 1e3) return `${(bps / 1e3).toFixed(2)} Kbps`
  return `${bps.toFixed(0)} bps`
}

const presets = [
  { name: 'Wi-Fi 6 (160 MHz, typical)', bw: 160, snr: 30, desc: 'Indoor, close range' },
  { name: 'Wi-Fi 5 (80 MHz, typical)', bw: 80, snr: 25, desc: 'Standard home Wi-Fi' },
  { name: '4G LTE (20 MHz)', bw: 20, snr: 20, desc: 'Urban cellular' },
  { name: '5G NR (100 MHz)', bw: 100, snr: 22, desc: 'Sub-6 GHz band' },
  { name: '5G mmWave (400 MHz)', bw: 400, snr: 18, desc: 'High frequency, short range' },
  { name: 'FM Radio (200 KHz)', bw: 0.2, snr: 40, desc: 'Analog broadcast audio' },
  { name: 'Satellite (36 MHz)', bw: 36, snr: 10, desc: 'Typical transponder' },
]

export default function ThroughputCalc() {
  const [bandwidth, setBandwidth] = useState(20)
  const [snr, setSnr] = useState(20)
  const [activePreset, setActivePreset] = useState(2)

  const capacity = useMemo(() => shannonCapacity(bandwidth, snr), [bandwidth, snr])

  const applyPreset = (idx) => {
    setActivePreset(idx)
    setBandwidth(presets[idx].bw)
    setSnr(presets[idx].snr)
  }

  // Chart: Capacity vs SNR for current bandwidth
  const snrChartData = useMemo(() => {
    const labels = []
    const data = []
    for (let s = 0; s <= 40; s += 2) {
      labels.push(`${s}`)
      data.push(shannonCapacity(bandwidth, s) / 1e6) // in Mbps
    }
    return {
      labels,
      datasets: [{
        label: `Capacity at ${bandwidth} MHz bandwidth`,
        data,
        borderColor: '#f59e0b',
        backgroundColor: '#f59e0b18',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHitRadius: 10,
      }],
    }
  }, [bandwidth])

  // Chart: Capacity vs Bandwidth for current SNR
  const bwChartData = useMemo(() => {
    const labels = []
    const data = []
    const maxBw = Math.max(200, bandwidth * 3)
    const step = Math.max(1, Math.floor(maxBw / 30))
    for (let b = step; b <= maxBw; b += step) {
      labels.push(`${b}`)
      data.push(shannonCapacity(b, snr) / 1e6)
    }
    return {
      labels,
      datasets: [{
        label: `Capacity at ${snr} dB SNR`,
        data,
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f618',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHitRadius: 10,
      }],
    }
  }, [snr, bandwidth])

  const chartOptions = (xLabel) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#475569', usePointStyle: true, pointStyleWidth: 12 } },
      tooltip: {
        backgroundColor: '#fff', titleColor: '#1e293b', bodyColor: '#475569',
        borderColor: '#e2e8f0', borderWidth: 1, cornerRadius: 8, padding: 12,
        callbacks: { label: ctx => ` ${ctx.raw.toFixed(1)} Mbps` }
      },
    },
    scales: {
      x: { title: { display: true, text: xLabel, color: '#64748b' }, ticks: { color: '#64748b' }, grid: { color: '#f1f5f9' } },
      y: { title: { display: true, text: 'Capacity (Mbps)', color: '#64748b' }, ticks: { color: '#64748b' }, grid: { color: '#f1f5f9' } },
    },
  })

  // Efficiency comparison
  const spectralEfficiency = (capacity / (bandwidth * 1e6)).toFixed(2)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Throughput Calculator</h1>
        <p className="text-slate-500">
          Calculate maximum theoretical channel capacity using{' '}
          <strong>Shannon–Hartley theorem</strong>:{' '}
          <span className="font-mono text-sm text-slate-600">C = B × log₂(1 + SNR)</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Result + Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Big result card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="text-sm text-slate-500 mb-1">Maximum Theoretical Throughput</div>
            <div className="text-4xl font-bold text-amber-600 mb-3">{formatBits(capacity)}</div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-slate-400 mb-1">Bandwidth</div>
                <div className="text-sm font-semibold text-slate-700">
                  {bandwidth >= 1 ? `${bandwidth} MHz` : `${(bandwidth * 1000).toFixed(0)} KHz`}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-slate-400 mb-1">SNR</div>
                <div className="text-sm font-semibold text-slate-700">{snr} dB</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-slate-400 mb-1">Spectral Efficiency</div>
                <div className="text-sm font-semibold text-slate-700">{spectralEfficiency} bps/Hz</div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Capacity vs SNR</h3>
              <div className="h-[250px]">
                <Line data={snrChartData} options={chartOptions('SNR (dB)')} />
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Capacity vs Bandwidth</h3>
              <div className="h-[250px]">
                <Line data={bwChartData} options={chartOptions('Bandwidth (MHz)')} />
              </div>
            </div>
          </div>

          {/* Technology comparison table */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-slate-800">Technology Comparison — Theoretical Max</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-6 py-3 text-slate-500 font-medium">Technology</th>
                    <th className="text-left px-6 py-3 text-slate-500 font-medium">Bandwidth</th>
                    <th className="text-left px-6 py-3 text-slate-500 font-medium">Typical SNR</th>
                    <th className="text-left px-6 py-3 text-slate-500 font-medium">Shannon Limit</th>
                  </tr>
                </thead>
                <tbody>
                  {presets.map((p, i) => {
                    const cap = shannonCapacity(p.bw, p.snr)
                    return (
                      <tr key={i} className={`border-t border-gray-100 ${activePreset === i ? 'bg-amber-50/50' : ''}`}>
                        <td className="px-6 py-3 text-slate-700 font-medium">{p.name}</td>
                        <td className="px-6 py-3 text-slate-500 font-mono">
                          {p.bw >= 1 ? `${p.bw} MHz` : `${(p.bw * 1000).toFixed(0)} KHz`}
                        </td>
                        <td className="px-6 py-3 text-slate-500 font-mono">{p.snr} dB</td>
                        <td className="px-6 py-3 text-slate-700 font-mono font-medium">{formatBits(cap)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Controls sidebar */}
        <div className="space-y-4">
          {/* Presets */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-3">Quick Presets</h3>
            <div className="space-y-2">
              {presets.map((p, i) => (
                <button key={i} onClick={() => applyPreset(i)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm border transition-all ${
                    activePreset === i
                      ? 'border-amber-300 bg-amber-50 text-slate-700'
                      : 'border-gray-100 text-slate-500 hover:border-gray-200'
                  }`}>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-slate-400">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Manual sliders */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4">Manual Input</h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Bandwidth (B)</span>
                  <span className="text-slate-800 font-mono font-medium">
                    {bandwidth >= 1 ? `${bandwidth} MHz` : `${(bandwidth * 1000).toFixed(0)} KHz`}
                  </span>
                </div>
                <input type="range" min={0.1} max={500} step={0.1} value={bandwidth}
                  onChange={e => setBandwidth(Number(e.target.value))}
                  className="w-full accent-amber-500" />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>100 KHz</span><span>500 MHz</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">SNR (Signal-to-Noise)</span>
                  <span className="text-slate-800 font-mono font-medium">{snr} dB</span>
                </div>
                <input type="range" min={0} max={40} step={1} value={snr}
                  onChange={e => setSnr(Number(e.target.value))}
                  className="w-full accent-amber-500" />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0 dB</span><span>40 dB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formula explanation */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-3">The Formula</h3>
            <div className="bg-gray-50 rounded-xl px-4 py-3 font-mono text-sm text-slate-700 mb-3 text-center">
              C = B × log₂(1 + SNR)
            </div>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><strong className="text-slate-700">C</strong> — Channel capacity (bits per second)</li>
              <li><strong className="text-slate-700">B</strong> — Bandwidth of the channel (Hz)</li>
              <li><strong className="text-slate-700">SNR</strong> — Signal-to-Noise Ratio (linear)</li>
              <li><strong className="text-slate-700">log₂</strong> — Base-2 logarithm (binary capacity)</li>
            </ul>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              This gives the theoretical maximum — real throughput is always lower
              due to protocol overhead, interference, and modulation constraints.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

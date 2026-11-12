import { useState, useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Radar } from 'react-chartjs-2'
import compData from '../data/comparison.json'

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  RadialLinearScale, PointElement, LineElement,
  Filler, Tooltip, Legend
)

const techKeys = Object.keys(compData.technologies)

export default function Comparison() {
  const [chartType, setChartType] = useState('bar')
  const [selected, setSelected] = useState(() =>
    Object.fromEntries(techKeys.map(k => [k, true]))
  )

  const toggle = key => {
    const nextSelected = { ...selected, [key]: !selected[key] }
    if (Object.values(nextSelected).some(Boolean)) setSelected(nextSelected)
  }

  const activeTechs = techKeys.filter(k => selected[k])

  const barData = useMemo(() => ({
    labels: compData.parameters,
    datasets: activeTechs.map(name => ({
      label: name,
      data: compData.technologies[name].values,
      backgroundColor: compData.technologies[name].color,
      borderColor: compData.technologies[name].borderColor,
      borderWidth: 1,
      borderRadius: 4,
    })),
  }), [activeTechs])

  const radarData = useMemo(() => ({
    labels: compData.parameters,
    datasets: activeTechs.map(name => ({
      label: name,
      data: compData.technologies[name].values,
      backgroundColor: compData.technologies[name].color.replace('0.7', '0.12'),
      borderColor: compData.technologies[name].borderColor,
      borderWidth: 2,
      pointBackgroundColor: compData.technologies[name].borderColor,
      pointRadius: 4,
    })),
  }), [activeTechs])

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#475569', padding: 16, usePointStyle: true, pointStyleWidth: 12 },
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: ctx => {
            const name = ctx.dataset.label
            const paramIdx = ctx.dataIndex
            const textLabel = compData.technologies[name].labels[paramIdx]
            return ` ${name}: ${ctx.raw}/10 (${textLabel})`
          }
        }
      },
    },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: '#f1f5f9' } },
      y: { min: 0, max: 10, ticks: { color: '#64748b', stepSize: 2 }, grid: { color: '#f1f5f9' } },
    },
  }

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#475569', padding: 16, usePointStyle: true, pointStyleWidth: 12 },
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      r: {
        min: 0, max: 10,
        ticks: { stepSize: 2, color: '#64748b', backdropColor: 'transparent' },
        grid: { color: '#e2e8f0' },
        angleLines: { color: '#e2e8f0' },
        pointLabels: { color: '#475569', font: { size: 13 } },
      },
    },
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Performance Comparison</h1>
        <p className="text-slate-500">
          Compare wireless technologies across coverage, mobility, latency, speed, and cost.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {techKeys.map(name => (
            <button
              key={name}
              onClick={() => toggle(name)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                selected[name]
                  ? 'text-white'
                  : 'border-gray-200 text-slate-400 bg-white hover:border-gray-300'
              }`}
              style={
                selected[name]
                  ? { backgroundColor: compData.technologies[name].borderColor,
                      borderColor: compData.technologies[name].borderColor }
                  : {}
              }
            >
              {name}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center bg-white border border-gray-200 rounded-lg p-1">
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              chartType === 'bar' ? 'bg-gray-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Bar Chart
          </button>
          <button
            onClick={() => setChartType('radar')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              chartType === 'radar' ? 'bg-gray-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Radar Chart
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-10 shadow-sm">
        <div className="h-[420px]">
          {chartType === 'bar' ? (
            <Bar data={barData} options={barOptions} />
          ) : (
            <Radar data={radarData} options={radarOptions} />
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-slate-800">Detailed Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Parameter</th>
                {activeTechs.map(name => (
                  <th key={name} className="text-left px-6 py-3 font-medium"
                      style={{ color: compData.technologies[name].borderColor }}>
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compData.parameters.map((param, i) => (
                <tr key={param} className="border-t border-gray-100">
                  <td className="px-6 py-3 text-slate-700 font-medium">{param}</td>
                  {activeTechs.map(name => (
                    <td key={name} className="px-6 py-3 text-slate-500">
                      {compData.technologies[name].labels[i]}
                      <span className="text-slate-300 ml-1">({compData.technologies[name].values[i]}/10)</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

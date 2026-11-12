import { useState, useRef, useCallback, useEffect } from 'react'

const NODE_RADIUS = 22
const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ef4444', '#06b6d4', '#ec4899', '#84cc16']

function dist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

function findPath(nodes, edges, fromId, toId) {
  const adj = {}
  nodes.forEach(n => (adj[n.id] = []))
  edges.forEach(e => { adj[e.from].push(e.to); adj[e.to].push(e.from) })
  const visited = new Set()
  const queue = [[fromId, [fromId]]]
  visited.add(fromId)
  while (queue.length > 0) {
    const [current, path] = queue.shift()
    if (current === toId) return path
    for (const neighbor of adj[current]) {
      if (!visited.has(neighbor)) { visited.add(neighbor); queue.push([neighbor, [...path, neighbor]]) }
    }
  }
  return null
}

export default function Simulator() {
  const svgRef = useRef(null)
  const [nodes, setNodes] = useState([
    { id: 1, x: 200, y: 180, label: 'Device A' },
    { id: 2, x: 450, y: 120, label: 'Device B' },
    { id: 3, x: 550, y: 300, label: 'Device C' },
    { id: 4, x: 300, y: 380, label: 'Device D' },
    { id: 5, x: 120, y: 340, label: 'Device E' },
  ])
  const [edges, setEdges] = useState([
    { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 },
    { from: 4, to: 5 }, { from: 5, to: 1 }, { from: 1, to: 4 },
  ])
  const [nextId, setNextId] = useState(6)
  const [mode, setMode] = useState('select')
  const [connectFrom, setConnectFrom] = useState(null)
  const [sendFrom, setSendFrom] = useState(null)
  const [dragging, setDragging] = useState(null)
  const [message, setMessage] = useState(null)
  const [log, setLog] = useState(['Welcome! Use the controls above to interact with the network.'])
  const animRef = useRef(null)

  const addLog = useCallback(text => setLog(prev => [text, ...prev].slice(0, 30)), [])

  const getNodeAt = useCallback((x, y) => nodes.find(n => dist(n, { x, y }) < NODE_RADIUS + 5), [nodes])

  const getEdgeAt = useCallback((x, y) => {
    for (const edge of edges) {
      const a = nodes.find(n => n.id === edge.from)
      const b = nodes.find(n => n.id === edge.to)
      if (!a || !b) continue
      const len = dist(a, b)
      if (len === 0) continue
      const t = Math.max(0, Math.min(1, ((x - a.x) * (b.x - a.x) + (y - a.y) * (b.y - a.y)) / (len * len)))
      const proj = { x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) }
      if (dist({ x, y }, proj) < 10) return edge
    }
    return null
  }, [nodes, edges])

  const getSvgCoords = useCallback(e => {
    const svg = svgRef.current
    const rect = svg.getBoundingClientRect()
    return { x: ((e.clientX - rect.left) / rect.width) * 700, y: ((e.clientY - rect.top) / rect.height) * 500 }
  }, [])

  const handleSvgClick = useCallback(e => {
    if (message) return
    const { x, y } = getSvgCoords(e)
    const clickedNode = getNodeAt(x, y)

    if (mode === 'add' && !clickedNode) {
      const id = nextId
      const label = `Device ${String.fromCharCode(64 + id)}`
      setNodes(prev => [...prev, { id, x, y, label }])
      setNextId(prev => prev + 1)
      addLog(`Added ${label}`)
    } else if (mode === 'connect') {
      if (clickedNode) {
        if (connectFrom === null) { setConnectFrom(clickedNode.id); addLog(`Select second node to connect with ${clickedNode.label}...`) }
        else if (connectFrom !== clickedNode.id) {
          const exists = edges.some(e => (e.from === connectFrom && e.to === clickedNode.id) || (e.from === clickedNode.id && e.to === connectFrom))
          if (!exists) { setEdges(prev => [...prev, { from: connectFrom, to: clickedNode.id }]); addLog(`Connected ${nodes.find(n => n.id === connectFrom).label} ↔ ${clickedNode.label}`) }
          else addLog('Connection already exists!')
          setConnectFrom(null)
        }
      }
    } else if (mode === 'delete' && clickedNode) {
      setNodes(prev => prev.filter(n => n.id !== clickedNode.id))
      setEdges(prev => prev.filter(e => e.from !== clickedNode.id && e.to !== clickedNode.id))
      addLog(`Removed ${clickedNode.label}`)
    } else if (mode === 'break') {
      const edge = getEdgeAt(x, y)
      if (edge) {
        setEdges(prev => prev.filter(e => e !== edge))
        addLog(`Broke connection: ${nodes.find(n => n.id === edge.from).label} ↔ ${nodes.find(n => n.id === edge.to).label}`)
      }
    } else if (mode === 'send' && clickedNode) {
      if (sendFrom === null) { setSendFrom(clickedNode.id); addLog(`Select destination for message from ${clickedNode.label}...`) }
      else if (sendFrom !== clickedNode.id) {
        const path = findPath(nodes, edges, sendFrom, clickedNode.id)
        if (path) { addLog(`Sending: ${path.map(id => nodes.find(n => n.id === id).label).join(' → ')}`); setMessage({ path, step: 0, progress: 0 }) }
        else addLog(`No path found!`)
        setSendFrom(null)
      }
    }
  }, [mode, connectFrom, sendFrom, nodes, edges, message, nextId, getNodeAt, getEdgeAt, getSvgCoords, addLog])

  const handleMouseDown = useCallback(e => {
    if (mode !== 'select' || message) return
    const { x, y } = getSvgCoords(e)
    const node = getNodeAt(x, y)
    if (node) setDragging({ id: node.id, offsetX: x - node.x, offsetY: y - node.y })
  }, [mode, message, getSvgCoords, getNodeAt])

  const handleMouseMove = useCallback(e => {
    if (!dragging) return
    const { x, y } = getSvgCoords(e)
    setNodes(prev => prev.map(n => n.id === dragging.id
      ? { ...n, x: Math.max(30, Math.min(670, x - dragging.offsetX)), y: Math.max(30, Math.min(470, y - dragging.offsetY)) } : n))
  }, [dragging, getSvgCoords])

  const handleMouseUp = useCallback(() => setDragging(null), [])

  useEffect(() => {
    if (!message) return
    const { path, step, progress } = message
    if (step >= path.length - 1) { addLog('Message delivered successfully! ✓'); setMessage(null); return }
    animRef.current = requestAnimationFrame(() => {
      const np = progress + 0.025
      if (np >= 1) setMessage({ path, step: step + 1, progress: 0 })
      else setMessage({ path, step, progress: np })
    })
    return () => cancelAnimationFrame(animRef.current)
  }, [message, addLog])

  let packetPos = null
  if (message && message.step < message.path.length - 1) {
    const from = nodes.find(n => n.id === message.path[message.step])
    const to = nodes.find(n => n.id === message.path[message.step + 1])
    if (from && to) packetPos = { x: from.x + (to.x - from.x) * message.progress, y: from.y + (to.y - from.y) * message.progress }
  }

  const modes = [
    { id: 'select', label: '🖱️ Select & Drag', desc: 'Move nodes around' },
    { id: 'add', label: '➕ Add Node', desc: 'Click empty area to add' },
    { id: 'connect', label: '🔗 Connect', desc: 'Click two nodes to link' },
    { id: 'send', label: '📨 Send Message', desc: 'Pick source then destination' },
    { id: 'break', label: '✂️ Break Link', desc: 'Click a connection line' },
    { id: 'delete', label: '🗑️ Delete Node', desc: 'Click a node to remove it' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Ad-hoc Network Simulator</h1>
        <p className="text-slate-500">Build a wireless network, send messages between devices, and see how communication adapts when connections break.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {modes.map(m => (
          <button key={m.id}
            onClick={() => { setMode(m.id); setConnectFrom(null); setSendFrom(null) }}
            className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
              mode === m.id ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-gray-200 text-slate-500 hover:border-gray-300 hover:text-slate-700'
            }`} title={m.desc}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-3 shadow-sm overflow-hidden">
          <div className="text-xs text-slate-400 mb-2 px-1">
            Mode: <span className="text-slate-600">{modes.find(m => m.id === mode)?.desc}</span>
            {connectFrom && <span className="text-amber-600 ml-2">→ From: {nodes.find(n => n.id === connectFrom)?.label}</span>}
            {sendFrom && <span className="text-amber-600 ml-2">→ From: {nodes.find(n => n.id === sendFrom)?.label}</span>}
          </div>
          <svg ref={svgRef} viewBox="0 0 700 500" className="w-full h-auto bg-slate-50 rounded-xl border border-gray-100"
            style={{ maxHeight: '500px', cursor: mode === 'add' ? 'crosshair' : mode === 'select' ? 'grab' : 'pointer' }}
            onClick={handleSvgClick} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            {Array.from({ length: 15 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={500} stroke="#e2e8f0" strokeWidth={0.5} />
            ))}
            {Array.from({ length: 11 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={i * 50} x2={700} y2={i * 50} stroke="#e2e8f0" strokeWidth={0.5} />
            ))}

            {edges.map((edge, i) => {
              const from = nodes.find(n => n.id === edge.from)
              const to = nodes.find(n => n.id === edge.to)
              if (!from || !to) return null
              const isOnPath = message && message.path.some((id, idx) => idx < message.path.length - 1 &&
                ((message.path[idx] === edge.from && message.path[idx + 1] === edge.to) ||
                 (message.path[idx] === edge.to && message.path[idx + 1] === edge.from)))
              return <line key={`e-${i}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={isOnPath ? '#f59e0b' : '#cbd5e1'} strokeWidth={isOnPath ? 2.5 : 1.5} className="transition-all duration-300" />
            })}

            {nodes.map((node, i) => {
              const color = COLORS[i % COLORS.length]
              const isActive = connectFrom === node.id || sendFrom === node.id || (message && message.path.includes(node.id))
              return (
                <g key={node.id}>
                  {isActive && (
                    <circle cx={node.x} cy={node.y} r={NODE_RADIUS + 8} fill="none" stroke={color} strokeWidth={1} opacity={0.3}>
                      <animate attributeName="r" from={NODE_RADIUS + 4} to={NODE_RADIUS + 20} dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.4" to="0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle cx={node.x} cy={node.y} r={NODE_RADIUS} fill={color + '15'} stroke={color}
                    strokeWidth={isActive ? 2.5 : 1.5} className="transition-all duration-200" />
                  <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle" fill={color}
                    fontSize={14} className="pointer-events-none select-none">📱</text>
                  <text x={node.x} y={node.y + NODE_RADIUS + 14} textAnchor="middle" fill="#64748b"
                    fontSize={10} className="pointer-events-none select-none">{node.label}</text>
                </g>
              )
            })}

            {packetPos && (
              <g>
                <circle cx={packetPos.x} cy={packetPos.y} r={8} fill="#f59e0b" opacity={0.3}>
                  <animate attributeName="r" from="6" to="16" dur="0.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.4" to="0" dur="0.8s" repeatCount="indefinite" />
                </circle>
                <circle cx={packetPos.x} cy={packetPos.y} r={6} fill="#f59e0b" />
                <text x={packetPos.x} y={packetPos.y + 1} textAnchor="middle" dominantBaseline="middle"
                  fill="#fff" fontSize={8} fontWeight="bold" className="pointer-events-none select-none">✉</text>
              </g>
            )}
          </svg>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col">
          <h3 className="font-semibold text-slate-800 mb-1">Activity Log</h3>
          <p className="text-xs text-slate-400 mb-3">{nodes.length} nodes · {edges.length} connections</p>
          <div className="flex-1 overflow-y-auto space-y-1.5 max-h-80 lg:max-h-[420px]">
            {log.map((entry, i) => (
              <div key={i} className={`text-xs leading-relaxed px-2 py-1.5 rounded ${
                i === 0 ? 'bg-amber-50 text-slate-700' : 'text-slate-400'
              }`}>{entry}</div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-medium text-slate-500 mb-2">Quick Guide</h4>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>• <strong>Select & Drag</strong> — move nodes around</li>
              <li>• <strong>Add Node</strong> — click empty space</li>
              <li>• <strong>Connect</strong> — click two nodes</li>
              <li>• <strong>Send Message</strong> — pick source, then target</li>
              <li>• <strong>Break Link</strong> — click a connection line</li>
              <li>• <strong>Delete Node</strong> — click a node to remove</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

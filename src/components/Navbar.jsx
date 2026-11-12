import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { HiMenuAlt3, HiX } from 'react-icons/hi'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/comparison', label: 'Compare' },
  { to: '/coverage', label: 'Coverage Map' },
  { to: '/simulator', label: 'Simulator' },
  { to: '/signal', label: 'Signal' },
  { to: '/throughput', label: 'Throughput' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🛰️</span>
            <div>
              <span className="font-bold text-lg text-slate-800 group-hover:text-amber-600 transition-colors">
                WNS
              </span>
              <span className="hidden sm:inline text-sm text-slate-400 ml-2">
                Dashboard
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-slate-500 hover:text-slate-800"
          >
            {open ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.to
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

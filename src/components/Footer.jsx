export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🛰️</span>
            <span className="text-sm text-slate-500">
              Wireless Network Simulator Dashboard
            </span>
          </div>
          <div className="text-sm text-slate-400">
            B.Tech CSE CC — 7th Semester Project
          </div>
          <div className="text-xs text-slate-400">
            Usha • Aditya • Pooja • Ranuraj
          </div>
        </div>
      </div>
    </footer>
  )
}

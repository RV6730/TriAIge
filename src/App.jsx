import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { Activity, Mic, BarChart2, Zap } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Intake from './pages/Intake'
import Surveillance from './pages/Surveillance'
import PublicTracker from './pages/PublicTracker'

function AppLayout() {
  const location = useLocation()
  const isTracker = location.pathname.startsWith('/tracker')

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top Nav - Hidden on Tracker */}
      {!isTracker && (
        <nav className="border-b border-gray-800 bg-gray-950/95 backdrop-blur sticky top-0 z-50">
          <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                  <Zap size={16} className="text-white" />
                </div>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-950 animate-pulse" />
              </div>
              <div>
                <span className="text-white font-bold text-lg tracking-tight">Tri<span className="text-red-500">AI</span>ge</span>
                <span className="ml-2 text-gray-500 text-xs font-mono hidden sm:inline">// Emergency System</span>
              </div>
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
              <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} id="nav-dashboard">
                <Activity size={15} /> Dashboard
              </NavLink>
              <NavLink to="/intake" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} id="nav-intake">
                <Mic size={15} /> Intake
              </NavLink>
              <NavLink to="/surveillance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} id="nav-surveillance">
                <BarChart2 size={15} /> Surveillance
              </NavLink>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              LIVE
            </div>
          </div>
        </nav>
      )}

      {/* Page Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/intake" element={<Intake />} />
          <Route path="/surveillance" element={<Surveillance />} />
          <Route path="/tracker/:id" element={<PublicTracker />} />
        </Routes>
      </main>

      {/* Footer - Hidden on Tracker */}
      {!isTracker && (
        <footer className="border-t border-gray-800 px-6 py-3 text-center text-xs text-gray-600 font-mono">
          TriAIge v1.0 · AI-Powered Triage · Powered by Sarvam AI + Claude + ABHA · Built for Bharat 🇮🇳
        </footer>
      )}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

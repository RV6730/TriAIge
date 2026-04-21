import { MapPin, Activity } from 'lucide-react'

export default function AmbulanceMap({ route = [], currentIdx = 0 }) {
  // Safety guard: if route is missing or empty, show a loading state
  if (!route || route.length === 0) {
    return (
      <div className="w-full h-48 bg-gray-900/80 rounded-xl border border-gray-700 flex items-center justify-center">
        <span className="text-xs text-gray-500 font-mono animate-pulse">Initializing GPS Signal...</span>
      </div>
    )
  }

  const idx = Math.min(currentIdx, route.length - 1)
  const current = route[idx] || route[0]
  
  // Transform route into SVG path
  const pathData = route.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <div className="relative w-full h-48 bg-gray-900/80 rounded-xl border border-gray-700 overflow-hidden shadow-inner">
      {/* City Grid Mockup */}
      <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
      </svg>

      <svg className="absolute inset-0 w-full h-full p-6" viewBox="0 0 100 100">
        {/* Main Road Path */}
        <path
          d={pathData}
          fill="none"
          stroke="#374151"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Progress Path */}
        <path
          d={route.slice(0, idx + 1).map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
          fill="none"
          stroke="#ef4444"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-1000 ease-in-out"
        />

        {/* Path dots */}
        {route.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.5" fill={i <= idx ? '#ef4444' : '#4b5563'} />
        ))}

        {/* Pickup Point (Origin) */}
        <g transform={`translate(${route[0].x - 3}, ${route[0].y - 8})`}>
          <path d="M 3 8 L 3 3 A 3 3 0 1 1 3.1 3 Z" fill="#4b5563" />
          <circle cx="3" cy="3" r="1" fill="white" />
          <text x="3" y="-2" textAnchor="middle" fontSize="3.5" fill="#9ca3af" fontWeight="bold">PICKUP</text>
        </g>

        {/* Destination (Hospital) */}
        <g transform="translate(85, 2)">
          <rect width="12" height="12" rx="2" fill="#1e40af" className="animate-pulse" />
          <path d="M 6 3 L 6 9 M 3 6 L 9 6" stroke="white" strokeWidth="2" />
          <text x="6" y="16" textAnchor="middle" fontSize="4" fill="#60a5fa" fontWeight="black">HOSPITAL</text>
        </g>

        {/* Ambulance Marker */}
        {current && (
          <g 
            className="transition-all duration-1000 ease-in-out"
            transform={`translate(${current.x - 4}, ${current.y - 4})`}
          >
            <circle cx="4" cy="4" r="5" fill="#ef4444" className="animate-ping opacity-40" />
            <rect width="8" height="6" y="1" rx="1.5" fill="#ef4444" />
            <rect width="3" height="3" x="1" y="2" rx="0.5" fill="white" opacity="0.4" />
            <circle cx="2.5" cy="7" r="1" fill="black" />
            <circle cx="5.5" cy="7" r="1" fill="black" />
          </g>
        )}
      </svg>

      {/* Overlay info */}
      <div className="absolute bottom-2 left-3 flex items-center gap-2">
        <Activity size={10} className="text-red-500 animate-pulse" />
        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">Live GPS Tracking Active</span>
      </div>
    </div>
  )
}

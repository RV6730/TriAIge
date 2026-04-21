import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getSocket } from '../lib/socket'
import AmbulanceMap from '../components/AmbulanceMap'
import { MapPin, Clock, Shield, Phone, Zap } from 'lucide-react'

export default function PublicTracker() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Initial fetch for the static data
    fetch('/api/ambulance/current')
      .then(res => res.json())
      .then(d => {
        if (d.case_id === id || id === 'demo' || id.startsWith('AMB')) {
          setData(d)
        } else {
          setError(true)
        }
      })
      .catch(() => setError(true))

    const socket = getSocket()
    socket.on('ambulance_update', (update) => {
      setData(prev => {
        if (!prev) return prev
        if (update.case_id === prev.case_id) {
          return { ...prev, eta_minutes: update.eta_minutes, current_location_idx: update.current_location_idx }
        }
        return prev
      })
    })

    return () => socket.off('ambulance_update')
  }, [id])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-4">
          <MapPin size={32} className="text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Tracking Link Invalid</h1>
        <p className="text-gray-400 text-sm italic">The case ID was not found or the trip has ended.</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col animate-fade-in">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-gray-800 bg-gray-950/70 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-red-600 flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">TriAIge <span className="text-red-500">Live</span></span>
        </div>
        <div className="text-[10px] bg-green-950 text-green-400 border border-green-900/50 px-2 py-0.5 rounded font-mono font-bold animate-pulse">
          CONNECTED
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Patient / ETA */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-sm text-gray-500 font-mono tracking-widest uppercase mb-1">Incoming Ambulance</h2>
            <p className="text-2xl font-black text-white">{data.patient_name}</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-red-400 font-bold uppercase tracking-wider">
              <Shield size={11} /> {data.ai_pre_triage}
            </div>
          </div>
          <div className="text-right shrink-0">
             <div className="text-4xl font-black font-mono text-white leading-none">{data.eta_minutes}</div>
             <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">MINUTES ETA</div>
          </div>
        </div>

        {/* The Map */}
        <div className="glass-card overflow-hidden">
          <AmbulanceMap route={data.route} currentIdx={data.current_location_idx} />
        </div>

        {/* Trip Details */}
        <div className="space-y-4">
          <div className="flex gap-4 p-4 glass-card border border-gray-800">
            <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center shrink-0 border border-blue-800/50">
              <MapPin size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Towards Destination</p>
              <p className="text-sm font-bold text-white">AIIMS Emergency Dept</p>
              <p className="text-xs text-gray-400">Bengaluru · Main Trauma Center</p>
            </div>
          </div>

          <div className="flex gap-4 p-4 glass-card border border-gray-800">
            <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center shrink-0 border border-green-800/50">
              <Phone size={20} className="text-green-400" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Assigned Paramedic</p>
              <p className="text-sm font-bold text-white">Vinay K. (ID-4421)</p>
              <button className="mt-2 flex items-center gap-1.5 text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold">
                <Phone size={11} /> Call Emergency Team
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-6 pb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock size={12} className="text-gray-600" />
            <span className="text-[10px] text-gray-600 font-mono tracking-tighter">Updated just now · Ref: {data.case_id}</span>
          </div>
          <p className="text-[10px] text-gray-700 leading-relaxed max-w-[240px] mx-auto italic">
            This tracking is provided by the TriAIge Network. For life-threatening changes, please call the number above.
          </p>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { AlertTriangle, X, MapPin, Heart, Activity, Wind, Brain, Map } from 'lucide-react'
import AmbulanceMap from './AmbulanceMap'

function VitalBadge({ label, value, unit, warn }) {
  return (
    <div className={`rounded-lg px-3 py-2 text-center ${warn ? 'bg-red-950/60 border border-red-800' : 'bg-gray-800/60 border border-gray-700'}`}>
      <div className={`text-lg font-black font-mono ${warn ? 'text-red-400' : 'text-white'}`}>
        {value}<span className="text-xs font-normal ml-0.5">{unit}</span>
      </div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  )
}

export default function AmbulanceAlert({ data, onDismiss }) {
  const [showMap, setShowMap] = useState(false)
  if (!data) return null

  const v = data.vitals || {}

  return (
    <div className="mx-6 mt-4 animate-slide-in">
      <div className="relative rounded-xl border-2 border-red-700 bg-red-950/20 backdrop-blur overflow-hidden">
        {/* Animated top bar */}
        <div className="h-0.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 animate-pulse" />

        <div className="p-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <AlertTriangle size={20} className="text-white" />
                </div>
                <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-60" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-red-400 tracking-wider font-mono text-sm">AMBULANCE INCOMING</span>
                  <span className="bg-red-700 text-white text-xs px-2 py-0.5 rounded font-mono font-bold">
                    ETA: {data.eta_minutes}m
                  </span>
                </div>
                <p className="text-white font-bold mt-0.5">{data.patient_name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-red-400 font-bold">{data.ai_pre_triage}</p>
                  <button 
                    id="toggle-ambulance-map"
                    onClick={() => setShowMap(!showMap)}
                    className="flex items-center gap-1 text-[10px] bg-red-900/40 hover:bg-red-900/60 border border-red-800 text-red-300 px-1.5 py-0.5 rounded transition-all"
                  >
                    <Map size={10} /> {showMap ? 'Hide Map' : 'Track on Map'}
                  </button>
                </div>
              </div>
            </div>
            <button
              id="ambulance-dismiss"
              onClick={onDismiss}
              className="text-gray-500 hover:text-white transition-colors p-1 rounded"
            >
              <X size={18} />
            </button>
          </div>

          {/* Map View */}
          {showMap && (
            <div className="mb-4 animate-fade-in">
              <AmbulanceMap route={data.route} currentIdx={data.current_location_idx} />
            </div>
          )}

          {/* Content grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left: Info */}
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <MapPin size={13} className="text-gray-500 mt-0.5 shrink-0" />
                <span className="text-gray-300 text-xs">{data.pickup_location}</span>
              </div>
              <div className="text-xs text-gray-300 bg-gray-800/50 rounded p-2 border border-gray-700">
                <span className="text-gray-500 font-mono">Chief Complaint: </span>
                {data.reported_complaint}
              </div>
            </div>

            {/* Center: Vitals */}
            <div>
              <p className="section-label mb-2">Live Vitals</p>
              <div className="grid grid-cols-3 gap-1.5">
                <VitalBadge label="SpO₂" value={v.spo2} unit="%" warn={v.spo2 < 94} />
                <VitalBadge label="HR" value={v.heart_rate} unit="bpm" warn={v.heart_rate > 110} />
                <VitalBadge label="RR" value={v.rr} unit="/min" warn={v.rr > 20} />
                <div className="col-span-2">
                  <VitalBadge label="BP" value={`${v.bp_systolic}/${v.bp_diastolic}`} unit="mmHg" warn={v.bp_systolic > 140} />
                </div>
                <VitalBadge label="GCS" value={v.gcs} unit="/15" warn={v.gcs < 14} />
              </div>
            </div>

            {/* Right: ASHA checklist */}
            <div>
              <p className="section-label mb-2">ASHA Pre-check</p>
              {data.asha_pre_check?.completed && (
                <div className="bg-green-950/30 border border-green-900 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-2 text-xs text-green-400 font-semibold">
                    <Activity size={11} />
                    {data.asha_pre_check.worker_name}
                  </div>
                  <ul className="space-y-1">
                    {data.asha_pre_check.checklist_flags.map((flag, i) => (
                      <li key={i} className="text-xs text-red-300 flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-red-500 rounded-full" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { User, Heart, Pill, AlertTriangle, Shield, Phone, Clock, ChevronRight, MessageSquare, Loader, CheckCircle } from 'lucide-react'
import { sendWhatsApp } from '../lib/api'

const TRIAGE_CONFIG = {
  RED: {
    label: 'CRITICAL — IMMEDIATE',
    border: 'border-red-700',
    glow: 'shadow-red-900/40',
    badge: 'badge-red',
    dot: 'bg-red-500',
    text: 'text-red-400',
    bg: 'bg-red-950/30',
  },
  YELLOW: {
    label: 'URGENT',
    border: 'border-yellow-700',
    glow: 'shadow-yellow-900/30',
    badge: 'badge-yellow',
    dot: 'bg-yellow-500',
    text: 'text-yellow-400',
    bg: 'bg-yellow-950/30',
  },
  GREEN: {
    label: 'NON-URGENT',
    border: 'border-green-700',
    glow: '',
    badge: 'badge-green',
    dot: 'bg-green-500',
    text: 'text-green-400',
    bg: 'bg-green-950/20',
  },
}

export default function PatientCard({ patient, abhaData, triageResult }) {
  const [notifLoading, setNotifLoading] = useState(false)
  const [notifSent, setNotifSent] = useState(false)

  const cat = patient.category || 'GREEN'
  const cfg = TRIAGE_CONFIG[cat] || TRIAGE_CONFIG.GREEN

  const handleNotify = async () => {
    if (!abhaData?.emergency_contact?.phone) return
    setNotifLoading(true)
    try {
      await sendWhatsApp({
        to_phone: abhaData.emergency_contact.phone,
        patient_name: patient.name,
        queue_position: patient.id || 1,
        wait_minutes: patient.wait || 0,
        triage_status: cat,
        doctor_name: patient.doctor || 'Dr. On-Call',
      })
      setNotifSent(true)
      setTimeout(() => setNotifSent(false), 5000)
    } catch {
      // fail silently
    } finally {
      setNotifLoading(false)
    }
  }

  return (
    <div className={`glass-card border ${cfg.border} shadow-lg ${cfg.glow} h-full flex flex-col animate-fade-in`}>
      {/* Header */}
      <div className={`${cfg.bg} px-5 py-4 rounded-t-xl border-b border-gray-800 flex items-start justify-between`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${cfg.dot} ${cat === 'RED' ? 'animate-pulse' : ''}`} />
            <span className={`font-mono text-xs font-bold tracking-wider ${cfg.text}`}>{cfg.label}</span>
          </div>
          <h2 className="text-xl font-bold text-white">{patient.name}</h2>
          <p className="text-sm text-gray-400 font-mono">{patient.age}y · {patient.gender || 'M'} · {abhaData?.blood_group || patient.blood_group || 'B+'}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black font-mono text-white">
            #{patient.id || 1}
          </div>
          <div className="text-xs text-gray-500">Queue</div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

        {/* Triage AI result */}
        {triageResult && (
          <div>
            <p className="section-label">AI Triage Assessment</p>
            <div className="glass-card border border-gray-700 p-3 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{triageResult.suspected_condition}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{triageResult.triage_reason}</p>
                </div>
                <div className="text-center shrink-0">
                  <div className={`text-2xl font-black font-mono ${cfg.text}`}>{triageResult.severity_score}</div>
                  <div className="text-xs text-gray-500">/10</div>
                </div>
              </div>

              {/* Symptoms */}
              <div className="flex flex-wrap gap-1.5">
                {(triageResult.symptoms || []).map((s, i) => (
                  <span key={i} className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded font-mono">
                    {s}
                  </span>
                ))}
              </div>

              {/* Red flags */}
              {triageResult.red_flags?.length > 0 && (
                <div className="flex items-start gap-2 text-xs text-red-400 bg-red-950/30 border border-red-900 rounded p-2">
                  <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                  <span>{triageResult.red_flags.join(' · ')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Current condition */}
        <div>
          <p className="section-label">Presenting Condition</p>
          <div className={`${cfg.badge} inline-flex items-center gap-1.5 mb-2`}>
            <span>{cat}</span>
          </div>
          <p className="text-sm text-gray-300">{patient.condition}</p>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
            <Clock size={11} />
            {patient.wait === 0 ? 'Now being seen' : `Wait: ~${patient.wait} minutes`}
          </div>
        </div>

        {/* Doctor */}
        <div>
          <p className="section-label">Assigned Doctor</p>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-900 flex items-center justify-center">
              <User size={14} className="text-blue-300" />
            </div>
            <span className="text-sm text-white">{patient.doctor}</span>
          </div>
        </div>

        {/* ABHA data if available */}
        {abhaData && (
          <>
            {/* Medications/Conditions summary */}
            {(abhaData.chronic_conditions?.length > 0 || abhaData.allergies?.length > 0) && (
              <div className="grid grid-cols-2 gap-3">
                {abhaData.allergies?.length > 0 && (
                  <div>
                    <p className="section-label text-[10px]">Allergies</p>
                    <p className="text-[11px] text-orange-400 font-mono truncate">{abhaData.allergies.join(', ')}</p>
                  </div>
                )}
                {abhaData.chronic_conditions?.length > 0 && (
                  <div>
                    <p className="section-label text-[10px]">Conditions</p>
                    <p className="text-[11px] text-red-400 font-mono truncate">{abhaData.chronic_conditions[0]}</p>
                  </div>
                )}
              </div>
            )}

            {/* PM-JAY */}
            {abhaData.pmjay_eligible && (
              <div>
                <p className="section-label text-[10px]">PM-JAY Protection</p>
                <div className="bg-blue-950/20 border border-blue-900/50 rounded p-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield size={12} className="text-blue-400" />
                    <span className="text-[10px] text-gray-300 font-mono">{abhaData.pmjay_card_number}</span>
                  </div>
                  <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest">ACTIVE</span>
                </div>
              </div>
            )}

            {/* Emergency contact & WhatsApp */}
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="section-label text-[10px]">Family Update</p>
                  <div className="flex items-center gap-2">
                    <Phone size={11} className="text-green-500" />
                    <span className="text-xs text-white font-medium">{abhaData.emergency_contact?.name || 'Contact'}</span>
                  </div>
                </div>
                <button
                  id="card-whatsapp-btn"
                  onClick={handleNotify}
                  disabled={notifLoading || !abhaData.emergency_contact}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border
                    ${notifSent 
                      ? 'bg-green-950/40 border-green-700 text-green-400' 
                      : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-white'}`}
                >
                  {notifLoading ? <Loader size={12} className="animate-spin" /> : 
                   notifSent ? <CheckCircle size={12} /> : <MessageSquare size={12} />}
                  {notifSent ? 'SENT' : 'WHATSAPP'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

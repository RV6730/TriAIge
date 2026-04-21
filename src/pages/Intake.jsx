import { useState } from 'react'
import VoiceRecorder from '../components/VoiceRecorder'
import PatientCard from '../components/PatientCard'
import { fetchABHA, submitTextIntake, getDemoTriage, sendWhatsApp } from '../lib/api'
import { Search, Send, Loader, CheckCircle, AlertTriangle, FileText, Mic } from 'lucide-react'

const ABHA_IDS = ['DEFAULT', 'ABHA-2024-DEMO-001', 'ABHA-2024-DEMO-002', 'ABHA-2024-DEMO-003']
const LANG_NAMES = {
  'hi-IN': 'Hindi', 'ta-IN': 'Tamil', 'te-IN': 'Telugu', 'bn-IN': 'Bengali',
  'mr-IN': 'Marathi', 'kn-IN': 'Kannada', 'gu-IN': 'Gujarati', 'ml-IN': 'Malayalam', 'en-IN': 'English',
}

const CAT_COLORS = {
  'RED (immediate)': 'text-red-400 bg-red-950/40 border-red-700',
  'YELLOW (urgent)': 'text-yellow-400 bg-yellow-950/40 border-yellow-700',
  'GREEN (non-urgent)': 'text-green-400 bg-green-950/40 border-green-700',
}

function TriageResultPanel({ result, transcript }) {
  if (!result) return null
  const cat = result.triage_category || ''
  const colorClass = Object.entries(CAT_COLORS).find(([k]) => cat.toLowerCase().includes(k.split(' ')[0].toLowerCase()))?.[1]
    || 'text-gray-400 bg-gray-900 border-gray-700'

  return (
    <div className="glass-card animate-fade-in">
      <div className={`border ${colorClass} rounded-xl p-5 space-y-4`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="section-label">AI Triage Result</p>
            <h3 className="text-lg font-bold text-white">{result.suspected_condition}</h3>
            <p className="text-sm text-gray-400 mt-0.5">{result.triage_reason}</p>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-black font-mono ${colorClass.split(' ')[0]}`}>{result.severity_score}</div>
            <div className="text-xs text-gray-500">/10 severity</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="section-label">Category</p>
            <span className={`inline-block text-xs font-mono font-bold px-2 py-1 rounded border ${colorClass}`}>
              {result.triage_category}
            </span>
          </div>
          <div>
            <p className="section-label">Duration</p>
            <p className="text-sm text-white font-mono">{result.duration}</p>
          </div>
        </div>

        {result.symptoms?.length > 0 && (
          <div>
            <p className="section-label">Symptoms</p>
            <div className="flex flex-wrap gap-1.5">
              {result.symptoms.map((s, i) => (
                <span key={i} className="bg-gray-800 text-gray-200 text-xs px-2 py-0.5 rounded font-mono border border-gray-700">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {result.red_flags?.length > 0 && (
          <div className="flex items-start gap-2 text-xs bg-red-950/30 border border-red-900 rounded-lg p-3">
            <AlertTriangle size={13} className="text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-red-400 font-bold mb-0.5">Red Flags</p>
              <p className="text-red-300">{result.red_flags.join(' · ')}</p>
            </div>
          </div>
        )}

        {result.needs_specialist && result.needs_specialist !== 'none' && (
          <p className="text-xs text-yellow-400 font-mono">
            → Refer to: <span className="font-bold uppercase">{result.needs_specialist}</span>
          </p>
        )}

        {transcript && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
            <p className="section-label">Patient Statement</p>
            <p className="text-sm text-gray-300 italic">"{transcript}"</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Intake() {
  const [mode, setMode] = useState('voice') // 'voice' | 'text'
  const [abhaId, setAbhaId] = useState('')
  const [abhaData, setAbhaData] = useState(null)
  const [abhaLoading, setAbhaLoading] = useState(false)
  const [abhaError, setAbhaError] = useState(null)
  const [triage, setTriage] = useState(null)
  const [transcript, setTranscript] = useState('')
  const [textInput, setTextInput] = useState('')
  const [textLang, setTextLang] = useState('English')
  const [textLoading, setTextLoading] = useState(false)
  const [notifSent, setNotifSent] = useState(false)
  const [notifLoading, setNotifLoading] = useState(false)

  const handleABHALookup = async () => {
    if (!abhaId.trim()) return
    setAbhaLoading(true)
    setAbhaError(null)
    setAbhaData(null)
    try {
      const res = await fetchABHA(abhaId.trim())
      setAbhaData(res.patient)
    } catch (e) {
      setAbhaError('Could not fetch record. Check the ABHA ID and try again.')
    } finally {
      setAbhaLoading(false)
    }
  }

  const handleTriageResult = (result, tx) => {
    setTriage(result)
    if (tx) setTranscript(tx)
  }

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return
    setTextLoading(true)
    try {
      const res = await submitTextIntake(textInput, textLang, abhaId || null)
      setTriage(res.triage)
      setTranscript(res.transcript)
    } finally {
      setTextLoading(false)
    }
  }

  const handleDemoTriage = async () => {
    setTextLoading(true)
    try {
      const res = await getDemoTriage()
      setTriage(res.triage)
      setTranscript(res.transcript)
      setAbhaId('DEFAULT')
      const r = await fetchABHA('DEFAULT')
      setAbhaData(r.patient)
    } finally {
      setTextLoading(false)
    }
  }

  const handleNotify = async () => {
    if (!abhaData?.emergency_contact?.phone) return
    setNotifLoading(true)
    const cat = triage?.triage_category?.split(' ')[0] || 'GREEN'
    try {
      await sendWhatsApp({
        to_phone: abhaData.emergency_contact.phone,
        patient_name: abhaData.name,
        queue_position: 3,
        wait_minutes: 15,
        triage_status: cat,
        doctor_name: 'Dr. On-Call',
      })
      setNotifSent(true)
    } finally {
      setNotifLoading(false)
    }
  }

  const patientForCard = abhaData
    ? {
        id: '—',
        name: abhaData.name,
        age: abhaData.age,
        gender: abhaData.gender,
        category: triage?.triage_category?.includes('RED') ? 'RED'
          : triage?.triage_category?.includes('YELLOW') ? 'YELLOW' : 'GREEN',
        condition: triage?.suspected_condition || 'Pending...',
        wait: 15,
        doctor: 'Dr. On-Call',
      }
    : null

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-6">
      <h1 className="text-lg font-bold text-white mb-1">Patient Intake</h1>
      <p className="text-xs text-gray-500 font-mono mb-6">AI-powered voice/text symptom intake · Sarvam STT + Claude triage</p>

      <div className="grid grid-cols-12 gap-6">
        {/* Left column: ABHA + intake */}
        <div className="col-span-12 lg:col-span-5 space-y-5">

          {/* ABHA Lookup */}
          <div className="glass-card p-5">
            <p className="section-label">ABHA / Patient ID</p>
            <div className="flex gap-2">
              <input
                id="abha-input"
                list="abha-suggestions"
                value={abhaId}
                onChange={(e) => setAbhaId(e.target.value)}
                placeholder="Enter ABHA ID or scan QR"
                className="field flex-1"
              />
              <datalist id="abha-suggestions">
                {ABHA_IDS.map((id) => <option key={id} value={id} />)}
              </datalist>
              <button
                id="abha-lookup-btn"
                onClick={handleABHALookup}
                disabled={abhaLoading}
                className="btn-secondary shrink-0"
              >
                {abhaLoading ? <Loader size={14} className="animate-spin" /> : <Search size={14} />}
                Fetch
              </button>
            </div>
            {abhaData && (
              <div className="mt-3 text-xs text-green-400 flex items-center gap-1.5 animate-fade-in">
                <CheckCircle size={12} />
                Loaded: {abhaData.name} · {abhaData.age}y · {abhaData.blood_group}
              </div>
            )}
            {abhaError && (
              <div className="mt-3 text-xs text-red-400 flex items-center gap-1.5 animate-fade-in">
                <AlertTriangle size={12} />
                {abhaError}
              </div>
            )}
          </div>

          {/* Mode selector */}
          <div className="flex gap-1 p-1 bg-gray-900 rounded-xl border border-gray-800">
            <button
              id="intake-mode-voice"
              onClick={() => setMode('voice')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2
                ${mode === 'voice' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Mic size={14} /> Voice Intake
            </button>
            <button
              id="intake-mode-text"
              onClick={() => setMode('text')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2
                ${mode === 'text' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <FileText size={14} /> Text Intake
            </button>
          </div>

          {/* Voice recorder */}
          {mode === 'voice' && (
            <VoiceRecorder onTriageResult={handleTriageResult} abhaId={abhaId || null} />
          )}

          {/* Text intake */}
          {mode === 'text' && (
            <div className="glass-card p-5 space-y-3">
              <div>
                <p className="section-label">Language</p>
                <select
                  id="text-lang-select"
                  value={textLang}
                  onChange={(e) => setTextLang(e.target.value)}
                  className="field"
                >
                  {Object.values(LANG_NAMES).map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <p className="section-label">Patient Complaint (type or dictate)</p>
                <textarea
                  id="text-symptom-input"
                  rows={5}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="e.g. Severe chest pain radiating to left arm since 1 hour, sweating profusely..."
                  className="field resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  id="text-submit-btn"
                  onClick={handleTextSubmit}
                  disabled={textLoading || !textInput.trim()}
                  className="btn-primary flex-1"
                >
                  {textLoading ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
                  Analyse with Claude
                </button>
              </div>
            </div>
          )}

          {/* Demo button */}
          <button
            id="demo-triage-btn"
            onClick={handleDemoTriage}
            disabled={textLoading}
            className="btn-ghost w-full justify-center border border-dashed border-gray-700"
          >
            {textLoading ? <Loader size={14} className="animate-spin" /> : null}
            ⚡ Load Demo Triage (no API keys needed)
          </button>

          {/* Triage result */}
          <TriageResultPanel result={triage} transcript={transcript} />

          {/* Notify family */}
          {triage && abhaData?.emergency_contact && (
            <div className="glass-card p-4 border border-gray-700">
              <p className="section-label">Family Notification</p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-300">
                  WhatsApp → <span className="font-mono text-green-400">{abhaData.emergency_contact.name}</span>
                </p>
                {notifSent ? (
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <CheckCircle size={12} /> Sent
                  </span>
                ) : (
                  <button
                    id="notify-family-btn"
                    onClick={handleNotify}
                    disabled={notifLoading}
                    className="btn-secondary text-xs"
                  >
                    {notifLoading ? <Loader size={12} className="animate-spin" /> : null}
                    Send WhatsApp
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right column: Patient card */}
        <div className="col-span-12 lg:col-span-7">
          {patientForCard ? (
            <PatientCard
              patient={patientForCard}
              abhaData={abhaData}
              triageResult={triage}
            />
          ) : (
            <div className="glass-card h-full min-h-64 flex flex-col items-center justify-center gap-3 text-gray-600">
              <Search size={36} className="opacity-20" />
              <p className="text-sm">Look up an ABHA ID or complete intake to see the patient profile</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

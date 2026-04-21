import { useState, useRef } from 'react'
import { Mic, MicOff, Loader, CheckCircle } from 'lucide-react'
import { submitVoiceIntake } from '../lib/api'

const LANGUAGES = [
  { code: 'hi-IN', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'te-IN', label: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'bn-IN', label: 'বাংলা (Bengali)', flag: '🇮🇳' },
  { code: 'mr-IN', label: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
  { code: 'gu-IN', label: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
  { code: 'ml-IN', label: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
  { code: 'en-IN', label: 'English (India)', flag: '🇬🇧' },
]

export default function VoiceRecorder({ onTriageResult, abhaId }) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [language, setLanguage] = useState('hi-IN')
  const [transcript, setTranscript] = useState('')
  const [duration, setDuration] = useState(0)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(null)

  const mediaRecorder = useRef(null)
  const chunks = useRef([])
  const timer = useRef(null)

  const startRecording = async () => {
    setError(null)
    setDone(false)
    setTranscript('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm'
      mediaRecorder.current = new MediaRecorder(stream, { mimeType })
      chunks.current = []

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data)
      }

      mediaRecorder.current.onstop = async () => {
        clearInterval(timer.current)
        setDuration(0)
        const blob = new Blob(chunks.current, { type: mimeType })
        stream.getTracks().forEach((t) => t.stop())

        // Guard: empty recording (mic denied mid-session or too short)
        if (blob.size < 1000) {
          setError('Recording was too short or empty. Please speak clearly and try again.')
          setIsProcessing(false)
          return
        }

        setIsProcessing(true)
        try {
          const data = await submitVoiceIntake(blob, language, abhaId)
          setTranscript(data.transcript)
          onTriageResult(data.triage, data.transcript)
          setDone(true)
        } catch (err) {
          setError(`Voice intake failed: ${err.message}. Try using Text Intake instead.`)
        } finally {
          setIsProcessing(false)
        }
      }

      mediaRecorder.current.start(250)
      setIsRecording(true)
      setDuration(0)
      timer.current = setInterval(() => setDuration((d) => d + 1), 1000)
    } catch (err) {
      setError('Microphone access denied. Please allow microphone and try again.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop()
      setIsRecording(false)
    }
  }

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="glass-card p-5 space-y-4">
      <div>
        <p className="section-label">Language / भाषा</p>
        <select
          id="voice-language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={isRecording || isProcessing}
          className="field"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.flag} {l.label}
            </option>
          ))}
        </select>
      </div>

      {/* Record button */}
      <div className="flex flex-col items-center gap-3 py-4">
        <button
          id={isRecording ? 'stop-recording-btn' : 'start-recording-btn'}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50 
            ${isRecording
              ? 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900'
              : 'bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 hover:border-gray-500'
            }`}
        >
          {isRecording && (
            <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75" />
          )}
          {isProcessing
            ? <Loader size={28} className="text-white animate-spin" />
            : isRecording
              ? <MicOff size={28} className="text-white" />
              : <Mic size={28} className="text-gray-300" />
          }
        </button>

        <div className="text-center">
          {isRecording && (
            <p className="text-red-400 font-mono font-bold text-lg animate-blink">{fmt(duration)}</p>
          )}
          <p className="text-xs text-gray-400">
            {isProcessing
              ? 'Processing via Sarvam AI + Claude...'
              : isRecording
                ? 'Recording... tap to stop'
                : 'Tap to begin voice intake'
            }
          </p>
        </div>
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-3 animate-fade-in">
          <p className="section-label">Transcript</p>
          <p className="text-sm text-gray-200 leading-relaxed">{transcript}</p>
        </div>
      )}

      {done && (
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <CheckCircle size={14} />
          Triage assessment complete — see results above
        </div>
      )}

      {error && (
        <div className="text-red-400 text-xs bg-red-950/30 border border-red-900 rounded p-2">
          {error}
        </div>
      )}
    </div>
  )
}

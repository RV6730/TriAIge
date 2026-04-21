import { useState, useEffect } from 'react'
import { getSocket } from '../lib/socket'
import { fetchABHA } from '../lib/api'
import PatientCard from '../components/PatientCard'
import QueuePanel from '../components/QueuePanel'
import AmbulanceAlert from '../components/AmbulanceAlert'
import DiseaseChart from '../components/DiseaseChart'
import { Clock, RefreshCw } from 'lucide-react'

const MOCK_QUEUE = [
  {
    id: 1,
    name: 'Ramesh Kumar',
    age: 58,
    gender: 'Male',
    category: 'RED',
    condition: 'Suspected STEMI — Chest Pain + Diaphoresis',
    wait: 0,
    doctor: 'Dr. Anita Rao (Cardiology)',
    abha_id: 'DEFAULT',
  },
  {
    id: 2,
    name: 'Meena Devi',
    age: 34,
    gender: 'Female',
    category: 'YELLOW',
    condition: 'High Fever (104°F) + Vomiting × 2 days',
    wait: 8,
    doctor: 'Dr. Suresh Pillai (General)',
    abha_id: 'ABHA-2024-DEMO-001',
  },
  {
    id: 3,
    name: 'Kiran Babu',
    age: 22,
    gender: 'Male',
    category: 'GREEN',
    condition: 'Ankle Sprain — RTA',
    wait: 25,
    doctor: 'Dr. Priya Nair (Ortho)',
    abha_id: 'ABHA-2024-DEMO-002',
  },
  {
    id: 4,
    name: 'Lakshmi S.',
    age: 67,
    gender: 'Female',
    category: 'YELLOW',
    condition: 'Breathlessness — Worsening since morning',
    wait: 12,
    doctor: 'Dr. Ravi Kumar (General)',
    abha_id: 'ABHA-2024-DEMO-003',
  },
  {
    id: 5,
    name: 'Mohammed Irfan',
    age: 45,
    gender: 'Male',
    category: 'RED',
    condition: 'Stroke Symptoms — Facial Droop + Arm Weakness',
    wait: 0,
    doctor: 'Dr. Shilpa Rao (Neurology)',
    abha_id: 'ABHA-2024-DEMO-002',
  },
]

function Clock12() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="font-mono text-gray-400 text-xs">
      {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  )
}

export default function Dashboard() {
  const [queue] = useState(MOCK_QUEUE)
  const [ambulance, setAmbulance] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [abhaData, setAbhaData] = useState(null)

  const stats = {
    red: queue.filter((p) => p.category === 'RED').length,
    yellow: queue.filter((p) => p.category === 'YELLOW').length,
    green: queue.filter((p) => p.category === 'GREEN').length,
    avgWait: Math.round(queue.reduce((s, p) => s + p.wait, 0) / queue.length),
  }

  // Socket.io ambulance feed
  useEffect(() => {
    const socket = getSocket()
    socket.on('ambulance_incoming', (data) => setAmbulance(data))
    socket.on('ambulance_update', (data) =>
      setAmbulance((prev) => prev ? { ...prev, eta_minutes: data.eta_minutes, current_location_idx: data.current_location_idx } : prev)
    )
    return () => {
      socket.off('ambulance_incoming')
      socket.off('ambulance_update')
    }
  }, [])

  // Fetch ABHA when selecting patient
  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient)
    setAbhaData(null)
    try {
      const result = await fetchABHA(patient.abha_id || 'DEFAULT')
      setAbhaData(result.patient)
    } catch {
      // silently fail — no backend required for demo display
    }
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-4">
      {/* Stats header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold text-white">Emergency Dashboard</h1>
          <p className="text-xs text-gray-500 font-mono">AIIMS Bengaluru · Emergency Dept</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="stat-box">
            <div className="text-xl font-black font-mono text-red-500">{stats.red}</div>
            <div className="text-xs text-gray-500">CRITICAL</div>
          </div>
          <div className="stat-box">
            <div className="text-xl font-black font-mono text-yellow-400">{stats.yellow}</div>
            <div className="text-xs text-gray-500">URGENT</div>
          </div>
          <div className="stat-box">
            <div className="text-xl font-black font-mono text-green-400">{stats.green}</div>
            <div className="text-xs text-gray-500">STABLE</div>
          </div>
          <div className="stat-box">
            <div className="text-xl font-black font-mono text-blue-400">{stats.avgWait}m</div>
            <div className="text-xs text-gray-500">AVG WAIT</div>
          </div>
          <div className="stat-box hidden sm:flex">
            <Clock size={14} className="text-gray-500" />
            <Clock12 />
          </div>
        </div>
      </div>

      {/* Ambulance alert */}
      {ambulance && (
        <div className="mb-4">
          <AmbulanceAlert data={ambulance} onDismiss={() => setAmbulance(null)} />
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-4" style={{ height: 'calc(100vh - 220px)' }}>
        {/* Queue — left */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 overflow-hidden flex flex-col">
          <QueuePanel
            queue={queue}
            onSelect={handleSelectPatient}
            selected={selectedPatient}
          />
        </div>

        {/* Patient detail — center */}
        <div className="col-span-12 md:col-span-5 lg:col-span-6 overflow-hidden">
          {selectedPatient ? (
            <PatientCard
              patient={selectedPatient}
              abhaData={abhaData}
              triageResult={null}
            />
          ) : (
            <div className="glass-card h-full flex flex-col items-center justify-center gap-3 text-gray-600">
              <RefreshCw size={32} className="opacity-30" />
              <p className="text-sm">Select a patient from the queue to view details</p>
            </div>
          )}
        </div>

        {/* Disease surveillance — right */}
        <div className="col-span-12 md:col-span-3 lg:col-span-3 overflow-hidden flex flex-col">
          <DiseaseChart />
        </div>
      </div>
    </div>
  )
}

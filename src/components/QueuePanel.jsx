import { Clock, User } from 'lucide-react'

const CAT_STYLES = {
  RED: {
    border: 'border-l-red-500',
    dot: 'bg-red-500 animate-pulse',
    badge: 'badge-red',
    rowHover: 'hover:bg-red-950/20',
    selectedBg: 'bg-red-950/30 border-red-800',
  },
  YELLOW: {
    border: 'border-l-yellow-500',
    dot: 'bg-yellow-500',
    badge: 'badge-yellow',
    rowHover: 'hover:bg-yellow-950/20',
    selectedBg: 'bg-yellow-950/30 border-yellow-800',
  },
  GREEN: {
    border: 'border-l-green-500',
    dot: 'bg-green-500',
    badge: 'badge-green',
    rowHover: 'hover:bg-green-950/20',
    selectedBg: 'bg-green-950/30 border-green-800',
  },
}

function QueueRow({ patient, selected, onSelect }) {
  const cfg = CAT_STYLES[patient.category] || CAT_STYLES.GREEN
  const isSelected = selected?.id === patient.id

  return (
    <button
      id={`queue-patient-${patient.id}`}
      onClick={() => onSelect(patient)}
      className={`w-full text-left border-l-2 ${cfg.border} px-4 py-3 rounded-r-lg transition-all duration-200 
                  ${isSelected
                    ? `border border-l-2 ${cfg.selectedBg}`
                    : `border border-transparent bg-gray-900/40 ${cfg.rowHover}`
                  } mb-2`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${cfg.dot}`} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate leading-tight">{patient.name}</p>
            <p className="text-xs text-gray-400 truncate">{patient.condition}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className={cfg.badge}>{patient.category}</span>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 justify-end">
            <Clock size={10} />
            {patient.wait === 0 ? 'NOW' : `${patient.wait}m`}
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
        <User size={10} />
        {patient.doctor}
      </p>
    </button>
  )
}

export default function QueuePanel({ queue, onSelect, selected }) {
  const red = queue.filter((p) => p.category === 'RED')
  const yellow = queue.filter((p) => p.category === 'YELLOW')
  const green = queue.filter((p) => p.category === 'GREEN')

  return (
    <div className="glass-card h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-sm font-bold text-white">Triage Queue</h2>
        <span className="text-xs font-mono text-gray-500">{queue.length} patients</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {red.length > 0 && (
          <div className="mb-3">
            <p className="section-label text-red-600">🔴 Critical ({red.length})</p>
            {red.map((p) => <QueueRow key={p.id} patient={p} selected={selected} onSelect={onSelect} />)}
          </div>
        )}
        {yellow.length > 0 && (
          <div className="mb-3">
            <p className="section-label text-yellow-600">🟡 Urgent ({yellow.length})</p>
            {yellow.map((p) => <QueueRow key={p.id} patient={p} selected={selected} onSelect={onSelect} />)}
          </div>
        )}
        {green.length > 0 && (
          <div>
            <p className="section-label text-green-700">🟢 Non-Urgent ({green.length})</p>
            {green.map((p) => <QueueRow key={p.id} patient={p} selected={selected} onSelect={onSelect} />)}
          </div>
        )}
      </div>
    </div>
  )
}

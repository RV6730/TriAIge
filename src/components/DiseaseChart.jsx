import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

const DISEASE_DATA = [
  { week: 'W1', dengue: 12, malaria: 8, diarrhea: 34, trauma: 18, cardiac: 6 },
  { week: 'W2', dengue: 18, malaria: 10, diarrhea: 29, trauma: 22, cardiac: 9 },
  { week: 'W3', dengue: 28, malaria: 7, diarrhea: 41, trauma: 19, cardiac: 11 },
  { week: 'W4', dengue: 42, malaria: 12, diarrhea: 38, trauma: 24, cardiac: 8 },
  { week: 'W5', dengue: 35, malaria: 9, diarrhea: 31, trauma: 28, cardiac: 14 },
  { week: 'W6', dengue: 55, malaria: 15, diarrhea: 45, trauma: 21, cardiac: 10 },
  { week: 'W7', dengue: 48, malaria: 11, diarrhea: 52, trauma: 26, cardiac: 13 },
  { week: 'W8', dengue: 62, malaria: 8, diarrhea: 39, trauma: 30, cardiac: 16 },
]

const ALERTS = [
  { type: 'Dengue', surge: '+47%', color: 'text-orange-400', bg: 'bg-orange-950/30 border-orange-900' },
  { type: 'Gastroenteritis', surge: '+31%', color: 'text-blue-400', bg: 'bg-blue-950/30 border-blue-900' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card border border-gray-700 p-3 text-xs">
      <p className="font-bold text-white mb-1 font-mono">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function DiseaseChart() {
  return (
    <div className="glass-card h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-800">
        <h2 className="text-sm font-bold text-white">District Surveillance</h2>
        <p className="text-xs text-gray-500 font-mono">Bengaluru South · Last 8 weeks</p>
      </div>

      <div className="px-4 py-3 space-y-2">
        {ALERTS.map((a) => (
          <div key={a.type} className={`${a.bg} border rounded-lg px-3 py-2 flex items-center justify-between`}>
            <span className="text-xs font-semibold text-gray-200">{a.type}</span>
            <span className={`text-xs font-black font-mono ${a.color}`}>{a.surge} ↑</span>
          </div>
        ))}
      </div>

      <div className="flex-1 px-2 pb-4 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DISEASE_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="dengue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="malaria" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="diarrhea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="dengue" name="Dengue" stroke="#f97316" fill="url(#dengue)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="malaria" name="Malaria" stroke="#a855f7" fill="url(#malaria)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="diarrhea" name="Diarrhea" stroke="#3b82f6" fill="url(#diarrhea)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'

const WEEKLY_DATA = [
  { week: 'W1', dengue: 12, malaria: 8, diarrhea: 34, respiratory: 22, trauma: 18, cardiac: 6 },
  { week: 'W2', dengue: 18, malaria: 10, diarrhea: 29, respiratory: 18, trauma: 22, cardiac: 9 },
  { week: 'W3', dengue: 28, malaria: 7, diarrhea: 41, respiratory: 30, trauma: 19, cardiac: 11 },
  { week: 'W4', dengue: 42, malaria: 12, diarrhea: 38, respiratory: 25, trauma: 24, cardiac: 8 },
  { week: 'W5', dengue: 35, malaria: 9, diarrhea: 31, respiratory: 28, trauma: 28, cardiac: 14 },
  { week: 'W6', dengue: 55, malaria: 15, diarrhea: 45, respiratory: 35, trauma: 21, cardiac: 10 },
  { week: 'W7', dengue: 48, malaria: 11, diarrhea: 52, respiratory: 40, trauma: 26, cardiac: 13 },
  { week: 'W8', dengue: 62, malaria: 8, diarrhea: 39, respiratory: 33, trauma: 30, cardiac: 16 },
]

const TALUK_DATA = [
  { name: 'Bengaluru South', cases: 182 },
  { name: 'Bengaluru North', cases: 134 },
  { name: 'Anekal', cases: 98 },
  { name: 'Yelahanka', cases: 76 },
  { name: 'Ramanagara', cases: 54 },
  { name: 'Tumkur', cases: 42 },
]

const PIE_DATA = [
  { name: 'Dengue', value: 30, color: '#f97316' },
  { name: 'Gastroenteritis', value: 22, color: '#3b82f6' },
  { name: 'Respiratory', value: 18, color: '#8b5cf6' },
  { name: 'Trauma', value: 15, color: '#ef4444' },
  { name: 'Malaria', value: 9, color: '#10b981' },
  { name: 'Cardiac', value: 6, color: '#ec4899' },
]

const ALERTS = [
  { district: 'Bengaluru South', disease: 'Dengue', change: '+47%', cases: 62, level: 'HIGH' },
  { district: 'Anekal', disease: 'Gastroenteritis', change: '+31%', cases: 45, level: 'MEDIUM' },
  { district: 'Bengaluru North', disease: 'Respiratory', change: '+19%', cases: 40, level: 'MEDIUM' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card border border-gray-700 p-3 text-xs min-w-[140px]">
      <p className="font-bold text-white mb-1 font-mono">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="flex justify-between gap-4">
          <span>{p.name}</span><span className="font-mono">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function Surveillance() {
  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-6">
      <h1 className="text-lg font-bold text-white mb-1">Disease Surveillance</h1>
      <p className="text-xs text-gray-500 font-mono mb-6">
        Karnataka · Bengaluru Region · Integrated Disease Surveillance Programme (IDSP) · Last 8 weeks
      </p>

      {/* Alert strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {ALERTS.map((a) => (
          <div
            key={a.district}
            className={`glass-card border p-4 ${
              a.level === 'HIGH' ? 'border-red-800 bg-red-950/10' : 'border-yellow-800 bg-yellow-950/10'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 font-mono">{a.district}</p>
                <p className="text-sm font-bold text-white">{a.disease}</p>
                <p className="text-xs text-gray-400">{a.cases} cases · 8 weeks</p>
              </div>
              <div className="text-right">
                <span className={`text-lg font-black font-mono ${a.level === 'HIGH' ? 'text-red-400' : 'text-yellow-400'}`}>
                  {a.change}
                </span>
                <p className={`text-xs font-bold ${a.level === 'HIGH' ? 'text-red-500' : 'text-yellow-500'}`}>
                  {a.level}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Main area chart */}
        <div className="col-span-12 lg:col-span-8 glass-card p-5">
          <h2 className="text-sm font-bold text-white mb-1">Disease Trend — Weekly Cases</h2>
          <p className="text-xs text-gray-500 font-mono mb-4">Bengaluru South Taluk</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={WEEKLY_DATA} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <defs>
                {[
                  { key: 'dengue', color: '#f97316' },
                  { key: 'malaria', color: '#10b981' },
                  { key: 'diarrhea', color: '#3b82f6' },
                  { key: 'respiratory', color: '#8b5cf6' },
                ].map(({ key, color }) => (
                  <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
              <Area type="monotone" dataKey="dengue" name="Dengue" stroke="#f97316" fill="url(#grad-dengue)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="diarrhea" name="Gastroenteritis" stroke="#3b82f6" fill="url(#grad-diarrhea)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="respiratory" name="Respiratory" stroke="#8b5cf6" fill="url(#grad-respiratory)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="malaria" name="Malaria" stroke="#10b981" fill="url(#grad-malaria)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="col-span-12 lg:col-span-4 glass-card p-5">
          <h2 className="text-sm font-bold text-white mb-1">Case Distribution</h2>
          <p className="text-xs text-gray-500 font-mono mb-4">All districts · Current week</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={PIE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {PIE_DATA.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v}%`, n]} contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {PIE_DATA.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: d.color }} />
                {d.name} ({d.value}%)
              </div>
            ))}
          </div>
        </div>

        {/* Bar chart by taluk */}
        <div className="col-span-12 glass-card p-5">
          <h2 className="text-sm font-bold text-white mb-4">Cases by Taluk — All Disease</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={TALUK_DATA} margin={{ top: 0, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="cases" fill="#ef4444" radius={[4, 4, 0, 0]}>
                {TALUK_DATA.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#ef4444' : '#6b2c2c'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

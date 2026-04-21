import { useState } from 'react'
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
  { 
    district: 'Bengaluru South', 
    disease: 'Dengue', 
    change: '+47%', 
    cases: 62, 
    level: 'CRITICAL',
    precautions: [
      'Eliminate stagnant water around homes',
      'Use mosquito nets and DEET-based repellents',
      'Wear protective full-sleeve clothing'
    ],
    guidance: 'Highest emergency level. Coordinate with local ASHA workers for fumigation.'
  },
  { 
    district: 'Anekal', 
    disease: 'Gastroenteritis', 
    change: '+31%', 
    cases: 45, 
    level: 'HIGH',
    precautions: [
      'Consume only boiled or UV-filtered water',
      'Wash hands before handling any food',
      'Avoid raw vegetables and street snacks'
    ],
    guidance: 'Outbreak detected. Monitor water supply lines for contamination.'
  },
  { 
    district: 'Bengaluru North', 
    disease: 'Respiratory', 
    change: '+19%', 
    cases: 40, 
    level: 'MEDIUM',
    precautions: [
      'Encourage masking in public transport',
      'Ensure high ventilation in government offices',
      'Early flu vaccination for elderly residents'
    ],
    guidance: 'Elevated case count. Track cluster spread in high-density colonies.'
  },
  { 
    district: 'Yelahanka', 
    disease: 'Malaria', 
    change: '+12%', 
    cases: 28, 
    level: 'MEDIUM',
    precautions: [
      'Spray residual insecticide in dark corners',
      'Screen windows and doors with mesh',
      'Clear drainage blockages near residential blocks'
    ],
    guidance: 'Localized clusters identified. Vector control teams deployed.'
  },
  { 
    district: 'Ramanagara', 
    disease: 'Trauma', 
    change: '+24%', 
    cases: 35, 
    level: 'HIGH',
    precautions: [
      'Enhance highway patrol on SH-17',
      'Ensure 24/7 availability of blood banks',
      'Station ambulances at identified black spots'
    ],
    guidance: 'Accident rates increasing. Alert tertiary trauma centers.'
  },
  { 
    district: 'Tumkur', 
    disease: 'Cardiac', 
    change: '+8%', 
    cases: 18, 
    level: 'LOW',
    precautions: [
      'Conduct regular community BP screenings',
      'Promote salt-reduction awareness',
      'Distribute emergency ASA (Aspirin) kits'
    ],
    guidance: 'Standard baseline. Focus on preventive lifestyle camps.'
  },
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

const DISEASE_AWARENESS = [
  {
    name: 'Dengue Prevention',
    icon: '🦟',
    color: '#f97316',
    precautions: [
      'Eliminate stagnant water in coolers, tires, and pots',
      'Use mosquito nets and insect repellents daily',
      'Wear long-sleeved clothing during dawn and dusk'
    ],
    awareness: 'Dengue cases typically peak after monsoon. High fever and joint pain require immediate medical attention.'
  },
  {
    name: 'Gastroenteritis',
    icon: '💧',
    color: '#3b82f6',
    precautions: [
      'Always drink boiled or filtered water',
      'Wash hands thoroughly before meals',
      'Avoid consuming raw or street food during outbreaks'
    ],
    awareness: 'Oral Rehydration Salts (ORS) are essential during diarrhea. Seek help if dehydration symptoms appear.'
  },
  {
    name: 'Respiratory Health',
    icon: '🫁',
    color: '#8b5cf6',
    precautions: [
      'Wear masks in crowded or high-pollution areas',
      'Maintain regular ventilation in living spaces',
      'Get annual influenza vaccinations'
    ],
    awareness: 'Early detection of persistent cough can prevent complications like pneumonia or TB.'
  }
]

const HYGIENE_STANDARDS = [
  { title: 'Hand Hygiene', tips: ['Wash hands for 20s before meals', 'Use 70% alcohol-based sanitizers', 'Clean hands after using public transport'], icon: '🧼' },
  { title: 'Water Safety', tips: ['Drink only boiled or filtered water', 'Keep storage containers covered', 'Clean overhead tanks every 6 months'], icon: '🚰' },
  { title: 'Food Standards', tips: ['Wash fruits & vegetables before use', 'Avoid undercooked street food', 'Store raw and cooked food separately'], icon: '🥗' },
  { title: 'Environmental', tips: ['Ensure cross-ventilation in rooms', 'Keep surroundings free of trash', 'Sanitize frequently touched surfaces'], icon: '🏠' },
]

export default function Surveillance() {
  const [selectedAlert, setSelectedAlert] = useState(null)

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-6 pb-20">
      <h1 className="text-lg font-bold text-white mb-1">Disease Surveillance</h1>
      <p className="text-xs text-gray-500 font-mono mb-6">
        Karnataka · Bengaluru Region · Integrated Disease Surveillance Programme (IDSP) · Last 8 weeks
      </p>

      {/* Alert strip */}
      <h2 className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.2em] mb-3">Live Hotspots (Click to view details)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {ALERTS.map((a) => (
          <button
            key={a.district}
            onClick={() => setSelectedAlert(a)}
            className={`glass-card border p-4 text-left transition-all hover:scale-[1.02] active:scale-95 ${
              selectedAlert?.district === a.district ? 'ring-2 ring-blue-500 border-transparent shadow-lg shadow-blue-900/20' : ''
            } ${
              a.level === 'CRITICAL' ? 'border-red-600 bg-red-950/20 animate-pulse' : 
              a.level === 'HIGH' ? 'border-red-800 bg-red-950/10' : 
              a.level === 'MEDIUM' ? 'border-yellow-800 bg-yellow-950/10' :
              'border-gray-800 bg-gray-900/10'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{a.district}</p>
                <p className="text-sm font-bold text-white mt-1">{a.disease}</p>
                <p className="text-[10px] text-gray-400 font-mono">{a.cases} cases · Last 8w</p>
              </div>
              <div className="text-right">
                <span className={`text-lg font-black font-mono ${
                  a.level === 'CRITICAL' ? 'text-red-500' : 
                  a.level === 'HIGH' ? 'text-red-400' : 
                  a.level === 'MEDIUM' ? 'text-yellow-400' :
                  'text-gray-400'
                }`}>
                  {a.change}
                </span>
                <p className={`text-[10px] font-black uppercase tracking-tighter ${
                  a.level === 'CRITICAL' ? 'text-red-600' : 
                  a.level === 'HIGH' ? 'text-red-500' : 
                  a.level === 'MEDIUM' ? 'text-yellow-500' :
                  'text-gray-500'
                }`}>
                  {a.level}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Alert Details Panel */}
      {selectedAlert && (
        <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
          <div className={`glass-card border-2 p-6 overflow-hidden relative ${
            selectedAlert.level === 'CRITICAL' ? 'border-red-600/50' : 
            selectedAlert.level === 'HIGH' ? 'border-red-800/50' : 
            'border-blue-500/50'
          }`}>
            <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${
                    selectedAlert.level === 'CRITICAL' ? 'bg-red-600' : 'bg-blue-600'
                  }`}>
                    {selectedAlert.disease.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">{selectedAlert.district} — {selectedAlert.disease}</h2>
                    <p className={`text-sm font-bold font-mono ${
                      selectedAlert.level === 'CRITICAL' ? 'text-red-500' : 'text-blue-400'
                    }`}>STATUS: {selectedAlert.level} SEVERITY</p>
                  </div>
                </div>
                
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 mb-4">
                  <p className="text-[10px] text-gray-500 font-mono uppercase mb-1">Administrative Guidance</p>
                  <p className="text-gray-200 text-sm italic">"{selectedAlert.guidance}"</p>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" /> Immediate Precautions
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {selectedAlert.precautions.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-900/30 p-3 rounded-lg border border-gray-800/50 text-xs text-gray-300">
                      <span className="text-green-500 font-bold">✓</span> {p}
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setSelectedAlert(null)}
                className="absolute top-0 right-0 p-2 text-gray-500 hover:text-white"
              >
                ✕ Close
              </button>
            </div>
            
            {/* Background decorative element */}
            <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
              <span className="text-9xl font-black">{selectedAlert.level}</span>
            </div>
          </div>
        </div>
      )}

      {/* Charts grid */}
      <div className="grid grid-cols-12 gap-4 mb-8">
        {/* Main area chart */}
        <div className="col-span-12 lg:col-span-8 glass-card p-5">
          <h2 className="text-sm font-bold text-white mb-1">Disease Trend — Weekly Cases</h2>
          <p className="text-xs text-gray-500 font-mono mb-4">Bengaluru Region Overview</p>
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
      </div>

      {/* Bar chart by taluk */}
      <div className="glass-card p-5 mb-8">
        <h2 className="text-sm font-bold text-white mb-4">Case Volume by Taluk (Click bars for details)</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart 
            data={ALERTS} 
            margin={{ top: 0, right: 4, left: -16, bottom: 0 }}
            onClick={(data) => {
              if (data && data.activePayload) {
                setSelectedAlert(data.activePayload[0].payload)
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis dataKey="district" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }} 
            />
            <Bar dataKey="cases" radius={[4, 4, 0, 0]} className="cursor-pointer">
              {ALERTS.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={
                    entry.level === 'CRITICAL' ? '#ef4444' : 
                    entry.level === 'HIGH' ? '#f87171' : 
                    entry.level === 'MEDIUM' ? '#fbbf24' : 
                    '#9ca3af'
                  } 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Hygiene Standards Section */}
      <div className="glass-card p-8 mb-8 bg-blue-900/5 border-blue-900/20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-2xl">✨</div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Daily Hygiene Standards</h2>
            <p className="text-xs text-blue-400 font-mono">Government of Karnataka · Health & Family Welfare Guidelines</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HYGIENE_STANDARDS.map((s) => (
            <div key={s.title} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{s.icon}</span>
                <h3 className="text-white font-bold text-sm uppercase tracking-wider">{s.title}</h3>
              </div>
              <ul className="space-y-2">
                {s.tips.map((tip, i) => (
                  <li key={i} className="text-xs text-gray-400 flex gap-2">
                    <span className="text-blue-500">•</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* General Awareness Section */}
      <h2 className="text-lg font-bold text-white mb-4">General Health Awareness</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DISEASE_AWARENESS.map((d) => (
          <div key={d.name} className="glass-card p-5 border-l-4" style={{ borderLeftColor: d.color }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{d.icon}</span>
              <h3 className="text-white font-bold">{d.name}</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-2">Key Precautions</p>
                <ul className="space-y-1.5">
                  {d.precautions.map((p, i) => (
                    <li key={i} className="flex gap-2 text-xs text-gray-300">
                      <span className="text-green-500 mt-0.5">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-4 border-t border-gray-800">
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-2">Health Insight</p>
                <p className="text-xs text-gray-400 italic">"{d.awareness}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

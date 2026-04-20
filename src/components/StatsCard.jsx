const StatsCard = ({ label, value, suffix = '', icon, color = 'text-green-400', bg = 'bg-green-500/10' }) => (
  <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
    <div className="mb-3 flex items-center justify-between">
      <p className="text-sm text-gray-400">{label}</p>
      <div className={`rounded-lg p-2 ${bg}`}>
        <span className={color}>{icon}</span>
      </div>
    </div>
    <p className="font-display text-3xl font-bold text-white">
      {value}<span className="text-lg text-gray-400">{suffix}</span>
    </p>
  </div>
)

export default StatsCard

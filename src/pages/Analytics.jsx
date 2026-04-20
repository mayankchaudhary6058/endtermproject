import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line, CartesianGrid,
} from 'recharts'
import { useHabitStats } from '../hooks/useHabitStats'
import { useHabits } from '../context/HabitContext'
import { Flame } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm shadow-xl">
      <p className="mb-1 font-medium text-white">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function Analytics() {
  const { habits } = useHabits()
  const { weeklyData, monthlyData, habitPerformance } = useHabitStats()

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-5xl">📊</p>
        <p className="mt-3 font-display text-xl font-semibold text-white">No data yet</p>
        <p className="mt-1 text-sm text-gray-500">
          Add habits and track them daily to see your analytics
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Analytics</h1>
        <p className="mt-1 text-gray-400">Understand your behavioral patterns</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Completions Bar Chart */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-5 font-display font-semibold text-white">
            Weekly Completions
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData} barCategoryGap="35%">
              <XAxis
                dataKey="label"
                stroke="#374151"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#374151"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar
                dataKey="completed"
                name="Completed"
                fill="#22c55e"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Rate Line Chart */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-5 font-display font-semibold text-white">
            Monthly Completion Rate
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                dataKey="label"
                stroke="#374151"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#374151"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                unit="%"
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="rate"
                name="Rate %"
                stroke="#22c55e"
                strokeWidth={2.5}
                dot={{ fill: '#22c55e', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: '#4ade80' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Habit Performance Table */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 lg:col-span-2">
          <h2 className="mb-5 font-display font-semibold text-white">
            Habit Performance — Last 30 Days
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {['Habit', 'Completions', 'Success Rate', 'Current Streak'].map((h) => (
                    <th
                      key={h}
                      className="pb-3 text-left text-xs font-semibold uppercase tracking-widest text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {habitPerformance.map((h, i) => (
                  <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-3.5">
                      <span className="mr-2 text-lg">{h.emoji}</span>
                      <span className="font-medium text-white">{h.name}</span>
                    </td>
                    <td className="py-3.5 text-gray-400">
                      {h.completions}
                      <span className="text-gray-600"> / 30</span>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-gray-800">
                          <div
                            className="h-full rounded-full bg-green-500 transition-all"
                            style={{ width: `${h.rate}%` }}
                          />
                        </div>
                        <span className="font-medium text-green-400">{h.rate}%</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="flex items-center gap-1.5 text-orange-400">
                        <Flame size={13} />
                        {h.streak} days
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

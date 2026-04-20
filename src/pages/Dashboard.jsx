import { useState, useMemo } from 'react'
import { Plus, Target, Flame, CheckCircle2, TrendingUp } from 'lucide-react'
import { useHabits } from '../context/HabitContext'
import { useAuth } from '../context/AuthContext'
import HabitCard from '../components/HabitCard'
import HabitForm from '../components/HabitForm'
import StatsCard from '../components/StatsCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Dashboard() {
  const { user } = useAuth()
  const { habits, loading, stats, createHabit, editHabit } = useHabits()
  const [showForm, setShowForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null)

  const today = useMemo(
    () =>
      new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    []
  )

  const handleEdit = (habit) => {
    setEditingHabit(habit)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingHabit(null)
  }

  const handleFormSubmit = async (data) => {
    if (editingHabit) {
      await editHabit(editingHabit.id, data)
    } else {
      await createHabit(data)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" text="Loading your habits..." />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{today}</p>
          <h1 className="font-display text-3xl font-bold text-white">
            Hey, {user?.displayName?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="mt-1 text-gray-400">
            {stats.completedToday} of {stats.total} habits done today
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 font-display font-semibold text-gray-950 shadow-lg shadow-green-500/20 transition-all hover:bg-green-400 hover:shadow-green-400/30"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">New Habit</span>
        </button>
      </div>

      {/* Progress Bar */}
      {stats.total > 0 && (
        <div className="mb-8 rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-gray-400">Today's Progress</span>
            <span className="font-semibold text-green-400">{stats.completionRate}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-700"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
          {stats.completionRate === 100 && (
            <p className="mt-2 text-center text-sm text-green-400">
              🎉 Perfect day! All habits completed!
            </p>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatsCard
          label="Total Habits"
          value={stats.total}
          icon={<Target size={16} />}
          color="text-green-400"
          bg="bg-green-500/10"
        />
        <StatsCard
          label="Done Today"
          value={stats.completedToday}
          icon={<CheckCircle2 size={16} />}
          color="text-blue-400"
          bg="bg-blue-500/10"
        />
        <StatsCard
          label="Completion"
          value={stats.completionRate}
          suffix="%"
          icon={<TrendingUp size={16} />}
          color="text-purple-400"
          bg="bg-purple-500/10"
        />
        <StatsCard
          label="Best Streak"
          value={stats.longestStreak}
          suffix=" days"
          icon={<Flame size={16} />}
          color="text-orange-400"
          bg="bg-orange-500/10"
        />
      </div>

      {/* Habits List */}
      <div>
        <h2 className="mb-4 font-display text-lg font-semibold text-white">Your Habits</h2>

        {habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-800 py-16 text-center">
            <p className="text-5xl">🌱</p>
            <p className="mt-3 font-display text-xl font-semibold text-white">No habits yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Create your first habit to start your journey
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-5 flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-400 transition-all hover:bg-green-500/20"
            >
              <Plus size={15} /> Add First Habit
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} onEdit={handleEdit} />
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <HabitForm
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
          initial={editingHabit}
        />
      )}
    </div>
  )
}

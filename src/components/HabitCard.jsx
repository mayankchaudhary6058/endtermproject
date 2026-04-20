import { useCallback, useState } from 'react'
import { Pencil, Trash2, Flame, Check } from 'lucide-react'
import { useHabits } from '../context/HabitContext'

const HabitCard = ({ habit, onEdit }) => {
  const { toggleHabit, removeHabit, todayStr } = useHabits()
  const [toggling, setToggling] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isCompleted = habit.completedDates?.includes(todayStr)

  const handleToggle = useCallback(async () => {
    setToggling(true)
    await toggleHabit(habit)
    setToggling(false)
  }, [habit, toggleHabit])

  const handleDelete = useCallback(async () => {
    if (!window.confirm(`Delete "${habit.name}"?`)) return
    setDeleting(true)
    await removeHabit(habit.id)
  }, [habit, removeHabit])

  return (
    <div
      className={`group relative rounded-2xl border p-5 transition-all duration-300 ${
        isCompleted
          ? 'border-green-500/40 bg-green-500/5'
          : 'border-gray-800 bg-gray-900 hover:border-gray-700'
      } ${deleting ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-full ${habit.color || 'bg-green-500'}`} />

      <div className="ml-3 flex items-center justify-between">
        {/* Habit info */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">{habit.emoji}</span>
          <div>
            <h3 className={`font-display font-semibold ${isCompleted ? 'text-gray-400 line-through' : 'text-white'}`}>
              {habit.name}
            </h3>
            {habit.description && (
              <p className="mt-0.5 text-xs text-gray-500">{habit.description}</p>
            )}
            <div className="mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-orange-400">
                <Flame size={11} />
                {habit.streak} day streak
              </span>
              <span className="text-xs capitalize text-gray-600">{habit.frequency}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Edit / Delete - visible on hover */}
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => onEdit(habit)}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-800 hover:text-gray-200"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={handleDelete}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-red-500/10 hover:text-red-400"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* Toggle button */}
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
              isCompleted
                ? 'bg-green-500 text-gray-950 shadow-lg shadow-green-500/30'
                : 'border-2 border-gray-700 text-transparent hover:border-green-500 hover:text-green-500'
            }`}
          >
            <Check size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default HabitCard

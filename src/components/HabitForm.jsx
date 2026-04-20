import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'

const EMOJIS = ['💪', '📚', '🧘', '🏃', '💧', '🥗', '😴', '✍️', '🎯', '🧠', '🎨', '🎵']
const COLORS = [
  'bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500',
  'bg-pink-500', 'bg-yellow-500', 'bg-teal-500', 'bg-red-500',
]
const FREQUENCIES = ['daily', 'weekdays', 'weekends']

const HabitForm = ({ onSubmit, onClose, initial }) => {
  const [name, setName] = useState(initial?.name || '')
  const [emoji, setEmoji] = useState(initial?.emoji || '💪')
  const [color, setColor] = useState(initial?.color || 'bg-green-500')
  const [frequency, setFrequency] = useState(initial?.frequency || 'daily')
  const [description, setDescription] = useState(initial?.description || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const nameRef = useRef(null)

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) { setError('Habit name is required'); return }
    setError('')
    setLoading(true)
    try {
      await onSubmit({ name: name.trim(), emoji, color, frequency, description: description.trim() })
      onClose()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-white">
            {initial ? 'Edit Habit' : 'New Habit'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm text-gray-400">Habit Name *</label>
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning Run"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
            />
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm text-gray-400">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why does this habit matter?"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Emoji Picker */}
          <div>
            <label className="mb-2 block text-sm text-gray-400">Icon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`rounded-lg p-2 text-xl transition-all ${
                    emoji === e ? 'ring-2 ring-green-500 ring-offset-1 ring-offset-gray-900' : 'hover:bg-gray-700'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="mb-2 block text-sm text-gray-400">Color</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-7 w-7 rounded-full ${c} transition-all ${
                    color === c ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-900 scale-110' : 'hover:scale-105'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="mb-2 block text-sm text-gray-400">Frequency</label>
            <div className="flex gap-2">
              {FREQUENCIES.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFrequency(f)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-all ${
                    frequency === f
                      ? 'bg-green-500 text-gray-950'
                      : 'border border-gray-700 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-500 py-3 font-display font-semibold text-gray-950 transition-all hover:bg-green-400 disabled:opacity-50"
          >
            {loading ? 'Saving...' : initial ? 'Update Habit' : 'Create Habit'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default HabitForm

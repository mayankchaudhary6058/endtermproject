import { useMemo } from 'react'
import { useHabits } from '../context/HabitContext'

// Returns last N days as ['YYYY-MM-DD', ...]
const getLastNDays = (n) => {
  const days = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

export const useHabitStats = () => {
  const { habits } = useHabits()

  const weeklyData = useMemo(() => {
    const days = getLastNDays(7)
    return days.map((date) => {
      const label = new Date(date).toLocaleDateString('en-IN', { weekday: 'short' })
      const completed = habits.filter((h) => h.completedDates?.includes(date)).length
      return { date, label, completed, total: habits.length }
    })
  }, [habits])

  const monthlyData = useMemo(() => {
    const days = getLastNDays(30)
    // Group into weeks
    const weeks = []
    for (let i = 0; i < 30; i += 7) {
      const chunk = days.slice(i, i + 7)
      const completed = chunk.reduce(
        (sum, date) => sum + habits.filter((h) => h.completedDates?.includes(date)).length,
        0
      )
      const possible = chunk.length * habits.length
      weeks.push({
        label: `Week ${Math.floor(i / 7) + 1}`,
        completed,
        rate: possible > 0 ? Math.round((completed / possible) * 100) : 0,
      })
    }
    return weeks
  }, [habits])

  const habitPerformance = useMemo(() => {
    const days = getLastNDays(30)
    return habits.map((h) => {
      const count = days.filter((d) => h.completedDates?.includes(d)).length
      return {
        name: h.name,
        completions: count,
        rate: Math.round((count / 30) * 100),
        streak: h.streak,
        emoji: h.emoji,
      }
    })
  }, [habits])

  return { weeklyData, monthlyData, habitPerformance }
}

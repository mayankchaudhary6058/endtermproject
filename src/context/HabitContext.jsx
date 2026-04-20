import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from './AuthContext'
import {
  fetchHabits,
  addHabit,
  updateHabit,
  deleteHabit,
  markHabitComplete,
  unmarkHabitComplete,
} from '../services/habitService'

const HabitContext = createContext(null)

export const HabitProvider = ({ children }) => {
  const { user } = useAuth()
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])

  // Load habits from Firestore
  const loadHabits = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await fetchHabits(user.uid)
      setHabits(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadHabits()
  }, [loadHabits])

  // CREATE
  const createHabit = useCallback(async (habitData) => {
    const id = await addHabit(user.uid, habitData)
    setHabits((prev) => [{ id, ...habitData, streak: 0, completedDates: [] }, ...prev])
  }, [user])

  // UPDATE
  const editHabit = useCallback(async (habitId, updates) => {
    await updateHabit(habitId, updates)
    setHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, ...updates } : h))
    )
  }, [])

  // DELETE
  const removeHabit = useCallback(async (habitId) => {
    await deleteHabit(habitId)
    setHabits((prev) => prev.filter((h) => h.id !== habitId))
  }, [])

  // TOGGLE complete for today
  const toggleHabit = useCallback(async (habit) => {
    const completed = habit.completedDates?.includes(todayStr)
    if (completed) {
      await unmarkHabitComplete(habit.id, todayStr, habit.streak)
      setHabits((prev) =>
        prev.map((h) =>
          h.id === habit.id
            ? {
                ...h,
                completedDates: h.completedDates.filter((d) => d !== todayStr),
                streak: Math.max(0, h.streak - 1),
              }
            : h
        )
      )
    } else {
      await markHabitComplete(habit.id, todayStr, habit.streak)
      setHabits((prev) =>
        prev.map((h) =>
          h.id === habit.id
            ? { ...h, completedDates: [...(h.completedDates || []), todayStr], streak: h.streak + 1 }
            : h
        )
      )
    }
  }, [todayStr])

  // Derived stats using useMemo
  const stats = useMemo(() => {
    const total = habits.length
    const completedToday = habits.filter((h) => h.completedDates?.includes(todayStr)).length
    const completionRate = total > 0 ? Math.round((completedToday / total) * 100) : 0
    const longestStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0)
    return { total, completedToday, completionRate, longestStreak }
  }, [habits, todayStr])

  const value = {
    habits,
    loading,
    error,
    todayStr,
    stats,
    createHabit,
    editHabit,
    removeHabit,
    toggleHabit,
    loadHabits,
  }

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
}

export const useHabits = () => {
  const ctx = useContext(HabitContext)
  if (!ctx) throw new Error('useHabits must be used inside HabitProvider')
  return ctx
}

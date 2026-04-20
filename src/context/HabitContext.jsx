import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "./AuthContext";
import {
  fetchHabits,
  addHabit,
  updateHabit,
  deleteHabit,
  markHabitComplete,
  unmarkHabitComplete,
} from "../services/habitService";

const HabitContext = createContext(null);

export const HabitProvider = ({ children }) => {
  const { user } = useAuth();

  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const todayStr = useMemo(
    () => new Date().toISOString().split("T")[0],
    []
  );

  // ✅ LOAD HABITS
  const loadHabits = useCallback(async () => {
    if (!user?.uid) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchHabits(user.uid);
      setHabits(data || []);
    } catch (err) {
      console.error("Load habits error:", err);
      setError(err.message || "Failed to load habits");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  // ✅ CREATE HABIT
  const createHabit = useCallback(
    async (habitData) => {
      if (!user?.uid) {
        console.warn("User not logged in");
        return;
      }

      try {
        const id = await addHabit(user.uid, habitData);

        setHabits((prev) => [
          {
            id,
            ...habitData,
            streak: 0,
            completedDates: [],
          },
          ...prev,
        ]);
      } catch (err) {
        console.error("Create habit error:", err);
        setError(err.message || "Failed to create habit");
      }
    },
    [user]
  );

  // ✅ UPDATE HABIT
  const editHabit = useCallback(async (habitId, updates) => {
    try {
      await updateHabit(habitId, updates);

      setHabits((prev) =>
        prev.map((h) =>
          h.id === habitId ? { ...h, ...updates } : h
        )
      );
    } catch (err) {
      console.error("Update habit error:", err);
      setError(err.message || "Failed to update habit");
    }
  }, []);

  // ✅ DELETE HABIT
  const removeHabit = useCallback(async (habitId) => {
    try {
      await deleteHabit(habitId);

      setHabits((prev) =>
        prev.filter((h) => h.id !== habitId)
      );
    } catch (err) {
      console.error("Delete habit error:", err);
      setError(err.message || "Failed to delete habit");
    }
  }, []);

  // ✅ TOGGLE HABIT
  const toggleHabit = useCallback(
    async (habit) => {
      if (!user?.uid) return;

      const completed = habit.completedDates?.includes(todayStr);

      try {
        if (completed) {
          await unmarkHabitComplete(
            habit.id,
            todayStr,
            habit.streak
          );

          setHabits((prev) =>
            prev.map((h) =>
              h.id === habit.id
                ? {
                    ...h,
                    completedDates: h.completedDates.filter(
                      (d) => d !== todayStr
                    ),
                    streak: Math.max(0, h.streak - 1),
                  }
                : h
            )
          );
        } else {
          await markHabitComplete(
            habit.id,
            todayStr,
            habit.streak
          );

          setHabits((prev) =>
            prev.map((h) =>
              h.id === habit.id
                ? {
                    ...h,
                    completedDates: [
                      ...(h.completedDates || []),
                      todayStr,
                    ],
                    streak: h.streak + 1,
                  }
                : h
            )
          );
        }
      } catch (err) {
        console.error("Toggle habit error:", err);
        setError(err.message || "Failed to update habit");
      }
    },
    [todayStr, user]
  );

  // ✅ STATS
  const stats = useMemo(() => {
    const total = habits.length;

    const completedToday = habits.filter((h) =>
      h.completedDates?.includes(todayStr)
    ).length;

    const completionRate =
      total > 0
        ? Math.round((completedToday / total) * 100)
        : 0;

    const longestStreak = habits.reduce(
      (max, h) => Math.max(max, h.streak || 0),
      0
    );

    return {
      total,
      completedToday,
      completionRate,
      longestStreak,
    };
  }, [habits, todayStr]);

  // ✅ SAFE VALUE
  const value = useMemo(
    () => ({
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
    }),
    [
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
    ]
  );

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};

// ✅ CUSTOM HOOK
export const useHabits = () => {
  const ctx = useContext(HabitContext);

  if (!ctx) {
    throw new Error(
      "useHabits must be used inside HabitProvider"
    );
  }

  return ctx;
};
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import { db } from './firebase'

const HABITS_COLLECTION = 'habits'

// CREATE
export const addHabit = async (userId, habitData) => {
  const docRef = await addDoc(collection(db, HABITS_COLLECTION), {
    ...habitData,
    userId,
    streak: 0,
    completedDates: [],
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

// READ - fetch all habits for a user
export const fetchHabits = async (userId) => {
  const q = query(
    collection(db, HABITS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

// UPDATE - edit habit details
export const updateHabit = async (habitId, updates) => {
  const ref = doc(db, HABITS_COLLECTION, habitId)
  await updateDoc(ref, updates)
}

// DELETE
export const deleteHabit = async (habitId) => {
  await deleteDoc(doc(db, HABITS_COLLECTION, habitId))
}

// Mark habit complete for today
export const markHabitComplete = async (habitId, dateStr, currentStreak) => {
  const ref = doc(db, HABITS_COLLECTION, habitId)
  await updateDoc(ref, {
    completedDates: arrayUnion(dateStr),
    streak: currentStreak + 1,
  })
}

// Unmark habit for today
export const unmarkHabitComplete = async (habitId, dateStr, currentStreak) => {
  const ref = doc(db, HABITS_COLLECTION, habitId)
  await updateDoc(ref, {
    completedDates: arrayRemove(dateStr),
    streak: Math.max(0, currentStreak - 1),
  })
}

// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   updateProfile,
// } from 'firebase/auth'
// import { auth } from './firebase'

// export const registerUser = async (email, password, displayName) => {
//   const userCredential = await createUserWithEmailAndPassword(auth, email, password)
//   await updateProfile(userCredential.user, { displayName })
//   return userCredential.user
// }

// export const loginUser = async (email, password) => {
//   const userCredential = await signInWithEmailAndPassword(auth, email, password)
//   return userCredential.user
// }

// export const logoutUser = () => signOut(auth)

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "./firebase";

// 🔐 Register
export const registerUser = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  // 👤 set display name
  await updateProfile(userCredential.user, {
    displayName: name,
  });

  return userCredential;
};

// 🔑 Login
export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// 🚪 Logout
export const logoutUser = async () => {
  return await signOut(auth);
};

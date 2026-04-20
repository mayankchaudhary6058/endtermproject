import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";          // ✅ add this
import { getFirestore } from "firebase/firestore"; // ✅ optional
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCRzXaMjh9CAolcxZ99WiEQafLK5EbGO8Y",
  authDomain: "term3endproject.firebaseapp.com",
  projectId: "term3endproject",
  storageBucket: "term3endproject.firebasestorage.app",
  messagingSenderId: "341328543253",
  appId: "1:341328543253:web:0579c3566357c6c0e1981c",
  measurementId: "G-H57WJXR3JQ"
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);


export const db = getFirestore(app);

// optional
const analytics = getAnalytics(app);

export default app;
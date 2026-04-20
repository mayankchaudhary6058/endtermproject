# 🔥 HabitFlow — Smart Habit Tracker

> Build habits that stick. Track streaks. Understand your patterns.

---

## 🎯 Problem Statement

Most people fail to build consistent habits because they lack **real-time feedback** and **behavioral insights**. HabitFlow is a full-stack web app that lets users track daily habits, visualize streaks, and analyze their consistency over time — turning vague intentions into measurable progress.

**Who is the user?** Anyone trying to build a consistent routine — students, professionals, fitness enthusiasts.  
**Problem being solved?** Lack of habit accountability and progress visibility.  
**Why does it matter?** Research shows that habit tracking alone increases follow-through by 2x.

---

## ✨ Features

- 🔐 **Authentication** — Register/Login with Firebase Auth
- ✅ **Daily Check-off** — Mark habits complete each day
- 🔥 **Streak Tracking** — Auto-calculated streaks per habit
- 📊 **Analytics** — Weekly bar charts & monthly trend lines
- 🎨 **Customizable Habits** — Pick emoji, color, and frequency
- 🗑️ **Full CRUD** — Create, Read, Update, Delete habits
- 📱 **Responsive** — Works on mobile and desktop
- ⚡ **Lazy Loading** — Code-split pages with React.lazy + Suspense

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite |
| Routing | React Router v6 |
| State | Context API + useState + useMemo |
| Backend | Firebase (Auth + Firestore) |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Deployment | Vercel / Netlify |

---

## ⚛️ React Concepts Used

- `useState`, `useEffect`, `useCallback`, `useMemo`, `useRef` — hooks
- `Context API` — AuthContext & HabitContext (global state)
- `React.lazy` + `Suspense` — lazy loading & code splitting
- `Controlled Components` — all forms are controlled
- `Lifting State Up` — habit state lifted to context
- `Conditional Rendering` — empty states, loaders, error messages
- `Lists & Keys` — habits rendered with unique Firestore IDs
- Custom hooks — `useHabitStats`, `useLocalStorage`
- Protected Routes — with redirect logic
- Component Composition — reusable StatsCard, HabitCard, etc.

---

## 🚀 Setup Instructions

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd habitflow
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Add a **Web App** → copy the config
4. Enable **Authentication → Email/Password**
5. Create **Firestore Database** (start in test mode)

### 3. Add Firebase Config

Open `src/services/firebase.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  ...
}
```

### 4. Run Locally

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Navbar.jsx
│   ├── HabitCard.jsx
│   ├── HabitForm.jsx
│   ├── StatsCard.jsx
│   ├── ProtectedRoute.jsx
│   └── LoadingSpinner.jsx
├── pages/             # Route-level pages
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   └── Analytics.jsx
├── context/           # Global state (Context API)
│   ├── AuthContext.jsx
│   └── HabitContext.jsx
├── hooks/             # Custom React hooks
│   ├── useHabitStats.js
│   └── useLocalStorage.js
├── services/          # Firebase abstraction layer
│   ├── firebase.js
│   ├── authService.js
│   └── habitService.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🌐 Deployment (Vercel)

```bash
npm install -g vercel
vercel
```

---

## 👨‍💻 Author

Built as an end-term project for **Building Web Applications with React** — Batch 2029.

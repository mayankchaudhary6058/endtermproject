import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { HabitProvider } from "./context/HabitContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Analytics = lazy(() => import("./pages/Analytics"));

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        {children}
      </main>
    </div>
  );
};

const PageLoader = () => (
  <div className="flex h-screen items-center justify-center bg-gray-950 text-white">
    <LoadingSpinner size="lg" text="Loading..." />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <HabitProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>

              {/* PUBLIC ROUTES */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* PROTECTED ROUTES */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Analytics />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* DEFAULT ROUTE FIX */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* FALLBACK (LOGIN SAFE) */}
              <Route path="*" element={<Navigate to="/login" replace />} />

            </Routes>
          </Suspense>
        </HabitProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
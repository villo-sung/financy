import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/auth/login";
import { SignUp } from "./pages/auth/sign-up";
import { useAuthStore } from "./stores/auth";
import { Layout } from "./pages/_layout";
import { Dashboard } from "./pages/dashboard";
import { Profile } from "./pages/profile";
import { Categories } from "./pages/categories";
import { Transactions } from "./pages/transactions";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        <Route path="/sign-up" element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/transactions" element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        } />

        <Route path="/categories" element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        } />
      </Routes>
    </Layout>
  )
}

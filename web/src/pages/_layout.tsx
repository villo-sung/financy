import { Toaster } from "sonner";
import { Header } from "@/components/header";
import { useAuthStore } from "@/stores/auth";
import { useNavigate } from "react-router-dom";

export function Layout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const navigate = useNavigate()

  if (!isAuthenticated) {
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="mx-auto px-12 py-12">{children}</main>

      <Toaster richColors />
    </div>
  )
}
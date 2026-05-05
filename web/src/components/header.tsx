import { useAuthStore } from "@/stores/auth"
import logo from "@/assets/logo.png"
import { Link, useLocation } from "react-router-dom"
import { Avatar, AvatarFallback } from "./ui/avatar"

export function Header() {
  const { user, isAuthenticated } = useAuthStore()
  const location = useLocation()
  const isDashboardPage = location.pathname === "/"
  const isTransactionsPage = location.pathname === "/transactions"
  const isCategoriesPage = location.pathname === "/categories"

  return (
    <div className="w-full">
      {isAuthenticated && (
        <div className="flex items-center justify-between w-full bg-white border-b border-gray-200 px-12 py-4">
          <img src={logo} alt="Financy" width={100} height={24} />

          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium">
              <span className={isDashboardPage ? "text-brand-base font-semibold" : "text-gray-600 text-sm hover:text-brand-base hover:underline"}>
                Dashboard
              </span>
            </Link>

            <Link to="/transactions" className="text-sm font-medium">
              <span className={isTransactionsPage ? "text-brand-base font-semibold" : "text-gray-600 text-sm hover:text-brand-base hover:underline"}>
                Transações
              </span>
            </Link>

            <Link to="/categories" className="text-sm font-medium">
              <span className={isCategoriesPage ? "text-brand-base font-semibold" : "text-gray-600 text-sm hover:text-brand-base hover:underline"}>
                Categorias
              </span>
            </Link>
          </div>

          <Link to="/profile" className="w-25 flex justify-end">
            <Avatar>
              <AvatarFallback className="bg-gray-300 text-gray-800 font-medium text-sm">
                {user?.name.charAt(0).toUpperCase() + user?.name.split(' ').reverse()[0].charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      )}
    </div>
  )
}

import { useState } from "react"
import logo from "../../assets/logo.png"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/stores/auth"
import { toast } from "sonner"
import { Lock, Mail, User, LogIn } from "lucide-react"

export function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const signUp = useAuthStore((state) => state.signUp)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await signUp({ name, email, password })

      if (response) {
        toast.success('Conta criada com sucesso!')

        navigate('/')
      }
    } catch (error) {
      console.error(error)
      toast.error('Erro ao realizar cadastro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <img src={logo} className="w-33.5 h-8" alt="" />

      <Card className="w-full max-w-md rounded-xl p-8 flex flex-col gap-8">
        <CardHeader className="flex flex-col gap-1 items-center p-0">
          <CardTitle className="text-xl font-bold text-gray-800">Criar conta</CardTitle>

          <CardDescription className="text-base text-gray-600 text-center">
            Comece a controlar suas finanças ainda hoje
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0 flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Nome completo</Label>

              <div className="flex items-center gap-2 border border-gray-300 px-3 py-3.5 rounded-lg">
                <User className="size-4 text-gray-400 shrink-0" />

                <Input
                  id="name"
                  type="text"
                  value={name}
                  placeholder="Seu nome completo"
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="bg-white placeholder:text-gray-400 text-base p-0 pl-1 h-full border-none focus-visible:ring-0 leading-4.5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">E-mail</Label>

              <div className="flex items-center gap-2 border border-gray-300 px-3 py-3.5 rounded-lg">
                <Mail className="size-4 text-gray-400 shrink-0" />

                <Input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="mail@exemplo.com"
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="bg-white placeholder:text-gray-400 text-base p-0 pl-1 h-full border-none focus-visible:ring-0 leading-4.5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Senha</Label>

              <div className="flex items-center gap-2 border border-gray-300 px-3 py-3.5 rounded-lg">
                <Lock className="size-4 text-gray-400 shrink-0" />

                <Input
                  id="password"
                  type="password"
                  value={password}
                  placeholder="Digite sua senha"
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="bg-white placeholder:text-gray-400 text-base p-0 pl-1 h-full border-none focus-visible:ring-0 leading-4.5"
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-2 rounded-lg h-12 bg-brand-base text-white font-medium" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>

          <div className="flex items-center gap-2">
            <div className="h-px w-full bg-gray-300"></div>
            <span className="text-sm text-gray-500">ou</span>
            <div className="h-px w-full bg-gray-300"></div>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-center text-sm text-gray-600">Já tem uma conta?</span>

            <Link to="/login">
              <Button type="button" className="w-full rounded-lg h-12 font-medium gap-2" disabled={loading} variant="outline">
                <LogIn className="size-4.5" />
                Fazer login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

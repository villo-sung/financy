import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth"
import { toast } from "sonner"
import { LogOut, Mail, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Profile() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const { logout, user } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // const response = await login({ email, password })

      // if (response) {
      //   toast.success('Login realizado com sucesso!')

      //   navigate('/')
      // }
    } catch (error) {
      console.error(error)
      toast.error('Erro ao realizar login')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setName(user?.name || '')
    setEmail(user?.email || '')
  }, [user])

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md rounded-xl p-8 flex flex-col gap-8">
        <Avatar className="mx-auto size-16">
          <AvatarFallback className="bg-gray-300 text-gray-800 text-2xl font-medium">
            {user?.name.charAt(0).toUpperCase() + user?.name.split(' ').reverse()[0].charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <CardHeader className="flex flex-col gap-0.5 items-center">
          <CardTitle className="text-xl font-bold text-gray-800">{user?.name}</CardTitle>

          <CardDescription className="text-base text-gray-600">
            {user?.email}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0 flex flex-col gap-4">
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

                <Input readOnly type="email" value={email} placeholder="mail@exemplo.com" onChange={(e) => setEmail(e.target.value)} disabled={loading} className="bg-white placeholder:text-gray-400 text-base p-0 pl-1 h-full border-none focus-visible:ring-0 leading-4.5" />
              </div>

              <span className="text-xs text-gray-500">O e-mail não pode ser alterado</span>
            </div>

            <Button type="submit" className="w-full mt-2 rounded-lg h-12 bg-brand-base text-white font-medium" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </form>

          <Button type="button" className="w-full rounded-lg h-12 font-medium gap-2 text-gray-700" disabled={loading} variant="outline" onClick={logout}>
            <LogOut className="size-4.5 text-danger" />

            Sair da conta
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
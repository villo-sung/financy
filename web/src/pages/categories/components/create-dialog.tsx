import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { type FormEvent, useState } from "react"
import { icons } from "@/utils/icon-mapper"
import { Color } from "@/data"
import { useMutation } from "@apollo/client/react"
import { CREATE_CATEGORY } from "@/lib/graphql/mutations/category"
import { toast } from "sonner"

export interface CreateCategoryDialogProps {
  onCreated: () => void
}

export function CreateCategoryDialog({ onCreated }: CreateCategoryDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState<keyof typeof icons | null>(null)
  const [color, setColor] = useState<Color | null>(null)
  const [createCategory, { loading }] = useMutation(CREATE_CATEGORY, {
    onCompleted: () => {
      onCreated()

      setTitle("")
      setDescription("")
      setIcon(null)
      setColor(null)

      toast.success("Categoria criada com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao criar categoria")
    }
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    createCategory({
      variables: {
        request: {
          title,
          description,
          icon,
          color
        }
      }
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Nova categoria</DialogTitle>
        <DialogDescription>
          Organize suas transações com categorias
        </DialogDescription>
      </DialogHeader>

      <form id="create-category-form" className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label>Título</Label>

          <Input placeholder="Ex. Alimentação" value={title} onChange={e => setTitle(e.target.value)} className="border border-gray-300 rounded-lg placeholder:text-gray-400 bg-white" />
        </div>

        <div className="space-y-2">
          <Label>Descrição</Label>

          <Input placeholder="Descrição da categoria" value={description} onChange={e => setDescription(e.target.value)} className="border border-gray-300 rounded-lg placeholder:text-gray-400 bg-white" />

          <span className="text-gray-500 text-xs">Opcional</span>
        </div>

        <div className="space-y-2">
          <Label>Ícone</Label>

          <div className="flex items-center gap-2 flex-wrap">
            {Object.keys(icons).map((iconOption) => {
              const Icon = icons[iconOption as keyof typeof icons]

              return (
                <Button
                  key={iconOption}
                  type="button"
                  size="icon-lg"
                  variant="outline"
                  onClick={() => setIcon(iconOption as keyof typeof icons)}
                  className={`p-2.5 rounded-lg border ${iconOption === icon ? "border-brand-base bg-gray-100 text-gray-600" : "border-gray-300 text-gray-500"}`}
                >
                  <Icon size={16} />
                </Button>
              )
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Cor</Label>

          <div className="flex items-center gap-2 flex-wrap">
            {Object.values(Color).map((colorOption) => {
              const bgClasses: Record<Color, string> = {
                [Color.GREEN]: "bg-green-base",
                [Color.BLUE]: "bg-blue-base",
                [Color.PURPLE]: "bg-purple-base",
                [Color.PINK]: "bg-pink-base",
                [Color.RED]: "bg-red-base",
                [Color.ORANGE]: "bg-orange-base",
                [Color.YELLOW]: "bg-yellow-base",
              }

              return (
                <Button
                  key={colorOption}
                  type="button"
                  variant="outline"
                  onClick={() => setColor(colorOption)}
                  className={`h-7.5 w-12.5 rounded-lg p-1 border ${color === colorOption ? "border-brand-base" : "border-gray-300"}`}
                >
                  <span className={`w-full h-full rounded-sm ${bgClasses[colorOption]}`} />
                </Button>
              )
            })}
          </div>
        </div>
      </form>

      <DialogFooter>
        <Button form="create-category-form" type="submit" disabled={loading || !title.trim() || !icon || !color} className="w-full mt-2 rounded-lg h-12 bg-brand-base text-white font-medium">
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

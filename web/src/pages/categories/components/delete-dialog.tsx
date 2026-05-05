import { Button } from "@/components/ui/button"
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DELETE_CATEGORY } from "@/lib/graphql/mutations/category"
import { useMutation } from "@apollo/client/react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export interface DeleteCategoryDialogProps {
  categoryId: string
  onDeleted?: () => void
}

export function DeleteCategoryDialog({ categoryId, onDeleted }: DeleteCategoryDialogProps) {
  const [deleteCategory, { loading }] = useMutation<{ deleteCategory: { id: string } }>(DELETE_CATEGORY, {
    onCompleted: () => {
      onDeleted?.()
      toast.success("Categoria deletada com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao deletar categoria!")
    }
  })

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Deletar categoria</DialogTitle>
        <DialogDescription>
          Tem certeza que deseja deletar essa categoria?
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancelar</Button>
        </DialogClose>

        <Button variant="destructive" onClick={() => deleteCategory({ variables: { categoryId } })}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Deletar"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
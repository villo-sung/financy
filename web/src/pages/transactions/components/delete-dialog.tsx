import { Button } from "@/components/ui/button"
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DELETE_TRANSACTION } from "@/lib/graphql/mutations/transaction"
import { useMutation } from "@apollo/client/react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export interface DeleteTransactionDialogProps {
  transactionId: string
  onDeleted?: () => void
}

export function DeleteTransactionDialog({ transactionId, onDeleted }: DeleteTransactionDialogProps) {
  const [deleteTransaction, { loading }] = useMutation<{ deleteTransaction: { id: string } }>(DELETE_TRANSACTION, {
    onCompleted: () => {
      onDeleted?.()
      toast.success("Transação deletada com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao deletar transação!")
    }
  })

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Deletar transação</DialogTitle>
        <DialogDescription>
          Tem certeza que deseja deletar essa transação?
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancelar</Button>
        </DialogClose>

        <Button variant="destructive" onClick={() => deleteTransaction({ variables: { transactionId } })}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Deletar"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
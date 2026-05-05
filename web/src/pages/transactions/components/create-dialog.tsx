import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { type FormEvent, useState } from "react"
import { TransactionType, type Category } from "@/data"
import { useMutation, useQuery } from "@apollo/client/react"
import { CREATE_TRANSACTION } from "@/lib/graphql/mutations/transaction"
import { GET_ALL_CATEGORIES } from "@/lib/graphql/queries/category"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon, CircleArrowDown, CircleArrowUp } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ptBR } from "date-fns/locale"

export interface CreateTransactionDialogProps {
  onCreated: () => void
}

export function CreateTransactionDialog({ onCreated }: CreateTransactionDialogProps) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState<number>(0)
  const [date, setDate] = useState<Date | undefined>()
  const [type, setType] = useState<TransactionType | null>(null)
  const [categoryId, setCategoryId] = useState<string>("")
  const { data } = useQuery<{ categories: { items: Pick<Category, 'id' | 'title'>[] } }>(GET_ALL_CATEGORIES)
  const [createTransaction, { loading }] = useMutation(CREATE_TRANSACTION, {
    onCompleted: () => {
      onCreated()

      setDescription("")
      setAmount(0)
      setDate(undefined)
      setType(null)
      setCategoryId("")

      toast.success("Transação criada com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao criar transação")
    }
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    createTransaction({
      variables: {
        request: {
          description,
          amount,
          date,
          type,
          categoryId,
        }
      }
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Nova transação</DialogTitle>
        <DialogDescription>
          Registre sua despesa ou receita
        </DialogDescription>
      </DialogHeader>

      <form id="create-transaction-form" className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex w-full border border-gray-200 rounded-xl p-2">
          <Button
            type="button"
            className={`flex-1 items-center gap-3 h-11.5 rounded-lg ${type === TransactionType.EXPENSE ? "text-gray-800 border border-red-base bg-gray-100" : "text-gray-600"
              }`}
            variant="ghost"
            onClick={() => setType(TransactionType.EXPENSE)}
          >
            <CircleArrowDown size={16} className={type === TransactionType.EXPENSE ? "text-red-base" : "text-gray-400"} />

            Despesa
          </Button>

          <Button
            type="button"
            className={`flex-1 items-center gap-3 h-11.5 rounded-lg ${type === TransactionType.REVENUE ? "text-gray-800 border border-green-base bg-gray-100" : "text-gray-600"
              }`}
            variant="ghost"
            onClick={() => setType(TransactionType.REVENUE)}
          >
            <CircleArrowUp size={16} className={type === TransactionType.REVENUE ? "text-green-base" : "text-gray-400"} />

            Receita
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Descrição</Label>

          <Input placeholder="Ex. Almoço no restaurante" value={description} onChange={e => setDescription(e.target.value)} className="border border-gray-300 rounded-lg placeholder:text-gray-400 bg-white" />
        </div>

        <div className="flex items-center gap-4 w-full">
          <div className="space-y-2 flex-1">
            <Label>Data</Label>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" data-empty={!date} className="border border-gray-300 rounded-lg placeholder:text-gray-400 bg-white w-full flex items-center justify-start gap-3">
                  <CalendarIcon />
                  {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione a data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar mode="single" selected={date} onSelect={setDate} locale={ptBR} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 flex-1">
            <Label>Valor</Label>

            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">R$</span>

              <Input type="number" placeholder="0,00" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} className="pl-9 border border-gray-300 rounded-lg placeholder:text-gray-400 bg-white" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Categoria</Label>

          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="border border-gray-300 rounded-lg bg-white w-full">
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>

            <SelectContent>
              {data && data.categories.items.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </form>

      <DialogFooter>
        <Button form="create-transaction-form" type="submit" disabled={loading} className="w-full mt-2 rounded-lg h-12 bg-brand-base text-white font-medium">
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, CircleArrowDown, CircleArrowUp, Plus, SquarePen, Trash } from "lucide-react";
import { icons } from "@/utils/icon-mapper";
import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Color, TransactionType, type Transaction } from "@/data";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from "@/components/ui/table";
import { GET_ALL_TRANSACTIONS } from "@/lib/graphql/queries/transaction";
import { CreateTransactionDialog } from "./components/create-dialog";
import { UpdateTransactionDialog } from "./components/update-dialog";
import { DeleteTransactionDialog } from "./components/delete-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { GET_ALL_CATEGORIES } from "@/lib/graphql/queries/category";
import { Label } from "@/components/ui/label";

export function Transactions() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("ALL")
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL")

  const pageSize = 10
  const { data, loading, refetch } = useQuery<{
    transactions: {
      items: Pick<Transaction, 'id' | 'description' | 'category' | 'amount' | 'date' | 'type'>[],
      totalCount: number
    }
  }>(GET_ALL_TRANSACTIONS, {
    variables: {
      page,
      pageSize,
      search: search || undefined,
      type: typeFilter === "ALL" ? undefined : typeFilter,
      categoryId: categoryFilter === "ALL" ? undefined : categoryFilter
    }
  })

  const { data: categoriesData } = useQuery<{ categories: { items: { id: string, title: string }[] } }>(GET_ALL_CATEGORIES)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  function handleCreate() {
    refetch()
    setIsCreateDialogOpen(false)
  }

  function handleDelete() {
    refetch()
    setIsDeleteDialogOpen(false)
  }

  function handleUpdate() {
    refetch()
    setIsEditDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center">
        <div className="space-y-0.5 flex-1">
          <h2 className="text-gray-800 text-2xl font-bold">Transações</h2>
          <h4>Gerencie todas as suas transações financeiras</h4>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-base gap-2 rounded-lg h-9">
              <Plus size={16} />

              Nova transação
            </Button>
          </DialogTrigger>

          {isCreateDialogOpen && <CreateTransactionDialog onCreated={handleCreate} />}
        </Dialog>
      </div>

      <div className="bg-white p-6 pt-5 rounded-xl border border-gray-200 flex gap-4 items-center">
        <div className="flex-1 space-y-2">
          <Label htmlFor="search" className="text-sm font-medium text-gray-700">Buscar</Label>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

            <Input
              placeholder="Buscar por descrição"
              className="pl-10 h-11 rounded-lg border-gray-300 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <Label className="text-sm font-medium text-gray-700">Tipo</Label>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-11! rounded-lg border-gray-300 bg-white w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value={TransactionType.REVENUE}>Entrada</SelectItem>
              <SelectItem value={TransactionType.EXPENSE}>Saída</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-2">
          <Label className="text-sm font-medium text-gray-700">Categoria</Label>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-11! rounded-lg border-gray-300 bg-white w-full">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas</SelectItem>
              {categoriesData?.categories.items.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-2">
          <Label className="text-sm font-medium text-gray-700">Período</Label>

          <Select defaultValue="all" disabled>
            <SelectTrigger className="h-11! rounded-lg border-gray-300 bg-white w-full">
              <SelectValue placeholder="Maio / 2026" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Maio / 2026</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table containerClassName="overflow-hidden" className="bg-white">
        <TableRow>
          <TableHead className="text-xs text-gray-500 font-medium uppercase">Descrição</TableHead>
          <TableHead className="text-center text-xs text-gray-500 font-medium uppercase">Data</TableHead>
          <TableHead className="text-center text-xs text-gray-500 font-medium uppercase">Categoria</TableHead>
          <TableHead className="text-center text-xs text-gray-500 font-medium uppercase">Tipo</TableHead>
          <TableHead className="text-right text-xs text-gray-500 font-medium uppercase">Valor</TableHead>
          <TableHead className="text-right text-xs text-gray-500 font-medium uppercase w-30">Ações</TableHead>
        </TableRow>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 h-24">
                Carregando transações...
              </TableCell>
            </TableRow>
          ) : data?.transactions.items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 h-24">
                Nenhuma transação encontrada
              </TableCell>
            </TableRow>
          ) : (
            data?.transactions.items.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <span className={`p-3 rounded-lg ${(() => {
                      const bgLightColors: Record<Color, string> = {
                        [Color.GREEN]: "bg-green-light",
                        [Color.BLUE]: "bg-blue-light",
                        [Color.PURPLE]: "bg-purple-light",
                        [Color.PINK]: "bg-pink-light",
                        [Color.RED]: "bg-red-light",
                        [Color.ORANGE]: "bg-orange-light",
                        [Color.YELLOW]: "bg-yellow-light",
                      }
                      return bgLightColors[transaction.category.color]
                    })()}`}>
                      {(() => {
                        const CategoryIcon = icons[transaction.category.icon]
                        const textColors: Record<Color, string> = {
                          [Color.GREEN]: "text-green-base",
                          [Color.BLUE]: "text-blue-base",
                          [Color.PURPLE]: "text-purple-base",
                          [Color.PINK]: "text-pink-base",
                          [Color.RED]: "text-red-base",
                          [Color.ORANGE]: "text-orange-base",
                          [Color.YELLOW]: "text-yellow-base",
                        }

                        return <CategoryIcon className={textColors[transaction.category.color]} size={16} />
                      })()}
                    </span>

                    {transaction.description}
                  </div>
                </TableCell>

                <TableCell className="text-center">{new Date(transaction.date).toLocaleDateString()}</TableCell>

                <TableCell className="text-center">
                  <Badge variant="outline" className={`bg-${transaction.category.color}-light text-${transaction.category.color}-base`}>{transaction.category.title}</Badge>
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    {transaction.type === TransactionType.EXPENSE ? (
                      <CircleArrowDown className="text-red-base" size={16} />
                    ) : (
                      <CircleArrowUp className="text-green-base" size={16} />
                    )}

                    <span className={`text-sm ${transaction.type === TransactionType.EXPENSE ? "text-red-base" : "text-green-base"
                      }`}>
                      {transaction.type === TransactionType.EXPENSE ? "Saída" : "Entrada"}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-right font-semibold text-sm text-gray-800">
                  {transaction.type === TransactionType.EXPENSE ? "-" : "+"} {' '} {transaction.amount.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>

                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                      <DialogTrigger asChild>
                        <span className="p-2 cursor-pointer rounded-lg border border-gray-300">
                          <Trash className="text-danger" size={16} />
                        </span>
                      </DialogTrigger>

                      {isDeleteDialogOpen && <DeleteTransactionDialog transactionId={transaction.id} onDeleted={handleDelete} />}
                    </Dialog>

                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <span className="p-2 cursor-pointer rounded-lg border border-gray-300">
                          <SquarePen className="text-gray-700" size={16} />
                        </span>
                      </DialogTrigger>

                      {isEditDialogOpen && <UpdateTransactionDialog transactionId={transaction.id} onUpdated={handleUpdate} />}
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>

        <TableFooter className="bg-white border-t border-gray-200">
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={6}>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-500">
                  {((page - 1) * pageSize) + 1} a {Math.min(page * pageSize, data?.transactions.totalCount || 0)} | {data?.transactions.totalCount || 0} resultados
                </span>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-lg border-gray-300"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft size={16} className="text-gray-600" />
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.ceil((data?.transactions.totalCount || 0) / pageSize) }, (_, i) => i + 1).map((p) => (
                        <Button
                          key={p}
                          variant={p === page ? "default" : "outline"}
                          size="icon"
                          className={`h-8 w-8 rounded-lg ${p === page
                            ? "bg-brand-base text-white hover:bg-brand-dark"
                            : "border-gray-300 text-gray-600 hover:bg-gray-100"
                            }`}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-lg border-gray-300"
                      onClick={() => setPage(p => p + 1)}
                      disabled={!data || page * pageSize >= data.transactions.totalCount}
                    >
                      <ChevronRight size={16} className="text-gray-600" />
                    </Button>
                  </div>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
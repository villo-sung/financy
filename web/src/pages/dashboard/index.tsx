import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Color, TransactionType, type Category, type Transaction } from "@/data"
import { GET_SUMMARY } from "@/lib/graphql/queries/dashboard"
import { icons } from "@/utils/icon-mapper"
import { useQuery } from "@apollo/client/react"
import { ChevronRight, CircleArrowDown, CircleArrowUp, Plus, Wallet } from "lucide-react"
import { Link } from "react-router-dom"

interface Summary {
  recentTransactions: Transaction[]
  categories: (Category & { transactionsCount: number, transactionsAmount: number })[]
  totalAmount: number
  monthExpensesAmount: number
  monthRevenuesAmount: number
}

interface DashboardData {
  dashboard: Summary
}

export function Dashboard() {
  const { data, loading } = useQuery<DashboardData>(GET_SUMMARY, {
    fetchPolicy: 'network-only'
  })

  const { recentTransactions, categories, totalAmount, monthExpensesAmount, monthRevenuesAmount } = data?.dashboard || {}

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-6">
        <Card className="p-6 rounded-xl flex-1">
          <CardContent className="flex flex-col items-start gap-4 p-0">
            <div className="flex items-center gap-3">
              <Wallet size={24} className="shrink-0 text-purple-base" />

              <span className="uppercase">Saldo total</span>
            </div>

            <h2 className="text-3xl font-bold">{(loading ? 0 : totalAmount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
          </CardContent>
        </Card>

        <Card className="p-6 rounded-xl flex-1">
          <CardContent className="flex flex-col items-start gap-4 p-0">
            <div className="flex items-center gap-3">
              <CircleArrowUp size={24} className="shrink-0 text-green-base" />

              <span className="uppercase">Receitas do mês</span>
            </div>

            <h2 className="text-3xl font-bold">{(loading ? 0 : monthRevenuesAmount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
          </CardContent>
        </Card>

        <Card className="p-6 rounded-xl flex-1">
          <CardContent className="flex flex-col items-start gap-4 p-0">
            <div className="flex items-center gap-3">
              <CircleArrowDown size={24} className="shrink-0 text-red-base" />

              <span className="uppercase">Despesas do mês</span>
            </div>

            <h2 className="text-3xl font-bold">{(loading ? 0 : monthExpensesAmount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6 items-start">
        <Card className="px-6 py-5 pb-2 rounded-xl col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2 p-0">
            <span className="font-medium text-xs uppercase text-gray-500">Transações recentes</span>

            <Link to="/transactions" className="flex items-center gap-1 text-sm font-medium text-brand-base hover:underline -mr-3">
              Ver todas
              <ChevronRight size={20} />
            </Link>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 p-0">
            <Table containerClassName="overflow-hidden">
              <TableHeader>
                <TableRow className="h-0">
                  <TableHead className="h-0 w-2/4"></TableHead>
                  <TableHead className="h-0 w-1/4"></TableHead>
                  <TableHead className="h-0 w-1/4"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {recentTransactions?.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="flex items-center gap-4">
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

                      <div className="flex flex-col gap-0.5 flex-1">
                        <span className="font-semibold text-sm">{transaction.description}</span>
                        <span className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge variant="outline" className={`bg-${transaction.category.color}-light text-${transaction.category.color}-base`}>{transaction.category.title}</Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {transaction.type === TransactionType.EXPENSE ? "-" : "+"} {' '} {transaction.amount.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}

                        {transaction.type === TransactionType.EXPENSE ? (
                          <CircleArrowDown className="text-red-base" size={16} />
                        ) : (
                          <CircleArrowUp className="text-green-base" size={16} />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TableFooter className="bg-white border-t border-gray-100">
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={3} className="p-0">
                    <Link to="/transactions" className="flex items-center justify-center gap-1.5 py-4 w-full text-brand-base font-medium hover:bg-gray-50 transition-colors">
                      <Plus size={16} />
                      Nova transação
                    </Link>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>

        <Card className="px-6 py-5 rounded-xl col-span-1">
          <CardHeader className="flex flex-row items-center justify-between gap-2 p-0">
            <span className="font-medium text-xs uppercase text-gray-500">Categorias</span>

            <Link to="/categories" className="flex items-center gap-1 text-sm font-medium text-brand-base hover:underline">
              Gerenciar
              <ChevronRight size={20} />
            </Link>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 p-0">
            <Table containerClassName="overflow-hidden">
              <TableHeader>
                <TableRow className="h-0">
                  <TableHead className="h-0 w-2/4"></TableHead>
                  <TableHead className="h-0 w-1/4"></TableHead>
                  <TableHead className="h-0 w-1/4"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {categories?.map((category) => (
                  <TableRow key={category.id} className="hover:bg-white">
                    <TableCell className="text-left p-0">
                      <Badge variant="outline" className={`bg-${category.color}-light text-${category.color}-base`}>{category.title}</Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <span className="text-gray-600 text-sm">{category.transactionsCount} {category.transactionsCount === 1 ? 'item' : 'itens'}</span>
                    </TableCell>

                    <TableCell className="text-right text-sm font-semibold text-gray-800">
                      {category.transactionsAmount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
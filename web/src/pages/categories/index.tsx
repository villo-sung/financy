import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ArrowUpDown, Loader2, Plus, SquarePen, Tag, Trash } from "lucide-react";
import { icons } from "@/utils/icon-mapper";
import { useQuery } from "@apollo/client/react";
import { GET_ALL_CATEGORIES } from "@/lib/graphql/queries/category";
import { Color, type Category } from "@/data";
import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateCategoryDialog } from "./components/create-dialog";
import { DeleteCategoryDialog } from "./components/delete-dialog";
import { UpdateCategoryDialog } from "./components/update-dialog";

export function Categories() {
  const { data, loading, refetch } = useQuery<{
    categories: {
      items: Category[],
      totalTransactionsCount: number
      totalCategoriesCount: number
      mostUsedCategory: Pick<Category, 'id' | 'title' | 'icon' | 'color'>
    }
  }>(GET_ALL_CATEGORIES)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const categories = data?.categories.items || []
  const totalTransactionsCount = data?.categories.totalTransactionsCount || 0
  const totalCategoriesCount = data?.categories.totalCategoriesCount || 0
  const mostUsedCategory = data?.categories.mostUsedCategory || null

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
    <div className="flex flex-col justify-center gap-8 w-full">
      <div className="flex items-center">
        <div className="space-y-0.5 flex-1">
          <h2 className="text-gray-800 text-2xl font-bold">Categorias</h2>
          <h4>Organize suas transações por categorias</h4>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-base gap-2 rounded-lg h-9">
              <Plus size={16} />

              Nova categoria
            </Button>
          </DialogTrigger>

          {isCreateDialogOpen && <CreateCategoryDialog onCreated={handleCreate} />}
        </Dialog>
      </div>

      <div className="flex gap-6">
        <Card className="p-6 rounded-xl flex-1">
          <CardContent className="flex items-start gap-4 p-0">
            <div className="p-2">
              <Tag size={24} className="shrink-0" />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold">{loading ? 0 : totalCategoriesCount}</h2>

              <span className="uppercase">Total de categorias</span>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 rounded-xl flex-1">
          <CardContent className="flex items-start gap-4 p-0">
            <div className="p-2">
              <ArrowUpDown size={24} className="shrink-0 text-purple-base" />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold">{loading ? 0 : totalTransactionsCount}</h2>

              <span className="uppercase">Total de transações</span>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 rounded-xl flex-1">
          <CardContent className="flex items-start gap-4 p-0">
            {mostUsedCategory ? (
              <>
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
                  return bgLightColors[mostUsedCategory.color]
                })()}`}>
                  {(() => {
                    const CategoryIcon = icons[mostUsedCategory.icon as keyof typeof icons]
                    const textColors: Record<Color, string> = {
                      [Color.GREEN]: "text-green-base",
                      [Color.BLUE]: "text-blue-base",
                      [Color.PURPLE]: "text-purple-base",
                      [Color.PINK]: "text-pink-base",
                      [Color.RED]: "text-red-base",
                      [Color.ORANGE]: "text-orange-base",
                      [Color.YELLOW]: "text-yellow-base",
                    }

                    if (!CategoryIcon) return <Tag size={16} />

                    return <CategoryIcon className={textColors[mostUsedCategory.color]} size={16} />
                  })()}
                </span>

                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-bold">
                    {loading ? "---" : mostUsedCategory.title}
                  </h2>

                  <span className="uppercase">Categoria mais utilizada</span>
                </div>
              </>
            ) : (
              <>
                <div className="p-2">
                  <ArrowUpDown size={24} className="shrink-0 text-gray-300" />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-bold">---</h2>
                  <span className="uppercase">Categoria mais utilizada</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-blue-base" />
          </div>
        ) : (
          categories.map((category, index) => (
            <Card
              key={index}
              className="p-6 rounded-xl flex flex-col gap-5"
            >
              <CardHeader className="p-0 flex justify-between">
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
                  return bgLightColors[category.color]
                })()}`}>
                  {(() => {
                    const CategoryIcon = icons[category.icon as keyof typeof icons]

                    const textColors: Record<Color, string> = {
                      [Color.GREEN]: "text-green-base",
                      [Color.BLUE]: "text-blue-base",
                      [Color.PURPLE]: "text-purple-base",
                      [Color.PINK]: "text-pink-base",
                      [Color.RED]: "text-red-base",
                      [Color.ORANGE]: "text-orange-base",
                      [Color.YELLOW]: "text-yellow-base",
                    }

                    if (!CategoryIcon) return <Tag size={16} />

                    return <CategoryIcon className={textColors[category.color]} size={16} />
                  })()}
                </span>

                <div className="flex items-center gap-2">
                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <span className="p-2 cursor-pointer rounded-lg border border-gray-300">
                        <Trash className="text-danger" size={16} />
                      </span>
                    </DialogTrigger>

                    <DeleteCategoryDialog categoryId={category.id} onDeleted={handleDelete} />
                  </Dialog>

                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <span className="p-2 cursor-pointer rounded-lg border border-gray-300">
                        <SquarePen className="text-gray-700" size={16} />
                      </span>
                    </DialogTrigger>

                    {isEditDialogOpen && <UpdateCategoryDialog categoryId={category.id} onUpdated={handleUpdate} />}
                  </Dialog>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col gap-1 p-0 min-h-17">
                <h2 className="text-base font-semibold">{category.title}</h2>

                <span className="text-gray-600 text-sm leading-5">{category.description}</span>
              </CardContent>

              <CardFooter className="p-0 flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${(() => {
                  const badgeColors: Record<Color, string> = {
                    [Color.GREEN]: "text-green-dark bg-green-light",
                    [Color.BLUE]: "text-blue-dark bg-blue-light",
                    [Color.PURPLE]: "text-purple-dark bg-purple-light",
                    [Color.PINK]: "text-pink-dark bg-pink-light",
                    [Color.RED]: "text-red-dark bg-red-light",
                    [Color.ORANGE]: "text-orange-dark bg-orange-light",
                    [Color.YELLOW]: "text-yellow-dark bg-yellow-light",
                  }
                  return badgeColors[category.color]
                })()}`}>{category.title}</span>

                <span className="text-gray-600 text-sm">{category.transactionsCount || 0} itens</span>
              </CardFooter>
            </Card>
          )))}
      </div>
    </div>
  )
}
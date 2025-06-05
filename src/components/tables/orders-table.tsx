"use client"
import * as React from "react"
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, Trash, Eye, Pencil, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import type { IOrder } from "@/app/models/order-model"
import { formatCurrency } from "@/lib/utils"

interface IOrdersTable {
  data: IOrder[]
  onDeleteOrder: (orderId: string) => void
  onEditOrder: (order: IOrder) => void
}

export default function OrdersTable({ data, onEditOrder, onDeleteOrder }: IOrdersTable) {
  const router = useRouter()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const handleGoToDetails = useCallback((order: IOrder) => {
    router.push(`/orders/${order.id}`)
  }, [router])

  const orderHeader = useCallback((column: Column<IOrder>) => {
    return (
      <div className="flex gap-1 items-center">
        Cliente
        <Button
          variant="ghost"
          size="icon"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown />
        </Button>
      </div>
    )
  }, [])

  const columns: ColumnDef<IOrder>[] = [
    {
      accessorKey: "cliente",
      header: ({ column }) => orderHeader(column)
      ,
    },
    {
      accessorKey: "produto",
      header: ({ column }) => orderHeader(column),
    },
    {
      accessorKey: "valor",
      header: ({ column }) => orderHeader(column),
      cell: ({ row }) => formatCurrency(row.getValue("valor")),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status")}</div>
      ),
    },
    {
      id: "actions",
      header: 'Ações',
      cell: ({ row }) => {
        return (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => handleGoToDetails(row.original)}
                >
                  <Eye />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Ver detalhes
              </TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEditOrder(row.original)}>
                  <Pencil />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDeleteOrder(row.original.id)}
                  variant="destructive"
                >
                  <Trash />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <Card className="py-0">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  )
}

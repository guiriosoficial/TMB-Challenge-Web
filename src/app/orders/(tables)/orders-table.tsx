"use client"

import { StatusTag } from "@/components/ui/status-tag"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "../../../components/ui/skeleton"
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
import {
  ArrowUpDown,
  Trash,
  Eye,
  Pencil,
  MoreHorizontal
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import type OrderModel from "@/models/order-model"
import { formatCurrency } from "@/lib/utils"
import dayjs from "dayjs"

interface IOrdersTable {
  data: OrderModel[]
  searchTerm: string
  loading: boolean
  onChangeSearchTerm: (value: string) => void
  onDeleteOrder: (orderId: string) => void
  onEditOrder: (order: OrderModel) => void
}

export function OrdersTable({ data, loading, onEditOrder, onDeleteOrder }: IOrdersTable) {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const handleGoToDetails = useCallback((order: OrderModel) => {
    router.push(`/orders/${order.id}`)
  }, [router])

  const formatDate = useCallback((dateTime: Date) => {
    return dayjs(dateTime).format('DD/MM/YYYY [ás] HH:mm')
  }, [ ])

  const orderHeader = useCallback((column: Column<OrderModel>, name: string) => {
    return (
      <div className="flex gap-1 items-center">
        {name}
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

  const rowActions = useCallback((order: OrderModel) => {
    return (
      <div className="flex justify-center w-8">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => handleGoToDetails(order)}
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
            <DropdownMenuItem onClick={() => onEditOrder(order)}>
              <Pencil />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDeleteOrder(order.id)}
              variant="destructive"
            >
              <Trash />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }, [handleGoToDetails, onDeleteOrder, onEditOrder])

  const columns: ColumnDef<OrderModel>[] = [
    {
      accessorKey: "cliente",
      header: ({ column }) => orderHeader(column, 'Cliente')
      ,
    },
    {
      accessorKey: "produto",
      header: ({ column }) => orderHeader(column, 'Produto'),
    },
    {
      accessorKey: "valor",
      header: ({ column }) => orderHeader(column, 'Valor'),
      cell: ({ row }) => formatCurrency(row.getValue("valor")),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusTag status={row.getValue('status')} />,
    },
    {
      accessorKey: "dataCriacao",
      header: ({ column }) => orderHeader(column, 'Data de criação'),
      cell: ({ row }) => formatDate(row.getValue('dataCriacao'))
    },
    {
      id: "actions",
      header: () => <div className="text-center w-8">Ações</div>,
      cell: ({ row }) => rowActions(row.original),
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
              <TableRow key={row.id}>
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
                {loading ? 'Buscando pedidos...' : 'Nenhum pedido encontrado.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  )
}

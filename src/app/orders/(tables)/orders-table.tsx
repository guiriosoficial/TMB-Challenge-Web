"use client"

import { StatusTag } from "@/components/ui/status-tag"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
// import { Skeleton } from "@/components/ui/skeleton"
import {
  Column,
  ColumnDef,
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
import { useCallback, useEffect, useMemo, useState } from "react"
import type OrderModel from "@/models/order-model"
import { formatCurrency } from "@/lib/utils"
import dayjs from "dayjs"
import { Skeleton } from "@/components/ui/skeleton"
import OrderStatus from "@/enums/order-status-enum"
// import Order from "@/models/order-model"
// import OrderStatus from "@/enums/order-status-enum"

interface IOrdersTable {
  data: OrderModel[]
  searchTerm: string
  statusFilter?: OrderStatus
  loading: boolean
  onDeleteOrder: (orderId: string) => void
  onEditOrder: (order: OrderModel) => void
  onChalgeSearchTerm: (searchTerm: string) => void
}

export function OrdersTable({ data, searchTerm, statusFilter, loading, onEditOrder, onDeleteOrder, onChalgeSearchTerm }: IOrdersTable) {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

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
      enableGlobalFilter: false,
      cell: ({ row }) => <StatusTag status={row.getValue('status')} />,
    },
    {
      accessorKey: "dataCriacao",
      enableGlobalFilter: false,
      header: ({ column }) => orderHeader(column, 'Data de criação'),
      cell: ({ row }) => formatDate(row.getValue('dataCriacao'))
    },
    {
      id: "actions",
      enableGlobalFilter: false,
      header: () => <div className="text-center w-8">Ações</div>,
      cell: ({ row }) => rowActions(row.original),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    globalFilterFn: 'includesString',
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: onChalgeSearchTerm,
    state: {
      sorting,
      globalFilter: searchTerm,
    },
  })

  useEffect(() => {
    table.getColumn('status')?.setFilterValue(statusFilter)
  }, [table, statusFilter])

  const tableSkeleton = useMemo(() => {
    return Array
      .from({ length: columns.length })
      .map((_, i) => (
        <TableCell key={i}>
          <Skeleton className="h-6 w-auto" />
        </TableCell>
      ))
  }, [columns.length])

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
              {loading
                ? tableSkeleton
                : (<TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Nenhum pedido encontrado.
                  </TableCell>
                )
              }
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  )
}

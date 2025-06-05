"use client"

import { useCallback, useState} from "react"
import { Plus} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import OrdersTable from "@/components/tables/orders-table"
import type { IOrder } from "@/app/models/order-model"
import { CreateEditOrderDialog } from "@/components/dialogs/create-edit-order-dialog"
import OrderStatus from "../enums/order-status-enum"
import { IOrderForm } from "../models/order-form-model"
import { DeleteOrderConfirmationDialog } from "@/components/dialogs/delete-order-confirmation-dialog"

const data: IOrder[] = [
  {
    id: "m5gr84i9",
    valor: 316,
    status: OrderStatus.Finalizado,
    cliente: "ken99@example.com",
    produto: "produto a",
    dataCriacao: new Date()
  },
  {
    id: "3u1reuv4",
    valor: 242,
    status: OrderStatus.Finalizado,
    cliente: "Abe45@example.com",
    produto: "produto a",
    dataCriacao: new Date()
  },
  {
    id: "derv1ws0",
    valor: 837,
    status: OrderStatus.Pendente,
    cliente: "Monserrat44@example.com",
    produto: "produto b",
    dataCriacao: new Date()
  },
  {
    id: "5kma53ae",
    valor: 874,
    status: OrderStatus.Processando,
    cliente: "Silas22@example.com",
    produto: "produto c",
    dataCriacao: new Date()
  },
  {
    id: "bhqecj4p",
    valor: 721,
    status: OrderStatus.Pendente,
    cliente: "carmella@example.com",
    produto: "produto b",
    dataCriacao: new Date()
  },
]

export default function DataTableDemo() {  
  const [isCreateOrderDialogOpen, setIsCreateOrderDialogOpen] = useState<boolean>(false)
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null)
  const [orderToEdit, setOrderToEdit] = useState<IOrder | undefined>(undefined)

  const handleToggleCreateOrderDialog = useCallback(() => {
    setIsCreateOrderDialogOpen((value) => !value)
    if (!isCreateOrderDialogOpen) setOrderToEdit(undefined)
  }, [isCreateOrderDialogOpen])

  const handleStartDeleteOrder = useCallback((orderId: string) => {
    setOrderToDelete(orderId)
  }, [])

  const handleCancelDeleteOrder = useCallback(() => {
    setOrderToDelete(null)
  }, [])

  const handleConfirmDeleteOrder = useCallback(() => {
    console.log('Deleta Pedido', orderToDelete);
    setOrderToDelete(null)
  }, [orderToDelete])

  const handleStartEditOrder = useCallback((order: IOrder) => {
    setOrderToEdit(order)
  }, [])

  const handleCancelCreateEditOrder = useCallback(() => {
    setOrderToEdit(undefined)
    setIsCreateOrderDialogOpen(false)
  }, [])

  const handleConfirmCreateEditOrder = useCallback((data: IOrderForm) => {
    console.log(data);
  }, [])

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center py-4">
          <Input
            placeholder="Buscar por cliente, produto ou valor..."
            // value={(table.getColumn("cliente")?.getFilterValue() as string) ?? ""}
            // onChange={(event) =>
            //   table.getColumn("cliente")?.setFilterValue(event.target.value)
            // }
            className="max-w-sm"
          />
          <Button onClick={handleToggleCreateOrderDialog}>
            <Plus />
            Adicionar
          </Button>
        </div>
        <OrdersTable
          data={data}
          onDeleteOrder={handleStartDeleteOrder}
          onEditOrder={handleStartEditOrder}
        />
      </div>

      <DeleteOrderConfirmationDialog
        open={Boolean(orderToDelete)}
        onConfirm={handleConfirmDeleteOrder}
        onCancel={handleCancelDeleteOrder}
      />

      <CreateEditOrderDialog
        open={isCreateOrderDialogOpen || Boolean(orderToEdit?.id)}
        order={orderToEdit}
        onConfirm={handleConfirmCreateEditOrder}
        onCancel={handleCancelCreateEditOrder}
      />
    </>
  )
}

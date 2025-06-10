"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { OrdersTable } from "@/app/orders/(tables)/orders-table"
import { CreateEditOrderDialog } from "@/components/dialogs/create-edit-order-dialog"
import { DeleteOrderConfirmationDialog } from "@/components/dialogs/delete-order-confirmation-dialog"
import { Plus } from "lucide-react"
import { useCallback, useState, useEffect } from "react"
import Order from "@/models/order-model"
import type OrderForm from "@/models/order-form-model"
import { ordersService } from "@/services/orders"
import socket from '@/lib/ws'
import OrderStatus from "@/enums/order-status-enum"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function OrdersListPage() {  
  const [isCreateOrderDialogOpen, setIsCreateOrderDialogOpen] = useState<boolean>(false)
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null)
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>()
  const [data, setData] = useState<Order[]>([])
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false)
  const [isLoadingOrder, setIsLoadingOrder] = useState<boolean>(false)
  const router = useRouter()

  const handleUpdatedOrder = useCallback((order: Order) => {
    const newData = [...data]
    const editedItemIndex = newData.findIndex((d) => d.id === order.id)
    if (editedItemIndex > -1) {
      newData[editedItemIndex] = order
      setData(newData)
    }
  }, [data])

  const handleCreatedOrder = useCallback((order: Order) => {
    const newData = [...data, order]
    setData(newData)
  }, [data])

  const handleOrderStatusUpdate = useCallback((evt: MessageEvent) => {
    const parsedData: Order = JSON.parse(evt.data)

    if (parsedData.status === OrderStatus.Finalizado) {
      toast.success('Eba!', {
        description: `O pedido ${parsedData.id} foi processado.`,
        action: {
          label: "Ver",
          onClick: () => router.push(`/orders/${parsedData.id}`),
        },
      })
    }

    handleUpdatedOrder(parsedData)
  }, [handleUpdatedOrder, router])

  const fetchData = async () => {
    setIsLoadingTable(true)
    try {
      const response = await ordersService.listOrders()
      setData(response)
    } catch (error) {
      toast.error('Ops! Houve um erro ao carregar os pedidos.')
      console.log(error);
    } finally {
      setIsLoadingTable(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {    
    socket.addEventListener('message', handleOrderStatusUpdate);

    return () => {
      socket.removeEventListener('message', handleOrderStatusUpdate);
    };
  }, [handleOrderStatusUpdate])

  const handleToggleCreateOrderDialog = useCallback(() => {
    setIsCreateOrderDialogOpen((value) => !value)
    if (!isCreateOrderDialogOpen) setOrderToEdit(null)
  }, [isCreateOrderDialogOpen])

  const handleStartDeleteOrder = useCallback((orderId: string) => {
    setOrderToDelete(orderId)
  }, [])

  const handleStopDeleteOrder = useCallback(() => {
    setOrderToDelete(null)
  }, [])

  const handleConfirmDeleteOrder = useCallback(async () => {    
    setIsLoadingOrder(true)
    if (orderToDelete) {
      try {
        await ordersService.deleteOrder(orderToDelete)
        setOrderToDelete(null)
        fetchData()
      } catch (error) {
        toast.error('Ops! Houve um erro ao excluír o pedido.')
        console.error(error)
      } finally {
        handleStopDeleteOrder()
        setIsLoadingOrder(false)
      }
    }
  }, [handleStopDeleteOrder, orderToDelete])

  const handleStartEditOrder = useCallback((order: Order) => {
    setOrderToEdit(order)
  }, [])

  const handleStopCreateEditOrder = useCallback(() => {
    setOrderToEdit(null)
    setIsCreateOrderDialogOpen(false)
  }, [])

  const handleConfirmCreateEditOrder = useCallback(async (data: OrderForm) => {
    setIsLoadingOrder(true)
    try {
      if (orderToEdit?.id) {
        const response = await ordersService.updateOrder(orderToEdit.id, data)
        handleUpdatedOrder(response)
      } else {
        const response = await ordersService.createOrder(data)
        handleCreatedOrder(response)
      }

      handleStopCreateEditOrder()
    } catch (error) {
      const title = orderToEdit?.id ? 'editar' : 'criar'
      toast.error(`Ops! Houve um erro ao ${title} o pedido.`)
      console.error(error)
    } finally {
      setIsLoadingOrder(false)
    }
  }, [handleCreatedOrder, handleStopCreateEditOrder, handleUpdatedOrder, orderToEdit?.id])

  const handleFilterStatuschange = useCallback((value: OrderStatus) => {
    setStatusFilter(value)
  }, [])

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-2xl">Pedidos</h1>
        <div className="flex gap-4">
          <Input
            className="max-w-sm"
            placeholder="Buscar por cliente, produto ou valor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            value={statusFilter}
            onValueChange={handleFilterStatuschange}
          >
            <SelectTrigger className="w-[260px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(OrderStatus).map((status) => (
                <SelectItem key={status[0]} value={status[0]}>
                  {status[1]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleToggleCreateOrderDialog}>
            <Plus />
            Adicionar
          </Button>
        </div>
        </div>
        <OrdersTable
          data={data}
          searchTerm={searchTerm}
          loading={isLoadingTable}
          statusFilter={statusFilter}
          onDeleteOrder={handleStartDeleteOrder}
          onEditOrder={handleStartEditOrder}
          onChalgeSearchTerm={setSearchTerm}
        />
      </div>

      {Boolean(orderToDelete) && <DeleteOrderConfirmationDialog
        open={Boolean(orderToDelete)}
        loading={isLoadingOrder}
        onConfirm={handleConfirmDeleteOrder}
        onCancel={handleStopDeleteOrder}
      />}

      {(isCreateOrderDialogOpen || Boolean(orderToEdit?.id)) &&<CreateEditOrderDialog
        open={isCreateOrderDialogOpen || Boolean(orderToEdit?.id)}
        order={orderToEdit}
        loading={isLoadingOrder}
        onConfirm={handleConfirmCreateEditOrder}
        onCancel={handleStopCreateEditOrder}
      />}
    </>
  )
}

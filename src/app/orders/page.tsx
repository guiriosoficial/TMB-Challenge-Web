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
import { OrdersTable } from "@/components/tables/orders-table"
import { CreateEditOrderDialog } from "@/components/dialogs/create-edit-order-dialog"
import { DeleteOrderConfirmationDialog } from "@/components/dialogs/delete-order-confirmation-dialog"
import { Plus } from "lucide-react"
import { useCallback, useState, useEffect} from "react"
import Order from "@/models/order-model"
import type OrderForm from "@/models/order-form-model"
import { ordersService } from "@/serices/orders"
import socket from '@/lib/ws'
import OrderStatus from "@/enums/order-status-enum"

export default function OrdersListPage() {  
  const [isCreateOrderDialogOpen, setIsCreateOrderDialogOpen] = useState<boolean>(false)
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null)
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [data, setData] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await ordersService.listOrders()
      setData(response)
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  }

  const handleOrderStatusUpdate = (evt: MessageEvent) => {
    handleUpdatedOrder(evt.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {    
    socket.addEventListener('message', handleOrderStatusUpdate);

    return () => {
      socket.removeEventListener('message', handleOrderStatusUpdate);
    };
  }, [])

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
    setIsLoading(true)
    if (orderToDelete) {
      try {
        await ordersService.deleteOrder(orderToDelete)
        setOrderToDelete(null)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
    handleStopDeleteOrder()
  }, [handleStopDeleteOrder, orderToDelete])

  const handleStartEditOrder = useCallback((order: Order) => {
    setOrderToEdit(order)
  }, [])

  const handleStopCreateEditOrder = useCallback(() => {
    setOrderToEdit(null)
    setIsCreateOrderDialogOpen(false)
  }, [])

  const handleCreatedOrder = useCallback((order: Order) => {
    const newData = [...data, order]
    setData(newData)
  }, [data])

  const handleUpdatedOrder = useCallback((order: Order) => {
    const newData = [...data]
    const editedItemIndex = newData.findIndex((d) => d.id === order.id)
    newData[editedItemIndex] = order
    setData(newData)
  }, [data])

  const handleConfirmCreateEditOrder = useCallback(async (data: OrderForm) => {
    setIsLoading(true)
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
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [handleCreatedOrder, handleStopCreateEditOrder, handleUpdatedOrder, orderToEdit?.id])

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
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(OrderStatus).map((status) => (
                <SelectItem key={status[0]} value={status[0]}>{status[1]}</SelectItem>
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
          onChangeSearchTerm={setSearchTerm}
          onDeleteOrder={handleStartDeleteOrder}
          onEditOrder={handleStartEditOrder}
        />
      </div>

      {Boolean(orderToDelete) && <DeleteOrderConfirmationDialog
        open={Boolean(orderToDelete)}
        orderId={orderToDelete}
        onConfirm={handleConfirmDeleteOrder}
        onCancel={handleStopDeleteOrder}
      />}

      {(isCreateOrderDialogOpen || Boolean(orderToEdit?.id)) &&<CreateEditOrderDialog
        open={isCreateOrderDialogOpen || Boolean(orderToEdit?.id)}
        order={orderToEdit}
        onConfirm={handleConfirmCreateEditOrder}
        onCancel={handleStopCreateEditOrder}
      />}
    </>
  )
}

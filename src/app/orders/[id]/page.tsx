'use client'

import { Button } from "@/components/ui/button";
import { StatusTag } from "@/components/ui/status-tag";
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCallback, useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from "lucide-react";
import { ordersService } from "@/services/orders";
import socket from '@/lib/ws'
import { CreateEditOrderDialog } from "@/components/dialogs/create-edit-order-dialog";
import { DeleteOrderConfirmationDialog } from "@/components/dialogs/delete-order-confirmation-dialog";
import type Order from "@/models/order-model";
import { formatCurrency } from "@/lib/utils";
import dayjs from 'dayjs'
import OrderStatus from "@/enums/order-status-enum";
import OrderForm from "@/models/order-form-model";
import { toast } from "sonner";

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [isEditingOrder, setIsEditingOrder] = useState<boolean>(false)
  const [data, setData] = useState<Order>({} as Order)
  const [isLoadingAction, setIsLoadingAction] = useState<boolean>(false)
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false)
  const [isDeletingOrder, setIsDeletingOrder] = useState<boolean>(false)
  const orderId = String(params.id)

  const fetchData = async () => {
    setIsLoadingData(true)
    try {
      const response = await ordersService.getOrderById(orderId)
      setData(response)
    } catch (error) {
      toast.error('Ops! Houve um erro ao buscar o pedido.')
      console.error(error)
    } finally {
      setIsLoadingData(false)
    }
  }

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

    if (parsedData.status === data.status) return
    setData(parsedData)
  }, [data.status, router])

  useEffect(() => {
    socket.addEventListener('message', handleOrderStatusUpdate);

    return () => {
      socket.removeEventListener('message', handleOrderStatusUpdate);
    };
  }, [handleOrderStatusUpdate])

  useEffect(() => {
    fetchData()
  }, [])

  const handleToggleIsDeletingOrder = useCallback(() => {
    setIsDeletingOrder((value) => !value)
  }, [])

    const handleConfirmDeleteOrder = useCallback(async () => {    
    setIsLoadingAction(true)
    try {
      await ordersService.deleteOrder(orderId)
      router.push('/orders')
    } catch (error) {
      toast.error('Ops! Houve um erro ao excluír o pedido.')
      console.error(error)
    } finally {
      handleToggleIsDeletingOrder()
      setIsLoadingAction(false)
    }
  }, [handleToggleIsDeletingOrder, orderId, router])

  const handleToggleIsEditingOrder = useCallback(() => {
    setIsEditingOrder((value) => !value)
  }, [])

  const handleConfirmEditOrder = useCallback(async (orderDto: OrderForm) => {
    setIsLoadingAction(true)
    try {
      const response = await ordersService.updateOrder(orderId, orderDto)
      setData(response)
      handleToggleIsEditingOrder()
    } catch (error) {
      toast.error('Ops! Houve um erro ou editar o pedido.')
      console.error(error)
    } finally {
      setIsLoadingAction(false)
    }
  }, [handleToggleIsEditingOrder, orderId])

  const handleClickBackHome = useCallback(() => {
    router.push('/orders')
  }, [router])

  const formatDate = useCallback((dateTime: Date) => {
    return dayjs(dateTime).format('DD/MM/YYYY [às] HH:mm:ss')
  }, [])

  return (
    <>
      <div>
        <div className="flex items-center gap-2 mb-4">
          <ArrowLeft className="cursor-pointer" onClick={handleClickBackHome} />
          <h1 className="font-bold text-2xl">Detalhes do pedido</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{orderId}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              Criado em {isLoadingData ? <Skeleton className="h-4 w-32" /> : formatDate(data.dataCriacao)}
            </CardDescription>
            <CardAction>
              {isLoadingData ? <Skeleton className="h-6 w-24" /> : <StatusTag status={data.status} />}
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 text-sm">Cliente:{' '}</span>
              {isLoadingData ? <Skeleton className="h-4 w-32" /> : data.cliente}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 text-sm">Produto:{' '}</span>
              {isLoadingData ? <Skeleton className="h-4 w-32" /> : data.produto}
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <h2 className="font-bold text-2xl">
              {isLoadingData ? <Skeleton className="h-8 w-32" /> : formatCurrency(data.valor)}
            </h2>
            <div className="space-x-2">
              <Button
                type="submit"
                variant="outline"
                disabled={isLoadingData}
                onClick={handleToggleIsDeletingOrder}
              >
                Excluir
              </Button>
              <Button
                type="submit"
                disabled={isLoadingData}
                onClick={handleToggleIsEditingOrder}
              >
                Editar
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {isEditingOrder && <CreateEditOrderDialog
        open={isEditingOrder}
        order={data}
        loading={isLoadingAction}
        onConfirm={handleConfirmEditOrder}
        onCancel={handleToggleIsEditingOrder}
      />}

      {isDeletingOrder && <DeleteOrderConfirmationDialog
        open={isDeletingOrder}
        loading={isLoadingAction}
        onCancel={handleToggleIsDeletingOrder}
        onConfirm={handleConfirmDeleteOrder}
      />}
    </>
  );
}

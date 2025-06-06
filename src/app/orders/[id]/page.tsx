'use client'

import { Button } from "@/components/ui/button";
import { StatusTag } from "@/components/ui/status-tag";
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
import type Order from "@/models/order-model";
import { formatCurrency } from "@/lib/utils";
import dayjs from 'dayjs'
import OrderForm from "@/models/order-form-model";

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [isEditingOrder, setIsEditingOrder] = useState<boolean>(false)
  const [data, setData] = useState<Order>({} as Order)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const orderId = String(params.id)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await ordersService.getOrderById(orderId)
      setData(response)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOrderStatusUpdate = useCallback((evt: MessageEvent) => {
    const parsedData = JSON.parse(evt.data)
    if (parsedData.status === data.status) return
    setData(parsedData)
  }, [data.status])

  useEffect(() => {
    socket.addEventListener('message', handleOrderStatusUpdate);

    return () => {
      socket.removeEventListener('message', handleOrderStatusUpdate);
    };
  }, [handleOrderStatusUpdate])

  useEffect(() => {
    fetchData()
  }, [])

  const handleToggleIsEditingOrder = useCallback(() => {
    setIsEditingOrder((value) => !value)
  }, [])

  const handleConfirmEditOrder = useCallback(async (orderDto: OrderForm) => {
    setIsLoading(true)
    try {
      const response = await ordersService.updateOrder(orderId, orderDto)
      setData(response)
      handleToggleIsEditingOrder()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

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
            <CardDescription>
              Criado em {formatDate(data.dataCriacao)}
            </CardDescription>
            <CardAction>
              <StatusTag status={data.status} />
            </CardAction>
          </CardHeader>
          <CardContent>
            <div>
              <span className="text-neutral-500 text-sm">Cliente:{' '}</span>
              {data.cliente}
            </div>
            <div>
              <span className="text-neutral-500 text-sm">Produto:{' '}</span>
              {data.produto}
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <h2 className="font-bold text-2xl">{formatCurrency(data.valor)}</h2>
            <Button
              type="submit"
              variant="outline"
              onClick={handleToggleIsEditingOrder}
            >
              Editar
            </Button>
          </CardFooter>
        </Card>
      </div>

      {isEditingOrder && <CreateEditOrderDialog
        open={isEditingOrder}
        order={data}
        loading={isLoading}
        onConfirm={handleConfirmEditOrder}
        onCancel={handleToggleIsEditingOrder}
      />}
    </>
  );
}

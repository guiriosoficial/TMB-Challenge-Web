'use client'

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCallback, useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from "lucide-react";

export default function Order() {
  const params = useParams()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const form = {
    cliente: '',
    produto: '',
    valor: 0
  }

  const handleClickEdit = useCallback(() => {
    setIsEditing(value => !value)
  }, [])

  const handleClickBackHome = useCallback(() => {
    router.push('/orders')
  }, [])

  return (
    <div className="p-4">
      <ArrowLeft className="cursor-pointer" onClick={handleClickBackHome} />
      <h1>Detalhes do pedido</h1>
      <Card>
        <CardHeader>
          <CardTitle>Ordem</CardTitle>
          <CardDescription>{params.id}</CardDescription>
          <CardAction>status</CardAction>
        </CardHeader>
        <CardContent>
          {form.cliente}
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={handleClickEdit}>{isEditing ? 'Cancelar' : 'Editar'}</Button>
          <Button type="submit">Salvar</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

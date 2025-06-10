import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { Loader2Icon } from "lucide-react"
import { z } from "zod"
import OrderFormModel from "@/models/order-form-model"
import type OrderModel from "@/models/order-model"

interface ICreateEditOrderDialog {
  readonly order: OrderModel | null
  readonly open: boolean
  readonly loading: boolean
  readonly onCancel: () => void
  readonly onConfirm: (data: OrderFormModel) => void
}

const formSchema = z.object({
  cliente: z.string().min(2, { message: 'Deve ter no mínimo 2 caracteres' }),
  produto: z.string().min(2, { message: 'Deve ter no mínimo 2 caracteres' }),
  valor: z.coerce.number()
})

export function CreateEditOrderDialog({ order, open, loading, onCancel, onConfirm }: ICreateEditOrderDialog) {
  const isEditing = order?.id

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: new OrderFormModel(order?.cliente, order?.produto, order?.valor),
  })

  useEffect(() => {
    form.setValue('cliente', order?.cliente ?? '')
    form.setValue('produto', order?.produto ?? '')
    form.setValue('valor', order?.valor ?? 0)
  }, [form, order])

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar' : 'Criar'} pedido</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onConfirm)}
          >
            <FormField
              control={form.control}
              name="cliente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="produto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produto*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor*</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button
            variant="outline"
            disabled={loading}
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            onClick={form.handleSubmit(onConfirm)}
          >
            {loading && <Loader2Icon className="animate-spin" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

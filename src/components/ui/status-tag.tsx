import { useCallback } from "react";
import { Badge } from "./badge";
import { CircleCheck } from "lucide-react";
import OrderStatus from "@/enums/order-status-enum";

interface IStatusTag {
  readonly status: OrderStatus
}

function StatusTag({ status }: IStatusTag) {
  const badgeColor = useCallback(() => {
    switch (status) {
      case OrderStatus.Finalizado:
        return 'bg-green-600 text-white dark:bg-green-600'
      case OrderStatus.Processando:
        return 'bg-blue-500 text-white dark:bg-blue-600'
      case OrderStatus.Pendente:
      default:
        return ''
    }
  }, [status])

  return (
    <Badge
      variant="secondary"
      className={badgeColor()}
    >
      {status === OrderStatus.Finalizado && <CircleCheck />}
      {OrderStatus[status]}
    </Badge>
  )
}

export { StatusTag }

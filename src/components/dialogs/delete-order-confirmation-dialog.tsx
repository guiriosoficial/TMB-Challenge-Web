import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2Icon } from "lucide-react"
interface IConfirmationDialog {
  readonly open: boolean
  readonly loading: boolean
  readonly onConfirm: () => void
  readonly onCancel: () => void
}

export function DeleteOrderConfirmationDialog({open, loading, onConfirm, onCancel }: IConfirmationDialog) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja excluir o pedido?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
            onClick={onCancel}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={onConfirm}
          >
            {loading && <Loader2Icon className="animate-spin" />}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
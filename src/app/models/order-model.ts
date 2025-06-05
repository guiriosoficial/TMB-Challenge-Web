import OrderForm, { type IOrderForm } from "./order-form-model";
import OrderStatus from "../enums/order-status-enum";

interface IOrder extends IOrderForm {
  id: string
  status: OrderStatus
  dataCriacao: Date
}

class Order extends OrderForm implements IOrder {
  public id: string;
  public status: OrderStatus;
  public dataCriacao: Date;

  constructor(order: Order) {
    super(order.cliente, order.produto, order.valor)

    this.id = order.id
    this.status = order.status
    this.dataCriacao = order.dataCriacao
  }
}

export type { IOrder }
export default Order

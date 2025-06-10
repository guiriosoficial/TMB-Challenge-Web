import OrderForm, { type IOrderForm } from "./order-form-model";
import OrderStatus from "../enums/order-status-enum";

interface IOrder extends IOrderForm {
  readonly id: string
  readonly status: OrderStatus
  readonly dataCriacao: Date
  readonly dataEfetivacao: Date
}

class Order extends OrderForm implements IOrder {
  public id: string;
  public status: OrderStatus;
  public dataCriacao: Date;
  public dataEfetivacao: Date;

  constructor(order: Order) {
    super(order.cliente, order.produto, order.valor)

    this.id = order.id
    this.status = order.status
    this.dataCriacao = order.dataCriacao
    this.dataEfetivacao = order.dataEfetivacao
  }
}

export type { IOrder }
export default Order

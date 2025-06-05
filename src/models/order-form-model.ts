interface IOrderForm {
  cliente: string
  produto: string
  valor: number
}

class OrderForm implements IOrderForm {
  public cliente: string
  public produto: string
  public valor: number

  constructor(cliente: string = '', produto: string = '', valor: number = 0) {
    this.cliente = cliente
    this.produto = produto
    this.valor = valor
  }
}

export type { IOrderForm }
export default OrderForm

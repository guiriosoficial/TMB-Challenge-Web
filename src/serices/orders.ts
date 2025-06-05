import apiClient from '@/lib/fetch'
import OrderForm from '@/models/order-form-model'
import Order from '@/models/order-model'

const path = '/orders'

export const ordersService = {
  async listOrders(): Promise<Order[]> {
    const response = await apiClient.get(path)
    return response
  },

  async getOrderById(orderId: string): Promise<Order> {
    const response = await apiClient.get(`${path}/${orderId}`)
    return response
  },

  async createOrder(order: OrderForm): Promise<Order> {
    const response = await apiClient.post(path, order)
    return response
  },

  async updateOrder(orderId: string, order: OrderForm): Promise<Order> {
    const response = await apiClient.put(`${path}/${orderId}`, order)
    return response
  },

  async deleteOrder(orderId: string): Promise<void> {
    const response = await apiClient.delete(`${path}/${orderId}`)
    return response
  }
}
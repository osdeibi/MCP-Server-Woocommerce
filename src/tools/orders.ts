import axios from 'axios';

export interface ListOrdersArgs {
  per_page?: number;
  page?: number;
  search?: string;
  after?: string;
  before?: string;
  modified_after?: string;
  modified_before?: string;
  exclude?: number[];
  include?: number[];
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: string;
  parent?: number[];
  parent_exclude?: number[];
  status?: string[];
  customer?: number;
  product?: number;
  dp?: number;
  created_via?: string[];
}

export async function listOrders(args: ListOrdersArgs = {}) {
  if (!axios.defaults.baseURL || !axios.defaults.auth) {
    throw new Error('listOrders: primero debes llamar a authenticate');
  }
  const response = await axios.get('/orders', { params: args });
  return response.data;
}

export interface GetOrderArgs {
  orderId: number;
}

export async function getOrder(args: GetOrderArgs) {
  if (!axios.defaults.baseURL || !axios.defaults.auth) {
    throw new Error('getOrder: primero debes llamar a authenticate');
  }
  const { orderId } = args;
  if (orderId == null) throw new Error('getOrder: falta orderId');
  const response = await axios.get(`/orders/${orderId}`);
  return response.data;
}

export async function createOrder(args: Record<string, any>) {
  if (!axios.defaults.baseURL || !axios.defaults.auth) {
    throw new Error('createOrder: primero debes llamar a authenticate');
  }
  // args debe contener al menos billing, shipping, line_items, payment_method, etc.
  const response = await axios.post('/orders', args);
  return response.data;
}

export interface UpdateOrderArgs {
  orderId: number;
  data: Record<string, any>;
}

export async function updateOrder(args: UpdateOrderArgs) {
  if (!axios.defaults.baseURL || !axios.defaults.auth) {
    throw new Error('updateOrder: primero debes llamar a authenticate');
  }
  const { orderId, data } = args;
  if (orderId == null) throw new Error('updateOrder: falta orderId');
  const response = await axios.put(`/orders/${orderId}`, data);
  return response.data;
}

export interface DeleteOrderArgs {
  orderId: number;
  force?: boolean;
}

export async function deleteOrder(args: DeleteOrderArgs) {
  if (!axios.defaults.baseURL || !axios.defaults.auth) {
    throw new Error('deleteOrder: primero debes llamar a authenticate');
  }
  const { orderId, force = false } = args;
  if (orderId == null) throw new Error('deleteOrder: falta orderId');
  const response = await axios.delete(`/orders/${orderId}`, {
    params: { force }
  });
  return response.data;
}

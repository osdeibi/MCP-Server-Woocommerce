import axios from 'axios';

export interface ListCustomersArgs {
  per_page?: number;
  page?: number;
  search?: string;
  exclude?: number[];
  include?: number[];
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: 'id'|'include'|'name'|'registered_date';
  email?: string;
  role?: string;
}

export async function listCustomers(args: ListCustomersArgs = {}) {
  if (!axios.defaults.baseURL || !axios.defaults.auth) {
    throw new Error('listCustomers: primero debes llamar a authenticate');
  }
  const response = await axios.get('/customers', {
    params: {
      per_page: args.per_page ?? 10,
      page:     args.page     ?? 1,
      search:   args.search,
      exclude:  args.exclude,
      include:  args.include,
      offset:   args.offset,
      order:    args.order,
      orderby:  args.orderby,
      email:    args.email,
      role:     args.role,
    }
  });
  return response.data;
}

export interface GetCustomerArgs {
  customerId: number;
}

export async function getCustomer(args: GetCustomerArgs) {
  if (!axios.defaults.baseURL || !axios.defaults.auth) {
    throw new Error('getCustomer: primero debes llamar a authenticate');
  }
  const { customerId } = args;
  if (customerId == null) throw new Error('getCustomer: falta customerId');
  const response = await axios.get(`/customers/${customerId}`);
  return response.data;
}

export interface CustomerAddress {
  first_name?: string;
  last_name?: string;
  company?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  email?: string;
  phone?: string;
}

export interface CreateCustomerArgs {
  email: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  password?: string;
  billing?: CustomerAddress;
  shipping?: Omit<CustomerAddress, 'email' | 'phone'>;
  meta_data?: Array<{ key: string; value: any }>;
}

export async function createCustomer(args: CreateCustomerArgs) {
  if (!axios.defaults.baseURL || !axios.defaults.auth) {
    throw new Error('createCustomer: primero debes llamar a authenticate');
  }
  if (!args.email) throw new Error('createCustomer: falta el campo email');
  const response = await axios.post('/customers', args);
  return response.data;
}

export interface UpdateCustomerArgs {
  customerId: number;
  data: Partial<CreateCustomerArgs>;
}

export async function updateCustomer(args: UpdateCustomerArgs) {
  if (!axios.defaults.baseURL || !axios.defaults.auth) {
    throw new Error('updateCustomer: primero debes llamar a authenticate');
  }
  const { customerId, data } = args;
  if (customerId == null) throw new Error('updateCustomer: falta customerId');
  const response = await axios.put(`/customers/${customerId}`, data);
  return response.data;
}

export interface DeleteCustomerArgs {
  customerId: number;
  force?: boolean;
  reassign?: number;
}

export async function deleteCustomer(args: DeleteCustomerArgs) {
  if (!axios.defaults.baseURL || !axios.defaults.auth) {
    throw new Error('deleteCustomer: primero debes llamar a authenticate');
  }
  const { customerId, force = true, reassign } = args;
  if (customerId == null) throw new Error('deleteCustomer: falta customerId');
  const response = await axios.delete(`/customers/${customerId}`, {
    params: { force, reassign }
  });
  return response.data;
}

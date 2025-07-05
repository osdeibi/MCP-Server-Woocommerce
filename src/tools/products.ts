import axios from 'axios';

export interface ListProductsArgs {
  per_page?: number;
  page?: number;
}

export interface CreateProductArgs {
  name: string;
  type?: 'simple' | 'grouped' | 'external' | 'variable';
  regular_price?: string;
  description?: string;
  short_description?: string;
  sku?: string;
  price?: string;
  sale_price?: string;
  categories?: { id: number }[];
  images?: { id?: number; src?: string }[];
  [key: string]: any; // Para pasar cualquier campo adicional
}

export interface GetProductArgs {
  productId: number;
}

export interface UpdateProductArgs {
  productId: number;
  data: Partial<CreateProductArgs>;
}

export interface DeleteProductArgs {
  productId: number;
  force?: boolean;
}

export async function listProducts(args: ListProductsArgs = {}) {
  if (!axios.defaults.baseURL || !axios.defaults.auth) {
    throw new Error('listProducts: primero llama a authenticate');
  }
  const res = await axios.get('/products', {
    params: { per_page: args.per_page || 10, page: args.page || 1 }
  });
  return res.data;
}

export async function createProduct(args: CreateProductArgs) {
  if (!axios.defaults.baseURL || !axios.defaults.auth) {
    throw new Error('createProduct: primero llama a authenticate');
  }
  const res = await axios.post('/products', args);
  return res.data;
}

export async function getProduct(args: GetProductArgs) {
  if (!axios.defaults.baseURL || !axios.defaults.auth) {
    throw new Error('getProduct: primero llama a authenticate');
  }
  const res = await axios.get(`/products/${args.productId}`);
  return res.data;
}

export async function updateProduct(args: UpdateProductArgs) {
  if (!axios.defaults.baseURL || !axios.defaults.auth) {
    throw new Error('updateProduct: primero llama a authenticate');
  }
  const res = await axios.put(
    `/products/${args.productId}`,
    args.data
  );
  return res.data;
}

export async function deleteProduct(args: DeleteProductArgs) {
  if (!axios.defaults.baseURL || !axios.defaults.auth) {
    throw new Error('deleteProduct: primero llama a authenticate');
  }
  const res = await axios.delete(
    `/products/${args.productId}`,
    { params: { force: args.force ?? true } }
  );
  return res.data;
}

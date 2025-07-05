import axios from 'axios';

export interface ListCouponsArgs {
  per_page?: number;
  page?: number;
  code?: string;
}

export async function listCoupons(args: ListCouponsArgs = {}) {
  // Verifica que ya hayas hecho authenticate()
  if (!axios.defaults.baseURL || !axios.defaults.auth) {
    throw new Error('listCoupons: primero debes llamar a authenticate');
  }

  const response = await axios.get('/coupons', {
    params: {
      per_page: args.per_page ?? 10,
      page:     args.page     ?? 1,
      code:     args.code,
    }
  });
  return response.data;
}

export interface GetCouponArgs {
  couponId: number;
}

export async function getCoupon(args: GetCouponArgs) {
  if (!axios.defaults.baseURL || !axios.defaults.auth) {
    throw new Error('getCoupon: primero debes llamar a authenticate');
  }
  const { couponId } = args;
  if (couponId == null) throw new Error('getCoupon: falta couponId');
  const response = await axios.get(`/coupons/${couponId}`);
  return response.data;
}

export interface CreateCouponArgs {
  code: string;
  discount_type?: 'percent' | 'fixed_cart' | 'fixed_product';
  amount?: string;
  description?: string;
  date_expires?: string;
  individual_use?: boolean;
  exclude_sale_items?: boolean;
  minimum_amount?: string;
  maximum_amount?: string;
  usage_limit?: number;
  usage_limit_per_user?: number;
  free_shipping?: boolean;
  product_ids?: number[];
  excluded_product_ids?: number[];
  product_categories?: number[];
  excluded_product_categories?: number[];
  email_restrictions?: string[];
  meta_data?: Array<{ key: string; value: any }>;
}

export async function createCoupon(args: CreateCouponArgs) {
  if (!axios.defaults.baseURL || !axios.defaults.auth) {
    throw new Error('createCoupon: primero debes llamar a authenticate');
  }
  if (!args.code) throw new Error('createCoupon: falta el campo code');

  const response = await axios.post('/coupons', args);
  return response.data;
}

export interface UpdateCouponArgs {
  couponId: number;
  data: Partial<CreateCouponArgs>;
}

export async function updateCoupon(args: UpdateCouponArgs) {
  if (!axios.defaults.baseURL || !axios.defaults.auth) {
    throw new Error('updateCoupon: primero debes llamar a authenticate');
  }
  const { couponId, data } = args;
  if (couponId == null) throw new Error('updateCoupon: falta couponId');

  const response = await axios.put(`/coupons/${couponId}`, data);
  return response.data;
}

export interface DeleteCouponArgs {
  couponId: number;
  force?: boolean;
}

export async function deleteCoupon(args: DeleteCouponArgs) {
  if (!axios.defaults.baseURL || !axios.defaults.auth) {
    throw new Error('deleteCoupon: primero debes llamar a authenticate');
  }
  const { couponId, force = true } = args;
  if (couponId == null) throw new Error('deleteCoupon: falta couponId');

  const response = await axios.delete(`/coupons/${couponId}`, {
    params: { force }
  });
  return response.data;
}

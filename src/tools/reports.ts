import axios from 'axios'

/** Descriptor genérico de reporte */
export interface ReportDescriptor {
  slug: string
  description: string
}

/** 1) Listar todos los reportes disponibles */
export async function listReports(): Promise<ReportDescriptor[]> {
  const res = await axios.get('/reports')
  return res.data
}

/** Parámetros comunes para periodos y fechas */
export interface ReportDateArgs {
  context?: 'view' | 'edit'
  period?:  'week' | 'month' | 'last_month' | 'year'
  date_min?: string
  date_max?: string
}

/** 2) Reporte de ventas */
export async function getSalesReport(args: ReportDateArgs) {
  const res = await axios.get('/reports/sales', { params: args })
  return res.data
}

/** 3) Top sellers */
export async function getTopSellersReport(args: ReportDateArgs) {
  const res = await axios.get('/reports/top_sellers', { params: args })
  return res.data
}

/** 4) Totales de cupones */
export async function getCouponsTotals() {
  const res = await axios.get('/reports/coupons/totals')
  return res.data
}

/** 5) Totales de clientes */
export async function getCustomersTotals() {
  const res = await axios.get('/reports/customers/totals')
  return res.data
}

/** 6) Totales de órdenes */
export async function getOrdersTotals() {
  const res = await axios.get('/reports/orders/totals')
  return res.data
}

/** 7) Totales de productos */
export async function getProductsTotals() {
  const res = await axios.get('/reports/products/totals')
  return res.data
}

/** 8) Totales de reseñas */
export async function getReviewsTotals() {
  const res = await axios.get('/reports/reviews/totals')
  return res.data
}

/** 9) Totales de categorías */
export async function getCategoriesTotals() {
  const res = await axios.get('/reports/categories/totals')
  return res.data
}

/** 10) Totales de etiquetas */
export async function getTagsTotals() {
  const res = await axios.get('/reports/tags/totals')
  return res.data
}

/** 11) Totales de atributos */
export async function getAttributesTotals() {
  const res = await axios.get('/reports/attributes/totals')
  return res.data
}

import axios from 'axios';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { authenticate } from './tools/auth';
import {
  listProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} from './tools/products';
import {
  listCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon as removeCoupon,
} from './tools/coupons';
import {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from './tools/customers';
import {
  listOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder
} from './tools/orders';
import { sendOrderDetails } from './tools/orderActions';
import {
  createOrderNote,
  getOrderNote,
  listOrderNotes,
  deleteOrderNote,
} from './tools/orderNotes';
import {
  createOrderRefund,
  getOrderRefund,
  listOrderRefunds,
  deleteOrderRefund,
} from './tools/orderRefunds';
import {
  createProductVariation,
  getProductVariation,
  listProductVariations,
  updateProductVariation,
  deleteProductVariation,
  batchProductVariations,
  CreateVariationArgs,
  GetVariationArgs,
  ListVariationsArgs,
  UpdateVariationArgs,
  DeleteVariationArgs,
  BatchVariationsArgs
} from './tools/variations';
import {
  createProductAttribute,
  getProductAttribute,
  listProductAttributes,
  updateProductAttribute,
  deleteProductAttribute,
  batchProductAttributes,
  CreateProductAttributeArgs,
  GetProductAttributeArgs,
  ListProductAttributesArgs,
  UpdateProductAttributeArgs,
  DeleteProductAttributeArgs,
  BatchProductAttributesArgs
} from './tools/productAttributes';
import {
  createProductAttributeTerm,
  getProductAttributeTerm,
  listProductAttributeTerms,
  updateProductAttributeTerm,
  deleteProductAttributeTerm,
  batchProductAttributeTerms,
  CreateAttributeTermArgs,
  GetAttributeTermArgs,
  ListAttributeTermsArgs,
  UpdateAttributeTermArgs,
  DeleteAttributeTermArgs,
  BatchAttributeTermsArgs
} from './tools/attributeTerms';
import {
  createProductCategory,
  getProductCategory,
  listProductCategories,
  updateProductCategory,
  deleteProductCategory,
  batchProductCategories,
  CreateCategoryArgs,
  GetCategoryArgs,
  ListCategoriesArgs,
  UpdateCategoryArgs,
  DeleteCategoryArgs,
  BatchCategoriesArgs
} from './tools/categories';
import {
  createShippingClass,
  getShippingClass,
  listShippingClasses,
  updateShippingClass,
  deleteShippingClass,
  batchShippingClasses,
  CreateShippingClassArgs,
  GetShippingClassArgs,
  ListShippingClassesArgs,
  UpdateShippingClassArgs,
  DeleteShippingClassArgs,
  BatchShippingClassesArgs
} from './tools/shippingClasses';

import {
  createProductTag,
  getProductTag,
  listProductTags,
  updateProductTag,
  deleteProductTag,
  batchProductTags,
  CreateProductTagArgs,
  GetProductTagArgs,
  ListProductTagsArgs,
  UpdateProductTagArgs,
  DeleteProductTagArgs,
  BatchProductTagsArgs
} from './tools/productTags';

import {
  createProductReview,
  getProductReview,
  listProductReviews,
  updateProductReview,
  deleteProductReview,
  batchProductReviews,
  CreateReviewArgs,
  GetReviewArgs,
  ListReviewsArgs,
  UpdateReviewArgs,
  DeleteReviewArgs,
  BatchReviewsArgs
} from './tools/productReviews'

import {
  listReports,
  getSalesReport,
  getTopSellersReport,
  getCouponsTotals,
  getCustomersTotals,
  getOrdersTotals,
  getProductsTotals,
  getReviewsTotals,
  getCategoriesTotals,
  getTagsTotals,
  getAttributesTotals,
  ReportDateArgs,
} from './tools/reports'
import { listRefunds, ListRefundsArgs } from './tools/refunds'

async function main() {
  const server = new McpServer({ name: 'woocommerce', version: '1.0.0' });

  // --- 1) authenticate ---
  server.registerTool(
    'authenticate',
    {
      title: 'authenticate',
      description: 'Configura WooCommerce REST API leyendo env vars',
      inputSchema: z.object({}).shape,
    },
    async () => {
      try {
        const res = await authenticate();
        return { content: [{ type: 'text' as const, text: JSON.stringify(res) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${e.message}` }] };
      }
    }
  );

  // --- Cupones Lists ---
  server.registerTool(
    'listCoupons',
    {
      title: 'listCoupons',
      description: 'Lista todos los cupones (paginado y filtrado por código)',
      inputSchema: z.object({
        per_page: z.number().int().optional(),
        page:     z.number().int().optional(),
        code:     z.string().optional(),
      }).shape,
    },
    async (args: { per_page?: number; page?: number; code?: string }) => {
      try {
        const data = await listCoupons(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(data) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${e.message}` }] };
      }
    }
  );
  // --- Cupones Get ---
  server.registerTool(
    'getCoupon',
    {
      title: 'getCoupon',
      description: 'Recupera un cupón por su ID',
      inputSchema: z.object({
        couponId: z.number().int(),
      }).shape,
    },
    async (args: { couponId: number }) => {
      try {
        const data = await getCoupon(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(data) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${e.message}` }] };
      }
    }
  );
  // --- Cupones Create ---
  server.registerTool(
    'createCoupon',
    {
      title: 'createCoupon',
      description: 'Crea un nuevo cupón',
      inputSchema: z.object({
        code: z.string(),
        discount_type: z.enum(['percent','fixed_cart','fixed_product']).optional(),
        amount: z.string().optional(),
        description: z.string().optional(),
        date_expires: z.string().optional(),
        individual_use: z.boolean().optional(),
        exclude_sale_items: z.boolean().optional(),
        minimum_amount: z.string().optional(),
        maximum_amount: z.string().optional(),
        usage_limit: z.number().int().optional(),
        usage_limit_per_user: z.number().int().optional(),
        free_shipping: z.boolean().optional(),
        product_ids: z.array(z.number().int()).optional(),
        excluded_product_ids: z.array(z.number().int()).optional(),
        product_categories: z.array(z.number().int()).optional(),
        excluded_product_categories: z.array(z.number().int()).optional(),
        email_restrictions: z.array(z.string()).optional(),
        meta_data: z.array(z.object({ key: z.string(), value: z.any() })).optional(),
      }).shape,
    },
    async (args: any) => {
      try {
        const data = await createCoupon(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(data) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${e.message}` }] };
      }
    }
  );
  // --- Cupones Update ---
  server.registerTool(
    'updateCoupon',
    {
      title: 'updateCoupon',
      description: 'Actualiza un cupón existente',
      inputSchema: z.object({
        couponId: z.number().int(),
        data:     z.record(z.any()),
      }).shape,
    },
    async (args: { couponId: number; data: Record<string, any> }) => {
      try {
        const data = await updateCoupon(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(data) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${e.message}` }] };
      }
    }
  );
  // --- Cupones Delete ---
  server.registerTool(
    'deleteCoupon',
    {
      title: 'deleteCoupon',
      description: 'Elimina un cupón (force=true por defecto)',
      inputSchema: z.object({
        couponId: z.number().int(),
        force:    z.boolean().optional(),
      }).shape,
    },
    async (args: { couponId: number; force?: boolean }) => {
      try {
        const data = await removeCoupon(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(data) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${e.message}` }] };
      }
    }
  );

  // --- Clientes list ---
  server.registerTool(
    'listCustomers',
    {
      title: 'listCustomers',
      description: 'Lista clientes con filtros (pagina, email, rol, etc.)',
      inputSchema: z.object({
        per_page: z.number().int().optional(),
        page:     z.number().int().optional(),
        search:   z.string().optional(),
        exclude:  z.array(z.number().int()).optional(),
        include:  z.array(z.number().int()).optional(),
        offset:   z.number().int().optional(),
        order:    z.enum(['asc','desc']).optional(),
        orderby:  z.enum(['id','include','name','registered_date']).optional(),
        email:    z.string().optional(),
        role:     z.string().optional(),
      }).shape,
    },
    async (args: any) => {
      try {
        const data = await listCustomers(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(data) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${e.message}` }] };
      }
    }
  );

  // --- Clientes get ---
  server.registerTool(
    'getCustomer',
    {
      title: 'getCustomer',
      description: 'Recupera un cliente por su ID',
      inputSchema: z.object({
        customerId: z.number().int(),
      }).shape,
    },
    async (args: any) => {
      try {
        const data = await getCustomer(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(data) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${e.message}` }] };
      }
    }
  );

  // --- Clientes Create ---
  server.registerTool(
    'createCustomer',
    {
      title: 'createCustomer',
      description: 'Crea un nuevo cliente (email obligatorio)',
      inputSchema: z.object({
        email:      z.string().email(),
        first_name: z.string().optional(),
        last_name:  z.string().optional(),
        username:   z.string().optional(),
        password:   z.string().optional(),
        billing:    z.object({
          first_name: z.string().optional(),
          last_name:  z.string().optional(),
          company:    z.string().optional(),
          address_1:  z.string().optional(),
          address_2:  z.string().optional(),
          city:       z.string().optional(),
          state:      z.string().optional(),
          postcode:   z.string().optional(),
          country:    z.string().optional(),
          email:      z.string().optional(),
          phone:      z.string().optional(),
        }).optional(),
        shipping: z.object({
          first_name: z.string().optional(),
          last_name:  z.string().optional(),
          company:    z.string().optional(),
          address_1:  z.string().optional(),
          address_2:  z.string().optional(),
          city:       z.string().optional(),
          state:      z.string().optional(),
          postcode:   z.string().optional(),
          country:    z.string().optional(),
        }).optional(),
        meta_data: z.array(z.object({ key: z.string(), value: z.any() })).optional(),
      }).shape,
    },
    async (args: any) => {
      try {
        const data = await createCustomer(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(data) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${e.message}` }] };
      }
    }
  );

  // --- Clientes Update ---
  server.registerTool(
    'updateCustomer',
    {
      title: 'updateCustomer',
      description: 'Actualiza un cliente existente',
      inputSchema: z.object({
        customerId: z.number().int(),
        data:       z.record(z.any()),
      }).shape,
    },
    async (args: any) => {
      try {
        const data = await updateCustomer(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(data) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${e.message}` }] };
      }
    }
  );

  // --- Clientes Delete ---
  server.registerTool(
    'deleteCustomer',
    {
      title: 'deleteCustomer',
      description: 'Elimina un cliente (force/reassign opcionales)',
      inputSchema: z.object({
        customerId: z.number().int(),
        force:      z.boolean().optional(),
        reassign:   z.number().int().optional(),
      }).shape,
    },
    async (args: any) => {
      try {
        const data = await deleteCustomer(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(data) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${e.message}` }] };
      }
    }
  );

  // --- Orders List ---
  server.registerTool(
    'listOrders',
    {
      title: 'listOrders',
      description: 'Lista órdenes con filtros (pagina, estado, cliente, etc.)',
      inputSchema: z.object({
        per_page:       z.number().int().optional(),
        page:           z.number().int().optional(),
        search:         z.string().optional(),
        after:          z.string().optional(),
        before:         z.string().optional(),
        modified_after: z.string().optional(),
        modified_before:z.string().optional(),
        exclude:        z.array(z.number().int()).optional(),
        include:        z.array(z.number().int()).optional(),
        offset:         z.number().int().optional(),
        order:          z.enum(['asc','desc']).optional(),
        orderby:        z.string().optional(),
        parent:         z.array(z.number().int()).optional(),
        parent_exclude: z.array(z.number().int()).optional(),
        status:         z.array(z.string()).optional(),
        customer:       z.number().int().optional(),
        product:        z.number().int().optional(),
        dp:             z.number().int().optional(),
        created_via:    z.array(z.string()).optional(),
      }).shape,
    },
    async (args: any) => {
      try {
        const data = await listOrders(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(data) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${e.message}` }] };
      }
    }
  );

  // --- Orders Get ---
  server.registerTool(
    'getOrder',
    {
      title: 'getOrder',
      description: 'Recupera una orden por su ID',
      inputSchema: z.object({
        orderId: z.number().int(),
      }).shape,
    },
    async (args: any) => {
      try {
        const data = await getOrder(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(data) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${e.message}` }] };
      }
    }
  );

  // --- Orders Create ---
  server.registerTool(
    'createOrder',
    {
      title: 'createOrder',
      description: 'Crea una nueva orden. Pasa el objeto completo según la API',
      inputSchema: {},
    },
    async (args: any) => {
      try {
        const data = await createOrder(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(data) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${e.message}` }] };
      }
    }
  );

  // --- Orders Update ---
  server.registerTool(
    'updateOrder',
    {
      title: 'updateOrder',
      description: 'Actualiza una orden existente',
      inputSchema: z.object({
        orderId: z.number().int(),
        data:    z.record(z.any()),
      }).shape,
    },
    async (args: any) => {
      try {
        const data = await updateOrder(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(data) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${e.message}` }] };
      }
    }
  );

  // --- Orders Deleted ---
  server.registerTool(
    'deleteOrder',
    {
      title: 'deleteOrder',
      description: 'Elimina una orden (force opcional)',
      inputSchema: z.object({
        orderId: z.number().int(),
        force:   z.boolean().optional(),
      }).shape,
    },
    async (args: any) => {
      try {
        const data = await deleteOrder(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(data) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${e.message}` }] };
      }
    }
  );

   // Orders actions: send to client
  server.registerTool(
    'sendOrderDetails',
    {
      title: 'sendOrderDetails',
      description: 'Envía al cliente un email con los detalles de su orden',
      inputSchema: z.object({
        orderId: z.number().int().min(1, "orderId es obligatorio")
      }).shape,
    },
    async (rawArgs: any) => {
      try {
        const args = z
          .object({ orderId: z.number().int().min(1) })
          .parse(rawArgs);

        const result = await sendOrderDetails(args);
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify(result)
          }]
        };
      } catch (e: any) {
        return {
          content: [{
            type: 'text' as const,
            text: `Error en sendOrderDetails: ${e.message}`
          }]
        };
      }
    }
  );

  // Order notes createOrderNote
  server.registerTool(
  'createOrderNote',
  {
    title: 'createOrderNote',
    description: 'Crea una nota en una orden existente',
    inputSchema: z.object({
      orderId:      z.number().int().min(1, 'orderId es obligatorio'),
      note:         z.string().min(1, 'note es obligatorio'),
      customer_note:z.boolean().optional(),
      added_by_user:z.boolean().optional(),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        orderId:      z.number().int().min(1),
        note:         z.string().min(1),
        customer_note:z.boolean().optional(),
        added_by_user:z.boolean().optional(),
      }).parse(rawArgs);

      const result = await createOrderNote(args);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en createOrderNote: ${e.message}` }] };
    }
  }
  );
  
  // Order notes getOrderNote
  server.registerTool(
  'getOrderNote',
  {
    title: 'getOrderNote',
    description: 'Recupera una nota específica de una orden',
    inputSchema: z.object({
      orderId: z.number().int().min(1, 'orderId es obligatorio'),
      noteId:  z.number().int().min(1, 'noteId es obligatorio'),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        orderId: z.number().int().min(1),
        noteId:  z.number().int().min(1),
      }).parse(rawArgs);

      const result = await getOrderNote(args);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en getOrderNote: ${e.message}` }] };
    }
  }
  );
  
  // Order notes listOrderNotes
  server.registerTool(
  'listOrderNotes',
  {
    title: 'listOrderNotes',
    description: 'Lista todas las notas de una orden',
    inputSchema: z.object({
      orderId: z.number().int().min(1, 'orderId es obligatorio'),
      context:z.enum(['view','edit']).optional(),
      type:   z.enum(['any','customer','internal']).optional(),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        orderId: z.number().int().min(1),
        context:z.enum(['view','edit']).optional(),
        type:   z.enum(['any','customer','internal']).optional(),
      }).parse(rawArgs);

      const result = await listOrderNotes(args);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en listOrderNotes: ${e.message}` }] };
    }
  }
  );
  
  // Order notes deleteOrderNote
  server.registerTool(
  'deleteOrderNote',
  {
    title: 'deleteOrderNote',
    description: 'Elimina una nota de una orden',
    inputSchema: z.object({
      orderId: z.number().int().min(1, 'orderId es obligatorio'),
      noteId:  z.number().int().min(1, 'noteId es obligatorio'),
      force:   z.boolean().optional(),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        orderId: z.number().int().min(1),
        noteId:  z.number().int().min(1),
        force:   z.boolean().optional(),
      }).parse(rawArgs);

      const result = await deleteOrderNote(args);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en deleteOrderNote: ${e.message}` }] };
    }
  }
  );

  // REFUND CREATE REFUND
 server.registerTool(
  'createOrderRefund',
  {
    title: 'createOrderRefund',
    description: 'Crea un reembolso para una orden existente',
    inputSchema: z.object({
      orderId:     z.number().int().min(1, 'orderId es obligatorio'),
      amount:      z.string().optional(),
      reason:      z.string().optional(),
      api_refund:  z.boolean().optional(),
      api_restock: z.boolean().optional(),
      line_items:  z.array(z.object({
        id:           z.number().int().min(1),
        refund_total: z.number(),
        refund_tax:   z.array(z.object({
          id:           z.number().int().min(1),
          refund_total: z.number()
        })).optional()
      })).optional(),
      meta_data:   z.array(z.object({ key: z.string(), value: z.any() })).optional(),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        orderId:     z.number().int(),
        amount:      z.string().optional(),
        reason:      z.string().optional(),
        api_refund:  z.boolean().optional(),
        api_restock: z.boolean().optional(),
        line_items:  z.array(z.object({
          id:           z.number().int(),
          refund_total: z.number(),
          refund_tax:   z.array(z.object({
            id:           z.number().int(),
            refund_total: z.number()
          })).optional()
        })).optional(),
        meta_data:   z.array(z.object({ key: z.string(), value: z.any() })).optional(),
      }).parse(rawArgs);

      const result = await createOrderRefund(args);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en createOrderRefund: ${e.message}` }] };
    }
  }
 );
 
 // REFUND GET REFUND
 server.registerTool(
  'getOrderRefund',
  {
    title: 'getOrderRefund',
    description: 'Recupera un reembolso específico de una orden',
    inputSchema: z.object({
      orderId:  z.number().int().min(1, 'orderId es obligatorio'),
      refundId: z.number().int().min(1, 'refundId es obligatorio'),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        orderId:  z.number().int(),
        refundId: z.number().int(),
      }).parse(rawArgs);

      const result = await getOrderRefund(args);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en getOrderRefund: ${e.message}` }] };
    }
  }
 );
 
 // REFUND LIST REFUNDS
 server.registerTool(
  'listOrderRefunds',
  {
    title: 'listOrderRefunds',
    description: 'Lista todos los reembolsos de una orden',
    inputSchema: z.object({
      orderId:  z.number().int().min(1, 'orderId es obligatorio'),
      context:  z.enum(['view','edit']).optional(),
      page:     z.number().int().optional(),
      per_page: z.number().int().optional(),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        orderId:  z.number().int(),
        context:  z.enum(['view','edit']).optional(),
        page:     z.number().int().optional(),
        per_page: z.number().int().optional(),
      }).parse(rawArgs);

      const result = await listOrderRefunds(args);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en listOrderRefunds: ${e.message}` }] };
    }
  }
 );
 
 // REFUND DELETE REFUND
 server.registerTool(
  'deleteOrderRefund',
  {
    title: 'deleteOrderRefund',
    description: 'Elimina un reembolso de una orden',
    inputSchema: z.object({
      orderId:  z.number().int().min(1, 'orderId es obligatorio'),
      refundId: z.number().int().min(1, 'refundId es obligatorio'),
      force:    z.boolean().optional(),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        orderId:  z.number().int(),
        refundId: z.number().int(),
        force:    z.boolean().optional(),
      }).parse(rawArgs);

      const result = await deleteOrderRefund(args);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en deleteOrderRefund: ${e.message}` }] };
    }
  }
 );

  // --- listProducts ---
  server.registerTool(
    'listProducts',
    {
      title: 'listProducts',
      description: 'Lista productos de WooCommerce (paginado)',
      inputSchema: z.object({
        per_page: z.number().int().optional(),
        page: z.number().int().optional(),
      }).shape,
    },
    async (args: { per_page?: number; page?: number }) => {
      try {
        const data = await listProducts(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(data) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${e.message}` }] };
      }
    }
  );

  // --- createProduct ---
  server.registerTool(
    'createProduct',
    {
      title: 'createProduct',
      description: 'Crea un nuevo producto en WooCommerce',
      inputSchema: z.object({
        name: z.string(),
        type: z.enum(['simple','grouped','external','variable']).optional(),
        regular_price: z.string().optional(),
        description: z.string().optional(),
        short_description: z.string().optional(),
        sku: z.string().optional(),
        price: z.string().optional(),
        sale_price: z.string().optional(),
        categories: z.array(z.object({ id: z.number().int() })).optional(),
        images: z.array(z.object({
          id: z.number().int().optional(),
          src: z.string().url().optional(),
        })).optional(),
      }).shape,
    },
    async (args: any) => {
      try {
        const data = await createProduct(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(data) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${e.message}` }] };
      }
    }
  );

  // --- getProduct ---
  server.registerTool(
    'getProduct',
    {
      title: 'getProduct',
      description: 'Recupera un producto por su ID',
      inputSchema: z.object({
        productId: z.number().int(),
      }).shape,
    },
    async (args: { productId: number }) => {
      try {
        const data = await getProduct(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(data) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${e.message}` }] };
      }
    }
  );

  // --- updateProduct ---
  server.registerTool(
    'updateProduct',
    {
      title: 'updateProduct',
      description: 'Actualiza un producto existente',
      inputSchema: z.object({
        productId: z.number().int(),
        data: z.record(z.any()),
      }).shape,
    },
    async (args: { productId: number; data: Record<string, any> }) => {
      try {
        const data = await updateProduct(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(data) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${e.message}` }] };
      }
    }
  );

  // --- deleteProduct ---
  server.registerTool(
    'deleteProduct',
    {
      title: 'deleteProduct',
      description: 'Elimina un producto (force=true por defecto)',
      inputSchema: z.object({
        productId: z.number().int(),
        force: z.boolean().optional(),
      }).shape,
    },
    async (args: { productId: number; force?: boolean }) => {
      try {
        const data = await deleteProduct(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(data) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${e.message}` }] };
      }
    }
  );

// Product variations createProductVariation
server.registerTool(
  'createProductVariation',
  {
    title: 'createProductVariation',
    description: 'Crea una nueva variación para un producto',
    inputSchema: z.object({
      productId:      z.number().int().min(1),
      regular_price:  z.string().optional(),
      sale_price:     z.string().optional(),
      sku:            z.string().optional(),
      description:    z.string().optional(),
      status:         z.enum(['draft','pending','private','publish']).optional(),
      virtual:        z.boolean().optional(),
      downloadable:   z.boolean().optional(),
      download_limit: z.number().int().optional(),
      download_expiry:z.number().int().optional(),
      tax_status:     z.string().optional(),
      tax_class:      z.string().optional(),
      manage_stock:   z.boolean().optional(),
      stock_quantity: z.number().int().optional(),
      stock_status:   z.enum(['instock','outofstock','onbackorder']).optional(),
      backorders:     z.enum(['no','notify','yes']).optional(),
      weight:         z.string().optional(),
      dimensions:     z.object({
                         length: z.string().optional(),
                         width:  z.string().optional(),
                         height: z.string().optional()
                       }).optional(),
      shipping_class: z.string().optional(),
      image:          z.object({ id: z.number().int() }).optional(),
      attributes:     z.array(z.object({
                         id:     z.number().int(),
                         option: z.string()
                       })).optional(),
      menu_order:     z.number().int().optional(),
      meta_data:      z.array(z.object({ key: z.string(), value: z.any() })).optional(),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        productId:      z.number().int(),
        regular_price:  z.string().optional(),
        sale_price:     z.string().optional(),
        sku:            z.string().optional(),
        description:    z.string().optional(),
        status:         z.enum(['draft','pending','private','publish']).optional(),
        virtual:        z.boolean().optional(),
        downloadable:   z.boolean().optional(),
        download_limit: z.number().int().optional(),
        download_expiry:z.number().int().optional(),
        tax_status:     z.string().optional(),
        tax_class:      z.string().optional(),
        manage_stock:   z.boolean().optional(),
        stock_quantity: z.number().int().optional(),
        stock_status:   z.enum(['instock','outofstock','onbackorder']).optional(),
        backorders:     z.enum(['no','notify','yes']).optional(),
        weight:         z.string().optional(),
        dimensions:     z.object({
                           length: z.string().optional(),
                           width:  z.string().optional(),
                           height: z.string().optional()
                         }).optional(),
        shipping_class: z.string().optional(),
        image:          z.object({ id: z.number().int() }).optional(),
        attributes:     z.array(z.object({
                           id:     z.number().int(),
                           option: z.string()
                         })).optional(),
        menu_order:     z.number().int().optional(),
        meta_data:      z.array(z.object({ key: z.string(), value: z.any() })).optional(),
      })
      .parse(rawArgs) as CreateVariationArgs;

      const result = await createProductVariation(args);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en createProductVariation: ${e.message}` }] };
    }
  }
);

// Product variations getProductVariation
server.registerTool(
  'getProductVariation',
  {
    title: 'getProductVariation',
    description: 'Recupera una variación por ID',
    inputSchema: z.object({
      productId:   z.number().int().min(1),
      variationId: z.number().int().min(1),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        productId:   z.number().int(),
        variationId: z.number().int(),
      })
      .parse(rawArgs) as GetVariationArgs;

      const result = await getProductVariation(args);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en getProductVariation: ${e.message}` }] };
    }
  }
);

// Product variations listProductVariations
server.registerTool(
  'listProductVariations',
  {
    title: 'listProductVariations',
    description: 'Lista variaciones de un producto',
    inputSchema: z.object({
      productId: z.number().int().min(1),
      page:      z.number().int().optional(),
      per_page:  z.number().int().optional(),
      context:   z.enum(['view','edit']).optional(),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        productId: z.number().int(),
        page:      z.number().int().optional(),
        per_page:  z.number().int().optional(),
        context:   z.enum(['view','edit']).optional(),
      })
      .parse(rawArgs) as ListVariationsArgs;

      const result = await listProductVariations(args);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en listProductVariations: ${e.message}` }] };
    }
  }
);

// Product variations updateProductVariation
server.registerTool(
  'updateProductVariation',
  {
    title: 'updateProductVariation',
    description: 'Actualiza una variación existente',
    inputSchema: z.object({
      productId:     z.number().int().min(1),
      variationId:   z.number().int().min(1),
      regular_price: z.string().optional(),
      sale_price:    z.string().optional(),
      // …añade más campos opcionales si los necesitas…
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        productId:     z.number().int(),
        variationId:   z.number().int(),
        regular_price: z.string().optional(),
        sale_price:    z.string().optional(),
      })
      .parse(rawArgs) as UpdateVariationArgs;

      const result = await updateProductVariation(args);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en updateProductVariation: ${e.message}` }] };
    }
  }
);

// Product variations deleteProductVariation
server.registerTool(
  'deleteProductVariation',
  {
    title: 'deleteProductVariation',
    description: 'Elimina una variación de producto',
    inputSchema: z.object({
      productId:   z.number().int().min(1),
      variationId: z.number().int().min(1),
      force:       z.boolean().optional(),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        productId:   z.number().int(),
        variationId: z.number().int(),
        force:       z.boolean().optional(),
      })
      .parse(rawArgs) as DeleteVariationArgs;

      const result = await deleteProductVariation(args);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en deleteProductVariation: ${e.message}` }] };
    }
  }
);

// Product variations batchProductVariations
server.registerTool(
  'batchProductVariations',
  {
    title: 'batchProductVariations',
    description: 'Batch create/update/delete variaciones',
    inputSchema: z.object({
      productId: z.number().int().min(1),
      create:   z.array(z.any()).optional(),
      update:   z.array(z.any()).optional(),
      delete:   z.array(z.number().int()).optional(),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        productId: z.number().int(),
        create:   z.array(z.any()).optional(),
        update:   z.array(z.any()).optional(),
        delete:   z.array(z.number().int()).optional(),
      })
      .parse(rawArgs) as BatchVariationsArgs;

      const result = await batchProductVariations(args);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en batchProductVariations: ${e.message}` }] };
    }
  }
);

// Product attributes createProductAttribute
server.registerTool(
  'createProductAttribute',
  {
    title: 'createProductAttribute',
    description: 'Crea un nuevo atributo de producto',
    inputSchema: z.object({
      name:        z.string().min(1),
      slug:        z.string().optional(),
      type:        z.string().optional(),
      order_by:    z.enum(['menu_order','name','name_num','id']).optional(),
      has_archives:z.boolean().optional(),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        name:        z.string().min(1),
        slug:        z.string().optional(),
        type:        z.string().optional(),
        order_by:    z.enum(['menu_order','name','name_num','id']).optional(),
        has_archives:z.boolean().optional(),
      }).parse(rawArgs) as CreateProductAttributeArgs;

      const result = await createProductAttribute(args);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
    } catch (e: any) {
      return {
        content: [{ type: 'text' as const, text: `Error en createProductAttribute: ${e.message}` }]
      };
    }
  }
);

// Product attributes getProductAttribute
server.registerTool(
  'getProductAttribute',
  {
    title: 'getProductAttribute',
    description: 'Recupera un atributo de producto por ID',
    inputSchema: z.object({
      attributeId: z.number().int().min(1),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        attributeId: z.number().int().min(1),
      }).parse(rawArgs) as GetProductAttributeArgs;

      const result = await getProductAttribute(args);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
    } catch (e: any) {
      return {
        content: [{ type: 'text' as const, text: `Error en getProductAttribute: ${e.message}` }]
      };
    }
  }
);

// Product attributes listProductAttributes
server.registerTool(
  'listProductAttributes',
  {
    title: 'listProductAttributes',
    description: 'Lista todos los atributos de productos',
    inputSchema: z.object({
      page:     z.number().int().optional(),
      per_page: z.number().int().optional(),
      context:  z.enum(['view','edit']).optional(),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        page:     z.number().int().optional(),
        per_page: z.number().int().optional(),
        context:  z.enum(['view','edit']).optional(),
      }).parse(rawArgs) as ListProductAttributesArgs;

      const result = await listProductAttributes(args);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
    } catch (e: any) {
      return {
        content: [{ type: 'text' as const, text: `Error en listProductAttributes: ${e.message}` }]
      };
    }
  }
);

// Product attributes updateProductAttribute
server.registerTool(
  'updateProductAttribute',
  {
    title: 'updateProductAttribute',
    description: 'Actualiza un atributo de producto existente',
    inputSchema: z.object({
      attributeId: z.number().int().min(1),
      name:        z.string().optional(),
      slug:        z.string().optional(),
      type:        z.string().optional(),
      order_by:    z.enum(['menu_order','name','name_num','id']).optional(),
      has_archives:z.boolean().optional(),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        attributeId: z.number().int().min(1),
        name:        z.string().optional(),
        slug:        z.string().optional(),
        type:        z.string().optional(),
        order_by:    z.enum(['menu_order','name','name_num','id']).optional(),
        has_archives:z.boolean().optional(),
      }).parse(rawArgs) as UpdateProductAttributeArgs;

      const result = await updateProductAttribute(args);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
    } catch (e: any) {
      return {
        content: [{ type: 'text' as const, text: `Error en updateProductAttribute: ${e.message}` }]
      };
    }
  }
);

// Product attributes deleteProductAttribute
server.registerTool(
  'deleteProductAttribute',
  {
    title: 'deleteProductAttribute',
    description: 'Elimina un atributo de producto',
    inputSchema: z.object({
      attributeId: z.number().int().min(1),
      force:       z.boolean().optional(),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        attributeId: z.number().int().min(1),
        force:       z.boolean().optional(),
      }).parse(rawArgs) as DeleteProductAttributeArgs;

      const result = await deleteProductAttribute(args);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
    } catch (e: any) {
      return {
        content: [{ type: 'text' as const, text: `Error en deleteProductAttribute: ${e.message}` }]
      };
    }
  }
);

//  Product attributes batchProductAttributes
server.registerTool(
  'batchProductAttributes',
  {
    title: 'batchProductAttributes',
    description: 'Batch crea/actualiza/elimina atributos de productos',
    inputSchema: z.object({
      create: z.array(z.object({
        name:        z.string().min(1),
        slug:        z.string().optional(),
        type:        z.string().optional(),
        order_by:    z.enum(['menu_order','name','name_num','id']).optional(),
        has_archives:z.boolean().optional(),
      })).optional(),
      update: z.array(z.object({
        attributeId: z.number().int().min(1),
        name:        z.string().optional(),
        slug:        z.string().optional(),
        type:        z.string().optional(),
        order_by:    z.enum(['menu_order','name','name_num','id']).optional(),
        has_archives:z.boolean().optional(),
      })).optional(),
      delete: z.array(z.number().int()).optional(),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        create: z.array(z.object({
          name:        z.string().min(1),
          slug:        z.string().optional(),
          type:        z.string().optional(),
          order_by:    z.enum(['menu_order','name','name_num','id']).optional(),
          has_archives:z.boolean().optional(),
        })).optional(),
        update: z.array(z.object({
          attributeId: z.number().int().min(1),
          name:        z.string().optional(),
          slug:        z.string().optional(),
          type:        z.string().optional(),
          order_by:    z.enum(['menu_order','name','name_num','id']).optional(),
          has_archives:z.boolean().optional(),
        })).optional(),
        delete: z.array(z.number().int()).optional(),
      }).parse(rawArgs) as BatchProductAttributesArgs;

      const result = await batchProductAttributes(args);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
    } catch (e: any) {
      return {
        content: [{ type: 'text' as const, text: `Error en batchProductAttributes: ${e.message}` }]
      };
    }
  }
);

 // 1) createProductAttributeTerm
  server.registerTool(
    'createProductAttributeTerm',
    {
      title: 'createProductAttributeTerm',
      description: 'Crea un término para un atributo de producto',
      inputSchema: z.object({
        attributeId: z.number().int().min(1),
        name:        z.string(),
        slug:        z.string().optional(),
        description: z.string().optional(),
        menu_order:  z.number().int().optional(),
      }).shape
    },
    async (rawArgs: any) => {
      try {
        const args = z.object({
          attributeId: z.number().int(),
          name:        z.string(),
          slug:        z.string().optional(),
          description: z.string().optional(),
          menu_order:  z.number().int().optional(),
        }).parse(rawArgs) as CreateAttributeTermArgs;

        const result = await createProductAttributeTerm(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error en createProductAttributeTerm: ${e.message}` }] };
      }
    }
  );

  // 2) getProductAttributeTerm
  server.registerTool(
    'getProductAttributeTerm',
    {
      title: 'getProductAttributeTerm',
      description: 'Recupera un término de atributo por ID',
      inputSchema: z.object({
        attributeId: z.number().int().min(1),
        termId:      z.number().int().min(1),
      }).shape
    },
    async (rawArgs: any) => {
      try {
        const args = z.object({
          attributeId: z.number().int(),
          termId:      z.number().int(),
        }).parse(rawArgs) as GetAttributeTermArgs;

        const result = await getProductAttributeTerm(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error en getProductAttributeTerm: ${e.message}` }] };
      }
    }
  );

  // 3) listProductAttributeTerms
  server.registerTool(
    'listProductAttributeTerms',
    {
      title: 'listProductAttributeTerms',
      description: 'Lista términos de un atributo',
      inputSchema: z.object({
        attributeId: z.number().int().min(1),
        context:     z.enum(['view','edit']).optional(),
        page:        z.number().int().optional(),
        per_page:    z.number().int().optional(),
        search:      z.string().optional(),
        exclude:     z.array(z.number().int()).optional(),
        include:     z.array(z.number().int()).optional(),
        order:       z.enum(['asc','desc']).optional(),
        orderby:     z.string().optional(),
        hide_empty:  z.boolean().optional(),
        parent:      z.number().int().optional(),
        product:     z.number().int().optional(),
        slug:        z.string().optional(),
      }).shape
    },
    async (rawArgs: any) => {
      try {
        const args = z.object({
          attributeId: z.number().int(),
          context:     z.enum(['view','edit']).optional(),
          page:        z.number().int().optional(),
          per_page:    z.number().int().optional(),
          search:      z.string().optional(),
          exclude:     z.array(z.number().int()).optional(),
          include:     z.array(z.number().int()).optional(),
          order:       z.enum(['asc','desc']).optional(),
          orderby:     z.string().optional(),
          hide_empty:  z.boolean().optional(),
          parent:      z.number().int().optional(),
          product:     z.number().int().optional(),
          slug:        z.string().optional(),
        }).parse(rawArgs) as ListAttributeTermsArgs;

        const result = await listProductAttributeTerms(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error en listProductAttributeTerms: ${e.message}` }] };
      }
    }
  );

  // 4) updateProductAttributeTerm
  server.registerTool(
    'updateProductAttributeTerm',
    {
      title: 'updateProductAttributeTerm',
      description: 'Actualiza un término de atributo existente',
      inputSchema: z.object({
        attributeId: z.number().int().min(1),
        termId:      z.number().int().min(1),
        name:        z.string().optional(),
        slug:        z.string().optional(),
        description: z.string().optional(),
        menu_order:  z.number().int().optional(),
      }).shape
    },
    async (rawArgs: any) => {
      try {
        const args = z.object({
          attributeId: z.number().int(),
          termId:      z.number().int(),
          name:        z.string().optional(),
          slug:        z.string().optional(),
          description: z.string().optional(),
          menu_order:  z.number().int().optional(),
        }).parse(rawArgs) as UpdateAttributeTermArgs;

        const result = await updateProductAttributeTerm(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error en updateProductAttributeTerm: ${e.message}` }] };
      }
    }
  );

  // 5) deleteProductAttributeTerm
  server.registerTool(
    'deleteProductAttributeTerm',
    {
      title: 'deleteProductAttributeTerm',
      description: 'Elimina un término de atributo',
      inputSchema: z.object({
        attributeId: z.number().int().min(1),
        termId:      z.number().int().min(1),
        force:       z.boolean().optional(),
      }).shape
    },
    async (rawArgs: any) => {
      try {
        const args = z.object({
          attributeId: z.number().int(),
          termId:      z.number().int(),
          force:       z.boolean().optional(),
        }).parse(rawArgs) as DeleteAttributeTermArgs;

        const result = await deleteProductAttributeTerm(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error en deleteProductAttributeTerm: ${e.message}` }] };
      }
    }
  );

  // 6) batchProductAttributeTerms
  server.registerTool(
    'batchProductAttributeTerms',
    {
      title: 'batchProductAttributeTerms',
      description: 'Batch create/update/delete términos de atributo',
      inputSchema: z.object({
        attributeId: z.number().int().min(1),
        create:      z.array(z.object({
          attributeId: z.number().int(),  // se ignorará en el payload
          name:        z.string(),
          slug:        z.string().optional(),
          description: z.string().optional(),
          menu_order:  z.number().int().optional(),
        })).optional(),
        update:      z.array(z.object({
          attributeId: z.number().int(),
          termId:      z.number().int(),
          name:        z.string().optional(),
          slug:        z.string().optional(),
          description: z.string().optional(),
          menu_order:  z.number().int().optional(),
        })).optional(),
        delete:      z.array(z.number().int()).optional(),
      }).shape
    },
    async (rawArgs: any) => {
      try {
        const args = z.object({
          attributeId: z.number().int(),
          create:      z.array(z.object({
            attributeId: z.number().int(),
            name:        z.string(),
            slug:        z.string().optional(),
            description: z.string().optional(),
            menu_order:  z.number().int().optional(),
          })).optional(),
          update:      z.array(z.object({
            attributeId: z.number().int(),
            termId:      z.number().int(),
            name:        z.string().optional(),
            slug:        z.string().optional(),
            description: z.string().optional(),
            menu_order:  z.number().int().optional(),
          })).optional(),
          delete:      z.array(z.number().int()).optional(),
        }).parse(rawArgs) as BatchAttributeTermsArgs;

        const result = await batchProductAttributeTerms(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error en batchProductAttributeTerms: ${e.message}` }] };
      }
    }
  );

   // 1) createProductCategory
  server.registerTool(
    'createProductCategory',
    {
      title: 'createProductCategory',
      description: 'Crea una nueva categoría de producto',
      inputSchema: z.object({
        name:        z.string(),
        slug:        z.string().optional(),
        parent:      z.number().int().optional(),
        description: z.string().optional(),
        display:     z.enum(['default','products','subcategories','both']).optional(),
        image:       z.union([
                        z.object({ id: z.number().int() }),
                        z.object({ src: z.string() })
                      ]).optional(),
        menu_order:  z.number().int().optional(),
      }).shape
    },
    async (raw: any) => {
      try {
        const args = z.object({
          name:        z.string(),
          slug:        z.string().optional(),
          parent:      z.number().int().optional(),
          description: z.string().optional(),
          display:     z.enum(['default','products','subcategories','both']).optional(),
          image:       z.union([
                          z.object({ id: z.number().int() }),
                          z.object({ src: z.string() })
                        ]).optional(),
          menu_order:  z.number().int().optional(),
        }).parse(raw) as CreateCategoryArgs;

        const res = await createProductCategory(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(res) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error en createProductCategory: ${e.message}` }] };
      }
    }
  );

  // 2) getProductCategory
  server.registerTool(
    'getProductCategory',
    {
      title: 'getProductCategory',
      description: 'Recupera una categoría por ID',
      inputSchema: z.object({
        categoryId: z.number().int().min(1)
      }).shape
    },
    async (raw: any) => {
      try {
        const args = z.object({ categoryId: z.number().int() }).parse(raw) as GetCategoryArgs;
        const res = await getProductCategory(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(res) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error en getProductCategory: ${e.message}` }] };
      }
    }
  );

  // 3) listProductCategories
  server.registerTool(
    'listProductCategories',
    {
      title: 'listProductCategories',
      description: 'Lista las categorías de producto',
      inputSchema: z.object({
        context:    z.enum(['view','edit']).optional(),
        page:       z.number().int().optional(),
        per_page:   z.number().int().optional(),
        search:     z.string().optional(),
        exclude:    z.array(z.number().int()).optional(),
        include:    z.array(z.number().int()).optional(),
        order:      z.enum(['asc','desc']).optional(),
        orderby:    z.string().optional(),
        hide_empty: z.boolean().optional(),
        parent:     z.number().int().optional(),
        slug:       z.string().optional(),
      }).shape
    },
    async (raw: any) => {
      try {
        const args = z.object({
          context:    z.enum(['view','edit']).optional(),
          page:       z.number().int().optional(),
          per_page:   z.number().int().optional(),
          search:     z.string().optional(),
          exclude:    z.array(z.number().int()).optional(),
          include:    z.array(z.number().int()).optional(),
          order:      z.enum(['asc','desc']).optional(),
          orderby:    z.string().optional(),
          hide_empty: z.boolean().optional(),
          parent:     z.number().int().optional(),
          slug:       z.string().optional(),
        }).parse(raw) as ListCategoriesArgs;

        const res = await listProductCategories(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(res) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error en listProductCategories: ${e.message}` }] };
      }
    }
  );

  // 4) updateProductCategory
  server.registerTool(
    'updateProductCategory',
    {
      title: 'updateProductCategory',
      description: 'Actualiza una categoría existente',
      inputSchema: z.object({
        categoryId:  z.number().int().min(1),
        name:        z.string().optional(),
        slug:        z.string().optional(),
        parent:      z.number().int().optional(),
        description: z.string().optional(),
        display:     z.enum(['default','products','subcategories','both']).optional(),
        image:       z.union([
                        z.object({ id: z.number().int() }),
                        z.object({ src: z.string() })
                      ]).optional(),
        menu_order:  z.number().int().optional(),
      }).shape
    },
    async (raw: any) => {
      try {
        const args = z.object({
          categoryId:  z.number().int(),
          name:        z.string().optional(),
          slug:        z.string().optional(),
          parent:      z.number().int().optional(),
          description: z.string().optional(),
          display:     z.enum(['default','products','subcategories','both']).optional(),
          image:       z.union([
                          z.object({ id: z.number().int() }),
                          z.object({ src: z.string() })
                        ]).optional(),
          menu_order:  z.number().int().optional(),
        }).parse(raw) as UpdateCategoryArgs;

        const res = await updateProductCategory(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(res) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error en updateProductCategory: ${e.message}` }] };
      }
    }
  );

  // 5) deleteProductCategory
  server.registerTool(
    'deleteProductCategory',
    {
      title: 'deleteProductCategory',
      description: 'Elimina una categoría de producto',
      inputSchema: z.object({
        categoryId: z.number().int().min(1),
        force:      z.boolean().optional(),
      }).shape
    },
    async (raw: any) => {
      try {
        const args = z.object({
          categoryId: z.number().int(),
          force:      z.boolean().optional(),
        }).parse(raw) as DeleteCategoryArgs;

        const res = await deleteProductCategory(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(res) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error en deleteProductCategory: ${e.message}` }] };
      }
    }
  );

  // 6) batchProductCategories
  server.registerTool(
    'batchProductCategories',
    {
      title: 'batchProductCategories',
      description: 'Batch create/update/delete categorías',
      inputSchema: z.object({
        create: z.array(z.object({
          name:        z.string(),
          slug:        z.string().optional(),
          parent:      z.number().int().optional(),
          description: z.string().optional(),
          display:     z.enum(['default','products','subcategories','both']).optional(),
          image:       z.union([
                          z.object({ id: z.number().int() }),
                          z.object({ src: z.string() })
                        ]).optional(),
          menu_order:  z.number().int().optional(),
        })).optional(),
        update: z.array(z.object({
          categoryId:  z.number().int(),
          name:        z.string().optional(),
          slug:        z.string().optional(),
          parent:      z.number().int().optional(),
          description: z.string().optional(),
          display:     z.enum(['default','products','subcategories','both']).optional(),
          image:       z.union([
                          z.object({ id: z.number().int() }),
                          z.object({ src: z.string() })
                        ]).optional(),
          menu_order:  z.number().int().optional(),
        })).optional(),
        delete: z.array(z.number().int()).optional(),
      }).shape
    },
    async (raw: any) => {
      try {
        const args = z.object({
          create: z.array(z.object({
            name:        z.string(),
            slug:        z.string().optional(),
            parent:      z.number().int().optional(),
            description: z.string().optional(),
            display:     z.enum(['default','products','subcategories','both']).optional(),
            image:       z.union([
                            z.object({ id: z.number().int() }),
                            z.object({ src: z.string() })
                          ]).optional(),
            menu_order:  z.number().int().optional(),
          })).optional(),
          update: z.array(z.object({
            categoryId:  z.number().int(),
            name:        z.string().optional(),
            slug:        z.string().optional(),
            parent:      z.number().int().optional(),
            description: z.string().optional(),
            display:     z.enum(['default','products','subcategories','both']).optional(),
            image:       z.union([
                            z.object({ id: z.number().int() }),
                            z.object({ src: z.string() })
                          ]).optional(),
            menu_order:  z.number().int().optional(),
          })).optional(),
          delete: z.array(z.number().int()).optional(),
        }).parse(raw) as BatchCategoriesArgs;

        const res = await batchProductCategories(args);
        return { content: [{ type: 'text' as const, text: JSON.stringify(res) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error en batchProductCategories: ${e.message}` }] };
      }
    }
  );

  // 1) createShippingClass
  server.registerTool(
    'createShippingClass',
    {
      title: 'createShippingClass',
      description: 'Crea una nueva clase de envío',
      inputSchema: z.object({
        name:        z.string().min(1, 'name es obligatorio'),
        slug:        z.string().optional(),
        description: z.string().optional(),
      }).shape
    },
    async (raw: any) => {
      try {
        const parsed = z.object({
          name:        z.string().min(1),
          slug:        z.string().optional(),
          description: z.string().optional(),
        }).parse(raw);
        const result = await createShippingClass(parsed as CreateShippingClassArgs);
        return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error en createShippingClass: ${e.message}` }] };
      }
    }
  );

  // 2) getShippingClass
  server.registerTool(
    'getShippingClass',
    {
      title: 'getShippingClass',
      description: 'Recupera una clase de envío por ID',
      inputSchema: z.object({
        shippingClassId: z.number().int().min(1, 'shippingClassId es obligatorio'),
      }).shape
    },
    async (raw: any) => {
      try {
        const parsed = z.object({
          shippingClassId: z.number().int().min(1),
        }).parse(raw);
        const result = await getShippingClass(parsed as GetShippingClassArgs);
        return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error en getShippingClass: ${e.message}` }] };
      }
    }
  );

  // 3) listShippingClasses
  server.registerTool(
    'listShippingClasses',
    {
      title: 'listShippingClasses',
      description: 'Lista todas las clases de envío',
      inputSchema: z.object({
        context:    z.enum(['view','edit']).optional(),
        page:       z.number().int().optional(),
        per_page:   z.number().int().optional(),
        search:     z.string().optional(),
        exclude:    z.array(z.number().int()).optional(),
        include:    z.array(z.number().int()).optional(),
        offset:     z.number().int().optional(),
        order:      z.enum(['asc','desc']).optional(),
        orderby:    z.enum(['id','include','name','slug','term_group','description','count']).optional(),
        hide_empty: z.boolean().optional(),
        product:    z.number().int().optional(),
        slug:       z.string().optional(),
      }).shape
    },
    async (raw: any) => {
      try {
        const parsed = z.object({
          context:    z.enum(['view','edit']).optional(),
          page:       z.number().int().optional(),
          per_page:   z.number().int().optional(),
          search:     z.string().optional(),
          exclude:    z.array(z.number().int()).optional(),
          include:    z.array(z.number().int()).optional(),
          offset:     z.number().int().optional(),
          order:      z.enum(['asc','desc']).optional(),
          orderby:    z.enum(['id','include','name','slug','term_group','description','count']).optional(),
          hide_empty: z.boolean().optional(),
          product:    z.number().int().optional(),
          slug:       z.string().optional(),
        }).parse(raw);
        const result = await listShippingClasses(parsed as ListShippingClassesArgs);
        return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error en listShippingClasses: ${e.message}` }] };
      }
    }
  );

  // 4) updateShippingClass
  server.registerTool(
    'updateShippingClass',
    {
      title: 'updateShippingClass',
      description: 'Actualiza una clase de envío existente',
      inputSchema: z.object({
        shippingClassId: z.number().int().min(1, 'shippingClassId es obligatorio'),
        name:            z.string().optional(),
        slug:            z.string().optional(),
        description:     z.string().optional(),
      }).shape
    },
    async (raw: any) => {
      try {
        const parsed = z.object({
          shippingClassId: z.number().int().min(1),
          name:            z.string().optional(),
          slug:            z.string().optional(),
          description:     z.string().optional(),
        }).parse(raw);
        const result = await updateShippingClass(parsed as UpdateShippingClassArgs);
        return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error en updateShippingClass: ${e.message}` }] };
      }
    }
  );

  // 5) deleteShippingClass
  server.registerTool(
    'deleteShippingClass',
    {
      title: 'deleteShippingClass',
      description: 'Elimina una clase de envío',
      inputSchema: z.object({
        shippingClassId: z.number().int().min(1, 'shippingClassId es obligatorio'),
        force:           z.boolean().optional(),
      }).shape
    },
    async (raw: any) => {
      try {
        const parsed = z.object({
          shippingClassId: z.number().int().min(1),
          force:           z.boolean().optional(),
        }).parse(raw);
        const result = await deleteShippingClass(parsed as DeleteShippingClassArgs);
        return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error en deleteShippingClass: ${e.message}` }] };
      }
    }
  );

  // 6) batchShippingClasses
  server.registerTool(
    'batchShippingClasses',
    {
      title: 'batchShippingClasses',
      description: 'Batch create/update/delete de clases de envío',
      inputSchema: z.object({
        create: z
          .array(
            z.object({
              name:        z.string().min(1),
              slug:        z.string().optional(),
              description: z.string().optional(),
            })
          )
          .optional(),
        update: z
          .array(
            z.object({
              shippingClassId: z.number().int().min(1),
              name:            z.string().optional(),
              slug:            z.string().optional(),
              description:     z.string().optional(),
            })
          )
          .optional(),
        delete: z.array(z.number().int()).optional(),
      }).shape
    },
    async (raw: any) => {
      try {
        const parsed = z.object({
          create: z
            .array(
              z.object({
                name:        z.string().min(1),
                slug:        z.string().optional(),
                description: z.string().optional(),
              })
            )
            .optional(),
          update: z
            .array(
              z.object({
                shippingClassId: z.number().int().min(1),
                name:            z.string().optional(),
                slug:            z.string().optional(),
                description:     z.string().optional(),
              })
            )
            .optional(),
          delete: z.array(z.number().int()).optional(),
        }).parse(raw);
        const result = await batchShippingClasses(parsed as BatchShippingClassesArgs);
        return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
      } catch (e: any) {
        return { content: [{ type: 'text' as const, text: `Error en batchShippingClasses: ${e.message}` }] };
      }
    }
  );

  /**
 * 1) createProductTag
 */
server.registerTool(
  'createProductTag',
  {
    title: 'createProductTag',
    description: 'Crea un nuevo tag de producto',
    inputSchema: z.object({
      name:        z.string(),
      slug:        z.string().optional(),
      description: z.string().optional(),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        name:        z.string(),
        slug:        z.string().optional(),
        description: z.string().optional(),
      }).parse(rawArgs) as CreateProductTagArgs

      const result = await createProductTag(args)
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en createProductTag: ${e.message}` }] }
    }
  }
);

/**
 * 2) getProductTag
 */
server.registerTool(
  'getProductTag',
  {
    title: 'getProductTag',
    description: 'Recupera un tag de producto por ID',
    inputSchema: z.object({
      tagId: z.number().int().min(1),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        tagId: z.number().int(),
      }).parse(rawArgs) as GetProductTagArgs

      const result = await getProductTag(args)
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en getProductTag: ${e.message}` }] }
    }
  }
);

/**
 * 3) listProductTags
 */
server.registerTool(
  'listProductTags',
  {
    title: 'listProductTags',
    description: 'Lista tags de producto',
    inputSchema: z.object({
      context:    z.enum(['view','edit']).optional(),
      page:       z.number().int().optional(),
      per_page:   z.number().int().optional(),
      search:     z.string().optional(),
      exclude:    z.array(z.number().int()).optional(),
      include:    z.array(z.number().int()).optional(),
      offset:     z.number().int().optional(),
      order:      z.enum(['asc','desc']).optional(),
      orderby:    z.enum(['id','include','name','slug','term_group','description','count']).optional(),
      hide_empty: z.boolean().optional(),
      product:    z.number().int().optional(),
      slug:       z.string().optional(),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        context:    z.enum(['view','edit']).optional(),
        page:       z.number().int().optional(),
        per_page:   z.number().int().optional(),
        search:     z.string().optional(),
        exclude:    z.array(z.number().int()).optional(),
        include:    z.array(z.number().int()).optional(),
        offset:     z.number().int().optional(),
        order:      z.enum(['asc','desc']).optional(),
        orderby:    z.enum(['id','include','name','slug','term_group','description','count']).optional(),
        hide_empty: z.boolean().optional(),
        product:    z.number().int().optional(),
        slug:       z.string().optional(),
      }).parse(rawArgs) as ListProductTagsArgs

      const result = await listProductTags(args)
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en listProductTags: ${e.message}` }] }
    }
  }
);

/**
 * 4) updateProductTag
 */
server.registerTool(
  'updateProductTag',
  {
    title: 'updateProductTag',
    description: 'Actualiza un tag de producto existente',
    inputSchema: z.object({
      tagId:       z.number().int().min(1),
      name:        z.string().optional(),
      slug:        z.string().optional(),
      description: z.string().optional(),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        tagId:       z.number().int(),
        name:        z.string().optional(),
        slug:        z.string().optional(),
        description: z.string().optional(),
      }).parse(rawArgs) as UpdateProductTagArgs

      const result = await updateProductTag(args)
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en updateProductTag: ${e.message}` }] }
    }
  }
);

/**
 * 5) deleteProductTag
 */
server.registerTool(
  'deleteProductTag',
  {
    title: 'deleteProductTag',
    description: 'Elimina un tag de producto',
    inputSchema: z.object({
      tagId: z.number().int().min(1),
      force: z.boolean().optional(),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        tagId: z.number().int(),
        force: z.boolean().optional(),
      }).parse(rawArgs) as DeleteProductTagArgs

      const result = await deleteProductTag(args)
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en deleteProductTag: ${e.message}` }] }
    }
  }
);

/**
 * 6) batchProductTags
 */
server.registerTool(
  'batchProductTags',
  {
    title: 'batchProductTags',
    description: 'Batch crear/actualizar/eliminar tags de producto',
    inputSchema: z.object({
      create: z.array(
        z.object({
          name:        z.string(),
          slug:        z.string().optional(),
          description: z.string().optional(),
        })
      ).optional(),
      update: z.array(
        z.object({
          tagId:       z.number().int().min(1),
          name:        z.string().optional(),
          slug:        z.string().optional(),
          description: z.string().optional(),
        })
      ).optional(),
      delete: z.array(z.number().int()).optional(),
    }).shape,
  },
  async (rawArgs: any) => {
    try {
      const args = z.object({
        create: z.array(
          z.object({
            name:        z.string(),
            slug:        z.string().optional(),
            description: z.string().optional(),
          })
        ).optional(),
        update: z.array(
          z.object({
            tagId:       z.number().int(),
            name:        z.string().optional(),
            slug:        z.string().optional(),
            description: z.string().optional(),
          })
        ).optional(),
        delete: z.array(z.number().int()).optional(),
      }).parse(rawArgs) as BatchProductTagsArgs

      const result = await batchProductTags(args)
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en batchProductTags: ${e.message}` }] }
    }
  }
);

/**
 * 1) createProductReview
 */
server.registerTool(
  'createProductReview',
  {
    title: 'createProductReview',
    description: 'Crea un nuevo review de producto',
    inputSchema: z.object({
      product_id:     z.number().int().min(1),
      review:         z.string(),
      reviewer:       z.string(),
      reviewer_email: z.string().email(),
      rating:         z.number().min(0).max(5),
      status:         z.enum(['approved','hold','spam','unspam','trash','untrash']).optional(),
      verified:       z.boolean().optional(),
    }).shape,
  },
  async (raw: any) => {
    try {
      const args = z.object({
        product_id:     z.number().int(),
        review:         z.string(),
        reviewer:       z.string(),
        reviewer_email: z.string().email(),
        rating:         z.number().min(0).max(5),
        status:         z.enum(['approved','hold','spam','unspam','trash','untrash']).optional(),
        verified:       z.boolean().optional(),
      }).parse(raw) as CreateReviewArgs

      const result = await createProductReview(args)
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en createProductReview: ${e.message}` }] }
    }
  }
);

/**
 * 2) getProductReview
 */
server.registerTool(
  'getProductReview',
  {
    title: 'getProductReview',
    description: 'Recupera un review por ID',
    inputSchema: z.object({
      reviewId: z.number().int().min(1),
    }).shape,
  },
  async (raw: any) => {
    try {
      const args = z.object({
        reviewId: z.number().int(),
      }).parse(raw) as GetReviewArgs

      const result = await getProductReview(args)
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en getProductReview: ${e.message}` }] }
    }
  }
);

/**
 * 3) listProductReviews
 */
server.registerTool(
  'listProductReviews',
  {
    title: 'listProductReviews',
    description: 'Lista todos los reviews de productos',
    inputSchema: z.object({
      context:          z.enum(['view','edit']).optional(),
      page:             z.number().int().optional(),
      per_page:         z.number().int().optional(),
      search:           z.string().optional(),
      after:            z.string().optional(),
      before:           z.string().optional(),
      exclude:          z.array(z.number().int()).optional(),
      include:          z.array(z.number().int()).optional(),
      offset:           z.number().int().optional(),
      order:            z.enum(['asc','desc']).optional(),
      orderby:          z.enum(['date','date_gmt','id','slug','include','product']).optional(),
      reviewer:         z.array(z.number().int()).optional(),
      reviewer_exclude: z.array(z.number().int()).optional(),
      reviewer_email:   z.array(z.string().email()).optional(),
      product:          z.array(z.number().int()).optional(),
      status:           z.enum(['all','hold','approved','spam','trash']).optional(),
    }).shape,
  },
  async (raw: any) => {
    try {
      const args = z.object({
        context:          z.enum(['view','edit']).optional(),
        page:             z.number().int().optional(),
        per_page:         z.number().int().optional(),
        search:           z.string().optional(),
        after:            z.string().optional(),
        before:           z.string().optional(),
        exclude:          z.array(z.number().int()).optional(),
        include:          z.array(z.number().int()).optional(),
        offset:           z.number().int().optional(),
        order:            z.enum(['asc','desc']).optional(),
        orderby:          z.enum(['date','date_gmt','id','slug','include','product']).optional(),
        reviewer:         z.array(z.number().int()).optional(),
        reviewer_exclude: z.array(z.number().int()).optional(),
        reviewer_email:   z.array(z.string().email()).optional(),
        product:          z.array(z.number().int()).optional(),
        status:           z.enum(['all','hold','approved','spam','trash']).optional(),
      }).parse(raw) as ListReviewsArgs

      const result = await listProductReviews(args)
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en listProductReviews: ${e.message}` }] }
    }
  }
);

/**
 * 4) updateProductReview
 */
server.registerTool(
  'updateProductReview',
  {
    title: 'updateProductReview',
    description: 'Actualiza un review existente',
    inputSchema: z.object({
      reviewId:       z.number().int().min(1),
      product_id:     z.number().int().optional(),
      review:         z.string().optional(),
      reviewer:       z.string().optional(),
      reviewer_email: z.string().email().optional(),
      rating:         z.number().min(0).max(5).optional(),
      status:         z.enum(['approved','hold','spam','unspam','trash','untrash']).optional(),
      verified:       z.boolean().optional(),
    }).shape,
  },
  async (raw: any) => {
    try {
      const args = z.object({
        reviewId:       z.number().int(),
        product_id:     z.number().int().optional(),
        review:         z.string().optional(),
        reviewer:       z.string().optional(),
        reviewer_email: z.string().email().optional(),
        rating:         z.number().min(0).max(5).optional(),
        status:         z.enum(['approved','hold','spam','unspam','trash','untrash']).optional(),
        verified:       z.boolean().optional(),
      }).parse(raw) as UpdateReviewArgs

      const result = await updateProductReview(args)
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en updateProductReview: ${e.message}` }] }
    }
  }
);

/**
 * 5) deleteProductReview
 */
server.registerTool(
  'deleteProductReview',
  {
    title: 'deleteProductReview',
    description: 'Elimina un review de producto',
    inputSchema: z.object({
      reviewId: z.number().int().min(1),
      force:    z.boolean().optional(),
    }).shape,
  },
  async (raw: any) => {
    try {
      const args = z.object({
        reviewId: z.number().int(),
        force:    z.boolean().optional(),
      }).parse(raw) as DeleteReviewArgs

      const result = await deleteProductReview(args)
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en deleteProductReview: ${e.message}` }] }
    }
  }
);

/**
 * 6) batchProductReviews
 */
server.registerTool(
  'batchProductReviews',
  {
    title: 'batchProductReviews',
    description: 'Batch create/update/delete de product reviews',
    inputSchema: z.object({
      create: z.array(
        z.object({
          product_id:     z.number().int(),
          review:         z.string(),
          reviewer:       z.string(),
          reviewer_email: z.string().email(),
          rating:         z.number().min(0).max(5),
          status:         z.enum(['approved','hold','spam','unspam','trash','untrash']).optional(),
          verified:       z.boolean().optional(),
        })
      ).optional(),
      update: z.array(
        z.object({
          reviewId:       z.number().int(),
          product_id:     z.number().int().optional(),
          review:         z.string().optional(),
          reviewer:       z.string().optional(),
          reviewer_email: z.string().email().optional(),
          rating:         z.number().min(0).max(5).optional(),
          status:         z.enum(['approved','hold','spam','unspam','trash','untrash']).optional(),
          verified:       z.boolean().optional(),
        })
      ).optional(),
      delete: z.array(z.number().int()).optional(),
    }).shape,
  },
  async (raw: any) => {
    try {
      const args = z.object({
        create: z.array(
          z.object({
            product_id:     z.number().int(),
            review:         z.string(),
            reviewer:       z.string(),
            reviewer_email: z.string().email(),
            rating:         z.number().min(0).max(5),
            status:         z.enum(['approved','hold','spam','unspam','trash','untrash']).optional(),
            verified:       z.boolean().optional(),
          })
        ).optional(),
        update: z.array(
          z.object({
            reviewId:       z.number().int(),
            product_id:     z.number().int().optional(),
            review:         z.string().optional(),
            reviewer:       z.string().optional(),
            reviewer_email: z.string().email().optional(),
            rating:         z.number().min(0).max(5).optional(),
            status:         z.enum(['approved','hold','spam','unspam','trash','untrash']).optional(),
            verified:       z.boolean().optional(),
          })
        ).optional(),
        delete: z.array(z.number().int()).optional(),
      }).parse(raw) as BatchReviewsArgs

      const result = await batchProductReviews(args)
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en batchProductReviews: ${e.message}` }] }
    }
  }
);

/**
 * 1) listReports
 */
server.registerTool(
  'listReports',
  {
    title: 'listReports',
    description: 'Lista todos los tipos de reportes disponibles',
    inputSchema: z.object({}).shape,
  },
  async () => {
    try {
      const result = await listReports()
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en listReports: ${e.message}` }] }
    }
  }
);

/**
 * 2) getSalesReport
 */
server.registerTool(
  'getSalesReport',
  {
    title: 'getSalesReport',
    description: 'Obtiene el reporte de ventas',
    inputSchema: z.object({
      context:  z.enum(['view','edit']).optional(),
      period:   z.enum(['week','month','last_month','year']).optional(),
      date_min: z.string().optional(),
      date_max: z.string().optional(),
    }).shape,
  },
  async (raw: any) => {
    try {
      const args = z.object({
        context:  z.enum(['view','edit']).optional(),
        period:   z.enum(['week','month','last_month','year']).optional(),
        date_min: z.string().optional(),
        date_max: z.string().optional(),
      }).parse(raw) as ReportDateArgs

      const result = await getSalesReport(args)
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en getSalesReport: ${e.message}` }] }
    }
  }
);

/**
 * 3) getTopSellersReport
 */
server.registerTool(
  'getTopSellersReport',
  {
    title: 'getTopSellersReport',
    description: 'Obtiene el reporte de top sellers',
    inputSchema: z.object({
      context:  z.enum(['view','edit']).optional(),
      period:   z.enum(['week','month','last_month','year']).optional(),
      date_min: z.string().optional(),
      date_max: z.string().optional(),
    }).shape,
  },
  async (raw: any) => {
    try {
      const args = z.object({
        context:  z.enum(['view','edit']).optional(),
        period:   z.enum(['week','month','last_month','year']).optional(),
        date_min: z.string().optional(),
        date_max: z.string().optional(),
      }).parse(raw) as ReportDateArgs

      const result = await getTopSellersReport(args)
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en getTopSellersReport: ${e.message}` }] }
    }
  }
);

/**
 * 4) getCouponsTotals
 */
server.registerTool(
  'getCouponsTotals',
  {
    title: 'getCouponsTotals',
    description: 'Obtiene totales de cupones',
    inputSchema: z.object({}).shape,
  },
  async () => {
    try {
      const result = await getCouponsTotals()
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en getCouponsTotals: ${e.message}` }] }
    }
  }
);

/**
 * 5) getCustomersTotals
 */
server.registerTool(
  'getCustomersTotals',
  {
    title: 'getCustomersTotals',
    description: 'Obtiene totales de clientes',
    inputSchema: z.object({}).shape,
  },
  async () => {
    try {
      const result = await getCustomersTotals()
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en getCustomersTotals: ${e.message}` }] }
    }
  }
);

/**
 * 6) getOrdersTotals
 */
server.registerTool(
  'getOrdersTotals',
  {
    title: 'getOrdersTotals',
    description: 'Obtiene totales de órdenes',
    inputSchema: z.object({}).shape,
  },
  async () => {
    try {
      const result = await getOrdersTotals()
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en getOrdersTotals: ${e.message}` }] }
    }
  }
);

/**
 * 7) getProductsTotals
 */
server.registerTool(
  'getProductsTotals',
  {
    title: 'getProductsTotals',
    description: 'Obtiene totales de productos',
    inputSchema: z.object({}).shape,
  },
  async () => {
    try {
      const result = await getProductsTotals()
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en getProductsTotals: ${e.message}` }] }
    }
  }
);

/**
 * 8) getReviewsTotals
 */
server.registerTool(
  'getReviewsTotals',
  {
    title: 'getReviewsTotals',
    description: 'Obtiene totales de reseñas',
    inputSchema: z.object({}).shape,
  },
  async () => {
    try {
      const result = await getReviewsTotals()
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en getReviewsTotals: ${e.message}` }] }
    }
  }
);

/**
 * 9) getCategoriesTotals
 */
server.registerTool(
  'getCategoriesTotals',
  {
    title: 'getCategoriesTotals',
    description: 'Obtiene totales de categorías',
    inputSchema: z.object({}).shape,
  },
  async () => {
    try {
      const result = await getCategoriesTotals()
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en getCategoriesTotals: ${e.message}` }] }
    }
  }
);

/**
 * 10) getTagsTotals
 */
server.registerTool(
  'getTagsTotals',
  {
    title: 'getTagsTotals',
    description: 'Obtiene totales de etiquetas',
    inputSchema: z.object({}).shape,
  },
  async () => {
    try {
      const result = await getTagsTotals()
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en getTagsTotals: ${e.message}` }] }
    }
  }
);

/**
 * 11) getAttributesTotals
 */
server.registerTool(
  'getAttributesTotals',
  {
    title: 'getAttributesTotals',
    description: 'Obtiene totales de atributos',
    inputSchema: z.object({}).shape,
  },
  async () => {
    try {
      const result = await getAttributesTotals()
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error en getAttributesTotals: ${e.message}` }] }
    }
  }
);

server.registerTool(
  'listRefunds',
  {
    title: 'listRefunds',
    description: 'Recupera todos los reembolsos (read-only)',
    inputSchema: z.object({
      context:        z.enum(['view','edit']).optional(),
      page:           z.number().int().optional(),
      per_page:       z.number().int().optional(),
      search:         z.string().optional(),
      after:          z.string().optional(),
      before:         z.string().optional(),
      exclude:        z.array(z.number().int()).optional(),
      include:        z.array(z.number().int()).optional(),
      offset:         z.number().int().optional(),
      order:          z.enum(['asc','desc']).optional(),
      orderby:        z.enum(['date','modified','id','include','title','slug']).optional(),
      parent:         z.array(z.number().int()).optional(),
      parent_exclude: z.array(z.number().int()).optional(),
      dp:             z.number().int().optional(),
    }).shape,
  },
  async (rawArgs: unknown) => {
    try {
      const args = z.object({
        context:        z.enum(['view','edit']).optional(),
        page:           z.number().int().optional(),
        per_page:       z.number().int().optional(),
        search:         z.string().optional(),
        after:          z.string().optional(),
        before:         z.string().optional(),
        exclude:        z.array(z.number().int()).optional(),
        include:        z.array(z.number().int()).optional(),
        offset:         z.number().int().optional(),
        order:          z.enum(['asc','desc']).optional(),
        orderby:        z.enum(['date','modified','id','include','title','slug']).optional(),
        parent:         z.array(z.number().int()).optional(),
        parent_exclude: z.array(z.number().int()).optional(),
        dp:             z.number().int().optional(),
      })
      .parse(rawArgs) as ListRefundsArgs;

      const result = await listRefunds(args);
      return {
        content: [
          { type: 'text' as const, text: JSON.stringify(result) }
        ]
      };
    } catch (e: any) {
      return {
        content: [
          { type: 'text' as const, text: `Error en listRefunds: ${e.message}` }
        ]
      };
    }
  }
);


  // --- Conexión STDIO ---
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('Error al arrancar el MCP server de WooCommerce:', err);
  process.exit(1);
});

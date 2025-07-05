import axios from 'axios';

export interface AuthArgs {
  /** Opcional: para sobreescribir desde la llamada, si lo deseas */
  siteUrl?: string;
  consumerKey?: string;
  consumerSecret?: string;
}

export async function authenticate(args: AuthArgs = {}) {
  // 1) Leemos de args o de las env que Claude inyecta
  const siteUrl        = args.siteUrl        || process.env.WORDPRESS_SITE_URL;
  const consumerKey    = args.consumerKey    || process.env.WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = args.consumerSecret || process.env.WOOCOMMERCE_CONSUMER_SECRET;

  if (!siteUrl || !consumerKey || !consumerSecret) {
    throw new Error(
      'authenticate: faltan WORDPRESS_SITE_URL, WOOCOMMERCE_CONSUMER_KEY o WOOCOMMERCE_CONSUMER_SECRET'
    );
  }

  // 2) Configuramos axios para WooCommerce REST v3
  axios.defaults.baseURL = `${siteUrl.replace(/\/$/, '')}/wp-json/wc/v3`;
  axios.defaults.auth    = { username: consumerKey, password: consumerSecret };
  axios.defaults.headers.common['Content-Type'] = 'application/json';

  return {
    message: 'Authentication configured',
    baseURL: axios.defaults.baseURL
  };
}

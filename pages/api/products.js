// pages/api/products.js
import { fetchProducts } from '../../lib/shopify';

export default async function handler(_req, res) {
  try {
    const products = await fetchProducts();
    res.status(200).json({ products });
  } catch (err) {
    console.error('API route error:', err.message);
    res.status(500).json({ error: 'Shopify fetch failed' });
  }
}

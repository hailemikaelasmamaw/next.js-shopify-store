import { postToShopify } from '../../utils/shopify';

export default async function handler(_req, res) {
  const query = `
    {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await postToShopify({ query });
    res.status(200).json(data.products.edges);
  } catch (err) {
    res.status(500).json({ error: 'Shopify fetch failed' });
  }
}

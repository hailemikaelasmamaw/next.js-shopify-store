// utils/shopifyQueries.js
import { postToShopify } from './shopify';

// Fetch all products
export async function fetchProducts(limit = 10) {
  const query = `
    {
      products(first: ${limit}) {
        edges {
          node {
            id
            title
            handle
            description
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

  const data = await postToShopify({ query });
  return data.products.edges;
}

// Fetch single product by handle (slug)
export async function fetchProductByHandle(handle) {
  const query = `
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        description
        handle
        images(first: 3) {
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
  `;

  const variables = { handle };

  const data = await postToShopify({ query, variables });
  return data.productByHandle;
}

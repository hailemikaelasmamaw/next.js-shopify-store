import fetch from 'node-fetch';

export const postToShopify = async ({ query, variables = {} }) => {
  try {
    const res = await fetch(process.env.SHOPIFY_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_API_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    const result = await res.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('Shopify GraphQL error');
    }

    if (!result.data) {
      console.error('Empty data returned from Shopify:', result);
      throw new Error('No data received from Shopify');
    }

    return result.data;

  } catch (error) {
    console.error('Shopify fetch failed:', error);
    throw error;
  }
};

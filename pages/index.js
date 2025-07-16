// pages/index.js
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

// ✅ Only import fetchProducts once from your preferred source
import { fetchProducts } from '../lib/shopify'; // or from '../utils/shopify' — not both

export async function getServerSideProps() {
  try {
    const edges = await fetchProducts();

    const products = edges
      .map(({ node }) => ({
        id: node.id,
        title: node.title,
        description: node.title, // or use a metafield/description if you have one
        imageSrc: node.images.edges[0]?.node?.url || '',
        imageAlt: node.images.edges[0]?.node?.altText || node.title,
        price: parseFloat(node.priceRange.minVariantPrice.amount),
        slug: node.handle,
      }))
      .filter(Boolean);

    return { props: { products } };
  } catch (err) {
    console.error('getServerSideProps error:', err.message);
    return { props: { products: [] } };
  }
}

function Product({ product }) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  return (
    <div className={styles.product}>
      <Link href={`/product/${product.slug}`}>
        <Image
          src={product.imageSrc}
          alt={product.imageAlt}
          width={400}
          height={400}
        />
      </Link>
      <h2>{product.title}</h2>
      <p className={styles.price}>{formattedPrice}</p>
    </div>
  );
}

export default function Home({ products }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Luxury Jewelry Store</title>
        <meta
          name="description"
          content="Explore our premium collection of handcrafted luxury jewelry."
        />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Our Collection</h1>
        <div className={styles.products}>
          {products.length > 0 ? (
            products.map((product) => (
              <Product key={product.id} product={product} />
            ))
          ) : (
            <p>No products available.</p>
          )}
        </div>
      </main>
    </div>
  );
}

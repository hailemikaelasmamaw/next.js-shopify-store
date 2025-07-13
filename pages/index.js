import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export async function getStaticProps() {
  const baseUrl =
    process.env.API_URL ||
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://nextjs-shopify-store-kappa.vercel.app'); // <- Update this to match your actual project URL

  try {
    const res = await fetch(`${baseUrl}/api/products`);

    if (!res.ok) {
      console.error('Failed to fetch products:', res.statusText);
      return { props: { products: [] } };
    }

    const rawData = await res.json();
    const edges = rawData?.products?.edges || [];

    const products = edges
      .map(({ node }) => {
        if (node.totalInventory <= 0) return null;

        return {
          id: node.id,
          title: node.title,
          description: node.description,
          imageSrc: node.images.edges[0]?.node?.src || '',
          imageAlt: node.title,
          price: parseFloat(node.variants.edges[0]?.node?.priceV2?.amount || 0),
          slug: node.handle,
        };
      })
      .filter(Boolean);

    return { props: { products } };
  } catch (err) {
    console.error('Error in getStaticProps:', err.message || err);
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
      <p>{product.description}</p>
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

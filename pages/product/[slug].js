import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';
import { fetchProductByHandle } from '../../utils/shopifyQueries';

export async function getServerSideProps({ params }) {
  try {
    const product = await fetchProductByHandle(params.slug);

    if (!product) {
      return { notFound: true };
    }

    const formattedProduct = {
      id: product.id,
      title: product.title,
      description: product.description,
      imageSrc: product.images.edges[0]?.node?.url || '',
      imageAlt: product.images.edges[0]?.node?.altText || product.title,
      price: parseFloat(product.priceRange.minVariantPrice.amount),
      slug: product.handle,
    };

    return {
      props: { product: formattedProduct },
    };
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return { notFound: true };
  }
}

function ProductDetail({ imageSrc, imageAlt, title, description, price }) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

  return (
    <div className={styles.product}>
      <Image src={imageSrc} alt={imageAlt} width={400} height={400} />
      <h2>{title}</h2>
      <p>{description}</p>
      <p className={styles.price}>{formattedPrice}</p>
    </div>
  );
}

export default function ProductPage({ product }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>{product.title} | Luxury Jewelry Store</title>
        <meta name="description" content={product.description} />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Product Details</h1>
        <Link href="/">&larr; Back to Collection</Link>
        <div className={styles.products}>
          <ProductDetail {...product} />
        </div>
      </main>
    </div>
  );
}

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';

export async function getServerSideProps({ params }) {
  try {
    const url = new URL(process.env.URL || 'http://localhost:8888');
    url.pathname = '/api/products';

    const res = await fetch(url.toString());

    if (!res.ok) throw new Error('API fetch failed');

    const data = await res.json();

    const product = data.products.edges
      .map(({ node }) => {
        if (node.totalInventory <= 0) return false;

        return {
          id: node.id,
          title: node.title,
          description: node.description,
          imageSrc: node.images.edges[0].node.src,
          imageAlt: node.title,
          price: node.variants.edges[0].node.priceV2.amount,
          slug: node.handle,
        };
      })
      .find((p) => p && p.slug === params.slug);

    if (!product) {
      return {
        notFound: true,
      };
    }

    return {
      props: { product },
    };
  } catch (err) {
    console.error('Error in getServerSideProps:', err);
    return {
      notFound: true,
    };
  }
}

function Product({ slug, imageSrc, imageAlt, title, description, price }) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className={styles.product}>
      <a href={`/product/${slug}`}>
        <Image src={imageSrc} alt={imageAlt} width={400} height={400} />
      </a>
      <h2>{title}</h2>
      <p>{description}</p>
      <p className={styles.price}>{formattedPrice.format(price)}</p>
    </div>
  );
}

export default function ProductPage({ product }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>{product.title} | Learn With Jason Store</title>
        <meta name="description" content={product.description} />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Store</h1>
        <Link href="/">&larr; back home</Link>

        <div className={styles.products}>
          <Product {...product} />
        </div>
      </main>
    </div>
  );
}

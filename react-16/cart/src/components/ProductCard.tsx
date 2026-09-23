import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import styles from './ProductCard.module.css';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart, items } = useCart();
  const cartItem = items.find((i) => i.product.id === product.id);

  return (
    <article className={styles.card}>
      <img
        src={product.image}
        alt={product.name}
        className={styles.image}
      />
      <div className={styles.body}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          <button
            className={styles.btn}
            onClick={() => addToCart(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            {cartItem ? `In cart (${cartItem.quantity})` : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  );
}

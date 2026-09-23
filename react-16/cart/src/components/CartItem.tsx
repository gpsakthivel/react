import type { CartItem as CartItemType } from '../types';
import { useCart } from '../context/CartContext';
import styles from './CartItem.module.css';

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const { removeFromCart, updateQuantity } = useCart();
  const { product, quantity } = item;

  return (
    <div className={styles.row}>
      <img src={product.image} alt={product.name} className={styles.image} />
      <div className={styles.info}>
        <span className={styles.name}>{product.name}</span>
        <span className={styles.price}>${product.price.toFixed(2)} each</span>
      </div>
      <div className={styles.controls}>
        <button
          className={styles.qtyBtn}
          onClick={() => updateQuantity(product.id, quantity - 1)}
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
        >
          −
        </button>
        <span className={styles.qty}>{quantity}</span>
        <button
          className={styles.qtyBtn}
          onClick={() => updateQuantity(product.id, quantity + 1)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <span className={styles.subtotal}>
        ${(product.price * quantity).toFixed(2)}
      </span>
      <button
        className={styles.remove}
        onClick={() => removeFromCart(product.id)}
        aria-label={`Remove ${product.name} from cart`}
      >
        ✕
      </button>
    </div>
  );
}

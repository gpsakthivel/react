import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import styles from './CartPage.module.css';

export default function CartPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <main className={styles.page}>
        <h1 className={styles.title}>Your Cart</h1>
        <div className={styles.empty}>
          <p>Your cart is empty.</p>
          <Link to="/" className={styles.shopLink}>
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>
        Your Cart <span className={styles.count}>({totalItems} items)</span>
      </h1>
      <div className={styles.layout}>
        <section className={styles.items} aria-label="Cart items">
          {items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
          <button className={styles.clearBtn} onClick={clearCart}>
            Clear Cart
          </button>
        </section>
        <aside className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal ({totalItems} items)</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span className={styles.free}>FREE</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <button
            className={styles.checkoutBtn}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
          <Link to="/" className={styles.continueLink}>
            ← Continue Shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}

import { Link } from 'react-router-dom';
import styles from './OrderConfirmation.module.css';

export default function OrderConfirmation() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon} aria-hidden="true">✓</div>
        <h1 className={styles.title}>Order Placed!</h1>
        <p className={styles.message}>
          Thank you for your purchase. You will receive a confirmation email
          shortly.
        </p>
        <Link to="/" className={styles.btn}>
          Back to Shop
        </Link>
      </div>
    </main>
  );
}

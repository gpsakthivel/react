import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { totalItems } = useCart();
  const { pathname } = useLocation();

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>
        ShopCart
      </Link>
      <div className={styles.links}>
        <Link
          to="/"
          className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}
        >
          Products
        </Link>
        <Link
          to="/cart"
          className={`${styles.link} ${pathname === '/cart' ? styles.active : ''}`}
        >
          Cart
          {totalItems > 0 && (
            <span className={styles.badge}>{totalItems}</span>
          )}
        </Link>
      </div>
    </nav>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { CheckoutFormData } from '../types';
import styles from './Checkout.module.css';

const EMPTY_FORM: CheckoutFormData = {
  fullName: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
  country: '',
};

type Errors = Partial<Record<keyof CheckoutFormData, string>>;

function validate(data: CheckoutFormData): Errors {
  const errors: Errors = {};
  if (!data.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!data.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!data.address.trim()) errors.address = 'Address is required.';
  if (!data.city.trim()) errors.city = 'City is required.';
  if (!data.postalCode.trim()) {
    errors.postalCode = 'Postal code is required.';
  } else if (!/^\d{4,10}$/.test(data.postalCode.replace(/\s/g, ''))) {
    errors.postalCode = 'Enter a valid postal code.';
  }
  if (!data.country.trim()) errors.country = 'Country is required.';
  return errors;
}

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState<CheckoutFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) navigate('/');
  }, [items.length, orderPlaced, navigate]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CheckoutFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    // Simulate async order placement
    setTimeout(() => {
      setOrderPlaced(true);
      clearCart();
      navigate('/order-confirmation');
    }, 800);
  }

  const fields: { name: keyof CheckoutFormData; label: string; type?: string }[] =
    [
      { name: 'fullName', label: 'Full Name' },
      { name: 'email', label: 'Email Address', type: 'email' },
      { name: 'address', label: 'Street Address' },
      { name: 'city', label: 'City' },
      { name: 'postalCode', label: 'Postal Code' },
      { name: 'country', label: 'Country' },
    ];

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Checkout</h1>
      <div className={styles.layout}>
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          noValidate
          aria-label="Checkout form"
        >
          <h2 className={styles.sectionTitle}>Shipping Information</h2>
          {fields.map(({ name, label, type = 'text' }) => (
            <div className={styles.field} key={name}>
              <label htmlFor={name} className={styles.label}>
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={form[name]}
                onChange={handleChange}
                className={`${styles.input} ${errors[name] ? styles.inputError : ''}`}
                aria-describedby={errors[name] ? `${name}-error` : undefined}
                autoComplete={name === 'email' ? 'email' : 'on'}
              />
              {errors[name] && (
                <span id={`${name}-error`} className={styles.errorMsg} role="alert">
                  {errors[name]}
                </span>
              )}
            </div>
          ))}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting}
          >
            {submitting ? 'Placing Order…' : 'Place Order'}
          </button>
        </form>

        <aside className={styles.orderSummary}>
          <h2 className={styles.sectionTitle}>Order Summary</h2>
          <ul className={styles.itemList}>
            {items.map(({ product, quantity }) => (
              <li key={product.id} className={styles.summaryItem}>
                <span>
                  {product.name} × {quantity}
                </span>
                <span>${(product.price * quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className={styles.totalRow}>
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </main>
  );
}

import { X, ShoppingBag } from 'lucide-react';
import type { CartItem } from '../hooks/useCart';

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onDecrement: (id: string) => void;
  onIncrement: (item: CartItem, type?: 'events' | 'boutique') => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onDecrement,
  onIncrement,
  onRemove,
  onCheckout,
}: CartDrawerProps) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <div className={`cart-modal ${isOpen ? 'open' : ''}`}>
        <div className="modal-header">
          <h2>Selected Booking Cart ({totalItems})</h2>
          <button onClick={onClose} className="close-btn" aria-label="Close Cart">
            <X className="icon" />
          </button>
        </div>

        <div className="modal-content">
          <div className="shortlist-items">
            {cart.length > 0 ? (
              cart.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-price">₹{item.price.toLocaleString()}</div>
                    <div className="item-quantity-control" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      <button
                        type="button"
                        onClick={() => onDecrement(item.id)}
                        style={{ padding: '2px 8px', border: '1px solid #d9d9d9', borderRadius: '4px', background: '#f0f0f0', cursor: 'pointer', fontSize: '12px' }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onIncrement(item, item.type)}
                        style={{ padding: '2px 8px', border: '1px solid #d9d9d9', borderRadius: '4px', background: '#f0f0f0', cursor: 'pointer', fontSize: '12px' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="remove-btn"
                    aria-label={`Remove ${item.name}`}
                  >
                    <X className="icon" />
                  </button>
                </div>
              ))
            ) : (
              <div className="empty">
                <ShoppingBag className="icon" />
                <p>Your cart is empty.</p>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="total-section">
              <span className="total-label">Total Booking Estimate</span>
              <div className="total-value">
                ₹{totalPrice.toLocaleString()}
              </div>
              <button
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="checkout-btn"
              >
                Checkout and Secure Slots
              </button>
            </div>
          )}
        </div>
      </div>
      {isOpen && <div className="modal-overlay" onClick={onClose} />}
    </>
  );
}

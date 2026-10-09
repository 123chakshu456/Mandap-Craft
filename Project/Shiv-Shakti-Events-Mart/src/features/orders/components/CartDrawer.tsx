import { X, ShoppingBag, Printer, Share2 } from 'lucide-react';
import type { CartItem } from '../hooks/useCart';
import { handleImageError, optimizeImageUrl } from '../../../shared/utils/imageFallback';
import WhatsAppIcon from '../../../shared/components/icons/WhatsAppIcon';
import { getCartWhatsAppUrl, getCartWhatsAppShareUrl, ENABLE_WHATSAPP_CHAT } from '../../../shared/utils/whatsapp';
import { printQuotation } from '../../../shared/utils/quotationPrint';

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

  const handleSendWhatsAppQuote = () => {
    if (cart.length === 0) return;
    const url = getCartWhatsAppUrl(
      cart.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        dimensionsNote: i.dimensionsNote,
      })),
      totalPrice
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareCartToWhatsApp = () => {
    if (cart.length === 0) return;
    const url = getCartWhatsAppShareUrl(
      cart.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        dimensionsNote: i.dimensionsNote,
      })),
      totalPrice
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePrintQuote = () => {
    if (cart.length === 0) return;
    printQuotation(cart, totalPrice);
  };

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
                    <img
                      src={optimizeImageUrl(item.image, 160, 160)}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    {item.dimensionsNote && (
                      <div style={{ fontSize: '0.74rem', color: '#fbbf24', fontWeight: 600, margin: '2px 0' }}>
                        📐 {item.dimensionsNote}
                      </div>
                    )}
                    <div className="item-price">₹{item.price.toLocaleString()}</div>
                    <div className="item-quantity-control">
                      <button
                        type="button"
                        onClick={() => onDecrement(item.id)}
                        className="qty-btn minus"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onIncrement(item, item.type)}
                        className="qty-btn plus"
                        aria-label="Increase quantity"
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

              {/* B2B Quotation Actions: WhatsApp & Print PDF */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', margin: '14px 0 10px' }}>
                <button
                  type="button"
                  onClick={handleShareCartToWhatsApp}
                  className="cart-action-quote-btn whatsapp"
                  title="Share this cart selection to WhatsApp friends & clients"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '10px 8px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(37, 211, 102, 0.25)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <Share2 size={16} color="#ffffff" />
                  <span>Share Cart (WA)</span>
                </button>

                {ENABLE_WHATSAPP_CHAT && (
                  <button
                    type="button"
                    onClick={handleSendWhatsAppQuote}
                    className="cart-action-quote-btn merchant-quote"
                    title="Send Formal Quotation Request to Merchant"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px 8px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #128C7E 0%, #075E54 100%)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(18, 140, 126, 0.25)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <WhatsAppIcon size={16} color="#ffffff" />
                    <span>Inquire Merchant</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handlePrintQuote}
                  className="cart-action-quote-btn print"
                  title="Print or Save Formal Estimate PDF"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '10px 8px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    color: '#0f172a',
                    border: '1px solid #cbd5e1',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e2e8f0';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Printer size={15} color="#475569" />
                  <span>Print Estimate (PDF)</span>
                </button>
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

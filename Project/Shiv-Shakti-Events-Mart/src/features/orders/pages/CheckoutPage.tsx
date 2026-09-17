import { useState, useMemo } from 'react';
import type { FormEvent } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  ShieldCheck,
  Ticket,
  QrCode,
  Landmark,
  CheckCircle,
  ArrowRight,
  User,
  Mail,
} from 'lucide-react';
import { orderApi } from '../services/orderApi';
import UpiPaymentSection from '../components/UpiPaymentSection';
import CardPaymentSection from '../components/CardPaymentSection';
import BankOtpModal from '../components/BankOtpModal';
import { PAYMENT_CONFIG } from '../../../config/paymentConfig';
import { handleImageError } from '../../../shared/utils/imageFallback';
import './CheckoutPage.scss';

export default function CheckoutPage() {
  const { cart, setCart, showToast, currentUser } = useOutletContext<{
    cart: { id: string; name: string; price: number; image: string; type: 'events' | 'boutique'; quantity: number }[];
    setCart: React.Dispatch<React.SetStateAction<{ id: string; name: string; price: number; image: string; type: 'events' | 'boutique'; quantity: number }[]>>;
    showToast: (msg: string) => void;
    currentUser?: { name: string; email: string; id?: string } | null;
  }>();

  const navigate = useNavigate();

  // Stable temporary order reference for UPI QR encoding
  const tempOrderRef = useMemo(() => {
    return `MC-${Math.floor(100000 + Math.random() * 900000)}`;
  }, []);

  // Customer Contact details
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');

  // Payment method tab selection
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');

  // Card details
  const [cardName, setCardName] = useState(currentUser?.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // UPI details
  const [upiMode, setUpiMode] = useState<'qr' | 'id'>('qr');
  const [upiId, setUpiId] = useState('');
  const [utrNumber, setUtrNumber] = useState('');

  // Net banking Selection
  const [selectedBank, setSelectedBank] = useState('');

  // Processing & Success states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const [confirmedPaymentDetails, setConfirmedPaymentDetails] = useState<{
    method: string;
    phone: string;
    ref?: string;
  }>({ method: '', phone: '' });

  // Coupon promo code
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const discountValue = useMemo(() => {
    return discountAmount;
  }, [discountAmount]);

  const grandTotal = useMemo(() => {
    const total = cartTotal - discountValue;
    return total < 0 ? 0 : total;
  }, [cartTotal, discountValue]);

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'ROYALMAJESTY') {
      setDiscountAmount(15000);
      showToast('🎉 Promo code applied! ₹15,000 royal cash discount deducted.');
    } else {
      showToast('❌ Invalid promo code. Try ROYALMAJESTY.');
    }
  };

  /**
   * Finalizes the order and persists it to the backend
   */
  const finalizeOrder = async (confirmedMethod: 'card' | 'upi' | 'netbanking') => {
    setIsProcessing(true);
    try {
      const finalName = customerName || cardName || currentUser?.name || 'Valued Guest';
      const finalEmail = customerEmail || currentUser?.email || 'guest@shivshaktievents.com';
      const finalPhone = customerPhone || '9876543210';

      const transactionRef = confirmedMethod === 'upi'
        ? (utrNumber ? `UTR-${utrNumber}` : `UPI-${tempOrderRef}`)
        : (confirmedMethod === 'card'
          ? `AUTH-3DS-${cardNumber.slice(-4) || 'CARD'}`
          : `NETBK-${selectedBank.toUpperCase()}`);

      const order = await orderApi.createOrder({
        customerName: finalName,
        customerEmail: finalEmail,
        customerPhone: finalPhone,
        transactionRef,
        items: cart,
        totalAmount: cartTotal,
        discountAmount: discountValue,
        grandTotal,
        paymentMethod: confirmedMethod,
      });

      const finalOrderNumber = order?.orderNumber || tempOrderRef;
      setConfirmedOrderId(finalOrderNumber);
      setConfirmedPaymentDetails({
        method: confirmedMethod.toUpperCase(),
        phone: finalPhone,
        ref: transactionRef,
      });

      setIsSuccess(true);
      setShowOtpModal(false);
      setCart([]); // Empty user cart
      showToast('✨ Payment authenticated! Booking slots confirmed & sealed.');
    } catch (err: any) {
      showToast(`❌ Error recording order: ${err.message || 'Payment processing error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Form submission router
   */
  const handlePaymentSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Your booking cart is empty.');
      return;
    }

    if (!customerPhone || customerPhone.length < 10) {
      showToast('Please provide a valid 10-digit mobile number for order verification.');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
        showToast('Please fill out all credit/debit card fields.');
        return;
      }
      if (cardNumber.replace(/\s+/g, '').length < 15) {
        showToast('Please enter a valid 16-digit card number.');
        return;
      }
      // Open RBI 3D-Secure Bank OTP verification modal
      setShowOtpModal(true);
      return;
    }

    if (paymentMethod === 'upi') {
      if (upiMode === 'id' && (!upiId || !upiId.includes('@'))) {
        showToast('Please enter a valid Virtual Payment Address (e.g. name@bank).');
        return;
      }
      await finalizeOrder('upi');
      return;
    }

    if (paymentMethod === 'netbanking') {
      if (!selectedBank) {
        showToast('Please select your preferred bank.');
        return;
      }
      await finalizeOrder('netbanking');
      return;
    }
  };

  // ── EMPTY CART STATE ──
  if ((!cart || cart.length === 0) && !isSuccess) {
    return (
      <div className="checkout-page-wrapper" style={{ padding: '60px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', background: '#0d1526', border: '1px solid #1e293b', borderRadius: '16px', padding: '40px 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛒</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 10px' }}>Your Booking Cart is Empty</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '0 0 24px' }}>
            You haven't selected any event mandaps, ceilings, or furniture items yet.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            <ArrowRight size={16} />
            <span>Browse Event Catalog</span>
          </button>
        </div>
      </div>
    );
  }

  // ── SUCCESSFUL ORDER CONFIRMATION SCREEN ──
  if (isSuccess) {
    return (
      <div className="checkout-page-wrapper">
        <div className="success-card">
          <div className="success-icon-wrapper">
            <CheckCircle className="icon" />
          </div>
          <h1>Bespoke Slots Secured</h1>
          <p className="subtitle">Thank you for choosing Shiv Shakti Events Mart Privilege.</p>

          <div className="order-summary-box">
            <div className="summary-row">
              <span className="label">Order Reference</span>
              <span className="value bold order-ref-text">{confirmedOrderId}</span>
            </div>
            <div className="summary-row">
              <span className="label">Status</span>
              <span className="value status-badge">CONFIRMED &amp; SEALED</span>
            </div>
            <div className="summary-row">
              <span className="label">Payment Method</span>
              <span className="value uppercase">{confirmedPaymentDetails.method} Gateway</span>
            </div>
            <div className="summary-row">
              <span className="label">Transaction Reference</span>
              <span className="value font-mono">{confirmedPaymentDetails.ref}</span>
            </div>
            <div className="summary-row">
              <span className="label">Contact Mobile</span>
              <span className="value">+91 {confirmedPaymentDetails.phone}</span>
            </div>
          </div>

          <p className="notice">
            A verified digital blueprint receipt, structural safety certificate, and designer assignment details have been sent to your registered contact channel.
          </p>

          <button onClick={() => navigate('/')} className="btn-home">
            Return to Grand Showcase
            <ArrowRight className="icon-arrow" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-wrapper">
      <div className="checkout-container">

        {/* LEFT COLUMN: PAYMENT & METHOD SELECTORS */}
        <div className="checkout-main">

          <div className="checkout-card">
            <div className="card-header">
              <h2>Privilege Payment Channel</h2>
              <p>Certified SSL 256-Bit Bank-Grade Encrypted Gateway</p>
            </div>

            {/* TAB SELECTORS */}
            <div className="payment-tabs">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
              >
                <CreditCard className="tab-icon" />
                <span>Credit / Debit Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`tab-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
              >
                <QrCode className="tab-icon" />
                <span>UPI Scan / ID</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`tab-btn ${paymentMethod === 'netbanking' ? 'active' : ''}`}
              >
                <Landmark className="tab-icon" />
                <span>Net Banking</span>
              </button>
            </div>

            {/* FORM BODY */}
            <form onSubmit={handlePaymentSubmit} className="payment-form">

              {/* Guest / User Contact Details Strip (if not logged in) */}
              {!currentUser && (
                <div className="guest-info-strip">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="customer-name">
                        <User className="icon-xs" /> Full Name
                      </label>
                      <input
                        id="customer-name"
                        type="text"
                        placeholder="e.g. Arjun Patel"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="customer-email">
                        <Mail className="icon-xs" /> Email Address
                      </label>
                      <input
                        id="customer-email"
                        type="email"
                        placeholder="arjun@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 1. CREDIT / DEBIT CARD CHANNEL */}
              {paymentMethod === 'card' && (
                <CardPaymentSection
                  cardName={cardName}
                  onCardNameChange={setCardName}
                  cardNumber={cardNumber}
                  onCardNumberChange={setCardNumber}
                  cardExpiry={cardExpiry}
                  onCardExpiryChange={setCardExpiry}
                  cardCvv={cardCvv}
                  onCardCvvChange={setCardCvv}
                  customerPhone={customerPhone}
                  onCustomerPhoneChange={setCustomerPhone}
                />
              )}

              {/* 2. DYNAMIC UPI CHANNEL */}
              {paymentMethod === 'upi' && (
                <UpiPaymentSection
                  grandTotal={grandTotal}
                  orderRef={tempOrderRef}
                  customerPhone={customerPhone}
                  onCustomerPhoneChange={setCustomerPhone}
                  upiId={upiId}
                  onUpiIdChange={setUpiId}
                  utrNumber={utrNumber}
                  onUtrNumberChange={setUtrNumber}
                  upiMode={upiMode}
                  onUpiModeChange={setUpiMode}
                />
              )}

              {/* 3. NET BANKING CHANNEL */}
              {paymentMethod === 'netbanking' && (
                <div className="form-fields netbanking-fields">
                  <div className="form-group phone-group">
                    <label htmlFor="netbanking-phone">
                      Mobile Number (For Bank Authorization)
                      <span className="required-star">*</span>
                    </label>
                    <div className="phone-input-wrapper">
                      <span className="country-code">+91</span>
                      <input
                        id="netbanking-phone"
                        type="tel"
                        maxLength={10}
                        placeholder="98765 43210"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="bank-select">Select Certified Bank</label>
                    <select
                      id="bank-select"
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      required
                    >
                      <option value="">-- Choose Your Bank --</option>
                      {PAYMENT_CONFIG.supportedBanks.map((b) => (
                        <option key={b.code} value={b.code}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* PAY / SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isProcessing || cart.length === 0}
                className="btn-pay"
              >
                {isProcessing ? (
                  <span className="spinner-wrapper">
                    <span className="spinner"></span>
                    Authenticating Payment...
                  </span>
                ) : (
                  paymentMethod === 'card'
                    ? `Proceed to Bank 3D-Secure (₹${grandTotal.toLocaleString()})`
                    : `Confirm & Pay ₹${grandTotal.toLocaleString()}`
                )}
              </button>

              <div className="ssl-badge">
                <ShieldCheck className="ssl-icon" />
                <span>SSL Encrypted | Certified PCI-DSS 256-Bit Bank Gateway</span>
              </div>

            </form>

          </div>

        </div>

        {/* RIGHT COLUMN: BOOKING ORDER SUMMARY */}
        <div className="checkout-sidebar">

          <div className="summary-card">
            <h3>Booking Order Summary</h3>

            <div className="summary-items">
              {cart.length > 0 ? (
                cart.map((item, idx) => (
                  <div key={idx} className="summary-item">
                    <div className="item-img">
                      <img src={item.image} alt={item.name} onError={handleImageError} />
                    </div>
                    <div className="item-info">
                      <h4 className="item-name">{item.name}</h4>
                      <span className="item-type">
                        {item.type === 'events' ? '🏰 Event Infrastructure' : '🛋️ Luxury Furniture'}
                      </span>
                      <span className="item-price">
                        ₹{item.price.toLocaleString()} × {item.quantity}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-summary">
                  <p>Your booking cart is empty.</p>
                </div>
              )}
            </div>

            {/* Promo Code Input */}
            <div className="promo-box">
              <div className="promo-input-group">
                <Ticket className="icon-ticket" />
                <input
                  type="text"
                  placeholder="Enter Promo Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button type="button" onClick={handleApplyPromo}>Apply</button>
              </div>
              <span className="promo-hint">Try: <strong>ROYALMAJESTY</strong></span>
            </div>

            {/* Price Calculations */}
            <div className="price-calc">
              <div className="calc-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              {discountValue > 0 && (
                <div className="calc-row discount">
                  <span>Privilege Royal Discount</span>
                  <span>- ₹{discountValue.toLocaleString()}</span>
                </div>
              )}
              <div className="calc-row grand-total">
                <span>Grand Total</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 3D-SECURE BANK OTP MODAL FOR CARD PAYMENTS */}
      <BankOtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onSuccess={() => finalizeOrder('card')}
        grandTotal={grandTotal}
        customerPhone={customerPhone}
        cardLast4={cardNumber.replace(/\s+/g, '').slice(-4)}
      />

    </div>
  );
}

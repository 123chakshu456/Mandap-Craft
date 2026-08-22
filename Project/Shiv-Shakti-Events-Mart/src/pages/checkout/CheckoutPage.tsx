import { useState, useMemo } from 'react';
import type { FormEvent } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, Ticket, QrCode, Landmark, CheckCircle, ArrowRight } from 'lucide-react';
import { orderApi } from '../../services/api';
import './CheckoutPage.scss';

export default function CheckoutPage() {
  const { cart, setCart, showToast, currentUser } = useOutletContext<{
    cart: { id: string; name: string; price: number; image: string; type: 'events' | 'boutique'; quantity: number }[];
    setCart: React.Dispatch<React.SetStateAction<{ id: string; name: string; price: number; image: string; type: 'events' | 'boutique'; quantity: number }[]>>;
    showToast: (msg: string) => void;
    currentUser?: { name: string; email: string; id?: string } | null;
  }>();

  const navigate = useNavigate();

  // Payment tab selection
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // UPI Inputs
  const [upiId, setUpiId] = useState('');

  // Net banking Selection
  const [selectedBank, setSelectedBank] = useState('');

  // Payment Processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

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
      showToast('🎉 Promo code applied! ₹15,000 cash back discount deducted.');
    } else {
      showToast('❌ Invalid promo code. Try ROYALMAJESTY.');
    }
  };

  const handlePaymentSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Your cart is empty.');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
        showToast('Please fill out all card details.');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId) {
        showToast('Please enter your UPI ID.');
        return;
      }
    } else if (paymentMethod === 'netbanking') {
      if (!selectedBank) {
        showToast('Please select your bank.');
        return;
      }
    }

    setIsProcessing(true);
    try {
      const customerName = currentUser?.name || cardName || (paymentMethod === 'upi' ? upiId.split('@')[0] : 'Privilege Guest');
      const customerEmail = currentUser?.email || (paymentMethod === 'upi' && upiId.includes('@') ? upiId : 'guest@shivshaktievents.com');

      const order = await orderApi.createOrder({
        customerName,
        customerEmail,
        items: cart,
        totalAmount: cartTotal,
        discountAmount: discountValue,
        grandTotal,
        paymentMethod,
      });

      setIsSuccess(true);
      setOrderId(order?.orderNumber || `MC-${Math.floor(100000 + Math.random() * 900000)}`);
      setCart([]); // Clear cart
      showToast('✨ Payment processed successfully! Order placed and recorded.');
    } catch (err: any) {
      showToast(`❌ Error placing order: ${err.message || 'Payment processing error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

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
              <span className="value bold">{orderId}</span>
            </div>
            <div className="summary-row">
              <span className="label">Status</span>
              <span className="value status-badge">CONFIRMED & SEALED</span>
            </div>
            <div className="summary-row">
              <span className="label">Payment Mode</span>
              <span className="value uppercase">{paymentMethod} Gateway</span>
            </div>
          </div>

          <p className="notice">
            An official digital receipt, structural safety blueprint, and designer allocation sheet have been sent to your registered email.
          </p>

          <button onClick={() => navigate('/')} className="btn-home">
            Return to Studio Dashboard
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
              <h2>Select Privilege Payment Channel</h2>
              <p>Secure SSL bank-encrypted transactions</p>
            </div>

            {/* TAB BUTTONS */}
            <div className="payment-tabs">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
              >
                <CreditCard className="tab-icon" />
                <span>Credit/Debit Card</span>
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

              {/* 1. CREDIT/DEBIT CARD */}
              {paymentMethod === 'card' && (
                <div className="form-fields">
                  <div className="form-group">
                    <label htmlFor="cardholder-name">Cardholder Name</label>
                    <input
                      id="cardholder-name"
                      type="text"
                      placeholder="e.g. Arjun Patel"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="card-number">Card Number</label>
                    <input
                      id="card-number"
                      type="text"
                      maxLength={19}
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="card-expiry">Expiry Date</label>
                      <input
                        id="card-expiry"
                        type="text"
                        maxLength={5}
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="card-cvv">CVV</label>
                      <input
                        id="card-cvv"
                        type="password"
                        maxLength={3}
                        placeholder="XXX"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. UPI OPTION */}
              {paymentMethod === 'upi' && (
                <div className="form-fields upi-fields">
                  <div className="qr-box">
                    <div className="qr-visual">
                      {/* Simulated QR block */}
                      <span className="qr-text">SHIV·SHAKTI PAY QR</span>
                    </div>
                    <p className="qr-caption">Scan this secure QR code using GPay, PhonePe, or Paytm to complete transfer</p>
                  </div>

                  <div className="divider-or"><span>OR ENTER UPI ID</span></div>

                  <div className="form-group">
                    <label htmlFor="upi-id">Virtual Payment Address (VPA)</label>
                    <input
                      id="upi-id"
                      type="text"
                      placeholder="arjun@okaxis"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* 3. NET BANKING OPTION */}
              {paymentMethod === 'netbanking' && (
                <div className="form-fields">
                  <div className="form-group">
                    <label htmlFor="bank-select">Select Premium Bank</label>
                    <select
                      id="bank-select"
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                    >
                      <option value="">-- Choose Bank --</option>
                      <option value="sbi">State Bank of India (Privilege)</option>
                      <option value="hdfc">HDFC Bank (Imperial)</option>
                      <option value="icici">ICICI Bank (Wealth)</option>
                      <option value="axis">Axis Bank (Burgundy)</option>
                      <option value="kotak">Kotak Mahindra Bank (Privy)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isProcessing || cart.length === 0}
                className="btn-pay"
              >
                {isProcessing ? (
                  <span className="spinner-wrapper">
                    <span className="spinner"></span>
                    Encrypting Payment...
                  </span>
                ) : (
                  `Pay ₹${grandTotal.toLocaleString()}`
                )}
              </button>

              <div className="ssl-badge">
                <ShieldCheck className="ssl-icon" />
                <span>SSL Encrypted | Certified PCI-DSS Compliant Gateway</span>
              </div>

            </form>

          </div>

        </div>

        {/* RIGHT COLUMN: CART SUMMARY */}
        <div className="checkout-sidebar">

          <div className="summary-card">
            <h3>Booking Order Summary</h3>

            <div className="summary-items">
              {cart.length > 0 ? (
                cart.map((item, idx) => (
                  <div key={idx} className="summary-item">
                    <div className="item-img">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-info">
                      <h4 className="item-name">{item.name}</h4>
                      <span className="item-type">{item.type === 'events' ? '🏰 Event Decor Setup' : '🛋️ Luxury Furniture'}</span>
                      <span className="item-price">₹{item.price.toLocaleString()} × {item.quantity}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-summary">
                  <p>Your cart is empty.</p>
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

            {/* Calculations */}
            <div className="price-calc">
              <div className="calc-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              {discountValue > 0 && (
                <div className="calc-row discount">
                  <span>Privilege Discount</span>
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
    </div>
  );
}

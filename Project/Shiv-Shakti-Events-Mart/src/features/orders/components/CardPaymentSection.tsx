import { useMemo } from 'react';
import { CreditCard, ShieldCheck, Lock } from 'lucide-react';

interface CardPaymentSectionProps {
  cardName: string;
  onCardNameChange: (val: string) => void;
  cardNumber: string;
  onCardNumberChange: (val: string) => void;
  cardExpiry: string;
  onCardExpiryChange: (val: string) => void;
  cardCvv: string;
  onCardCvvChange: (val: string) => void;
  customerPhone: string;
  onCustomerPhoneChange: (val: string) => void;
}

export default function CardPaymentSection({
  cardName,
  onCardNameChange,
  cardNumber,
  onCardNumberChange,
  cardExpiry,
  onCardExpiryChange,
  cardCvv,
  onCardCvvChange,
  customerPhone,
  onCustomerPhoneChange,
}: CardPaymentSectionProps) {

  // Auto-detect card brand based on BIN pattern
  const cardBrand = useMemo(() => {
    const clean = cardNumber.replace(/\s+/g, '');
    if (!clean) return null;
    if (/^4/.test(clean)) return { name: 'Visa', color: '#1a1f71', bg: '#e8eaf6' };
    if (/^(5[1-5]|2[2-7])/.test(clean)) return { name: 'Mastercard', color: '#eb001b', bg: '#ffebee' };
    if (/^(508|60|65|81|82|353|356)/.test(clean)) return { name: 'RuPay', color: '#097939', bg: '#e8f5e9' };
    if (/^3[47]/.test(clean)) return { name: 'Amex', color: '#006fcf', bg: '#e1f5fe' };
    return { name: 'Card', color: '#4a5568', bg: '#edf2f7' };
  }, [cardNumber]);

  const handleCardNumberInput = (val: string) => {
    // Keep only numbers and max 16 digits
    const digitsOnly = val.replace(/\D/g, '').slice(0, 16);
    // Group in sets of 4
    const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ');
    onCardNumberChange(formatted);
  };

  const handleExpiryInput = (val: string) => {
    // Clean to digits only, max 4 digits (MMYY)
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) {
      onCardExpiryChange(digits);
    } else {
      onCardExpiryChange(`${digits.slice(0, 2)}/${digits.slice(2)}`);
    }
  };

  return (
    <div className="form-fields card-fields">

      {/* Mini Card Preview Strip */}
      <div className="card-preview-strip">
        <div className="card-preview-icon">
          <CreditCard className="icon" />
        </div>
        <div className="card-preview-text">
          <span className="card-num-preview">
            {cardNumber || '•••• •••• •••• ••••'}
          </span>
          <span className="card-holder-preview">
            {cardName || 'CARDHOLDER NAME'}
          </span>
        </div>
        {cardBrand && (
          <span
            className="brand-pill"
            style={{ color: cardBrand.color, backgroundColor: cardBrand.bg }}
          >
            {cardBrand.name}
          </span>
        )}
      </div>

      {/* Cardholder Name */}
      <div className="form-group">
        <label htmlFor="cardholder-name">
          Cardholder Name
          <span className="required-star">*</span>
        </label>
        <input
          id="cardholder-name"
          type="text"
          placeholder="e.g. Arjun Patel"
          value={cardName}
          onChange={(e) => onCardNameChange(e.target.value)}
          required
        />
      </div>

      {/* Card Number with Brand Badge */}
      <div className="form-group">
        <label htmlFor="card-number">
          Card Number (Credit or Debit)
          <span className="required-star">*</span>
        </label>
        <div className="card-number-wrapper">
          <input
            id="card-number"
            type="text"
            inputMode="numeric"
            maxLength={19}
            placeholder="XXXX XXXX XXXX XXXX"
            value={cardNumber}
            onChange={(e) => handleCardNumberInput(e.target.value)}
            required
          />
          {cardBrand && (
            <span
              className="card-brand-tag"
              style={{ color: cardBrand.color, backgroundColor: cardBrand.bg }}
            >
              {cardBrand.name}
            </span>
          )}
        </div>
      </div>

      {/* Expiry & CVV */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="card-expiry">
            Expiry Date
            <span className="required-star">*</span>
          </label>
          <input
            id="card-expiry"
            type="text"
            inputMode="numeric"
            maxLength={5}
            placeholder="MM/YY"
            value={cardExpiry}
            onChange={(e) => handleExpiryInput(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="card-cvv">
            CVV / Security Code
            <span className="required-star">*</span>
          </label>
          <div className="cvv-wrapper">
            <input
              id="card-cvv"
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="•••"
              value={cardCvv}
              onChange={(e) => onCardCvvChange(e.target.value.replace(/\D/g, ''))}
              required
            />
            <Lock className="cvv-lock-icon" />
          </div>
        </div>
      </div>

      {/* Customer Mobile Phone (For Bank 3DS OTP) */}
      <div className="form-group phone-group">
        <label htmlFor="card-customer-phone">
          Bank Registered Mobile Number (For 3D Secure OTP)
          <span className="required-star">*</span>
        </label>
        <div className="phone-input-wrapper">
          <span className="country-code">+91</span>
          <input
            id="card-customer-phone"
            type="tel"
            maxLength={10}
            placeholder="98765 43210"
            value={customerPhone}
            onChange={(e) => onCustomerPhoneChange(e.target.value.replace(/\D/g, ''))}
            required
          />
        </div>
      </div>

      <div className="card-security-note">
        <ShieldCheck className="shield-icon" />
        <span>Your card information is tokenized with 256-bit AES bank-grade encryption.</span>
      </div>

    </div>
  );
}

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Smartphone, ShieldCheck, HelpCircle } from 'lucide-react';
import { PAYMENT_CONFIG, generateUpiUri, getUpiAppLinks } from '../../../config/paymentConfig';

interface UpiPaymentSectionProps {
  grandTotal: number;
  orderRef: string;
  customerPhone: string;
  onCustomerPhoneChange: (phone: string) => void;
  upiId: string;
  onUpiIdChange: (val: string) => void;
  utrNumber: string;
  onUtrNumberChange: (val: string) => void;
  upiMode: 'qr' | 'id';
  onUpiModeChange: (mode: 'qr' | 'id') => void;
}

export default function UpiPaymentSection({
  grandTotal,
  orderRef,
  customerPhone,
  onCustomerPhoneChange,
  upiId,
  onUpiIdChange,
  utrNumber,
  onUtrNumberChange,
  upiMode,
  onUpiModeChange,
}: UpiPaymentSectionProps) {
  const [copied, setCopied] = useState(false);

  // Generate real NPCI UPI string for this specific transaction
  const upiUri = generateUpiUri({
    amount: grandTotal,
    orderNumber: orderRef,
  });

  const appLinks = getUpiAppLinks(upiUri);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(PAYMENT_CONFIG.merchantUpiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="form-fields upi-fields">

      {/* Customer Mobile Phone Input */}
      <div className="form-group phone-group">
        <label htmlFor="customer-phone">
          Mobile Number (For Order Tracking &amp; WhatsApp Receipt)
          <span className="required-star">*</span>
        </label>
        <div className="phone-input-wrapper">
          <span className="country-code">+91</span>
          <input
            id="customer-phone"
            type="tel"
            maxLength={10}
            placeholder="98765 43210"
            value={customerPhone}
            onChange={(e) => onCustomerPhoneChange(e.target.value.replace(/\D/g, ''))}
            required
          />
        </div>
      </div>

      {/* Sub-tabs: Scan Dynamic QR vs Enter UPI ID */}
      <div className="upi-mode-selector">
        <button
          type="button"
          className={`mode-btn ${upiMode === 'qr' ? 'active' : ''}`}
          onClick={() => onUpiModeChange('qr')}
        >
          📱 Scan Dynamic UPI QR
        </button>
        <button
          type="button"
          className={`mode-btn ${upiMode === 'id' ? 'active' : ''}`}
          onClick={() => onUpiModeChange('id')}
        >
          💳 Pay via UPI ID / VPA
        </button>
      </div>

      {upiMode === 'qr' && (
        <div className="qr-box-dynamic">
          <div className="qr-header">
            <span className="merchant-tag">Verified Merchant: {PAYMENT_CONFIG.merchantName}</span>
            <div className="amount-badge">
              Pay ₹{grandTotal.toLocaleString()}
            </div>
          </div>

          <div className="qr-canvas-wrapper">
            <QRCodeSVG
              value={upiUri}
              size={180}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg",
                x: undefined,
                y: undefined,
                height: 28,
                width: 28,
                excavate: true,
              }}
            />
          </div>

          <div className="upi-copy-row">
            <span className="upi-id-label">Merchant UPI ID:</span>
            <span className="upi-id-value">{PAYMENT_CONFIG.merchantUpiId}</span>
            <button
              type="button"
              className={`btn-copy ${copied ? 'copied' : ''}`}
              onClick={handleCopyUpi}
              title="Copy UPI ID"
            >
              {copied ? <Check className="icon-sm" /> : <Copy className="icon-sm" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Quick UPI App links (helpful on mobile devices) */}
          <div className="upi-apps-row">
            <span className="apps-title">Tap to open in UPI App:</span>
            <div className="apps-grid">
              {appLinks.map((app) => (
                <a
                  key={app.id}
                  href={app.url}
                  className="app-pill"
                  style={{ borderColor: app.color }}
                >
                  <Smartphone className="icon-app" style={{ color: app.color }} />
                  <span>{app.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* 12-Digit UTR Reference Input */}
          <div className="form-group utr-group">
            <label htmlFor="utr-number">
              12-Digit UTR / UPI Transaction Reference No.
              <span className="hint-optional">(Optional, auto-verifies your slot)</span>
            </label>
            <input
              id="utr-number"
              type="text"
              maxLength={12}
              placeholder="e.g. 409823145678"
              value={utrNumber}
              onChange={(e) => onUtrNumberChange(e.target.value.replace(/\D/g, ''))}
            />
            <span className="utr-hint">
              <HelpCircle className="icon-xs" />
              Find the 12-digit UPI reference number in your Google Pay, PhonePe, or Paytm receipt.
            </span>
          </div>

          <div className="qr-footer-notice">
            <ShieldCheck className="icon-shield" />
            <span>Instant confirmation via NPCI zero-fee direct settlement channel</span>
          </div>
        </div>
      )}

      {upiMode === 'id' && (
        <div className="upi-id-box">
          <div className="form-group">
            <label htmlFor="upi-id-input">
              Your Virtual Payment Address (UPI ID)
              <span className="required-star">*</span>
            </label>
            <input
              id="upi-id-input"
              type="text"
              placeholder="e.g. yourname@okhdfcbank or 9876543210@paytm"
              value={upiId}
              onChange={(e) => onUpiIdChange(e.target.value)}
              required
            />
            <span className="upi-id-hint">
              A collect request of ₹{grandTotal.toLocaleString()} will be sent directly to your UPI app.
            </span>
          </div>
        </div>
      )}

    </div>
  );
}

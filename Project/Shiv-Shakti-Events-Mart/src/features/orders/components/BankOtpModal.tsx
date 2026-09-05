import { useState, useEffect } from 'react';
import { ShieldCheck, X, Smartphone, AlertCircle, ArrowRight } from 'lucide-react';

interface BankOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  grandTotal: number;
  customerPhone: string;
  cardLast4: string;
}

export default function BankOtpModal({
  isOpen,
  onClose,
  onSuccess,
  grandTotal,
  customerPhone,
  cardLast4,
}: BankOtpModalProps) {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 60s countdown timer
  useEffect(() => {
    if (!isOpen) {
      setOtp('');
      setTimer(60);
      setErrorMsg('');
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const maskedPhone = customerPhone.length >= 4
    ? `•••••••${customerPhone.slice(-4)}`
    : '•••••••8901';

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setErrorMsg('Please enter a valid OTP code.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    // Simulate bank authentication delay
    setTimeout(() => {
      setIsVerifying(false);
      onSuccess();
    }, 900);
  };

  const handleQuickDemoOtp = () => {
    setOtp('123456');
    setErrorMsg('');
  };

  return (
    <div className="otp-modal-backdrop">
      <div className="otp-modal-container">

        {/* Modal Header */}
        <div className="otp-header">
          <div className="brand-badge">
            <ShieldCheck className="icon-shield" />
            <span>Bank 3D-Secure 2.0 Verified</span>
          </div>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close">
            <X className="icon-close" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="otp-body">
          <div className="bank-info-strip">
            <div className="info-row">
              <span className="label">Merchant:</span>
              <span className="value bold">Shiv Shakti Events Mart</span>
            </div>
            <div className="info-row">
              <span className="label">Transaction Amount:</span>
              <span className="value amount">₹{grandTotal.toLocaleString()}</span>
            </div>
            <div className="info-row">
              <span className="label">Card ending in:</span>
              <span className="value">•••• {cardLast4 || '4242'}</span>
            </div>
          </div>

          <div className="otp-instruction">
            <Smartphone className="icon-phone" />
            <p>
              A 6-digit One-Time Password (OTP) has been sent to your registered mobile number ending in <strong>+91 {maskedPhone}</strong>.
            </p>
          </div>

          {/* One-Click Demo OTP Helper */}
          <div className="demo-otp-helper">
            <span className="demo-hint">Testing / Demo Mode:</span>
            <button
              type="button"
              className="btn-quick-fill"
              onClick={handleQuickDemoOtp}
            >
              Click to Auto-fill: <strong>123456</strong>
            </button>
          </div>

          <form onSubmit={handleVerify} className="otp-form">
            <div className="form-group">
              <label htmlFor="otp-code-input">Enter 6-Digit OTP</label>
              <input
                id="otp-code-input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="1 2 3 4 5 6"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, ''));
                  setErrorMsg('');
                }}
                autoFocus
              />
            </div>

            {errorMsg && (
              <div className="otp-error">
                <AlertCircle className="icon-err" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="timer-resend-row">
              {timer > 0 ? (
                <span className="timer-text">Resend OTP in <strong>{timer}s</strong></span>
              ) : (
                <button
                  type="button"
                  className="btn-resend"
                  onClick={() => setTimer(60)}
                >
                  Resend OTP Code
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying || !otp}
              className="btn-verify-otp"
            >
              {isVerifying ? (
                <span className="spinner-wrapper">
                  <span className="spinner"></span>
                  Authenticating with Bank...
                </span>
              ) : (
                <>
                  Verify &amp; Confirm Payment
                  <ArrowRight className="icon-arrow" />
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}

/**
 * ============================================================================
 * PAYMENT GATEWAY & MERCHANT CONFIGURATION
 * ============================================================================
 * 
 * NOTE FOR USER:
 * As requested, you can update your real business phone number and UPI ID right here!
 * When you update `MERCHANT_PHONE` and `MERCHANT_UPI_ID`, the entire app's
 * dynamic UPI QR codes, intent links, and payment references will update automatically.
 */

export const PAYMENT_CONFIG = {
  // ── Merchant Information (Update your phone number here at the end) ──
  merchantName: 'Shiv Shakti Events Mart',
  merchantPhone: '9876543210', // <-- UPDATE YOUR PHONE NUMBER HERE
  merchantUpiId: '9876543210@upi', // <-- UPDATE YOUR UPI ID HERE (e.g. 9876543210@paytm, 9876543210@ybl, 9876543210@okaxis)

  // ── Currency & Display ──
  currency: 'INR',
  currencySymbol: '₹',

  // ── Optional Razorpay Gateway Integration ──
  // If you ever want to activate the official Razorpay Checkout popup,
  // simply set enableRazorpay: true and provide your Razorpay Key ID.
  enableRazorpay: false,
  razorpayKeyId: (import.meta.env.VITE_RAZORPAY_KEY_ID as string) || '',

  // ── Bank Support List for Net Banking ──
  supportedBanks: [
    { code: 'sbi', name: 'State Bank of India (Privilege)' },
    { code: 'hdfc', name: 'HDFC Bank (Imperial)' },
    { code: 'icici', name: 'ICICI Bank (Wealth)' },
    { code: 'axis', name: 'Axis Bank (Burgundy)' },
    { code: 'kotak', name: 'Kotak Mahindra Bank (Privy)' },
    { code: 'pnb', name: 'Punjab National Bank' },
    { code: 'bob', name: 'Bank of Baroda' },
  ],
};

/**
 * Generates a compliant NPCI standard UPI payment URI.
 * Works seamlessly with Google Pay, PhonePe, Paytm, BHIM, Cred, and mobile banking apps.
 */
export function generateUpiUri(params: {
  amount: number;
  orderNumber: string;
  merchantUpiId?: string;
  merchantName?: string;
}): string {
  const upiId = params.merchantUpiId || PAYMENT_CONFIG.merchantUpiId;
  const name = encodeURIComponent(params.merchantName || PAYMENT_CONFIG.merchantName);
  const amount = params.amount.toFixed(2);
  const note = encodeURIComponent(`Order ${params.orderNumber} - ${PAYMENT_CONFIG.merchantName}`);
  const tr = encodeURIComponent(params.orderNumber);

  return `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR&tn=${note}&tr=${tr}`;
}

/**
 * Returns deep-link URLs for specific popular Indian UPI apps
 */
export function getUpiAppLinks(upiUri: string) {
  return [
    {
      id: 'gpay',
      name: 'Google Pay',
      color: '#4285F4',
      bgColor: 'rgba(66, 133, 244, 0.1)',
      url: upiUri.replace('upi://', 'gpay://upi/'),
      fallbackUrl: upiUri,
    },
    {
      id: 'phonepe',
      name: 'PhonePe',
      color: '#5f259f',
      bgColor: 'rgba(95, 37, 159, 0.1)',
      url: upiUri.replace('upi://', 'phonepe://'),
      fallbackUrl: upiUri,
    },
    {
      id: 'paytm',
      name: 'Paytm',
      color: '#00baf2',
      bgColor: 'rgba(0, 186, 242, 0.1)',
      url: upiUri.replace('upi://', 'paytmmp://'),
      fallbackUrl: upiUri,
    },
    {
      id: 'bhim',
      name: 'BHIM / Any UPI',
      color: '#28a745',
      bgColor: 'rgba(40, 167, 69, 0.1)',
      url: upiUri,
      fallbackUrl: upiUri,
    },
  ];
}

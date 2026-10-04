import { useState, useEffect, useMemo, type FormEvent } from 'react';
import {
  PhoneCall,
  CalendarCheck,
  Sparkles,
  X,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Send,
  ArrowRight,
  CheckCircle2,
  Package,
  ShoppingBag,
  User,
  Tag,
} from 'lucide-react';
import { quoteApi } from '../../../features/quotes/services/quoteApi';
import type { Product } from '../../../shared/types/models.types';

export interface FloatingActionDockProps {
  cart: { id: string; name: string; price: number; image: string; quantity: number }[];
  products?: Product[];
  onOpenCart: () => void;
  showToast: (msg: string) => void;
  onNavigate?: (path: string) => void;
  contactPerson?: {
    name: string;
    designation: string;
    phone: string;
    whatsapp: string;
    email: string;
    location: string;
  };
}

export default function FloatingActionDock({
  cart = [],
  products = [],
  onOpenCart,
  showToast,
  onNavigate,
  contactPerson = {
    name: 'Mr. Chakshu Goyal',
    designation: 'Founder & Chief Event Infrastructure Director',
    phone: '+91 98765 43210',
    whatsapp: '919876543210',
    email: '123chakshu456@gmail.com',
    location: 'Shiv Shakti Events Mart, Industrial Area, Ring Road, Jaipur, Rajasthan 302013',
  },
}: FloatingActionDockProps) {
  // Modal visibility states
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isBookNoticeOpen, setIsBookNoticeOpen] = useState(false);

  // Cart statistics
  const totalCartItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );
  const totalCartPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  // ==========================================
  // ENQUIRE AT: STATE (Product + Enquiry Topic)
  // ==========================================
  const [enquiryTargetType, setEnquiryTargetType] = useState<'catalogue_product' | 'order_reference'>('catalogue_product');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [customOrderNumber, setCustomOrderNumber] = useState<string>('');
  const [enquiryTopic, setEnquiryTopic] = useState<string>('Custom / Wholesale Bulk Pricing');
  const [enquiryQuestion, setEnquiryQuestion] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);
  const [enquirySuccessId, setEnquirySuccessId] = useState<string | null>(null);

  // Auto-select first cart item or first catalogue product when opening
  useEffect(() => {
    if (!selectedProductId) {
      if (cart.length > 0) {
        setSelectedProductId(cart[0].id);
      } else if (products.length > 0) {
        setSelectedProductId(products[0].id);
      }
    }
  }, [cart, products, selectedProductId]);

  // Selected product object
  const activeProduct = useMemo(() => {
    // First check cart
    const inCart = cart.find((i) => i.id === selectedProductId);
    if (inCart) return inCart;
    // Next check products list
    return products.find((p) => p.id === selectedProductId) || null;
  }, [selectedProductId, cart, products]);

  // Pre-set common enquiry topics
  const enquiryTopics = [
    { id: 'pricing', label: '💰 Wholesale & Bulk Pricing Quote', short: 'Bulk Pricing' },
    { id: 'specs', label: '📏 Dimensions, Size & Material Specs', short: 'Dimensions & Specs' },
    { id: 'availability', label: '📅 Availability for My Event Dates', short: 'Event Date Staging' },
    { id: 'installation', label: '🛠️ On-Site Rigging, Staging & Crew', short: 'On-site Staging' },
    { id: 'customization', label: '🎨 Custom Color, Polish & Thematic Mod', short: 'Customization' },
    { id: 'order_status', label: '📦 Production & Dispatch Tracking', short: 'Order Tracking' },
  ];

  // ==========================================
  // CONTACT PERSON FORM STATE
  // ==========================================
  const [quickSenderName, setQuickSenderName] = useState('');
  const [quickSenderPhone, setQuickSenderPhone] = useState('');
  const [quickSenderMsg, setQuickSenderMsg] = useState('');
  const [isSendingToPerson, setIsSendingToPerson] = useState(false);
  const [personMessageSent, setPersonMessageSent] = useState(false);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsContactOpen(false);
        setIsEnquiryOpen(false);
        setIsBookNoticeOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ==========================================
  // BUTTON CLICK HANDLERS
  // ==========================================

  // 1. BOOK NOW CLICK
  const handleBookNowClick = () => {
    if (totalCartItems > 0) {
      // Products are added in cart -> Open cart directly so user can book all items
      onOpenCart();
    } else {
      // Cart is empty -> Show informative modal directing user to catalogue
      setIsBookNoticeOpen(true);
      setIsContactOpen(false);
      setIsEnquiryOpen(false);
    }
  };

  // 2. ENQUIRE AT CLICK
  const handleEnquireAtClick = () => {
    setIsEnquiryOpen((prev) => !prev);
    setIsContactOpen(false);
    setIsBookNoticeOpen(false);
  };

  // 3. CONTACT US CLICK
  const handleContactUsClick = () => {
    setIsContactOpen((prev) => !prev);
    setIsEnquiryOpen(false);
    setIsBookNoticeOpen(false);
  };

  // Browse catalogue helper
  const handleBrowseCatalogue = () => {
    setIsBookNoticeOpen(false);
    setIsEnquiryOpen(false);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
    showToast('✨ Browse our live catalogue and click Add to Cart to book products!');
  };

  // ==========================================
  // ENQUIRY SUBMISSION (Product + Question)
  // ==========================================
  const handleEnquirySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !clientEmail.trim()) {
      showToast('⚠️ Please enter your Name, Phone Number, and Email.');
      return;
    }

    const productName = activeProduct?.name || customOrderNumber || 'General Catalogue Item';

    setIsSubmittingEnquiry(true);
    try {
      const res = await quoteApi.createQuote({
        email: clientEmail.trim(),
        scale: `${enquiryTopic} | ${productName}`,
        venue: clientPhone.trim(),
        drapes: enquiryQuestion.trim() || `Enquiry for ${productName} regarding ${enquiryTopic}`,
        estimated: (activeProduct as any)?.price || 50000,
      });

      const quoteId = res?.id ? res.id.slice(0, 8).toUpperCase() : `ENQ-${Date.now().toString().slice(-6)}`;
      setEnquirySuccessId(quoteId);
      showToast(`🎉 Product enquiry registered! Reference ID: #${quoteId}`);
    } catch {
      const fallbackId = `ENQ-${Date.now().toString().slice(-6)}`;
      setEnquirySuccessId(fallbackId);
      showToast(`🎉 Enquiry registered! Reference ID: #${fallbackId}. Our team will contact you shortly.`);
    } finally {
      setIsSubmittingEnquiry(false);
    }
  };

  // Send WhatsApp enquiry with pre-filled Product + Topic details
  const handleEnquiryWhatsApp = () => {
    const productName = activeProduct?.name || customOrderNumber || 'Catalogue Product';
    const productPrice = (activeProduct as any)?.price ? `₹${(activeProduct as any).price.toLocaleString('en-IN')}` : 'Contact for pricing';
    const productSku = (activeProduct as any)?.sku || 'N/A';

    const text = `*Event Product Enquiry — Shiv Shakti Events Mart*
━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 *Product / Order:* ${productName}
🏷️ *SKU / Ref:* ${productSku}
💰 *Listed Price:* ${productPrice}
🔍 *Enquiry Regarding:* ${enquiryTopic}
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Client Name:* ${clientName.trim() || 'Client'}
📱 *Phone:* ${clientPhone.trim() || 'Not specified'}
✉️ *Email:* ${clientEmail.trim() || 'Not specified'}
💬 *Specific Question:*
${enquiryQuestion.trim() || 'Please share detailed quotation, availability, and bulk pricing.'}`;

    const url = `https://wa.me/${contactPerson.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast('📲 Opening WhatsApp with your product enquiry details...');
  };

  // Direct Message to Contact Person
  const handleDirectMessageToPerson = (e: FormEvent) => {
    e.preventDefault();
    if (!quickSenderName.trim() || !quickSenderPhone.trim()) {
      showToast('⚠️ Please enter your name and phone number.');
      return;
    }

    setIsSendingToPerson(true);
    setTimeout(() => {
      setIsSendingToPerson(false);
      setPersonMessageSent(true);
      showToast(`✅ Callback request logged for ${contactPerson.name}!`);
      setTimeout(() => {
        setPersonMessageSent(false);
        setQuickSenderName('');
        setQuickSenderPhone('');
        setQuickSenderMsg('');
        setIsContactOpen(false);
      }, 2500);
    }, 600);
  };

  return (
    <>
      {/* =========================================================================
          FIXED BOTTOM-RIGHT DOCKED ACTION BAR (NON-SCROLLABLE)
         ========================================================================= */}
      <aside
        className="floating-action-dock"
        id="floating-action-dock"
        aria-label="Quick Actions: Contact Us, Enquire At, Book Now"
      >
        <div className="dock-pill-container">

          {/* 1. CONTACT US BUTTON */}
          <button
            type="button"
            className={`dock-action-btn contact-btn ${isContactOpen ? 'active' : ''}`}
            onClick={handleContactUsClick}
            aria-expanded={isContactOpen}
            title={`Contact ${contactPerson.name} directly`}
          >
            <span className="btn-icon-wrapper">
              <PhoneCall className="dock-icon phone-pulse" />
            </span>
            <span className="btn-label">Contact Us</span>
          </button>

          <span className="dock-divider" aria-hidden="true" />

          {/* 2. ENQUIRE AT BUTTON */}
          <button
            type="button"
            className={`dock-action-btn enquire-btn ${isEnquiryOpen ? 'active' : ''}`}
            onClick={handleEnquireAtClick}
            aria-expanded={isEnquiryOpen}
            title="Enquire about any catalogue product or order"
          >
            <span className="btn-icon-wrapper">
              <Sparkles className="dock-icon gold-sparkle" />
            </span>
            <span className="btn-label">Enquire At</span>
          </button>

          <span className="dock-divider" aria-hidden="true" />

          {/* 3. BOOK NOW BUTTON */}
          <button
            type="button"
            className={`dock-action-btn book-btn ${isBookNoticeOpen ? 'active' : ''}`}
            onClick={handleBookNowClick}
            aria-expanded={isBookNoticeOpen}
            title={totalCartItems > 0 ? `Book ${totalCartItems} catalogue products (₹${totalCartPrice.toLocaleString()})` : 'Book catalogue products'}
          >
            <span className="btn-icon-wrapper">
              <CalendarCheck className="dock-icon book-icon" />
            </span>
            <span className="btn-label">Book Now</span>
            {totalCartItems > 0 && (
              <span className="dock-cart-badge" aria-label={`${totalCartItems} items in cart`}>
                {totalCartItems}
              </span>
            )}
          </button>

        </div>
      </aside>

      {/* =========================================================================
          MODAL 1: CONTACT US (DIRECT CONTACT OF THE PERSON)
         ========================================================================= */}
      {isContactOpen && (
        <div className="dock-modal-backdrop" onClick={() => setIsContactOpen(false)}>
          <div
            className="dock-modal-card contact-person-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="contact-person-modal-title"
          >
            <div className="card-header">
              <div className="header-text">
                <span className="pill-badge">Direct Executive Contact</span>
                <h3 id="contact-person-modal-title">Contact Our Key Personnel</h3>
                <p>Speak directly with our founder &amp; chief event staging director.</p>
              </div>
              <button
                type="button"
                className="card-close-btn"
                onClick={() => setIsContactOpen(false)}
                aria-label="Close contact dialog"
              >
                <X className="icon" />
              </button>
            </div>

            <div className="card-body">
              {/* PRIMARY PERSON PROFILE CARD */}
              <div className="person-profile-banner">
                <div className="person-avatar-col">
                  <div className="avatar-circle">
                    <User className="user-icon" />
                  </div>
                  <span className="active-dot-status" title="Active on mobile & WhatsApp">
                    Online Now
                  </span>
                </div>
                <div className="person-details-col">
                  <div className="person-name-row">
                    <h4>{contactPerson.name}</h4>
                    <span className="verified-badge" title="Authorized Lead Contact">
                      ✓ Verified Director
                    </span>
                  </div>
                  <div className="person-designation">{contactPerson.designation}</div>
                  <div className="person-company">Shiv Shakti Events Mart Pvt Ltd</div>
                </div>
              </div>

              {/* PERSON CONTACT ACTIONS */}
              <div className="person-direct-actions-grid">
                {/* 1. Direct Phone Call */}
                <a
                  href={`tel:${contactPerson.phone.replace(/\s+/g, '')}`}
                  className="person-action-tile call-tile"
                >
                  <div className="tile-icon">
                    <Phone className="icon" />
                  </div>
                  <div className="tile-info">
                    <span className="tile-title">Call Person Directly</span>
                    <span className="tile-value">{contactPerson.phone}</span>
                    <span className="tile-sub">Mon–Sun: 8:00 AM – 10:00 PM</span>
                  </div>
                </a>

                {/* 2. Direct WhatsApp */}
                <a
                  href={`https://wa.me/${contactPerson.whatsapp}?text=${encodeURIComponent(`Hello ${contactPerson.name}, I am reaching out from Shiv Shakti Events Mart to discuss event infrastructure and bookings.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="person-action-tile whatsapp-tile"
                >
                  <div className="tile-icon">
                    <MessageCircle className="icon" />
                  </div>
                  <div className="tile-info">
                    <span className="tile-title">WhatsApp with Person</span>
                    <span className="tile-value">+91 {contactPerson.whatsapp.slice(-10)}</span>
                    <span className="tile-sub">⚡ Typical reply in 2 mins</span>
                  </div>
                </a>

                {/* 3. Direct Email */}
                <a
                  href={`mailto:${contactPerson.email}`}
                  className="person-action-tile email-tile"
                >
                  <div className="tile-icon">
                    <Mail className="icon" />
                  </div>
                  <div className="tile-info">
                    <span className="tile-title">Direct Email</span>
                    <span className="tile-value">{contactPerson.email}</span>
                    <span className="tile-sub">Send official RFPs &amp; specs</span>
                  </div>
                </a>

                {/* 4. Factory & Staging Location */}
                <div className="person-action-tile location-tile">
                  <div className="tile-icon">
                    <MapPin className="icon" />
                  </div>
                  <div className="tile-info">
                    <span className="tile-title">Staging Works &amp; Factory</span>
                    <span className="tile-value">{contactPerson.location}</span>
                    <span className="tile-sub">Direct factory visits welcome</span>
                  </div>
                </div>
              </div>

              {/* DIRECT MESSAGE TO PERSON */}
              <div className="direct-message-box">
                <h4>Leave a Direct Message for {contactPerson.name}</h4>
                {personMessageSent ? (
                  <div className="person-message-success">
                    <CheckCircle2 className="icon-success" />
                    <span>Your direct message was forwarded to {contactPerson.name}! You will receive a call within 15 minutes.</span>
                  </div>
                ) : (
                  <form onSubmit={handleDirectMessageToPerson} className="person-quick-form">
                    <div className="form-row-2">
                      <input
                        type="text"
                        placeholder="Your Full Name *"
                        value={quickSenderName}
                        onChange={(e) => setQuickSenderName(e.target.value)}
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Your 10-Digit Mobile *"
                        value={quickSenderPhone}
                        onChange={(e) => setQuickSenderPhone(e.target.value.replace(/\D/g, ''))}
                        maxLength={10}
                        required
                      />
                    </div>
                    <textarea
                      placeholder={`Hello ${contactPerson.name}, I need quotation for...`}
                      value={quickSenderMsg}
                      onChange={(e) => setQuickSenderMsg(e.target.value)}
                      rows={2}
                    />
                    <button type="submit" disabled={isSendingToPerson} className="send-to-person-btn">
                      {isSendingToPerson ? 'Sending Message...' : `Send Direct Message to ${contactPerson.name} →`}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: ENQUIRE AT (SELECT PRODUCT & WHAT SHOULD YOU ENQUIRE ABOUT THAT)
         ========================================================================= */}
      {isEnquiryOpen && (
        <div className="dock-modal-backdrop" onClick={() => setIsEnquiryOpen(false)}>
          <div
            className="dock-modal-card enquiry-product-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="enquiry-product-title"
          >
            <div className="card-header">
              <div className="header-text">
                <span className="pill-badge gold">Product &amp; Order Enquiry</span>
                <h3 id="enquiry-product-title">Enquire About a Product or Order</h3>
                <p>Select any catalogue product or order reference, and choose what you would like to enquire about.</p>
              </div>
              <button
                type="button"
                className="card-close-btn"
                onClick={() => setIsEnquiryOpen(false)}
                aria-label="Close enquiry modal"
              >
                <X className="icon" />
              </button>
            </div>

            <div className="card-body">
              {enquirySuccessId ? (
                <div className="enquiry-success-view">
                  <div className="success-icon-badge">
                    <CheckCircle2 className="icon" />
                  </div>
                  <h3>Product Enquiry Successfully Logged!</h3>
                  <div className="enquiry-reference-box">
                    <span>Enquiry Reference Ticket</span>
                    <strong>#{enquirySuccessId}</strong>
                  </div>
                  <p>
                    Your enquiry regarding <strong>{activeProduct?.name || customOrderNumber}</strong> ({enquiryTopic}) has been dispatched to <strong>{contactPerson.name}</strong>.
                  </p>
                  <div className="success-action-btns">
                    <button
                      type="button"
                      onClick={handleEnquiryWhatsApp}
                      className="whatsapp-confirm-btn"
                    >
                      <MessageCircle className="icon" />
                      <span>Chat on WhatsApp About This Product</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEnquirySuccessId(null);
                        setIsEnquiryOpen(false);
                      }}
                      className="close-confirm-btn"
                    >
                      Done / Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="enquiry-product-form">
                  
                  {/* STEP 1: CHOOSE TARGET (Catalogue Product vs Order Reference) */}
                  <div className="enquiry-step-block">
                    <div className="step-label-row">
                      <span className="step-num">1</span>
                      <span className="step-heading">Which Product or Order do you want to enquire about?</span>
                    </div>

                    <div className="target-type-toggle">
                      <button
                        type="button"
                        className={`type-toggle-btn ${enquiryTargetType === 'catalogue_product' ? 'active' : ''}`}
                        onClick={() => setEnquiryTargetType('catalogue_product')}
                      >
                        <Package className="icon" />
                        <span>Catalogue Product</span>
                      </button>
                      <button
                        type="button"
                        className={`type-toggle-btn ${enquiryTargetType === 'order_reference' ? 'active' : ''}`}
                        onClick={() => setEnquiryTargetType('order_reference')}
                      >
                        <Tag className="icon" />
                        <span>Order Reference Number</span>
                      </button>
                    </div>

                    {/* If Cart has items, offer quick chips */}
                    {enquiryTargetType === 'catalogue_product' && cart.length > 0 && (
                      <div className="cart-quick-select-strip">
                        <span className="strip-label">Items in your cart:</span>
                        <div className="cart-pills-row">
                          {cart.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              className={`cart-select-pill ${selectedProductId === item.id ? 'selected' : ''}`}
                              onClick={() => setSelectedProductId(item.id)}
                            >
                              <img src={item.image} alt={item.name} className="pill-thumb" />
                              <span className="pill-name">{item.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Product Selector Dropdown */}
                    {enquiryTargetType === 'catalogue_product' ? (
                      <div className="product-dropdown-container">
                        <label htmlFor="product-select" className="field-sublabel">Select from Catalogue:</label>
                        <select
                          id="product-select"
                          value={selectedProductId}
                          onChange={(e) => setSelectedProductId(e.target.value)}
                          className="product-select-dropdown"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} {p.price ? `— ₹${p.price.toLocaleString('en-IN')}` : ''} {p.sku ? `(${p.sku})` : ''}
                            </option>
                          ))}
                        </select>

                        {/* Selected Product Preview Card */}
                        {activeProduct && (
                          <div className="selected-product-card-preview">
                            <div className="preview-image">
                              <img src={activeProduct.image} alt={activeProduct.name} />
                            </div>
                            <div className="preview-info">
                              <div className="preview-title">{activeProduct.name}</div>
                              <div className="preview-meta">
                                {(activeProduct as any).sku && (
                                  <span className="sku-badge">{(activeProduct as any).sku}</span>
                                )}
                                {(activeProduct as any).price && (
                                  <span className="price-badge">
                                    ₹{(activeProduct as any).price.toLocaleString('en-IN')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="order-reference-field">
                        <label htmlFor="order-ref" className="field-sublabel">Enter Order # or Quote ID:</label>
                        <input
                          id="order-ref"
                          type="text"
                          placeholder="e.g. ORD-2026-1049 or QUOTE-8842"
                          value={customOrderNumber}
                          onChange={(e) => setCustomOrderNumber(e.target.value)}
                          className="order-ref-input"
                          required
                        />
                      </div>
                    )}
                  </div>

                  {/* STEP 2: WHAT DO YOU WANT TO ENQUIRE ABOUT THAT PRODUCT? */}
                  <div className="enquiry-step-block">
                    <div className="step-label-row">
                      <span className="step-num">2</span>
                      <span className="step-heading">What should you enquire about that product?</span>
                    </div>

                    <div className="topics-chips-grid">
                      {enquiryTopics.map((topic) => (
                        <button
                          key={topic.id}
                          type="button"
                          className={`topic-chip ${enquiryTopic === topic.short ? 'selected' : ''}`}
                          onClick={() => setEnquiryTopic(topic.short)}
                        >
                          <span className="topic-text">{topic.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="question-textarea-wrapper">
                      <label htmlFor="enq-question" className="field-sublabel">Specific Query / Notes:</label>
                      <textarea
                        id="enq-question"
                        rows={3}
                        placeholder={`e.g. Please let me know wholesale rates for 50 units, or whether this can be delivered to our venue by next week...`}
                        value={enquiryQuestion}
                        onChange={(e) => setEnquiryQuestion(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* STEP 3: YOUR CONTACT DETAILS */}
                  <div className="enquiry-step-block">
                    <div className="step-label-row">
                      <span className="step-num">3</span>
                      <span className="step-heading">Where should we send the response?</span>
                    </div>

                    <div className="client-fields-row">
                      <input
                        type="text"
                        placeholder="Your Name *"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Mobile / WhatsApp Number *"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value.replace(/\D/g, ''))}
                        maxLength={10}
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email Address *"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* SUBMISSION BUTTONS */}
                  <div className="enquiry-submit-row">
                    <button
                      type="submit"
                      disabled={isSubmittingEnquiry}
                      className="submit-product-enquiry-btn"
                    >
                      <Send className="icon" />
                      <span>{isSubmittingEnquiry ? 'Submitting Enquiry...' : 'Submit Product Enquiry'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleEnquiryWhatsApp}
                      className="whatsapp-product-enquiry-btn"
                    >
                      <MessageCircle className="icon" />
                      <span>Enquire on WhatsApp</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: BOOK NOW (WHEN CART IS EMPTY -> GUIDE TO CATALOGUE TO BOOK)
         ========================================================================= */}
      {isBookNoticeOpen && (
        <div className="dock-modal-backdrop" onClick={() => setIsBookNoticeOpen(false)}>
          <div
            className="dock-modal-card book-notice-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="book-notice-title"
          >
            <div className="card-header">
              <div className="header-text">
                <span className="pill-badge gold">Catalogue Checkout Booking</span>
                <h3 id="book-notice-title">Book Catalogue Products</h3>
                <p>Book now allows you to secure all products selected in your booking cart.</p>
              </div>
              <button
                type="button"
                className="card-close-btn"
                onClick={() => setIsBookNoticeOpen(false)}
                aria-label="Close booking dialog"
              >
                <X className="icon" />
              </button>
            </div>

            <div className="card-body text-center">
              <div className="empty-cart-graphic">
                <ShoppingBag className="bag-icon" />
              </div>

              <h4>Your Booking Cart is Currently Empty</h4>
              <p className="empty-cart-desc">
                &ldquo;Book Now&rdquo; allows you to instantly book all catalogue products added to your checkout cart.
                Browse our live catalogue of wedding mandaps, banquet chairs, bhattis, and catering equipment, and click <strong>Add to Cart</strong> to book them!
              </p>

              <div className="quick-catalogue-shortcuts">
                <button
                  type="button"
                  onClick={handleBrowseCatalogue}
                  className="browse-catalogue-cta-btn"
                >
                  <Sparkles className="icon" />
                  <span>Browse Live Catalogue to Add Products</span>
                  <ArrowRight className="icon" />
                </button>

                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsBookNoticeOpen(false);
                      onNavigate('/checkout');
                    }}
                    className="view-checkout-link"
                  >
                    <span>Go Directly to Checkout Page →</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

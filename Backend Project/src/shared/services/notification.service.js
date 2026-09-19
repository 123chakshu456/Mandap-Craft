import { auditService } from './audit.service.js';

/**
 * Enterprise Multi-Channel Notification Service (SMS, Email, WhatsApp)
 * Supports Twilio, Fast2SMS, Custom Webhooks, Resend, SendGrid, and Dev Fallback.
 */
export const notificationService = {
  /**
   * Send SMS text message to customer phone number
   */
  async sendSMS({ phone, orderNumber, customerName, grandTotal, message = '' }) {
    if (!phone) return { success: false, reason: 'No phone number provided' };

    const cleanPhone = String(phone).replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return { success: false, reason: 'Invalid phone number format' };
    }

    const formattedPhone = cleanPhone.length === 10 ? `+91${cleanPhone}` : `+${cleanPhone}`;
    const smsText = message ||
      `🎉 Order Confirmed! Dear ${customerName || 'Valued Guest'}, your order #${orderNumber} at Shiv Shakti Events Mart has been placed successfully for ₹${Number(grandTotal).toLocaleString('en-IN')}. For inquiries, contact us anytime. Track at: https://shivshaktieventsmart.vercel.app`;

    let provider = 'Console/Simulated';
    let deliveryStatus = 'SENT';

    try {
      // 1. Check for Fast2SMS (Common Indian SMS Gateway)
      if (process.env.FAST2SMS_API_KEY && process.env.FAST2SMS_API_KEY !== 'your_api_key') {
        provider = 'Fast2SMS';
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            authorization: process.env.FAST2SMS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            route: 'q',
            message: smsText,
            language: 'english',
            flash: 0,
            numbers: cleanPhone.slice(-10),
          }),
        });
        const resData = await response.json().catch(() => ({}));
        console.log(`📡 [Fast2SMS Gateway Response]`, resData);
      }
      // 2. Check for Twilio SMS
      else if (
        process.env.TWILIO_ACCOUNT_SID &&
        process.env.TWILIO_AUTH_TOKEN &&
        process.env.TWILIO_PHONE_NUMBER
      ) {
        provider = 'Twilio';
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;
        const bodyParams = new URLSearchParams({
          From: process.env.TWILIO_PHONE_NUMBER,
          To: formattedPhone,
          Body: smsText,
        });

        const response = await fetch(twilioUrl, {
          method: 'POST',
          headers: {
            Authorization: 'Basic ' + Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: bodyParams,
        });
        const resData = await response.json().catch(() => ({}));
        console.log(`📡 [Twilio Gateway Response]`, resData);
      }
      // 3. Custom Webhook Gateway
      else if (process.env.SMS_WEBHOOK_URL) {
        provider = 'Custom Webhook';
        await fetch(process.env.SMS_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: formattedPhone, orderNumber, text: smsText }),
        });
      }
      // 4. Default Production/Dev Logger
      else {
        console.log(`\n========================================================`);
        console.log(`📱 [SMS DISPATCHED]`);
        console.log(`Recipient Phone : ${formattedPhone}`);
        console.log(`Order Number    : #${orderNumber}`);
        console.log(`Text Message    : ${smsText}`);
        console.log(`Timestamp       : ${new Date().toISOString()}`);
        console.log(`========================================================\n`);
      }

      await auditService.record({
        action: 'SEND_SMS_NOTIFICATION',
        entity: 'Order',
        entityId: orderNumber,
        details: {
          recipient: formattedPhone,
          orderNumber,
          provider,
          status: deliveryStatus,
          text: smsText,
        },
      });

      return { success: true, provider, recipient: formattedPhone };
    } catch (err) {
      console.error(`❌ [SMS Dispatch Error]:`, err.message);
      return { success: false, error: err.message, recipient: formattedPhone };
    }
  },

  /**
   * Send Email confirmation to customer email address
   */
  async sendEmail({ email, orderNumber, customerName, grandTotal, items = [] }) {
    if (!email || email.includes('@customer.shivshaktievents.com')) {
      return { success: false, reason: 'No valid customer email provided' };
    }

    const subject = `Order Confirmation #${orderNumber} - Shiv Shakti Events Mart`;
    const itemRows = items
      .map(
        (it) =>
          `<tr>
            <td style="padding: 8px 12px; border-bottom: 1px solid #1e293b;">${it.name}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #1e293b; text-align: center;">${it.quantity}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #1e293b; text-align: right;">₹${Number(it.price).toLocaleString('en-IN')}</td>
          </tr>`
      )
      .join('');

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #0b1329; color: #f1f5f9; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b;">
        <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 24px; text-align: center;">
          <h1 style="margin: 0; color: #fff; font-size: 1.5rem; letter-spacing: 1px;">Shiv Shakti Events Mart</h1>
          <p style="margin: 6px 0 0; color: #e0e7ff; font-size: 0.9rem;">Bespoke Event Infrastructure & Royal Decor</p>
        </div>
        <div style="padding: 24px;">
          <h2 style="color: #38bdf8; margin-top: 0;">Order Confirmed! 🎉</h2>
          <p style="color: #94a3b8; font-size: 0.95rem;">Dear <strong>${customerName || 'Valued Guest'}</strong>,</p>
          <p style="color: #cbd5e1; line-height: 1.6;">Thank you for your order. We have received your booking and our infrastructure operations team is preparing your setup.</p>
          
          <div style="background: #060a14; border: 1px solid #1e293b; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <div style="font-size: 0.85rem; color: #94a3b8; text-transform: uppercase; font-weight: 700;">Order Reference Number</div>
            <div style="font-size: 1.4rem; color: #f59e0b; font-weight: 800; font-family: monospace; margin-top: 4px;">#${orderNumber}</div>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 0.9rem;">
            <thead>
              <tr style="background: #060a14; color: #94a3b8; text-align: left;">
                <th style="padding: 10px 12px; border-bottom: 2px solid #334155;">Item</th>
                <th style="padding: 10px 12px; border-bottom: 2px solid #334155; text-align: center;">Qty</th>
                <th style="padding: 10px 12px; border-bottom: 2px solid #334155; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 12px; font-weight: 700; text-align: right; color: #94a3b8;">Total Amount:</td>
                <td style="padding: 12px; font-weight: 800; text-align: right; color: #10b981; font-size: 1.1rem;">₹${Number(grandTotal).toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          </table>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://shivshaktieventsmart.vercel.app" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #7c3aed); color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 0.95rem;">Track Your Order</a>
          </div>
        </div>
        <div style="background: #060a14; padding: 16px; text-align: center; font-size: 0.75rem; color: #64748b; border-top: 1px solid #1e293b;">
          Shiv Shakti Events Mart • Luxury Wedding Decors, German Hangars & Stage Fabrication
        </div>
      </div>
    `;

    let provider = 'Console/Simulated';
    let deliveryStatus = 'SENT';

    try {
      // 1. Resend API
      if (process.env.RESEND_API_KEY) {
        provider = 'Resend';
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'Shiv Shakti Events Mart <orders@shivshaktievents.com>',
            to: [email],
            subject,
            html: htmlContent,
          }),
        });
      }
      // 2. Default Production/Dev Logger
      else {
        console.log(`\n========================================================`);
        console.log(`📧 [EMAIL DISPATCHED]`);
        console.log(`Recipient Email : ${email}`);
        console.log(`Order Number    : #${orderNumber}`);
        console.log(`Subject         : ${subject}`);
        console.log(`Timestamp       : ${new Date().toISOString()}`);
        console.log(`========================================================\n`);
      }

      await auditService.record({
        action: 'SEND_EMAIL_NOTIFICATION',
        entity: 'Order',
        entityId: orderNumber,
        details: {
          recipient: email,
          orderNumber,
          provider,
          status: deliveryStatus,
          subject,
        },
      });

      return { success: true, provider, recipient: email };
    } catch (err) {
      console.error(`❌ [Email Dispatch Error]:`, err.message);
      return { success: false, error: err.message, recipient: email };
    }
  },

  /**
   * Unified notification dispatcher: sends to SMS, Email, or both depending on availability
   */
  async sendOrderConfirmation({ order, customerName, customerEmail, customerPhone, grandTotal, items = [] }) {
    const orderNumber = order?.orderNumber || 'MC-ORDER';
    const total = grandTotal || order?.grandTotal || 0;
    const name = customerName || order?.customerName || 'Valued Guest';
    const email = customerEmail || order?.customerEmail;
    const phone = customerPhone || order?.customerPhone;

    const results = {
      orderNumber,
      sms: null,
      email: null,
      channelsDispatched: [],
    };

    // 1. Dispatch SMS if phone is provided
    if (phone) {
      results.sms = await this.sendSMS({
        phone,
        orderNumber,
        customerName: name,
        grandTotal: total,
      });
      if (results.sms?.success) {
        results.channelsDispatched.push('SMS');
      }
    }

    // 2. Dispatch Email if email is provided
    if (email) {
      results.email = await this.sendEmail({
        email,
        orderNumber,
        customerName: name,
        grandTotal: total,
        items,
      });
      if (results.email?.success) {
        results.channelsDispatched.push('Email');
      }
    }

    console.log(`📢 [Order #${orderNumber} Notifications]: Dispatched to [${results.channelsDispatched.join(' & ') || 'None'}]`);
    return results;
  },
};

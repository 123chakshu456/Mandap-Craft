// =========================================================
// Branded B2B Quotation Estimate Print / PDF Generator
// Creates clean, print-ready wholesale quote sheets
// =========================================================

export interface QuotationPrintItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  dimensionsNote?: string;
}

export function printQuotation(items: QuotationPrintItem[], totalPrice: number, customerName = 'Valued Event Decorator'): void {
  if (typeof window === 'undefined' || items.length === 0) return;

  const quoteId = `SSM-EST-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const printWindow = window.open('', '_blank', 'width=880,height=960');
  if (!printWindow) {
    alert('Please allow popups to download or print your quotation estimate.');
    return;
  }

  const itemsHtml = items.map((item, idx) => {
    const total = item.price * item.quantity;
    const dim = item.dimensionsNote ? `<br><small style="color:#666;">Size: ${item.dimensionsNote}</small>` : '';
    return `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px; text-align: center; color: #64748b; font-size: 13px;">${idx + 1}</td>
        <td style="padding: 12px; font-weight: 600; color: #0f172a; font-size: 14px;">
          ${item.name} ${dim}
        </td>
        <td style="padding: 12px; text-align: center; color: #0f172a; font-size: 14px; font-weight: 600;">${item.quantity}</td>
        <td style="padding: 12px; text-align: right; color: #0f172a; font-size: 14px;">₹${item.price.toLocaleString('en-IN')}</td>
        <td style="padding: 12px; text-align: right; font-weight: 700; color: #047857; font-size: 14px;">₹${total.toLocaleString('en-IN')}</td>
      </tr>
    `;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>Quotation Estimate #${quoteId} - Shiv Shakti Events Mart</title>
      <style>
        body {
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          color: #0f172a;
          margin: 0;
          padding: 32px;
          background: #fff;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body>
      <div style="max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 24px;">
          <div>
            <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 0.5px; color: #0f172a;">SHIV SHAKTI EVENTS MART</h1>
            <p style="margin: 4px 0 0; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #b45309; letter-spacing: 1px;">
              Premier Wedding &amp; Event Infrastructure Manufacturer
            </p>
            <p style="margin: 4px 0 0; font-size: 11px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.5px;">
              Fulfilled by: Shiv Shakti Dyeing and Tent Works (Authorized Indian Army Supplier)
            </p>
            <p style="margin: 4px 0 0; font-size: 12px; color: #1e293b; font-weight: 700;">
              <strong>GSTIN:</strong> 03ACLPK6023A1Z9 &bull; <strong>Bank:</strong> Punjab National Bank (PNB)
            </p>
            <p style="margin: 6px 0 0; font-size: 13px; color: #475569; line-height: 1.5;">
              📍 Bibi Wala Road, Near Durga Mandir, Bathinda, Punjab 151001<br />
              📞 WhatsApp: +91 94174-17978 / 94631-04291 &bull; ☎️ Landline: 0164-2211543 &bull; Mob: 90565-17978<br />
              🕒 Mon &ndash; Sat: 9:00 AM &ndash; 7:00 PM (IST) &bull; Sunday Closed &bull; 👤 Contact: Parveen
            </p>
          </div>
          <div style="text-align: right;">
            <div style="background: #f1f5f9; padding: 8px 16px; border-radius: 8px; display: inline-block;">
              <span style="display: block; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700;">Estimate Number</span>
              <strong style="font-size: 16px; color: #0f172a;">${quoteId}</strong>
            </div>
            <div style="margin-top: 8px; font-size: 13px; color: #64748b;">
              Date: <strong>${dateStr}</strong>
            </div>
          </div>
        </div>

        <!-- Client & Subject -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px; display: flex; justify-content: space-between;">
          <div>
            <span style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase;">Quotation Prepared For:</span>
            <div style="font-size: 15px; font-weight: 700; color: #0f172a; margin-top: 2px;">${customerName}</div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase;">Validity:</span>
            <div style="font-size: 13px; font-weight: 600; color: #0f172a; margin-top: 2px;">15 Days from Issue Date</div>
          </div>
        </div>

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <thead>
            <tr style="background: #0f172a; color: #fff;">
              <th style="padding: 10px 12px; font-size: 12px; text-align: center; border-radius: 6px 0 0 6px;">#</th>
              <th style="padding: 10px 12px; font-size: 12px; text-align: left;">Product Item &amp; Specifications</th>
              <th style="padding: 10px 12px; font-size: 12px; text-align: center;">Qty</th>
              <th style="padding: 10px 12px; font-size: 12px; text-align: right;">Unit Rate</th>
              <th style="padding: 10px 12px; font-size: 12px; text-align: right; border-radius: 0 6px 6px 0;">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Totals & Notes -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-top: 2px solid #e2e8f0; padding-top: 16px;">
          <div style="max-width: 440px; font-size: 12px; color: #64748b; line-height: 1.6;">
            <strong>Terms &amp; Wholesale Booking Guidelines:</strong>
            <ul style="margin: 4px 0 0; padding-left: 18px;">
              <li>Prices are indicative factory rates; freight &amp; GST applicable as per delivery location.</li>
              <li>Custom orders and large mandap structures require 50% advance for dispatch confirmation.</li>
              <li>For immediate logistics dispatch or bulk queries, contact Mr. Parveen (WhatsApp: +91 94174-17978 / 94631-04291 &bull; Tel: 0164-2211543 &bull; Mob: 90565-17978).</li>
              <li>Workshop &amp; Store Timings: Mon – Sat 9:00 AM – 7:00 PM (IST). Sunday Closed.</li>
            </ul>
          </div>
          <div style="text-align: right; min-width: 240px;">
            <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px 18px;">
              <span style="font-size: 12px; color: #047857; font-weight: 700; text-transform: uppercase;">Estimated Grand Total</span>
              <div style="font-size: 22px; font-weight: 900; color: #065f46; margin-top: 2px;">
                ₹${totalPrice.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        <!-- Official Bank Account & UPI Settlement Credentials -->
        <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 14px 18px; margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 12px; line-height: 1.6;">
          <div>
            <div style="font-size: 11px; text-transform: uppercase; color: #475569; font-weight: 800; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
              🏦 Official Bank Transfer (NEFT / RTGS / IMPS)
            </div>
            <div><strong>Bank Name:</strong> Punjab National Bank (PNB)</div>
            <div><strong>Account Number:</strong> <span style="font-family: monospace; font-size: 13.5px; font-weight: 800; color: #0f172a;">6183002100000867</span></div>
            <div><strong>IFS Code:</strong> <span style="font-family: monospace; font-size: 13px; font-weight: 800; color: #047857;">PUNB0618300</span></div>
            <div><strong>Beneficiary:</strong> Shiv Shakti Dyeing and Tent Works</div>
          </div>
          <div>
            <div style="font-size: 11px; text-transform: uppercase; color: #475569; font-weight: 800; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
              ⚡ Official GST &amp; UPI Settlement
            </div>
            <div><strong>GST Registration No:</strong> <span style="font-family: monospace; font-size: 13px; font-weight: 800; color: #0f172a;">03ACLPK6023A1Z9</span></div>
            <div><strong>UPI Number:</strong> <span style="font-family: monospace; font-size: 13px; font-weight: 800; color: #047857;">9417417978</span></div>
            <div><strong>UPI VPA ID:</strong> <span style="font-family: monospace; font-size: 12.5px; font-weight: 700;">9417417978@upi</span></div>
            <div><strong>Registered Works:</strong> Bathinda, Punjab 151001</div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="no-print" style="margin-top: 32px; display: flex; justify-content: flex-end; gap: 12px;">
          <button onclick="window.close()" style="padding: 10px 20px; background: #e2e8f0; color: #334155; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
            Close
          </button>
          <button onclick="window.print()" style="padding: 10px 24px; background: #0f172a; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px;">
            🖨️ Print / Save as PDF
          </button>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

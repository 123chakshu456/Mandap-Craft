// =========================================================
// Central Feature Flags Configuration
// Allows enabling / disabling platform modules easily
// =========================================================

/**
 * Flag to enable or disable the WhatsApp chat and inquiry features sitewide.
 * Set to `false` by default until you are ready to activate it.
 *
 * How to activate whenever you need it:
 * 1. Change this constant to `true`, OR
 * 2. Set `VITE_ENABLE_WHATSAPP=true` in your `.env` file.
 */
export const ENABLE_WHATSAPP_CHAT: boolean =
  typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ENABLE_WHATSAPP !== undefined
    ? import.meta.env.VITE_ENABLE_WHATSAPP === 'true'
    : false;

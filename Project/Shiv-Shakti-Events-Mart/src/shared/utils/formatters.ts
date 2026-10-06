/**
 * Utility formatters for product models and specifications.
 */

/**
 * Formats machine model variant labels to be concise.
 * Converts "20 Ltr Storage" / "20 ltr storage" to "20L", etc.
 */
export const formatModelLabel = (model?: string): string => {
  if (!model) return '';
  return model
    .replace(/\b(\d+)\s*(?:ltrs?|litres?|liters?)\s*storage\b/gi, '$1L')
    .replace(/\b(\d+)\s*(?:ltrs?|litres?|liters?)\b/gi, '$1L')
    .replace(/\s+/g, ' ')
    .trim();
};

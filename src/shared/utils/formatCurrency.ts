/**
 * Format number as Uzbek Som (UZS) currency
 *
 * @param amount - Amount in UZS
 * @param options - Formatting options
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1000000) // "1,000,000 so'm"
 * formatCurrency(1500000, { compact: true }) // "1.5M so'm"
 * formatCurrency(999) // "999 so'm"
 */
export function formatCurrency(
  amount: number,
  options: {
    compact?: boolean;
    showCurrency?: boolean;
  } = {}
): string {
  const { compact = false, showCurrency = true } = options;

  if (compact && amount >= 1000000) {
    // Format large numbers as millions (e.g., "1.5M")
    const millions = amount / 1000000;
    const formatted = millions.toFixed(millions >= 10 ? 0 : 1);
    return showCurrency ? `${formatted}M so'm` : `${formatted}M`;
  }

  if (compact && amount >= 1000) {
    // Format thousands with K (e.g., "150K")
    const thousands = amount / 1000;
    const formatted = thousands.toFixed(thousands >= 10 ? 0 : 1);
    return showCurrency ? `${formatted}K so'm` : `${formatted}K`;
  }

  // Format with thousand separators
  const formatted = new Intl.NumberFormat('uz-UZ').format(amount);
  return showCurrency ? `${formatted} so'm` : formatted;
}

/**
 * Format number as compact currency (always uses K/M notation)
 *
 * @param amount - Amount in UZS
 * @returns Compact formatted currency string
 *
 * @example
 * formatCompactCurrency(1500000) // "1.5M so'm"
 * formatCompactCurrency(150000) // "150K so'm"
 */
export function formatCompactCurrency(amount: number): string {
  return formatCurrency(amount, { compact: true });
}

/**
 * Parse currency string to number
 *
 * Removes currency symbols, spaces, and thousand separators
 *
 * @param value - Currency string
 * @returns Parsed number
 *
 * @example
 * parseCurrency("1,000,000 so'm") // 1000000
 * parseCurrency("1.5M") // 1500000
 * parseCurrency("150K") // 150000
 */
export function parseCurrency(value: string): number {
  // Remove currency symbol and spaces
  let cleaned = value.replace(/so'm|som|сўм/gi, '').trim();

  // Handle M (millions) and K (thousands) notation
  if (cleaned.includes('M') || cleaned.includes('М')) {
    const num = parseFloat(cleaned.replace(/[MМ]/gi, ''));
    return num * 1000000;
  }

  if (cleaned.includes('K') || cleaned.includes('К')) {
    const num = parseFloat(cleaned.replace(/[KК]/gi, ''));
    return num * 1000;
  }

  // Remove thousand separators and parse
  cleaned = cleaned.replace(/[,\s]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Format price range
 *
 * @param min - Minimum price
 * @param max - Maximum price
 * @param options - Formatting options
 * @returns Formatted price range string
 *
 * @example
 * formatPriceRange(100000, 500000) // "100,000 - 500,000 so'm"
 * formatPriceRange(1000000, 5000000, { compact: true }) // "1M - 5M so'm"
 */
export function formatPriceRange(
  min: number,
  max: number,
  options: { compact?: boolean } = {}
): string {
  const { compact = false } = options;
  const minFormatted = formatCurrency(min, { compact, showCurrency: false });
  const maxFormatted = formatCurrency(max, { compact, showCurrency: false });
  return `${minFormatted} - ${maxFormatted} so'm`;
}

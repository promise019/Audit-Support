/**
 * formatters.js — Utility functions for consistent data display across CFASS.
 * 
 * Centralizing formatting logic here ensures that currency, dates, and
 * percentages are rendered consistently across all audit modules.
 */

/**
 * Format a number as Nigerian Naira (₦).
 * @param {number} amount - The numeric value to format.
 * @param {boolean} compact - If true, abbreviates large numbers (₦12.5M).
 * @returns {string} Formatted currency string.
 */
export const formatNGN = (amount, compact = false) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₦0.00';
  
  if (compact) {
    if (Math.abs(amount) >= 1_000_000) {
      return `₦${(amount / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(amount) >= 1_000) {
      return `₦${(amount / 1_000).toFixed(0)}K`;
    }
  }

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format an ISO date string to a human-readable local date.
 * @param {string} dateStr - ISO date string or YYYY-MM-DD.
 * @returns {string} e.g. "15 Jan 2024"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

/**
 * Format a full ISO timestamp with date and time.
 * @param {string} isoStr - ISO timestamp string.
 * @returns {string} e.g. "15 Jan 2024, 14:32:05"
 */
export const formatTimestamp = (isoStr) => {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return isoStr;
  return d.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
};

/**
 * Format a percentage value with sign and 1 decimal place.
 * @param {number} pct - Percentage value (e.g. 12.5 for 12.5%).
 * @returns {string} e.g. "+12.5%" or "-8.3%"
 */
export const formatPercent = (pct) => {
  if (isNaN(pct)) return '0.0%';
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
};

/**
 * Generate a unique transaction/record ID with a given prefix.
 * @param {string} prefix - e.g. 'TXN', 'AUD', 'APR'
 * @returns {string} e.g. "TXN-2024-016"
 */
export const generateId = (prefix) => {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${year}-${rand}`;
};

/**
 * Get the current ISO timestamp string.
 * @returns {string} ISO 8601 timestamp.
 */
export const nowISO = () => new Date().toISOString();

/**
 * Truncate a string to a max length with ellipsis.
 * @param {string} str
 * @param {number} max
 * @returns {string}
 */
export const truncate = (str, max = 40) => {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
};

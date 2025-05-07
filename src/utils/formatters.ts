/**
 * Format a number as currency
 * @param amount The amount to format
 * @param includeSymbol Whether to include the currency symbol
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, includeSymbol = true): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: includeSymbol ? 'currency' : 'decimal',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return formatter.format(amount);
};

/**
 * Format a date
 * @param date Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format a date as a readable time period
 * @param startDate Start date
 * @param endDate End date
 * @returns Formatted date range
 */
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startStr = start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  
  const endStr = end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  return `${startStr} - ${endStr}`;
};

/**
 * Format a percentage
 * @param value The value to format as percentage
 * @param decimals Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format a number with thousand separators
 * @param value The number to format
 * @returns Formatted number string
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};
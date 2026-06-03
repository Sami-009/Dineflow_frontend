// formatCurrency.js

/**
 * Formats a number to Rs. currency format
 * @param {number|string} amount 
 * @returns {string} e.g. "Rs. 1,500"
 */
export const formatCurrency = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return 'Rs. 0';
  
  // Format as Pakistani Rupee style comma separation
  return `Rs. ${num.toLocaleString('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

export default formatCurrency;

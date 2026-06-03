// formatDate.js

/**
 * Formats a date string into a user-friendly format
 * @param {string} dateString 
 * @returns {string} e.g. "Jan 15, 2026, 10:30 AM"
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export default formatDate;

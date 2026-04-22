/**
 * Formatting utilities for dates, currency, and numbers.
 */

/** Format a date to a human-readable string */
export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/** Format a relative time (e.g., "2 days ago") */
export const formatRelativeTime = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return formatDate(dateStr);
};

/** Format currency */
export const formatCurrency = (amount) => {
  if (amount === 0) return 'Free';
  return `$${amount.toFixed(2)}`;
};

/** Format large numbers with k/m suffixes */
export const formatCount = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}m`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};

/** Render star rating as text */
export const formatRating = (rating) => {
  return rating ? `${rating.toFixed(1)} ★` : 'No ratings';
};

/**
 * App-wide constants — categories, sort options, and config values.
 */

export const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'finance', label: '💰 Finance' },
  { value: 'education', label: '📚 Education' },
  { value: 'hr', label: '👥 HR' },
  { value: 'marketing', label: '📊 Marketing' },
  { value: 'operations', label: '⚙️ Operations' },
  { value: 'personal', label: '🏠 Personal' },
  { value: 'other', label: '📁 Other' },
];

export const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest' },
  { value: '-downloadCount', label: 'Most Downloaded' },
  { value: '-rating', label: 'Highest Rated' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
];

export const AI_FREE_LIMIT = 20;

export const PRICE_RANGE = { min: 0, max: 49 };

export const PLATFORM_FEE_PERCENT = 20;

/**
 * Format a number with locale-specific separators
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Calculate total pages for pagination
 */
export const calculateTotalPages = (
  totalCount: number,
  perPage: number,
  maxPages: number = 100
): number => {
  return Math.min(Math.ceil(totalCount / perPage), maxPages);
};

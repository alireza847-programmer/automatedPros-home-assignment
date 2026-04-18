/**
 * Converts a Unix timestamp to a human-readable relative time string
 * @param timestamp - Unix timestamp in seconds
 * @returns Relative time string (e.g., "2h ago", "1d ago", "30m ago", "now")
 */
export const getRelativeTime = (timestamp: number): string => {
  const now = Date.now() / 1000;
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(diff / 3600);
  const days = Math.floor(diff / 86400);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'now';
};

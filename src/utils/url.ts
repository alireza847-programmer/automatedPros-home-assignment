/**
 * Extracts the domain name from a URL
 * @param url - The URL string to parse
 * @returns The domain name without 'www.' prefix, or empty string if invalid
 */
export const getDomainFromUrl = (url: string): string => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return '';
  }
};

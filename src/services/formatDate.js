export function FormatDate(isoString, locale = 'en-GB', options) {
  if (!isoString) return 'Unknown date';

  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    console.warn("Invalid date string:", isoString);
    return 'Invalid date';
  }

  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    ...(options || {})
  }).replace(',', '');
}

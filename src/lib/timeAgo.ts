export function timeAgo(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  function plural(n: number, one: string, few: string, many: string): string {
    const last = n % 10;
    const lastTwo = n % 100;
    if (lastTwo >= 11 && lastTwo <= 19) return many;
    if (last === 1) return one;
    if (last >= 2 && last <= 4) return few;
    return many;
  }

  if (diffMinutes < 1)  return 'щойно';
  if (diffMinutes < 60) return `${diffMinutes} ${plural(diffMinutes, 'хвилина', 'хвилини', 'хвилин')} тому`;
  if (diffHours < 24)   return `${diffHours} ${plural(diffHours, 'година', 'години', 'годин')} тому`;
  if (diffDays < 7)     return `${diffDays} ${plural(diffDays, 'день', 'дні', 'днів')} тому`;
  if (diffWeeks < 5)    return `${diffWeeks} ${plural(diffWeeks, 'тиждень', 'тижні', 'тижнів')} тому`;
  if (diffMonths < 12)  return `${diffMonths} ${plural(diffMonths, 'місяць', 'місяці', 'місяців')} тому`;
  return `${diffYears} ${plural(diffYears, 'рік', 'роки', 'років')} тому`;
}

// Date and time formatting on top of Intl, replacing moment.js. `dateFormat`
// still accepts the moment-style tokens v1 documented (e.g. "dddd, D. MMMM").

const TOKENS = /\[([^\]]*)]|YYYY|YY|MMMM|MMM|MM|M|Do|DD|D|dddd|ddd|dd|HH|H|hh|h|mm|ss|A|a/g;

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function part(date: Date, locale: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

function ordinal(day: number, locale: string) {
  if (locale.startsWith('en')) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = day % 100;
    return day + (s[(v - 20) % 10] || s[v] || s[0]);
  }
  return `${day}.`;
}

export function formatDate(date: Date, locale: string, format?: string): string {
  if (!format) {
    return part(date, locale, { weekday: 'long', day: 'numeric', month: 'long' });
  }
  return format.replace(TOKENS, (token, literal) => {
    if (literal !== undefined) return literal;
    switch (token) {
      case 'YYYY': return String(date.getFullYear());
      case 'YY': return String(date.getFullYear()).slice(-2);
      case 'MMMM': return part(date, locale, { month: 'long' });
      case 'MMM': return part(date, locale, { month: 'short' });
      case 'MM': return pad(date.getMonth() + 1);
      case 'M': return String(date.getMonth() + 1);
      case 'Do': return ordinal(date.getDate(), locale);
      case 'DD': return pad(date.getDate());
      case 'D': return String(date.getDate());
      case 'dddd': return part(date, locale, { weekday: 'long' });
      case 'ddd': return part(date, locale, { weekday: 'short' });
      case 'dd': return part(date, locale, { weekday: 'narrow' });
      case 'HH': return pad(date.getHours());
      case 'H': return String(date.getHours());
      case 'hh': return pad(date.getHours() % 12 || 12);
      case 'h': return String(date.getHours() % 12 || 12);
      case 'mm': return pad(date.getMinutes());
      case 'ss': return pad(date.getSeconds());
      case 'A': return date.getHours() < 12 ? 'AM' : 'PM';
      case 'a': return date.getHours() < 12 ? 'am' : 'pm';
      default: return token;
    }
  });
}

export function formatClock(date: Date, opts: { seconds: boolean; hour12: boolean; period: boolean }) {
  const hours = opts.hour12 ? date.getHours() % 12 || 12 : date.getHours();
  let time = `${pad(hours)}:${pad(date.getMinutes())}`;
  if (opts.seconds) time += `:${pad(date.getSeconds())}`;
  const suffix = opts.hour12 && opts.period ? (date.getHours() < 12 ? 'am' : 'pm') : '';
  return { time, suffix };
}

export function formatRelative(from: Date, locale: string): string {
  const diff = (from.getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const abs = Math.abs(diff);
  if (abs < 60) return rtf.format(Math.round(diff), 'second');
  if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
  return rtf.format(Math.round(diff / 86400), 'day');
}

export function formatNumber(value: number, locale: string, digits = 1) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: digits }).format(value);
}

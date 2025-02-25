export function isValidCF (cf: string): boolean {
  if (!cf || cf.length !== 16) return false;
  const cfRegex = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/;
  return cfRegex.test(cf);
}

export function isValidEmail (email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function isValidPassword (password: string): boolean {
  if (!password) return false;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/;
  return passwordRegex.test(password);
}

export function isToday (date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

export function isTodayStr (dateStr: string): boolean {
  const date = new Date(dateStr);
  return isToday(date);
}

export function todayStr (): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function dateStr (days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

export function search(source: any[], searchTerm: string): any[] {
  if (!searchTerm) return source;
  const term = searchTerm.toLowerCase();
  return source.filter((item) => {
    return Object.values(item).some((value) => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(term);
      }
      return false;
    });
  });
}
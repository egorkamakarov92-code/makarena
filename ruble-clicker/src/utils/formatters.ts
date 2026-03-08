export function formatMoney(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  if (abs >= 1e12) return sign + (abs / 1e12).toFixed(1) + ' трлн';
  if (abs >= 1e9) return sign + (abs / 1e9).toFixed(1) + ' млрд';
  if (abs >= 1e6) return sign + (abs / 1e6).toFixed(1) + ' млн';
  if (abs >= 1e4) return sign + Math.floor(abs).toLocaleString('ru-RU');
  return sign + Math.floor(abs).toLocaleString('ru-RU');
}

export function formatPrice(amount: number): string {
  return formatMoney(amount) + ' ₽';
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return sign + value.toFixed(2) + '%';
}

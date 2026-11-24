export function formatAud(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatAudCompact(amount: number): string {
  if (Math.abs(amount) >= 1000) {
    const k = amount / 1000;
    const formatted = Number.isInteger(k) ? `${k}k` : `${k.toFixed(1)}k`;
    return amount < 0 ? `-$${formatted.replace('-', '')}` : `$${formatted}`;
  }
  return formatAud(amount);
}

export function formatSignedAud(amount: number): string {
  const prefix = amount > 0 ? '+' : amount < 0 ? '-' : '';
  return `${prefix}${formatAud(Math.abs(amount))}`;
}

export function formatSignedPct(value: number): string {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1)}%`;
}

/* Money arrives from view contracts as integer minor units (cents). */

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usdCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export function formatMoneyMinor(minor: number): string {
  const dollars = minor / 100;
  return Number.isInteger(dollars) ? usd.format(dollars) : usdCents.format(dollars);
}

/** "$126.4K" style compact figure for stat cards. */
export function formatMoneyMinorCompact(minor: number): string {
  const dollars = minor / 100;
  if (Math.abs(dollars) >= 1000) {
    return `$${(dollars / 1000).toFixed(1)}K`;
  }
  return usd.format(dollars);
}

export function formatInt(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

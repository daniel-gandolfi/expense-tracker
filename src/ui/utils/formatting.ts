export function formatMoneyLocal(amount: number) {
  return new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

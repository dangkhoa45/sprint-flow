export function formatMoney(amount: number): string {
  const roundedAmount = Math.round(amount / 1000) * 1000;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(roundedAmount);
}

/**
 * Склонение существительного по числу (русский).
 * variants: [один, два-четыре, пять+]
 * Пример: pluralizeRu(1, ['товар', 'товара', 'товаров']) → 'товар'
 */
export function pluralizeRu(
  count: number,
  variants: [string, string, string],
): string {
  const abs = Math.abs(count) % 100;
  const lastDigit = abs % 10;
  if (abs > 10 && abs < 20) return variants[2];
  if (lastDigit > 1 && lastDigit < 5) return variants[1];
  if (lastDigit === 1) return variants[0];
  return variants[2];
}

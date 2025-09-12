export default function calculatePercentageChange(
  current: number,
  previous: number | undefined
): number | null {
  if (previous === undefined) return null;
  if (previous === 0) return 100;
  return ((current - previous) / previous) * 100;
}

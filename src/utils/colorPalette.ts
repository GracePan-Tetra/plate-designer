export const COLOR_PALETTE: string[] = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
  '#f97316',
  '#6366f1',
  '#14b8a6',
  '#a855f7',
  '#e11d48',
  '#0ea5e9',
  '#22c55e',
  '#eab308',
];

export function getConditionColor(index: number): string {
  return COLOR_PALETTE[index % COLOR_PALETTE.length] ?? '#cccccc';
}

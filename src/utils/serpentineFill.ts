import type { WellId } from '../types';

const ROWS = 8;
const COLS = 12;
const ROW_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

/** Col 1 top→bottom, Col 2 bottom→top, alternating */
export function getVerticalSerpentineOrder(): WellId[] {
  const wells: WellId[] = [];
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      const row = c % 2 === 0 ? r : ROWS - 1 - r;
      wells.push(`${ROW_LABELS[row]}${c + 1}`);
    }
  }
  return wells;
}

/** Row A left→right, Row B right→left, alternating */
export function getHorizontalSerpentineOrder(): WellId[] {
  const wells: WellId[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const col = r % 2 === 0 ? c : COLS - 1 - c;
      wells.push(`${ROW_LABELS[r]}${col + 1}`);
    }
  }
  return wells;
}

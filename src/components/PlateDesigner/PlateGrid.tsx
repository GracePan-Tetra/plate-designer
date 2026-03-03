import { Tooltip } from '@mui/material';
import type { PlateMapping } from '../../types';

interface PlateGridProps {
  mapping: PlateMapping | null;
}

const ROW_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COL_COUNT = 12;

const CELL_SIZE = 52;
const RADIUS = 20;
const LABEL_OFFSET = 40;
const TOP_OFFSET = 40;

const SVG_WIDTH = LABEL_OFFSET + COL_COUNT * CELL_SIZE + 16;
const SVG_HEIGHT = TOP_OFFSET + ROW_LABELS.length * CELL_SIZE + 16;

export default function PlateGrid({ mapping }: PlateGridProps) {
  return (
    <svg
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      width="100%"
      style={{ display: 'block' }}
      aria-label="96-well plate"
    >
      {/* Background */}
      <rect
        x={LABEL_OFFSET - 8}
        y={TOP_OFFSET - 8}
        width={COL_COUNT * CELL_SIZE + 16}
        height={ROW_LABELS.length * CELL_SIZE + 16}
        rx={6}
        fill="#e5e7eb"
      />

      {/* Column labels */}
      {Array.from({ length: COL_COUNT }, (_, c) => (
        <text
          key={`col-${c}`}
          x={LABEL_OFFSET + c * CELL_SIZE + CELL_SIZE / 2}
          y={TOP_OFFSET - 14}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={13}
          fill="#374151"
          fontWeight={600}
        >
          {c + 1}
        </text>
      ))}

      {/* Row labels */}
      {ROW_LABELS.map((row, r) => (
        <text
          key={`row-${r}`}
          x={LABEL_OFFSET - 14}
          y={TOP_OFFSET + r * CELL_SIZE + CELL_SIZE / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={13}
          fill="#374151"
          fontWeight={600}
        >
          {row}
        </text>
      ))}

      {/* Wells */}
      {ROW_LABELS.map((row, r) =>
        Array.from({ length: COL_COUNT }, (_, c) => {
          const wellId = `${row}${c + 1}`;
          const assignment = mapping?.assignments[wellId];
          const cx = LABEL_OFFSET + c * CELL_SIZE + CELL_SIZE / 2;
          const cy = TOP_OFFSET + r * CELL_SIZE + CELL_SIZE / 2;
          const fill = assignment?.color ?? '#ffffff';
          const tooltipTitle = assignment
            ? `${wellId} – ${assignment.conditionName} (rep ${assignment.replicateIndex})`
            : wellId;

          return (
            <Tooltip key={wellId} title={tooltipTitle} arrow placement="top">
              <circle
                cx={cx}
                cy={cy}
                r={RADIUS}
                fill={fill}
                stroke="#c8cdd4"
                strokeWidth={1.5}
                style={{ cursor: assignment ? 'pointer' : 'default' }}
              />
            </Tooltip>
          );
        })
      )}
    </svg>
  );
}

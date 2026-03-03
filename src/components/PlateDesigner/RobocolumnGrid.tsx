import { Tooltip } from '@mui/material';
import type { PlateMapping } from '../../types';

interface RobocolumnGridProps {
  mapping: PlateMapping | null;
}

const COL_COUNT = 8;
const COL_WIDTH = 70;
const COL_HEIGHT = 280;
const COL_GAP = 22;
const LABEL_H = 32;
const PAD_X = 20;
const PAD_B = 20;

const SVG_WIDTH = PAD_X * 2 + COL_COUNT * COL_WIDTH + (COL_COUNT - 1) * COL_GAP;
const SVG_HEIGHT = LABEL_H + COL_HEIGHT + PAD_B;

export default function RobocolumnGrid({ mapping }: RobocolumnGridProps) {
  return (
    <svg
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      width="100%"
      style={{ display: 'block' }}
      aria-label="Robocolumn grid"
    >
      {Array.from({ length: COL_COUNT }, (_, c) => {
        const x = PAD_X + c * (COL_WIDTH + COL_GAP);
        const colId = `col-${c + 1}`;
        const assignment = mapping?.assignments[colId];
        const fill = assignment?.color ?? '#ffffff';
        const tooltipTitle = assignment
          ? `${c + 1} – ${assignment.conditionName} (rep ${assignment.replicateIndex})`
          : `Column ${c + 1}`;

        return (
          <g key={c}>
            <text
              x={x + COL_WIDTH / 2}
              y={LABEL_H - 12}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={13}
              fill="#374151"
              fontWeight={600}
            >
              {c + 1}
            </text>
            <Tooltip title={tooltipTitle} arrow placement="top">
              <rect
                x={x}
                y={LABEL_H}
                width={COL_WIDTH}
                height={COL_HEIGHT}
                rx={2}
                ry={2}
                fill={fill}
                stroke="#c8cdd4"
                strokeWidth={1.5}
                style={{ cursor: assignment ? 'pointer' : 'default' }}
              />
            </Tooltip>
          </g>
        );
      })}
    </svg>
  );
}

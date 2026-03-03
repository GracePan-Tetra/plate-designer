import { Tooltip } from '@mui/material';
import type { PlateMapping } from '../../types';

interface AktaGridProps {
  mapping: PlateMapping | null;
}

const SVG_WIDTH = 760;
const PAD_X = 20;
const LABEL_H = 32;
const RECT_H = 90;
const PAD_B = 20;
const SVG_HEIGHT = LABEL_H + RECT_H + PAD_B;
const RECT_X = PAD_X;
const RECT_W = SVG_WIDTH - PAD_X * 2;

export default function AktaGrid({ mapping }: AktaGridProps) {
  const totalSlots = mapping?.totalWellsUsed ?? 0;

  return (
    <svg
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      width="100%"
      style={{ display: 'block' }}
      aria-label="AKTA tray"
    >
      {/* Lane label */}
      <text
        x={SVG_WIDTH / 2}
        y={LABEL_H - 12}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={13}
        fill="#374151"
        fontWeight={600}
      >
        1
      </text>

      {totalSlots === 0 ? (
        /* Empty state: single white rectangle */
        <rect
          x={RECT_X}
          y={LABEL_H}
          width={RECT_W}
          height={RECT_H}
          rx={2}
          ry={2}
          fill="#ffffff"
          stroke="#c8cdd4"
          strokeWidth={1.5}
        />
      ) : (
        /* Filled state: divide into colored sections */
        Array.from({ length: totalSlots }, (_, i) => {
          const slotId = `akta-${i + 1}`;
          const assignment = mapping?.assignments[slotId];
          const fill = assignment?.color ?? '#ffffff';
          const sectionW = RECT_W / totalSlots;
          const x = RECT_X + i * sectionW;
          const tooltipTitle = assignment
            ? `${i + 1} – ${assignment.conditionName} (rep ${assignment.replicateIndex})`
            : `Slot ${i + 1}`;

          return (
            <Tooltip key={slotId} title={tooltipTitle} arrow placement="top">
              <rect
                x={x}
                y={LABEL_H}
                width={sectionW}
                height={RECT_H}
                fill={fill}
                stroke="#c8cdd4"
                strokeWidth={0.75}
                style={{ cursor: assignment ? 'pointer' : 'default' }}
              />
            </Tooltip>
          );
        })
      )}

      {/* Outer border always visible */}
      {totalSlots > 0 && (
        <rect
          x={RECT_X}
          y={LABEL_H}
          width={RECT_W}
          height={RECT_H}
          rx={2}
          ry={2}
          fill="none"
          stroke="#c8cdd4"
          strokeWidth={1.5}
          style={{ pointerEvents: 'none' }}
        />
      )}
    </svg>
  );
}

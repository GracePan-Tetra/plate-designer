import { useState } from 'react';
import { Tooltip } from '@mui/material';
import type { PlateMapping } from '../../types';

interface PlateGridProps {
  mapping: PlateMapping | null;
  onWellDrop?: (wellId: string, conditionId: string) => void;
}

const ROW_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COL_COUNT = 12;

const CELL_SIZE = 52;
const RADIUS = 20;
const LABEL_OFFSET = 40;
const TOP_OFFSET = 40;

const SVG_WIDTH = LABEL_OFFSET + COL_COUNT * CELL_SIZE + 16;
const SVG_HEIGHT = TOP_OFFSET + ROW_LABELS.length * CELL_SIZE + 16;

export default function PlateGrid({ mapping, onWellDrop }: PlateGridProps) {
  const [hoveredWell, setHoveredWell] = useState<string | null>(null);

  return (
    <svg
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      width="100%"
      style={{ display: 'block' }}
      aria-label="96-well plate"
    >
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
          const isHovered = hoveredWell === wellId;
          const tooltipTitle = assignment
            ? `${wellId} – ${assignment.conditionName} (rep ${assignment.replicateIndex})`
            : wellId;

          return (
            <g
              key={wellId}
              onDragOver={(e) => { e.preventDefault(); setHoveredWell(wellId); }}
              onDragLeave={() => setHoveredWell(null)}
              onDrop={(e) => {
                e.preventDefault();
                const conditionId = e.dataTransfer.getData('conditionId');
                if (conditionId) onWellDrop?.(wellId, conditionId);
                setHoveredWell(null);
              }}
            >
              <Tooltip title={tooltipTitle} arrow placement="top">
                <circle
                  cx={cx}
                  cy={cy}
                  r={RADIUS}
                  fill={fill}
                  stroke={isHovered ? '#3b82f6' : '#c8cdd4'}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  style={{ cursor: 'copy' }}
                />
              </Tooltip>
            </g>
          );
        })
      )}
    </svg>
  );
}

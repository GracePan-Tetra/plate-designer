import { useCallback } from 'react';
import type { MappingConfig, PlateMapping, WellAssignment } from '../types';
import { getVerticalSerpentineOrder, getHorizontalSerpentineOrder } from '../utils/serpentineFill';
import { getConditionColor } from '../utils/colorPalette';

const TOTAL_WELLS = 96;

export function computeMapping(config: MappingConfig): PlateMapping {
  const { selectedConditions, replicatesPerCond, fillStrategy, primarySort, secondarySort } = config;

  if (selectedConditions.length === 0) {
    return {
      assignments: {},
      conditionColors: {},
      conditionCounts: {},
      totalWellsUsed: 0,
      error: null,
    };
  }

  const totalNeeded = selectedConditions.length * replicatesPerCond;
  if (totalNeeded > TOTAL_WELLS) {
    return {
      assignments: {},
      conditionColors: {},
      conditionCounts: {},
      totalWellsUsed: 0,
      error: `Total wells needed (${totalNeeded}) exceeds 96. Reduce conditions or replicates.`,
    };
  }

  // Sort conditions if requested
  let sorted = [...selectedConditions];
  const sortKey = (field: string) => {
    if (field === 'factor1') return (c: typeof sorted[0]) => c.factor1;
    if (field === 'factor2') return (c: typeof sorted[0]) => c.factor2;
    if (field === 'factor3') return (c: typeof sorted[0]) => c.factor3;
    return null;
  };

  const pk = primarySort !== 'none' ? sortKey(primarySort) : null;
  const sk = secondarySort !== 'none' ? sortKey(secondarySort) : null;

  if (pk || sk) {
    sorted.sort((a, b) => {
      if (pk) {
        const va = pk(a);
        const vb = pk(b);
        if (va < vb) return -1;
        if (va > vb) return 1;
      }
      if (sk) {
        const va = sk(a);
        const vb = sk(b);
        if (va < vb) return -1;
        if (va > vb) return 1;
      }
      return 0;
    });
  }

  const wellOrder =
    fillStrategy === 'vertical-snake'
      ? getVerticalSerpentineOrder()
      : getHorizontalSerpentineOrder();

  const assignments: Record<string, WellAssignment> = {};
  const conditionColors: Record<string, string> = {};
  const conditionCounts: Record<string, number> = {};

  sorted.forEach((condition, condIndex) => {
    const color = getConditionColor(condIndex);
    conditionColors[condition.id] = color;
    conditionCounts[condition.id] = replicatesPerCond;

    for (let rep = 0; rep < replicatesPerCond; rep++) {
      const wellIndex = condIndex * replicatesPerCond + rep;
      const wellId = wellOrder[wellIndex];
      if (wellId) {
        assignments[wellId] = {
          wellId,
          conditionId: condition.id,
          conditionName: condition.name,
          color,
          replicateIndex: rep + 1,
        };
      }
    }
  });

  return {
    assignments,
    conditionColors,
    conditionCounts,
    totalWellsUsed: totalNeeded,
    error: null,
  };
}

export function usePlateMapping() {
  return useCallback(computeMapping, []);
}

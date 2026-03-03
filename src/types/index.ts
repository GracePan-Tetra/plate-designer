export interface Condition {
  id: string;
  name: string;
  factor1: string;
  factor2: string;
  factor3: string;
}

export interface Modality {
  id: string;
  name: string;
  conditions: Condition[];
}

export type WellId = string; // e.g. "A1", "H12"
export type FillStrategy = 'vertical-snake' | 'horizontal-snake';
export type SortField = 'none' | 'factor1' | 'factor2' | 'factor3';

export interface WellAssignment {
  wellId: WellId;
  conditionId: string;
  conditionName: string;
  color: string;
  replicateIndex: number;
}

export interface MappingConfig {
  selectedModality: Modality | null;
  selectedConditions: Condition[];
  replicatesPerCond: number;
  fillStrategy: FillStrategy;
  primarySort: SortField;
  secondarySort: SortField;
}

export interface PlateMapping {
  assignments: Record<WellId, WellAssignment>;
  conditionColors: Record<string, string>;
  conditionCounts: Record<string, number>;
  totalWellsUsed: number;
  error: string | null;
}

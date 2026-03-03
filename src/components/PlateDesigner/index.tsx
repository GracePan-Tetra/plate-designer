import { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import type { Condition, FillStrategy, MappingConfig, Modality, PlateMapping, SortField } from '../../types';
import { ALL_CONDITIONS } from '../../data/mockData';
import { computeMapping } from '../../hooks/usePlateMapping';
import ConfigurationPanel from './ConfigurationPanel';
import PlateGrid from './PlateGrid';
import LegendTable from './LegendTable';

const DEFAULT_CONFIG: MappingConfig = {
  selectedModality: null,
  selectedConditions: [],
  replicatesPerCond: 1,
  fillStrategy: 'vertical-snake',
  primarySort: 'none',
  secondarySort: 'none',
};

export default function PlateDesigner() {
  const [config, setConfig] = useState<MappingConfig>(DEFAULT_CONFIG);
  const [mapping, setMapping] = useState<PlateMapping | null>(null);
  const [mappingError, setMappingError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const handleModalityChange = (modality: Modality | null) => {
    setConfig((prev) => ({ ...prev, selectedModality: modality }));
  };

  const handleConditionToggle = (condition: Condition) => {
    setConfig((prev) => {
      const already = prev.selectedConditions.some((c) => c.id === condition.id);
      return {
        ...prev,
        selectedConditions: already
          ? prev.selectedConditions.filter((c) => c.id !== condition.id)
          : [...prev.selectedConditions, condition],
      };
    });
  };

  const handleSelectAll = (checked: boolean) => {
    setConfig((prev) => ({
      ...prev,
      selectedConditions: checked ? [...ALL_CONDITIONS] : [],
    }));
  };

  const handleRemoveCondition = (conditionId: string) => {
    setConfig((prev) => ({
      ...prev,
      selectedConditions: prev.selectedConditions.filter((c) => c.id !== conditionId),
    }));
    setMapping((prev) => {
      if (!prev) return prev;
      const assignments = Object.fromEntries(
        Object.entries(prev.assignments).filter(([, v]) => v.conditionId !== conditionId)
      );
      return { ...prev, assignments };
    });
  };

  const handleApply = () => {
    const result = computeMapping(config);
    if (result.error) {
      setMappingError(result.error);
      setMapping(null);
    } else {
      setMappingError(null);
      setMapping(result);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', p: 3 }}>
      {/* Breadcrumb */}
      <Typography variant="body2" color="text.secondary" mb={0.5}>
        Project X / All Experiment /
      </Typography>

      {/* Page title */}
      <Typography variant="h4" fontWeight={700} mb={2.5}>
        Experiment Name
      </Typography>

      {/* Main two-column layout */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', height: 'calc(100vh - 120px)' }}>
        {/* Left: Configuration Panel */}
        <ConfigurationPanel
          config={config}
          onModalityChange={handleModalityChange}
          onConditionToggle={handleConditionToggle}
          onSelectAll={handleSelectAll}
          onReplicatesChange={(n) => setConfig((p) => ({ ...p, replicatesPerCond: n }))}
          onFillStrategyChange={(s: FillStrategy) => setConfig((p) => ({ ...p, fillStrategy: s }))}
          onPrimarySortChange={(s: SortField) => setConfig((p) => ({ ...p, primarySort: s }))}
          onSecondarySortChange={(s: SortField) => setConfig((p) => ({ ...p, secondarySort: s }))}
          onApply={handleApply}
          error={mappingError}
          page={page}
          onPageChange={setPage}
        />

        {/* Right: Plate + Legend */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, overflowY: 'auto', height: '100%' }}>
          {/* Plate card */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} mb={1.5}>
              Condition Mapping with Plate
            </Typography>
            <PlateGrid mapping={mapping} />
          </Paper>

          {/* Selected Conditions / Legend */}
          <LegendTable
            mapping={mapping}
            selectedConditions={config.selectedConditions}
            onRemoveCondition={handleRemoveCondition}
          />
        </Box>
      </Box>
    </Box>
  );
}

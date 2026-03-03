import { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import type { Condition, FillStrategy, MappingConfig, Modality, PlateMapping, SortField } from '../../types';
import { ALL_CONDITIONS } from '../../data/mockData';
import { computeMapping } from '../../hooks/usePlateMapping';
import ConfigurationPanel from './ConfigurationPanel';
import PlateGrid from './PlateGrid';
import RobocolumnGrid from './RobocolumnGrid';
import AktaGrid from './AktaGrid';
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
  const [isExpanded, setIsExpanded] = useState(true);

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

  const handleConditionSelect = (condition: Condition) => {
    setConfig((prev) => ({ ...prev, selectedConditions: [condition] }));
    setMapping(null);
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
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', p: { xs: 1.5, sm: 2, md: 3 } }}>
      {/* Breadcrumb */}
      <Typography variant="body2" color="text.secondary" mb={0.5}>
        Project X / All Experiment /
      </Typography>

      {/* Page title */}
      <Typography
        variant="h4"
        fontWeight={700}
        mb={{ xs: 1.5, md: 2.5 }}
        sx={{ fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2.125rem' } }}
      >
        Experiment Name
      </Typography>

      {/* Main layout: side-by-side on md+, stacked on mobile */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: { xs: 'stretch', md: 'flex-start' },
          height: { xs: 'auto', md: 'calc(100vh - 120px)' },
        }}
      >
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
          isExpanded={isExpanded}
          onExpandToggle={() => setIsExpanded((p) => !p)}
          onConditionSelect={handleConditionSelect}
        />

        {/* Right: Plate + Legend */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minWidth: 0,
            overflowY: { xs: 'visible', md: 'auto' },
            height: { xs: 'auto', md: '100%' },
          }}
        >
          {/* Plate card */}
          <Paper variant="outlined" sx={{ p: { xs: 1.5, md: 2 } }}>
            <Typography variant="h6" fontWeight={600} mb={1.5}>
              Condition Mapping
            </Typography>
            {config.selectedModality?.id === 'robocolumn'
              ? <RobocolumnGrid mapping={mapping} />
              : config.selectedModality?.id === 'akta'
              ? <AktaGrid mapping={mapping} />
              : <PlateGrid mapping={mapping} />
            }
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

import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import type { Condition, FillStrategy, MappingConfig, Modality, SortField } from '../../types';
import { ALL_CONDITIONS, MODALITIES } from '../../data/mockData';

const ROWS_PER_PAGE = 10;

interface ConfigurationPanelProps {
  config: MappingConfig;
  onModalityChange: (modality: Modality | null) => void;
  onConditionToggle: (condition: Condition) => void;
  onSelectAll: (checked: boolean) => void;
  onReplicatesChange: (n: number) => void;
  onFillStrategyChange: (s: FillStrategy) => void;
  onPrimarySortChange: (s: SortField) => void;
  onSecondarySortChange: (s: SortField) => void;
  onApply: () => void;
  error: string | null;
  page: number;
  onPageChange: (p: number) => void;
  isExpanded: boolean;
  onExpandToggle: () => void;
  onConditionSelect: (condition: Condition) => void;
}

export default function ConfigurationPanel({
  config,
  onModalityChange,
  onConditionToggle,
  onSelectAll,
  onReplicatesChange,
  onFillStrategyChange,
  onPrimarySortChange,
  onSecondarySortChange,
  onApply,
  error,
  page,
  onPageChange,
  isExpanded,
  onExpandToggle,
  onConditionSelect,
}: ConfigurationPanelProps) {
  const { selectedModality, selectedConditions, replicatesPerCond, fillStrategy, primarySort, secondarySort } = config;
  const isAkta = selectedModality?.id === 'akta';

  const allConditions = ALL_CONDITIONS;
  const totalPages = Math.max(1, Math.ceil(allConditions.length / ROWS_PER_PAGE));
  const pageConditions = allConditions.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const allChecked = allConditions.length > 0 && allConditions.every((c) => selectedConditions.some((s) => s.id === c.id));
  const someChecked = selectedConditions.some((s) => allConditions.some((c) => c.id === s.id));

  return (
    <Paper
      variant="outlined"
      sx={{
        width: isExpanded
          ? { xs: '100%', md: '50vw' }
          : { xs: '100%', md: 400 },
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        height: { xs: 'auto', md: '100%' },
        minHeight: { xs: 480, md: 'unset' },
        overflow: 'hidden',
      }}
    >
      <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography sx={{ fontSize: 12, fontWeight: 400 }}>
          Configuration
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Modality selector */}
        <Box>
          <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
            Define Scale
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Select Modality</InputLabel>
            <Select
              label="Select Modality"
              value={selectedModality?.id ?? ''}
              onChange={(e) => {
                const found = MODALITIES.find((m) => m.id === e.target.value) ?? null;
                onModalityChange(found);
              }}
            >
              {MODALITIES.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Conditions table */}
        <Box>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Typography variant="subtitle1" fontWeight={700}>
              Select Conditions
            </Typography>
            <Box display="flex" gap={0.5}>
              <Button size="small" startIcon={<FilterListIcon />} sx={{ textTransform: 'none', minWidth: 0, fontSize: 12 }}>
                Filter
              </Button>
              <Button
                size="small"
                startIcon={isExpanded ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
                onClick={onExpandToggle}
                sx={{ textTransform: 'none', minWidth: 0, fontSize: 12 }}
              >
                {isExpanded ? 'Collapse' : 'Expand'}
              </Button>
            </Box>
          </Box>

          <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" sx={{ bgcolor: 'grey.200' }}>
                    {!isAkta && (
                      <Checkbox
                        size="small"
                        checked={allChecked}
                        indeterminate={someChecked && !allChecked}
                        onChange={(e) => onSelectAll(e.target.checked)}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ bgcolor: 'grey.200', fontWeight: 600, fontSize: 12 }}>Condition ID</TableCell>
                  <TableCell sx={{ bgcolor: 'grey.200', fontWeight: 600, fontSize: 12 }}>Factor 1</TableCell>
                  <TableCell sx={{ bgcolor: 'grey.200', fontWeight: 600, fontSize: 12 }}>Factor 2</TableCell>
                  <TableCell sx={{ bgcolor: 'grey.200', fontWeight: 600, fontSize: 12 }}>Factor 3</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pageConditions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ color: 'text.secondary', py: 3 }}>
                      No conditions
                    </TableCell>
                  </TableRow>
                ) : (
                  pageConditions.map((cond) => {
                    const checked = selectedConditions.some((s) => s.id === cond.id);
                    return (
                      <TableRow
                        key={cond.id}
                        hover
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('conditionId', cond.id);
                          e.dataTransfer.effectAllowed = 'copy';
                        }}
                        onClick={() => isAkta ? onConditionSelect(cond) : onConditionToggle(cond)}
                        sx={{ cursor: 'grab' }}
                      >
                        <TableCell padding="checkbox">
                          {isAkta ? (
                            <Radio
                              size="small"
                              checked={checked}
                              onChange={() => onConditionSelect(cond)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <Checkbox
                              size="small"
                              checked={checked}
                              onChange={() => onConditionToggle(cond)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                        </TableCell>
                        <TableCell sx={{ fontSize: 12 }}>{cond.name}</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>{cond.factor1}</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>{cond.factor2}</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>{cond.factor3}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Button
                  size="small"
                  disabled={page <= 1}
                  onClick={() => onPageChange(page - 1)}
                  sx={{ minWidth: 28, p: 0.5, fontSize: 12 }}
                >
                  {'<'}
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    size="small"
                    variant={p === page ? 'contained' : 'text'}
                    onClick={() => onPageChange(p)}
                    sx={{ minWidth: 28, p: 0.5, fontSize: 12 }}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  size="small"
                  disabled={page >= totalPages}
                  onClick={() => onPageChange(page + 1)}
                  sx={{ minWidth: 28, p: 0.5, fontSize: 12 }}
                >
                  {'>'}
                </Button>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {ROWS_PER_PAGE} / page
              </Typography>
            </Box>
          )}
        </Box>

        {/* Mapping Settings */}
        <Box>
          <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
            Mapping Setting
          </Typography>

          <Box display="flex" flexDirection="column" gap={1.5}>
            <TextField
              label="Replicates per Condition"
              type="number"
              size="small"
              fullWidth
              value={replicatesPerCond}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v) && v >= 1) onReplicatesChange(v);
              }}
              inputProps={{ min: 1, max: 96 }}
            />

            <FormControl fullWidth size="small">
              <InputLabel>Fill Strategy</InputLabel>
              <Select
                label="Fill Strategy"
                value={fillStrategy}
                onChange={(e) => onFillStrategyChange(e.target.value as FillStrategy)}
              >
                <MenuItem value="vertical-snake">Snake (Vertical)</MenuItem>
                <MenuItem value="horizontal-snake">Snake (Horizontal)</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Primary Sort</InputLabel>
              <Select
                label="Primary Sort"
                value={primarySort}
                onChange={(e) => onPrimarySortChange(e.target.value as SortField)}
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="factor1">Factor 1</MenuItem>
                <MenuItem value="factor2">Factor 2</MenuItem>
                <MenuItem value="factor3">Factor 3</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Secondary Sort</InputLabel>
              <Select
                label="Secondary Sort"
                value={secondarySort}
                onChange={(e) => onSecondarySortChange(e.target.value as SortField)}
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="factor1">Factor 1</MenuItem>
                <MenuItem value="factor2">Factor 2</MenuItem>
                <MenuItem value="factor3">Factor 3</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ fontSize: 12 }}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Apply button pinned at bottom */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button
          variant="contained"
          fullWidth
          onClick={onApply}
          disabled={selectedConditions.length === 0}
          sx={{ bgcolor: '#1e3a5f', '&:hover': { bgcolor: '#16325c' }, fontWeight: 700, letterSpacing: 1 }}
        >
          APPLY MAPPING
        </Button>
      </Box>
    </Paper>
  );
}

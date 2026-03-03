import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Condition, PlateMapping } from '../../types';

interface LegendTableProps {
  mapping: PlateMapping | null;
  selectedConditions: Condition[];
  onRemoveCondition: (conditionId: string) => void;
}

export default function LegendTable({
  mapping,
  selectedConditions,
  onRemoveCondition,
}: LegendTableProps) {
  const conditionOrder = selectedConditions.filter((c) =>
    mapping ? c.id in mapping.conditionColors : true
  );

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight={600} mb={1.5}>
        Selected Conditions
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ '& th': { bgcolor: 'grey.700', color: 'white', fontWeight: 600, py: 0.75 } }}>
              <TableCell>Assigned Color</TableCell>
              <TableCell>Condition ID</TableCell>
              <TableCell>Factor 1</TableCell>
              <TableCell>Factor 2</TableCell>
              <TableCell>Factor 3</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {conditionOrder.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ color: 'text.secondary', py: 3 }}>
                  No conditions selected yet
                </TableCell>
              </TableRow>
            ) : (
              conditionOrder.map((cond) => {
                const color = mapping?.conditionColors[cond.id];
                return (
                  <TableRow
                    key={cond.id}
                    sx={{ '&:nth-of-type(odd)': { bgcolor: 'grey.50' } }}
                  >
                    <TableCell>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '3px',
                          bgcolor: color ?? '#e0e0e0',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{cond.name}</TableCell>
                    <TableCell>{cond.factor1}</TableCell>
                    <TableCell>{cond.factor2}</TableCell>
                    <TableCell>{cond.factor3}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => onRemoveCondition(cond.id)}
                        sx={{ color: 'text.secondary' }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

import React from 'react';
import {
  Dialog, DialogActions, CircularProgress, LinearProgress, Stack, Typography, Box, Button,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

export type StepStatuses = 'error' | 'finished' | 'ongoing';

export interface StepProgressProps {
  open: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  step: number;
  stepStatus: StepStatuses;
  steps: string[];
  stepsError: string[];
}

const StepProgress: React.FC<StepProgressProps> = ({
  open,
  onClose,
  isSubmitting,
  step,
  stepStatus,
  steps,
  stepsError,
}) => (
  <Dialog
    fullWidth
    maxWidth="xs"
    open={open}
    // Forbid outside clicks
    onBackdropClick={() => {}}
    onClose={() => {}}
  >
    <Box sx={{ p: 3 }}>
      <Stack justifyContent="center" alignItems="center" spacing={4}>
        {stepStatus === 'ongoing' && <CircularProgress />}
        {stepStatus === 'finished' && <CheckIcon sx={{ color: 'green', fontSize: '2rem' }} />}
        {stepStatus === 'error' && <ClearIcon sx={{ color: 'red', fontSize: '2rem' }} />}
        <Typography variant="h5" color="textPrimary">
          {stepStatus === 'error' ? stepsError[step] : steps[step]}
        </Typography>
        <LinearProgress variant="determinate" value={((step + 1) / steps.length) * 100} style={{ width: '100%' }} />
      </Stack>
    </Box>
    <DialogActions>
      <Button size="large" onClick={onClose} disabled={isSubmitting}>
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default StepProgress;

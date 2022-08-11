import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export default styled(Typography)({
  fontSize: '0.7rem',
  '& strong': {
    fontSize: '1rem',
  },
});

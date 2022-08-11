import React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { fPercent } from '@open-zhy/utils';

const calculatePercentage = (from: number, to: number) => fPercent((100 * (to - from)) / from);

const PercentValue = styled(Typography, {
  shouldForwardProp: (prop: string) => !['up', 'down'].includes(prop),
})<TypographyProps & { up?: boolean; down?: boolean }>(({ theme, up, down }) => ({
  fontWeight: 500,
  ...(up && {
    color: theme.palette.success.main,
  }),
  ...(down && {
    color: theme.palette.error.main,
  }),
}));

interface NumberDeltaProps {
  from?: number;
  to?: number;
}

const NumberDelta = ({ from, to }: NumberDeltaProps) => {
  if (from === to || from === 0) {
    return <>-</>;
  }

  return <PercentValue {...{ up: to > from, down: to < from }}>{calculatePercentage(from, to)}</PercentValue>;
};

NumberDelta.defaultProps = {
  from: 0,
  to: 0,
};

export default NumberDelta;

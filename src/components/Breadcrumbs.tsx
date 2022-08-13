import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { SxProps } from '@mui/system';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0),
}));

export interface BreadcrumbsProps {
  sx?: SxProps
}

export default (props: BreadcrumbsProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container {...props}>
      <IconButton onClick={handleBack}>
        <ArrowBackIcon />
      </IconButton>
    </Container>
  );
};

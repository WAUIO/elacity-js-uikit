import * as React from 'react';
import classNames from 'classnames';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import MuiBox from '@mui/material/Box';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import type { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import type { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

const Container = styled(MuiBox)(({ theme }) => ({
  '& .MuiAccordion-root': {
    '& .MuiAccordionSummary-root': {
      borderRadius: theme.spacing(0),
    },

    '&:first-of-type': {
      borderTopLeftRadius: theme.spacing(2),
      borderTopRightRadius: theme.spacing(2),
      '& .MuiAccordionSummary-root': {
        borderTopLeftRadius: theme.spacing(2),
        borderTopRightRadius: theme.spacing(2),
      },
    },
    '&:last-of-type': {
      borderBottomLeftRadius: theme.spacing(2),
      borderBottomRightRadius: theme.spacing(2),
      '& .MuiAccordionSummary-root': {
        borderBottomLeftRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
      },
      '&.Mui-expanded': {
        '& .MuiAccordionSummary-root': {
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        },
      },
    },
  },
}));

export const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

export const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',

  '&.Mui-expanded': {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

interface AccordionGroupProps {
  opened?: number | null;
  readonly?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  allowMany?: boolean;
  elements: {
    title?: string | React.ReactNode;
    content: React.ReactNode;
  }[];
}

export const AccordionGroup: React.FC<AccordionGroupProps> = ({ elements, opened, readonly }: AccordionGroupProps) => {
  const [expanded, setExpanded] = React.useState<string | null>(
    typeof opened !== 'undefined' ? `panel${opened}` : null
  );

  const handleChange = (i: number) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    if (!readonly) {
      setExpanded(newExpanded ? `panel${i}` : null);
    }
  };

  return (
    <Container>
      {elements.map(({ title, content }, index: number) => (
        <Accordion
          key={`$.accordion.${index + 1}`}
          expanded={expanded === `panel${index}`}
          onChange={handleChange(index)}
          className={classNames({ expanded })}
        >
          {title && (
            <AccordionSummary aria-controls={`panel${index}d-content`} id={`panel${index}d-header`}>
              <Typography fontWeight="bolder">{title}</Typography>
            </AccordionSummary>
          )}
          <AccordionDetails>{content}</AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};

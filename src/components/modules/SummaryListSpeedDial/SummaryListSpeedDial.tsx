'use client';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import React from 'react';
import SummaryListFilter, {
  SummaryFilter,
} from '../SummaryListFilter/SummaryListFilter';

export interface SummaryListSpeedDialProps {
  selectableFilters: SummaryFilter;
  selectedFilters: SummaryFilter;
  onUpdateFilter: (
    filterKey: keyof SummaryFilter,
    removeItems: string[],
    addItems: string[],
  ) => void;
}

export default function SummaryListSpeedDial(props: SummaryListSpeedDialProps) {
  const [openFilter, setOpenFilter] = React.useState(false);

  const actions = [
    {
      icon: <FontAwesomeIcon icon={faFilter} />,
      name: 'Filter',
      onClick: () => {
        setOpenFilter(true);
      },
    },
  ];

  return (
    <>
      <SpeedDial
        ariaLabel="SpeedDial"
        sx={{ position: 'fixed', bottom: '20px', right: '20px' }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
      <SummaryListFilter
        selectableFilters={props.selectableFilters}
        selectedFilters={props.selectedFilters}
        onUpdateFilter={props.onUpdateFilter}
        open={openFilter}
        onOpen={() => setOpenFilter(true)}
        onClose={() => setOpenFilter(false)}
      />
    </>
  );
}

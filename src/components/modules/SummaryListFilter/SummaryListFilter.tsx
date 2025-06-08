import { Puller } from '@/src/components/elements/Puller/Puller';
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SwipeableDrawer,
} from '@mui/material';
import React, { useEffect } from 'react';
import styles from './SummaryListFilter.module.css';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SummaryMatter } from '@/src/app/studies/summaries/[summaryName]/page';

export interface SummaryListFilterProps {
  selectableFilters: SummaryFilter;
  selectedFilters: SummaryFilter;
  onUpdateFilter: (
    filterKey: keyof SummaryFilter,
    removeItems: string[],
    addItems: string[],
  ) => void;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export interface SummaryFilter {
  professor: string[];
  degree: string[];
  degreeSubject: string[];
  language: string[];
  university: string[];
  semester: string[];
  semesterPeriod: string[];
}

export const getEmptyFilter: () => SummaryFilter = () =>
  structuredClone({
    professor: [],
    degree: [],
    degreeSubject: [],
    language: [],
    university: [],
    semester: [],
    semesterPeriod: [],
  });

export const isFilterEmpty: (filter: SummaryFilter) => boolean = (filter) => {
  return Object.keys(filter).every(
    (key) => filter[key as keyof SummaryFilter].length === 0,
  );
};

export const isFilterValid: (filter: SummaryFilter) => boolean = (filter) => {
  const emptyFilter = getEmptyFilter();

  return Object.keys(emptyFilter).every((key) =>
    Array.isArray(filter[key as keyof SummaryFilter]),
  );
};

export const isFilterEqual: (
  filterA: SummaryFilter,
  filterB: SummaryFilter,
) => boolean = (filterA, filterB) => {
  return Object.keys(filterA).every((key) => {
    const sameLength =
      filterA[key as keyof SummaryFilter].length ===
      filterB[key as keyof SummaryFilter].length;
    const filterContainsAllFilterBItems = filterB[
      key as keyof SummaryFilter
    ].every((filterItem) => {
      return filterA[key as keyof SummaryFilter].includes(filterItem);
    });

    return sameLength && filterContainsAllFilterBItems;
  });
};

export const addKeysToFilter: (
  filter: SummaryFilter,
  matter: SummaryMatter,
) => void = (filter, matter) => {
  // professor
  if (matter.professors) {
    matter.professors.forEach((professor) => {
      if (
        !filter.professor.includes(
          professor.firstName + ' ' + professor.lastName,
        )
      ) {
        filter.professor.push(professor.firstName + ' ' + professor.lastName);
      }
    });
  }
  // degree
  if (matter.degree) {
    if (!filter.degree.includes(matter.degree)) {
      filter.degree.push(matter.degree);
    }
  }
  // degreeSubject
  if (matter.degreeSubject) {
    if (!filter.degreeSubject.includes(matter.degreeSubject)) {
      filter.degreeSubject.push(matter.degreeSubject);
    }
  }
  // language
  if (matter.language) {
    if (!filter.language.includes(matter.language)) {
      filter.language.push(matter.language);
    }
  }
  // university
  if (matter.university) {
    if (!filter.university.includes(matter.university)) {
      filter.university.push(matter.university);
    }
  }
  // semester
  if (matter.semester) {
    if (!filter.semester.includes(matter.semester.toString())) {
      filter.semester.push(matter.semester.toString());
    }
  }
  // semesterPeriod
  if (matter.semesterPeriod) {
    if (!filter.semesterPeriod.includes(matter.semesterPeriod)) {
      filter.semesterPeriod.push(matter.semesterPeriod);
    }
  }
};

export const isMatterAllowedByFilter: (
  filter: SummaryFilter,
  matter: SummaryMatter,
) => boolean = (filter, matter) => {
  if (isFilterEmpty(filter)) {
    return true;
  }

  // Check for each category if the matter is part of the filter or if the filter is empty
  // professor
  if (
    filter.professor.length > 0 &&
    !matter.professors?.some((prof) =>
      filter.professor.includes(prof.firstName + ' ' + prof.lastName),
    )
  ) {
    return false;
  }
  // degree
  if (
    filter.degree.length > 0 &&
    !filter.degree.includes(matter.degree || '')
  ) {
    return false;
  }
  // degreeSubject
  if (
    filter.degreeSubject.length > 0 &&
    !filter.degreeSubject.includes(matter.degreeSubject || '')
  ) {
    return false;
  }
  // language
  if (
    filter.language.length > 0 &&
    !filter.language.includes(matter.language || '')
  ) {
    return false;
  }
  // university
  if (
    filter.university.length > 0 &&
    !filter.university.includes(matter.university || '')
  ) {
    return false;
  }
  // semester
  if (
    filter.semester.length > 0 &&
    !filter.semester.includes(matter.semester?.toString() || '')
  ) {
    return false;
  }
  // semesterPeriod
  if (
    filter.semesterPeriod.length > 0 &&
    !filter.semesterPeriod.includes(matter.semesterPeriod || '')
  ) {
    return false;
  }

  return true;
};

export default function SummaryListFilter(props: SummaryListFilterProps) {
  const [selectedFilters, setSelectedFilters] = React.useState<SummaryFilter>(
    getEmptyFilter(),
  );

  // Extra state and useEffect to assure that select menu is closed when filter item is selected
  // (without, the update of the props does not trigger the closing at value change)
  useEffect(() => {
    setSelectedFilters(props.selectedFilters);
  }, [props.selectedFilters]);

  const handleChange = (
    event: SelectChangeEvent,
    filterKey: keyof SummaryFilter,
  ) => {
    const currentFilterItems = props.selectedFilters[filterKey];
    const newFilterItems = event.target.value == '' ? [] : [event.target.value];

    props.onUpdateFilter(filterKey, currentFilterItems, newFilterItems);
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={props.open}
      onClose={props.onClose}
      onOpen={props.onOpen}
      disableSwipeToOpen
      disableScrollLock
      PaperProps={{
        square: false,
      }}
    >
      <Box
        sx={{
          height: 22,
        }}
      >
        <Puller />
      </Box>
      <Box
        sx={{
          padding: '0 16px 8px 16px',
        }}
      >
        <div className={styles.drawerHeader}>
          <div className={styles.drawerHeaderIconWrapper}>
            <FontAwesomeIcon icon={faFilter} />
          </div>
          <h2>Filter</h2>
        </div>
        <div>
          {Object.keys(props.selectableFilters).map((filterKey) => {
            return (
              <div key={'Filter key: ' + filterKey}>
                <FormControl
                  variant="filled"
                  sx={{ m: 1, minWidth: 120, width: 'stretch' }}
                >
                  <InputLabel id={'FilterLabel ' + filterKey}>
                    {filterKey}
                  </InputLabel>
                  <Select
                    labelId={'FilterLabel' + filterKey}
                    id={'Filter' + filterKey}
                    value={
                      selectedFilters[filterKey as keyof SummaryFilter][0] || ''
                    }
                    label={filterKey}
                    onChange={(event) =>
                      handleChange(event, filterKey as keyof SummaryFilter)
                    }
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {props.selectableFilters[filterKey as keyof SummaryFilter]
                      .sort()
                      .map((filterItem) => {
                        return (
                          <MenuItem
                            key={'FilterItem ' + filterItem}
                            value={filterItem}
                          >
                            {filterItem}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </div>
            );
          })}
        </div>
        {/* <div>
          <h3>Selected Filters</h3>
          {Object.keys(props.selectedFilters).map((filterKey) => {
            return props.selectedFilters[filterKey as keyof SummaryFilter].map(
              (filterItem) => {
                return (
                  <Chip
                    key={'SelectedFilter' + filterKey + ' - ' + filterItem}
                    label={filterItem}
                    onDelete={() =>
                      props.onRemoveFilter(
                        filterKey as keyof SummaryFilter,
                        filterItem,
                      )
                    }
                  />
                );
              },
            );
          })}
        </div>
        <div>
          <h3>Available Filters</h3>
          {Object.keys(props.selectableFilters).map((filterKey) => {
            return props.selectableFilters[
              filterKey as keyof SummaryFilter
            ].map((filterItem) => {
              return (
                <Chip
                  key={'SelectableFilter' + filterKey + ' - ' + filterItem}
                  label={filterItem}
                  onClick={() =>
                    props.onAddFilter(
                      filterKey as keyof SummaryFilter,
                      filterItem,
                    )
                  }
                />
              );
            });
          })}
        </div> */}
      </Box>
    </SwipeableDrawer>
  );
}

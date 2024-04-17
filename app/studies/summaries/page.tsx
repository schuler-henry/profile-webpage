'use client';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { Professor, SummaryMatter } from './[summaryName]/page';
import {
  SummaryFilter,
  addKeysToFilter,
  getEmptyFilter,
  isFilterEmpty,
  isFilterValid,
  isMatterAllowedByFilter,
} from '@/components/modules/SummaryListFilter/SummaryListFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@mui/material';
import ConfirmationDialog from '@/components/elements/ConfirmationDialog/ConfirmationDialog';
import SummaryListItem from '@/components/modules/SummaryListItem/SummaryListItem';
import SummaryListSpeedDial from '@/components/modules/SummaryListSpeedDial/SummaryListSpeedDial';
import { IndexedDBAdapter } from '@/components/adapters/IndexedDBAdapter/IndexedDBAdapter';

export default function Summaries() {
  const [summaryMatters, setSummaryMatters] = useState<SummaryMatter[]>([]);
  const [offlineMatters, setOfflineMatters] = useState<SummaryMatter[]>([]);
  const [filterOptions, setFilterOptions] = useState<SummaryFilter>(
    getEmptyFilter(),
  );
  const [activeFilter, setActiveFilter] = useState<SummaryFilter>(
    getEmptyFilter(),
  );

  const [openDeleteFilterConfirmation, setOpenDeleteFilterConfirmation] =
    useState<boolean>(false);

  // Initial Content Load
  useEffect(() => {
    async function getOfflineMatters() {
      const idb = await IndexedDBAdapter.createIndexedDBAdapter();
      const matters = await idb.getSummaryMatters();
      setOfflineMatters(matters);
    }

    async function fetchSummaryMatters() {
      const response = await fetch('/api/studies/summaries/getMatters', {
        method: 'GET',
      });

      if (response.ok) {
        const matters: SummaryMatter[] = await response.json();
        setSummaryMatters(matters);
      }
    }

    async function initialDataLoad() {
      await Promise.all([
        getOfflineMatters(),
        fetchSummaryMatters(),
        setFilter(getFilter()),
      ]);
    }

    initialDataLoad();
  }, []);

  // Recalculate available filter options on summaryMatters change
  useEffect(() => {
    function updateSelectableFilters() {
      const filter = getEmptyFilter();

      summaryMatters.forEach((matter) => {
        addKeysToFilter(filter, matter);
      });

      setFilterOptions(filter);
    }

    updateSelectableFilters();
  }, [summaryMatters]);

  // Filter Functions
  function getFilter(): SummaryFilter {
    const filter = window.localStorage.getItem('/studies/summaries;filter');

    if (filter) {
      return JSON.parse(filter) as SummaryFilter;
    }

    return getEmptyFilter();
  }

  function setFilter(filter: SummaryFilter): void {
    if (!isFilterValid(filter)) return;

    window.localStorage.setItem(
      '/studies/summaries;filter',
      JSON.stringify(filter),
    );

    setActiveFilter(filter);
  }

  function isAllowedByFilter(matter: SummaryMatter): boolean {
    return isMatterAllowedByFilter(activeFilter, matter);
  }

  return (
    <div className={styles.summaryList}>
      <div className={styles.headerWrapper}>
        <h1>Summaries</h1>
        {isFilterEmpty(activeFilter) ? (
          <></>
        ) : (
          <>
            <IconButton
              aria-label="delete-filter"
              size="large"
              hidden={isFilterEmpty(activeFilter)}
              onClick={() => setOpenDeleteFilterConfirmation(true)}
            >
              <FontAwesomeIcon icon={faFilterCircleXmark} />
            </IconButton>
            <ConfirmationDialog
              title="Delete Filter"
              open={openDeleteFilterConfirmation}
              onClose={(value?: string) => {
                if (value === 'ok') {
                  setFilter(getEmptyFilter());
                }
                setOpenDeleteFilterConfirmation(false);
              }}
            >
              <p>Do you want to delete the current filter?</p>
            </ConfirmationDialog>
          </>
        )}
      </div>
      <div>
        {(summaryMatters.length === 0 ? offlineMatters : summaryMatters).map(
          (matter) => {
            if (isAllowedByFilter(matter)) {
              return (
                <div key={'Summary ' + matter.id + matter.fileName}>
                  {matter.fileName?.split('.')[1] === 'mdx' ? (
                    <SummaryListItem
                      title={matter.title || ''}
                      description={matter.description || ''}
                      professor={
                        matter.professors
                          ?.map((prof) => {
                            return prof.firstName + ' ' + prof.lastName;
                          })
                          .join(', ') || ''
                      }
                      degree={matter.degree || ''}
                      degreeSubject={matter.degreeSubject || ''}
                      language={matter.language || ''}
                      university={matter.university || ''}
                      semester={matter.semester?.toString() || ''}
                      semesterPeriod={matter.semesterPeriod || ''}
                      date={
                        matter.lastModified
                          ? new Date(matter.lastModified).toLocaleString(
                              'default',
                              {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                              },
                            )
                          : ''
                      }
                      href={
                        '/studies/summaries/' +
                        matter.fileName?.split('.')[0] +
                        '?type=' +
                        matter.fileName?.split('.')[1]
                      }
                      offlineAvailable={
                        offlineMatters.find((m) => m.id === matter.id)
                          ? true
                          : false
                      }
                    />
                  ) : (
                    <></>
                  )}
                  {/* {offlineMatters.find((m) => m.id === matter.id) ? (
                    <button
                      onClick={async () => {
                        const idb =
                          await IndexedDBAdapter.createIndexedDBAdapter();
                        await idb.removeSummaryMatter(matter);
                        window.alert('Summary removed from your collection');
                      }}
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        const idb =
                          await IndexedDBAdapter.createIndexedDBAdapter();
                        await idb.addSummaryMatter(matter);
                        window.alert('Summary added to your collection');
                      }}
                    >
                      Add
                    </button>
                  )} */}
                </div>
              );
            } else {
              return <></>;
            }
          },
        )}
      </div>
      <SummaryListSpeedDial
        selectableFilters={filterOptions}
        selectedFilters={activeFilter}
        onUpdateFilter={(
          filterKey: keyof SummaryFilter,
          removeItems: string[],
          addItems: string[],
        ) => {
          const newFilter = { ...activeFilter };
          removeItems.forEach((item) => {
            newFilter[filterKey] = newFilter[filterKey].filter(
              (filterItem) => filterItem !== item,
            );
          });
          addItems.forEach((item) => {
            if (!newFilter[filterKey].includes(item))
              newFilter[filterKey].push(item);
          });
          setFilter(newFilter);
        }}
      />
    </div>
  );
}

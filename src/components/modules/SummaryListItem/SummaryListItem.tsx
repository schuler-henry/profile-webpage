'use client';
import Link from 'next/link';
import React from 'react';
import styles from './SummaryListItem.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuildingColumns,
  faCalendarDays,
  faClock,
  faEarthEurope,
  faEllipsisVertical,
  faFileLines,
  faGraduationCap,
  faLink,
  faPen,
  faUser,
  faWrench,
} from '@fortawesome/free-solid-svg-icons';
import { Box, SwipeableDrawer, useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';

export interface SummaryListItemProps {
  href: string;
  title: string;
  description: string;
  professor: string;
  degree: string;
  degreeSubject: string;
  language: string;
  university: string;
  semester: string;
  semesterPeriod: string;
  date: string;
}

export default function SummaryListItem(props: SummaryListItemProps) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  return (
    <>
      <Link
        href={props.href}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <div className={styles.wrapper}>
          <div className={styles.iconWrapper}>
            <FontAwesomeIcon icon={faFileLines} />
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>{props.title}</h3>
            <span className={styles.attributeList}>
              <span className={styles.attribute}>
                <FontAwesomeIcon
                  icon={faUser}
                  className={styles.attributeIcon}
                />
                <p className={styles.attributeName}>{props.professor}</p>
              </span>
              <span className={styles.attribute}>
                <FontAwesomeIcon
                  icon={faEarthEurope}
                  className={styles.attributeIcon}
                />
                <p className={styles.attributeName}>{props.language}</p>
              </span>
              <span className={styles.attribute}>
                <FontAwesomeIcon
                  icon={faGraduationCap}
                  className={styles.attributeIcon}
                />
                <p className={styles.attributeName}>{props.degree}</p>
              </span>
              <span className={styles.attribute}>
                <FontAwesomeIcon
                  icon={faBuildingColumns}
                  className={styles.attributeIcon}
                />
                <p className={styles.attributeName}>{props.university}</p>
              </span>
            </span>
          </div>
          <div
            className={styles.ellipsisWrapper}
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
              setOpen(true);
            }}
          >
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </div>
        </div>
      </Link>

      <SwipeableDrawer
        anchor={'bottom'}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        disableSwipeToOpen
        disableScrollLock
        PaperProps={{
          square: false,
          sx: { borderTopLeftRadius: 8, borderTopRightRadius: 8 },
        }}
      >
        <Box
          sx={{
            height: 22,
          }}
        >
          <Box
            style={{
              width: 60,
              height: 6,
              backgroundColor:
                theme.palette.mode === 'light' ? grey[300] : grey[900],
              borderRadius: 3,
              position: 'absolute',
              top: 8,
              left: 'calc(50% - 30px)',
            }}
          />
        </Box>
        <Box
          sx={{
            padding: '0 16px 8px 16px',
          }}
        >
          <div className={styles.drawerHeader}>
            <div className={styles.drawerHeaderIconWrapper}>
              <FontAwesomeIcon icon={faFileLines} />
            </div>
            <h3>{props.title}</h3>
          </div>
          <div className={styles.drawerDescription}>
            <p>{props.description}</p>
          </div>
          <div className={styles.drawerAttributeList}>
            <span className={styles.drawerAttribute}>
              <FontAwesomeIcon icon={faUser} />
              <p>{props.professor}</p>
            </span>
            <span className={styles.drawerAttribute}>
              <FontAwesomeIcon icon={faEarthEurope} />
              <p>{props.language}</p>
            </span>
            <span className={styles.drawerAttribute}>
              <FontAwesomeIcon icon={faGraduationCap} />
              <p>{props.degree}</p>
            </span>
            <span className={styles.drawerAttribute}>
              <FontAwesomeIcon icon={faWrench} />
              <p>{props.degreeSubject}</p>
            </span>
            <span className={styles.drawerAttribute}>
              <FontAwesomeIcon icon={faCalendarDays} />
              <p>{props.semesterPeriod}</p>
            </span>
            <span className={styles.drawerAttribute}>
              <FontAwesomeIcon icon={faClock} />
              <p>Semester {props.semester}</p>
            </span>
            <span className={styles.drawerAttribute}>
              <FontAwesomeIcon icon={faBuildingColumns} />
              <p>{props.university}</p>
            </span>
            <span className={styles.drawerAttribute}>
              <FontAwesomeIcon icon={faPen} />
              <p>{props.date}</p>
            </span>
            <span
              className={
                styles.drawerAttribute + ' ' + styles.drawerAttributeLink
              }
              onClick={async () => {
                await navigator.clipboard.writeText(
                  location.href + '/' + props.href.split('/summaries/')[1],
                );
                setOpen(false);
              }}
            >
              <FontAwesomeIcon icon={faLink} />
              <p>Copy Link</p>
            </span>
          </div>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

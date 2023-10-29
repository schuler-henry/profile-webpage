'use client';
import Link from 'next/link';
import React from 'react';
import styles from './SummaryListItem.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuildingColumns,
  faEarthEurope,
  faEllipsisVertical,
  faFileLines,
  faGraduationCap,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

export interface SummaryListItemProps {
  href: string;
  title: string;
  professor: string;
  degree: string;
  language: string;
  universityName: string;
}

export default function SummaryListItem(props: SummaryListItemProps) {
  return (
    <>
      <Link href={props.href}>
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
                  icon={faGraduationCap}
                  className={styles.attributeIcon}
                />
                <p className={styles.attributeName}>{props.degree}</p>
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
                  icon={faBuildingColumns}
                  className={styles.attributeIcon}
                />
                <p className={styles.attributeName}>{props.universityName}</p>
              </span>
            </span>
          </div>
          <div className={styles.ellipsisWrapper}>
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </div>
        </div>
      </Link>
    </>
  );
}

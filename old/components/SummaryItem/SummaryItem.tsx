import { Component } from "react";
import styles from './SummaryItem.module.css'
import Image from "next/image";
import Link from "next/link";
import DefaultIcon from "../../public/logos/GitHub.png"

export interface SummaryItemState {

}

export interface SummaryItemProps {
  summary: {[key: string]: any;};
}

export class Summary extends Component<SummaryItemProps, SummaryItemState> {
  render() {
    return(
      <div className={styles.summaryItem}>
        <div className={styles.heading}>
          <Image 
            src={this.props.summary.img || DefaultIcon} 
            objectFit='contain'
            height={40}
            width={40}
            alt="no image available" />
          <div className={styles.headText}>
            <Link href={`/studies/summaries/${this.props.summary.slug}`}>
              <a className={styles.summaryTitle}>
                {this.props.summary.title}
              </a>
            </Link>
            <div className={styles.date}>
              {this.props.summary.date}
            </div>
          </div>
        </div>
        <p className={styles.description}>
          {this.props.summary.description}
        </p>
      </div>
    )
  }
}
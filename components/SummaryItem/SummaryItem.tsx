import { Component } from "react";
import styles from './SummaryItem.module.css'
import Image from "next/image";
import Link from "next/link";
import DefaultIcon from "../../public/GitHub.png"

export interface SummaryItemState {

}

export interface SummaryItemProps {
  summary: {[key: string]: any;};
}

export class Summary extends Component<SummaryItemProps, SummaryItemState> {
  render() {
    return(
      <div>
        <div className={styles.summaryItem}>
          <Image 
            src={this.props.summary.img || DefaultIcon} 
            objectFit='contain'
            height={40}
            width={40}
            alt="no image available" />
          <div className={styles.date}>
            {this.props.summary.date}
          </div>
          <Link href={`/studies/summaries/${this.props.summary.slug}`}>
            <a className={styles.summaryTitle}>
              {this.props.summary.title}
            </a>
          </Link>
          <p>
            {this.props.summary.description}
          </p>
        </div>
      </div>
    )
  }
}
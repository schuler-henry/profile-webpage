import { Spinner, SpinnerSize } from "@fluentui/react"
import { TFunction } from "next-i18next"
import Link from "next/link"
import { Component } from "react"
import styles from "./PageLoadingScreen.module.css"

export interface PageLoadingScreenState {

}

export interface PageLoadingScreenProps {
  t: TFunction;
}

export class PageLoadingScreen extends Component<PageLoadingScreenProps, PageLoadingScreenState> {

  render() {
    return (
      <div>
        <div className={styles.container}>
          <div className={styles.grid}>
            <h2>{this.props.t('common:LoadingPage')}</h2>
            <Spinner className={styles.spinner} size={3} />
            <h2>{this.props.t('common:BackTo')} <Link href={"/"}>{this.props.t('common:Home')}</Link></h2>
          </div>
          <div className={styles.footer}>
            {this.props.t('common:NotLoadingErrorText')} <Link href={"mailto:contact@henryschuler.de"}>help@henryschuler.de</Link>.
          </div>
        </div>
      </div>
    )
  }
}
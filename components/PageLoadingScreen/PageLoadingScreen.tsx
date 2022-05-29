import { Spinner } from "@fluentui/react"
import Link from "next/link"
import { Component } from "react"
import { PWPLanguageContext } from "../PWPLanguageProvider/PWPLanguageProvider"
import styles from "./PageLoadingScreen.module.css"

export interface PageLoadingScreenState {
  visibility: boolean;
}

export interface PageLoadingScreenProps {

}

export class PageLoadingScreen extends Component<PageLoadingScreenProps, PageLoadingScreenState> {
  constructor(props: PageLoadingScreenProps) {
    super(props)
    this.state = {
      visibility: false,
    }
  }
  
  componentDidMount(): void {
    setTimeout(() => {this.setState({visibility: true})}, 1000)
  }
  render() {
    return (
      <PWPLanguageContext.Consumer> 
        { LanguageContext => (
          <div hidden={!this.state.visibility}>
            <div className={styles.container}>
              <div className={styles.grid}>
                <h2>{LanguageContext.t('common:LoadingPage')}</h2>
                <Spinner className={styles.spinner} size={3} />
                <h2>{LanguageContext.t('common:BackTo')} <Link href={"/"}>{LanguageContext.t('common:Home')}</Link></h2>
              </div>
              <div className={styles.footer}>
                {LanguageContext.t('common:NotLoadingErrorText')} <Link href={"mailto:contact@henryschuler.de"}>help@henryschuler.de</Link>.
              </div>
            </div>
          </div>
        )}
      </PWPLanguageContext.Consumer>
    )
  }
}
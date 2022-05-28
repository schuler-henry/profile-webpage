import { I18n, WithTranslation, withTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { Component } from 'react'

export interface PageNotFoundState {

}

export interface PageNotFoundProps extends WithTranslation {
  i18n: I18n
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    }
  }
}

class PageNotFound extends Component<PageNotFoundProps, PageNotFoundState> {
  render() {
    return (
      <div>
        <div className='scrollBody'>
          <main>
            Error 404 page not found.
            This page is not available!
            Get back to <Link href={"/"}>Home</Link>!
          </main>
        </div>
      </div>
    )
  }
}

export default withTranslation()(PageNotFound)
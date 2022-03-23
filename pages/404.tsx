import Link from 'next/link'
import { Component } from 'react'

export interface PageNotFoundState {

}

export interface PageNotFoundProps {

}
class PageNotFound extends Component<PageNotFoundProps, PageNotFoundState> {
  render() {
    return(
      <div>
        <main>
          Error 404 page not found.
          This page is not available!
          Get back to <Link href={"/"}>Home</Link>!
        </main>
      </div>
    )
  }
}

export default PageNotFound
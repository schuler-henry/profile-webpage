import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    console.log("Document")
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;800&display=swap" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Red+Hat+Mono:wght@400;600&display=swap" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument

function getUnicodeFlagIcon(arg0: string): string | JSX.Element {
  throw new Error('Function not implemented.')
}

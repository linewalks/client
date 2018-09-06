import Document, { Head, Main, NextScript } from "next/document"

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <html>
        <Head>
          <link
            href="/static/css/bootstrap.min.css"
            rel="stylesheet"
            type="text/css"
          />
          <link href="/static/css/animate.css" rel="stylesheet" />
          <link href="/static/css/style.css" rel="stylesheet" />
          <link href="/static/css/react-tagsinput.css" rel="stylesheet" />

          <link
            href="/static/font-awesome/css/font-awesome.css"
            rel="stylesheet"
          />
        </Head>
        <body className="custom_class">
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

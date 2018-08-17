import App, { Container } from "next/app"
import Head from "next/head"
import React from "react"

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <Head>
          <link
            href="/static/css/bootstrap.min.css"
            rel="stylesheet"
            type="text/css"
          />
          <link href="/static/css/animate.css" rel="stylesheet" />
          <link href="/static/css/style.css" rel="stylesheet" />

          <link
            href="/static/font-awesome/css/font-awesome.css"
            rel="stylesheet"
          />
        </Head>
        <Component {...pageProps} />
      </Container>
    )
  }
}

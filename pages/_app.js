import App, { Container } from "next/app"
import Head from "next/head"
import React from "react"
import { Provider } from "react-redux"
import withRedux from "next-redux-wrapper"
import Web3 from "web3"
import makeStore from "../store"
import axios from "axios"

class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    const resp = await axios.get("http://localhost:9090/network_information")

    const networkInformation = {
      ...resp.data
    }

    let networkMetaProps = {
      ...networkInformation
    }
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps, ...networkMetaProps }
  }

  render() {
    const { Component, pageProps, store } = this.props
    return (
      <Container>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    )
  }
}

export default withRedux(makeStore)(MyApp)

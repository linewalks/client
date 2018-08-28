import App, { Container } from "next/app"
import Head from "next/head"
import React from "react"
import { Provider } from "react-redux"
import withRedux from "next-redux-wrapper"
import Web3 from "web3"
import makeStore from "../store"

const INITIAL_STATE = {
  patientContract: {
    contractHash: "",
    abi: undefined
  },
  providerContract: {
    contractHash: "",
    abi: undefined
  }
}

class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
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

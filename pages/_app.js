import App, { Container } from "next/app"
import Head from "next/head"
import React from "react"
import { createStore } from "redux"
import { Provider } from "react-redux"
import withRedux from "next-redux-wrapper"
import Web3 from "web3"

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

const reducer = (state = INITIAL_STATE, { type, payload }) => {
  if (type === "CONNECT_TO_PATIENT_CONTRACT") {
    return {
      ...state,
      patientContract: {
        contractHash: payload.contractHash,
        abi: payload.abi
      }
    }
  }
  if (type === "CONNECT_TO_PROVIDER_CONTRACT") {
    return {
      ...state,
      providerContract: {
        contractHash: payload.contractHash,
        abi: payload.abi
      }
    }
  }
  return {
    ...state
  }
}

const makeStore = (initialState, options) => {
  return createStore(reducer, initialState)
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

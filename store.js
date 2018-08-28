import { createStore } from "redux"
import reducer from "./reducer"

const makeStore = (initialState, options) => {
  return createStore(reducer, initialState)
}

export default makeStore

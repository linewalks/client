const INITIAL_STATE = {
  patientContract: {
    contractHash: "",
    abi: undefined
  },
  providerContract: {
    contractHash: "",
    abi: undefined,
    address: ""
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
        ...state.providerContract,
        contractHash: payload.contractHash,
        abi: payload.abi
      }
    }
  }
  if (type === "CONNECT_AS_PROVIDER") {
    console.log("ACTION CALLED")
    return {
      ...state,
      providerContract: {
        ...state.providerContract,
        contractHash: payload.hash,
        address: payload.address
      }
    }
  }
  return {
    ...state
  }
}

export default reducer

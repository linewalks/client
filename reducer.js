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

export default reducer

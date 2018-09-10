const hospitalInfoFields = [
  "owner",
  "facilityName",
  "typeOfHospital",
  "clinicalSpecialty"
]

const callContractMethod = (contractRef, method) => {
  return contractRef.methods[method]()
    .call()
    .then(resp => Promise.resolve(resp), err => Promise.reject(err))
}

const issueTransaction = (contractRef, method) => {}

export const getHospitalInfo = contractRef => {
  return Promise.all(
    hospitalInfoFields.map(field => callContractMethod(contractRef, field))
  ).then(
    resp =>
      Promise.resolve({
        owner: resp[0],
        facilityName: resp[1],
        typeOfHospital: resp[2],
        clinicalSpecialty: resp[3]
      }),
    err => Promise.reject(err)
  )
}

export const getIssuedClaims = contractRef => {
  return callContractMethod(contractRef, "viewIssuedClaims")
}

export const getPatients = contractRef => {
  return callContractMethod(contractRef, "viewPatientsList").then(
    resp => {
      return Promise.resolve(
        resp.map(patient => ({
          yearOfBirth: patient[1],
          code: patient[2],
          gender: patient[3],
          address: patient[0]
        }))
      )
    },
    err => Promise.reject(err)
  )
}

export const sendTransactionToContract = (
  contractRef,
  method,
  senderAddress,
  args = [],
  gas = 1500000,
  gasPrice = "20000000000"
) => {
  return contractRef.methods[method](...args)
    .send({
      from: senderAddress,
      gas,
      gasPrice
    })
    .then(
      resp => {
        return Promise.resolve(resp.transactionHash)
      },
      e => {
        console.log(e)
        return Promise.reject(e)
      }
    )
}

export const issueClaimForPatient = (
  contractRef,
  senderAddress,
  patientAddress,
  claimFields = []
) => {
  return sendTransactionToContract(
    contractRef,
    "renderClaimForPatient",
    senderAddress,
    [patientAddress, claimFields]
  ).then(
    resp => {
      return Promise.resolve(resp)
    },
    error => Promise.reject(error)
  )
}

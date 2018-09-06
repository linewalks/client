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
          yearOfBirth: patient[0],
          code: patient[1],
          gender: patient[2]
        }))
      )
    },
    err => Promise.reject(err)
  )
}

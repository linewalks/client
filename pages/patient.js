import React from "react"
import PageLayout from "../layout/PageLayout"
import Ibox from "../component/Ibox"
import Web3 from "web3"
import PatientRegistrarContract from "../contracts/PatientRegistrar.json"

class Patient extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gender: "male",
      yearOfBirth: "",
      patientAddress: "",
      contractHash: ""
    }
  }

  onSubmit = e => {
    e.preventDefault()
    console.log(this.state.gender, this.state.yearOfBirth)
  }

  onValueChange = (field, value) => {
    this.setState({
      ...this.state,
      [field]: value
    })
  }

  connectToPatientRegistrar = () => {
    this.web3 = new Web3(
      new Web3.providers.HttpProvider("http://localhost:8545")
    )
    const PatientRegistrarContractABI = PatientRegistrarContract.abi
    const patientRegistrarContractTx = this.state.contractHash
    this.connectAs = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1"
    this.patientRegistrarRef = new this.web3.eth.Contract(
      PatientRegistrarContractABI,
      patientRegistrarContractTx,
      { from: this.connectAs }
    )

    return this.patientRegistrarRef.methods
      .viewPatientsList()
      .call()
      .then(
        resp => {
          console.log(resp)
        },
        e => console.log(e)
      )
  }

  createPatient = () => {
    const address = this.state.patientAddress
    const gender = this.state.gender
    const yearOfBirth = this.state.yearOfBirth

    const gas = 167540
    const gasPrice = "10000000000"

    return this.patientRegistrarRef.methods
      .registerPatientToRegistrar(address, gender, yearOfBirth)
      .send({
        from: this.connectAs, // PatientRegistrar가 추가,
        gas,
        gasPrice
      })
      .then(
        resp => {
          console.log(
            `Successfully added Patient with tx hash ${resp.transactionHash}`
          )
        },
        e => console.log(e)
      )
  }

  render() {
    return (
      <PageLayout>
        <div className="row">
          <div className="col-lg-12">
            <Ibox title="Dear Patient,">
              <div>
                <h5>
                  In this section, you can create your identity as a Patient
                </h5>
                <h5>
                  Your credentials will be created as a block on the blockchain
                </h5>
                <h5>
                  Be careful not to forget your account address (ETH Address)
                </h5>
              </div>
            </Ibox>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <Ibox title="First, connect to the blockchain">
              <div className="form-group">
                <label>Patient Registrar Contract #</label>
                <input
                  type="text"
                  placeholder="Enter PatientRegistrar Contract #"
                  className="form-control"
                  onChange={e =>
                    this.onValueChange("contractHash", e.target.value)
                  }
                />
              </div>
              <div>
                <button
                  className="btn btn-sm btn-primary float-right m-t-n-xs"
                  onClick={this.connectToPatientRegistrar}
                >
                  <strong>Connect to Patient Registrar</strong>
                </button>
              </div>
            </Ibox>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <Ibox title="Create Patient Identity">
              <div>
                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <label>Patient Account Address</label>
                    <input
                      type="text"
                      placeholder="Enter account address"
                      className="form-control"
                      onChange={e =>
                        this.onValueChange("patientAddress", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Year of Birth</label>
                    <input
                      type="text"
                      placeholder="Enter year of birth"
                      className="form-control"
                      onChange={e =>
                        this.onValueChange("yearOfBirth", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      value={this.state.gender}
                      onChange={e =>
                        this.onValueChange("gender", e.target.value)
                      }
                      className="form-control m-b"
                      name="account"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <button
                      className="btn btn-sm btn-primary float-right m-t-n-xs"
                      type="submit"
                      onClick={this.createPatient}
                    >
                      <strong>Create Patient</strong>
                    </button>
                  </div>
                </form>
              </div>
            </Ibox>
          </div>
        </div>
      </PageLayout>
    )
  }
}
export default Patient

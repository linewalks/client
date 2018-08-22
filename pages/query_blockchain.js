import React from "react"
import PageLayout from "../layout/PageLayout"
import Ibox from "../component/Ibox"
import Web3 from "web3"
import { connect } from "react-redux"

class QueryBlockchain extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      patientsList: []
    }
  }

  getPatientsList = () => {
    const { patientContractHash, patientContractAbi } = this.props
    this.connectAs = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1"

    if (!patientContractHash || !patientContractAbi) {
      alert(
        "Patient Query를 하기에 정보가 부족합니다. Patient Tab에 가서 Contract Hash를 기입하세요"
      )
    }
    this.web3 = new Web3(
      new Web3.providers.HttpProvider("http://localhost:8545")
    )

    this.patientRegistrarRef = new this.web3.eth.Contract(
      patientContractAbi,
      patientContractHash,
      { from: this.connectAs }
    )
    return this.patientRegistrarRef.methods
      .viewPatientsList()
      .call()
      .then(
        resp => {
          this.setState({
            patientsList: [...resp]
          })
        },
        e => console.log(e)
      )
  }

  render() {
    return (
      <PageLayout>
        <div className="row">
          <div className="col-lg-12">
            <Ibox title="Querying data...">
              <div>
                <h5>Query Registered Patients</h5>
                <h5>Query Diagnosis and medical claims</h5>
              </div>
            </Ibox>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <Ibox title="Get Patient Lists">
              <div>
                <div>
                  <button
                    className="btn btn-sm btn-primary float-right m-t-n-xs"
                    onClick={this.getPatientsList}
                  >
                    <strong>Retrieve Patient List from Blockchain</strong>
                  </button>
                </div>
              </div>
            </Ibox>
            <Ibox title="Patients List">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Patient Address</th>
                    <th>Year of Birth</th>
                    <th>Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.patientsList.map((patient, i) => (
                    <tr>
                      <td>{i + 1}</td>
                      <td>{patient[0]}</td>
                      <td>{patient[1]}</td>
                      <td>{patient[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Ibox>
          </div>
        </div>
      </PageLayout>
    )
  }
}

export default connect(state => ({
  patientContractHash: state.patientContract.contractHash,
  patientContractAbi: state.patientContract.abi
}))(QueryBlockchain)

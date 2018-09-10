import React from "react"
import PageLayout from "../layout/PageLayout"
import Ibox from "../component/Ibox"
import Web3 from "web3"
import { connect } from "react-redux"
import { getPatients } from "../util/contractHelpers"

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

    return getPatients(this.patientRegistrarRef).then(patients => {
      this.setState({
        patientsList: patients
      })
    })
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
                    <th>Patient Code</th>
                    <th>Year of Birth</th>
                    <th>Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.patientsList.map((patient, i) => (
                    <tr>
                      <td>{i + 1}</td>
                      <td>{patient[1]}</td>
                      <td>{patient[0]}</td>
                      <td>{patient[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Ibox>
            <div className="row">
              <div className="col-lg-12">
                <div className="ibox">
                  <div className="ibox-content">
                    <span className="text-muted small float-right">
                      Last modification: <i className="fa fa-clock-o" /> 2:10 pm
                      - 12.06.2014
                    </span>
                    <h2>Search MCIDL</h2>
                    <p>
                      All clients need to be verified before you can query the
                      blockchain
                    </p>
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search client "
                        className="input form-control"
                      />
                      <span className="input-group-append">
                        <button type="button" className="btn btn btn-primary">
                          {" "}
                          <i className="fa fa-search" /> Search
                        </button>
                      </span>
                    </div>
                    <div className="clients-list">
                      <span className="float-right small text-muted">
                        1406 Elements
                      </span>
                      <ul className="nav nav-tabs">
                        <li>
                          <a
                            className="nav-link active show"
                            data-toggle="tab"
                            href="#tab-1"
                          >
                            <i className="fa fa-user" /> Patients
                          </a>
                        </li>
                        <li>
                          <a
                            className="nav-link"
                            data-toggle="tab"
                            href="#tab-2"
                          >
                            <i className="fa fa-briefcase" /> Health Providers
                          </a>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div id="tab-1" className="tab-pane active show">
                          <div
                            className="slimScrollDiv"
                            style={{
                              position: "relative",
                              overflow: "hidden",
                              width: "auto",
                              height: "100%"
                            }}
                          >
                            <div
                              className="full-height-scroll"
                              style={{
                                overflow: "hidden",
                                width: "auto",
                                height: "100%"
                              }}
                            >
                              <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <a
                                          href="#contact-1"
                                          className="client-link"
                                        >
                                          Anthony Jackson
                                        </a>
                                      </td>
                                      <td> Tellus Institute</td>
                                      <td className="contact-type">
                                        <i className="fa fa-envelope"> </i>
                                      </td>
                                      <td> gravida@rbisit.com</td>
                                      <td className="client-status">
                                        <span className="label label-primary">
                                          Active
                                        </span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <a
                                          href="#contact-2"
                                          className="client-link"
                                        >
                                          Rooney Lindsay
                                        </a>
                                      </td>
                                      <td>Proin Limited</td>
                                      <td className="contact-type">
                                        <i className="fa fa-envelope"> </i>
                                      </td>
                                      <td> rooney@proin.com</td>
                                      <td className="client-status">
                                        <span className="label label-primary">
                                          Active
                                        </span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <a
                                          href="#contact-3"
                                          className="client-link"
                                        >
                                          Lionel Mcmillan
                                        </a>
                                      </td>
                                      <td>Et Industries</td>
                                      <td className="contact-type">
                                        <i className="fa fa-phone"> </i>
                                      </td>
                                      <td> +432 955 908</td>
                                      <td className="client-status" />
                                    </tr>
                                    <tr>
                                      <td>
                                        <a
                                          href="#contact-4"
                                          className="client-link"
                                        >
                                          Edan Randall
                                        </a>
                                      </td>
                                      <td>Integer Sem Corp.</td>
                                      <td className="contact-type">
                                        <i className="fa fa-phone"> </i>
                                      </td>
                                      <td> +422 600 213</td>
                                      <td className="client-status">
                                        <span className="label label-warning">
                                          Waiting
                                        </span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <a
                                          href="#contact-4"
                                          className="client-link"
                                        >
                                          Lionel Mcmillan
                                        </a>
                                      </td>
                                      <td>Et Industries</td>
                                      <td className="contact-type">
                                        <i className="fa fa-phone"> </i>
                                      </td>
                                      <td> +432 955 908</td>
                                      <td className="client-status">
                                        <span className="label label-primary">
                                          Active
                                        </span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div
                              className="slimScrollBar"
                              style={{
                                background: "rgb(0, 0, 0)",
                                width: "7px",
                                position: "absolute",
                                top: "0px",
                                opacity: "0.4",
                                display: "none",
                                borderRadius: "7px",
                                zIndex: "99",
                                right: "1px",
                                height: "366.599px"
                              }}
                            />
                            <div
                              className="slimScrollRail"
                              style={{
                                width: "7px",
                                height: "100%",
                                position: "absolute",
                                top: "0px",
                                display: "none",
                                borderRadius: "7px",
                                background: "rgb(51, 51, 51)",
                                opacity: "0.2",
                                zIndex: "90",
                                right: "1px"
                              }}
                            />
                          </div>
                        </div>
                        <div id="tab-2" className="tab-pane">
                          <div
                            className="slimScrollDiv"
                            style={{
                              position: "relative",
                              overflow: "hidden",
                              width: "auto",
                              height: "100%"
                            }}
                          >
                            <div
                              className="full-height-scroll"
                              style={{
                                overflow: "hidden",
                                width: "auto",
                                height: "100%"
                              }}
                            >
                              <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <a
                                          href="#company-1"
                                          className="client-link"
                                        >
                                          Tellus Institute
                                        </a>
                                      </td>
                                      <td>Rexton</td>
                                      <td>
                                        <i className="fa fa-flag" /> Angola
                                      </td>
                                      <td className="client-status">
                                        <span className="label label-primary">
                                          Active
                                        </span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <a
                                          href="#company-2"
                                          className="client-link"
                                        >
                                          Velit Industries
                                        </a>
                                      </td>
                                      <td>Maglie</td>
                                      <td>
                                        <i className="fa fa-flag" /> Luxembourg
                                      </td>
                                      <td className="client-status">
                                        <span className="label label-primary">
                                          Active
                                        </span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <a
                                          href="#company-2"
                                          className="client-link"
                                        >
                                          Et Arcu Inc.
                                        </a>
                                      </td>
                                      <td>Sioux City</td>
                                      <td>
                                        <i className="fa fa-flag" /> Burundi
                                      </td>
                                      <td className="client-status">
                                        <span className="label label-primary">
                                          Active
                                        </span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

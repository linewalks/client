import React from "react"
import Link from "next/link"
import { connect } from "react-redux"
import isEmpty from "lodash/isEmpty"

class Header extends React.Component {
  render() {
    const patientContractHash = this.props.state.patientContract.contractHash
    const patientContractAbi = this.props.state.patientContract.abi
    const isPatientContractInformationSufficient =
      !!patientContractHash && !isEmpty(patientContractAbi)

    const isLoggedInAsProvider =
      this.props.state.providerContract.contractHash &&
      this.props.state.providerContract.address

    return (
      <div className="row border-bottom white-bg">
        <nav className="navbar navbar-expand-lg navbar-static-top">
          <Link href="/">
            <a className="navbar-brand" style={{ color: "white" }}>
              Medical Claim Issuance and Data Lookup
            </a>
          </Link>
          <div className="navbar-collapse collapse">
            <ul className="nav navbar-top-links navbar-right">
              <li className="dropdown">
                <Link href="/patient">
                  <a className="dropdown-toggle">
                    Patient
                    {isPatientContractInformationSufficient && (
                      <i
                        className="fa-circle fa green"
                        style={{ color: "#1ab394", marginLeft: "4px" }}
                      />
                    )}
                  </a>
                </Link>
              </li>
              <li className="dropdown">
                <Link href="/provider">
                  <a className="dropdown-toggle">Login as Provider</a>
                </Link>
              </li>
              {isLoggedInAsProvider && (
                <li className="dropdown">
                  <Link href="/issue_claims">
                    <a className="dropdown-toggle">
                      Issue Medical Claims
                      <i
                        className="fa-circle fa green"
                        style={{ color: "#1ab394", marginLeft: "4px" }}
                      />
                    </a>
                  </Link>
                </li>
              )}
              <li className="dropdown">
                <Link href="/query_blockchain">
                  <a className="dropdown-toggle">Query Blockchain</a>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}

export default connect(state => ({ state }))(Header)

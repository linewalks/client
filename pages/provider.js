import React from "react"
import PageLayout from "../layout/PageLayout"
import Ibox from "../component/Ibox"
import Web3 from "web3"
import { connect } from "react-redux"
import sampleAddresses from "../util/sampleAddresses"
import axios from "axios"
import TableComponents from "../component/Table"
import { typesOfHospitals, typesOfClinics } from "../util/hospitalMetadata"
import { getHospitalInfo, getIssuedClaims } from "../util/contractHelpers"
const { Wrapper, Head, HeadColumn, Body, BodyColumn } = TableComponents
import Router from "next/router"

const gas = 1500000
const gasPrice = "20000000000"

class HealthProvider extends React.Component {
  static async getInitialProps({ ctx }) {
    const resp = await axios.get("http://localhost:9090/contracts_meta")
    const networkInfoResponse = await axios.get(
      "http://localhost:9090/network_information"
    )

    const contractABIs = resp.data || []
    const networkInfo = networkInfoResponse.data

    const providerData = contractABIs.filter(abi => abi.name === "Provider")[0]

    const providerAbi = providerData.abi
    const providerBytecode = providerData.bytecode

    return {
      providerAbi,
      providerBytecode,
      port: networkInfo.port,
      host: networkInfo.host,
      networkId: networkInfo.networkId
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      providerAddress: sampleAddresses[0],
      facilityName: "",
      typeOfClinic: typesOfClinics[0],
      typeOfHospital: typesOfHospitals[0],
      accountAddressToLoginAs: sampleAddresses[0]
    }
    const { host } = props
    if (host) {
      this.web3 = new Web3(new Web3.providers.HttpProvider(host))
    }
    this.connectAs = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1"
  }

  isProvderAccountInputValid = () =>
    this.state.providerAddress &&
    this.state.facilityName &&
    this.state.typeOfClinic &&
    this.state.typeOfHospital

  connectAsProvider = () => {
    const { providerAbi, dispatch } = this.props
    // Overwrite providerContractRef
    this.providerContractRef = new this.web3.eth.Contract(
      providerAbi,
      this.state.providerContractHash,
      { from: this.state.accountAddressToLoginAs }
    )

    return dispatch({
      type: "CONNECT_AS_PROVIDER",
      payload: {
        hash: this.state.providerContractHash,
        address: this.state.accountAddressToLoginAs
      }
    })
    // Router.push("/issue_claims")
    // this.retrieveClaimsIssuesByProvider()
  }

  retrieveClaimsIssuesByProvider = () => {
    getHospitalInfo(this.providerContractRef).then(resp => {
      console.log("From Helper")
      console.log(resp)
    })

    return getIssuedClaims(this.providerContractRef).then(
      resp => {
        const claims = resp.map(claim => {
          const [
            type,
            cost,
            description,
            patientAddr,
            createdAt,
            isValidated
          ] = claim
          return {
            type,
            cost,
            description,
            patientAddr,
            createdAt,
            isValidated
          }
        })
        console.log(claims)
        this.setState({
          issuedClaims: claims
        })
        return Promise.resolve(claims)
      },
      err => console.log(err)
    )
  }

  createProviderAccount = async () => {
    await this.connectToProvider()
    let contractInstance
    try {
      contractInstance = await this.providerContractRef
        .deploy({
          data: this.props.providerBytecode,
          arguments: [
            this.state.providerAddress,
            this.state.facilityName,
            this.state.typeOfClinic,
            this.state.typeOfHospital
          ]
        })
        .send({
          from: this.state.providerAddress,
          gas,
          gasPrice
        })
        .on("error", function(error) {
          console.error(error)
        })
        .on("transactionHash", function(transactionHash) {
          console.log(
            `Deploying Contract... Pending as tx#: ${transactionHash}\n`
          )
        })
    } catch (e) {
      console.log(e)
    }
    alert("Provider Contract Created: " + contractInstance.options.address)
    this.setState({
      providerContractHash: contractInstance.options.address
    })

    const { providerAbi } = this.props

    this.providerContractRef = new this.web3.eth.Contract(
      providerAbi,
      contractInstance.options.address,
      { from: this.state.providerAddress }
    )
  }

  issueClaimForPatient = () => {
    console.log(`Issuing Claim for Patient Addr: ${this.state.providerAddress}`)
    return this.providerContractRef.methods
      .renderClaimForPatient(this.state.providerAddress, [
        "TYPE OF CLAIM",
        10041004,
        "Hello Description"
      ])
      .send({
        from: this.state.providerAddress,
        gas,
        gasPrice
      })
      .then(
        resp => {
          console.log(
            `Successfully issued claim for Patient with tx hash ${
              resp.transactionHash
            }`
          )
        },
        e => console.log(e)
      )
  }

  connectToProvider = async () => {
    const { host, port, networkId, providerAbi } = this.props
    this.web3 = new Web3(new Web3.providers.HttpProvider(host))
    // this.byteCode = await this.web3.eth.getCode(providerContractHash)

    this.providerContractRef = new this.web3.eth.Contract(providerAbi)
  }

  onValueChange = (field, value) => {
    this.setState({
      ...this.state,
      [field]: value
    })
  }

  render() {
    return (
      <PageLayout>
        <div className="row">
          <div className="col-lg-12">
            <Ibox title="Create identity as a Healthcare Provider">
              <div>
                <h4>
                  본 페이지에서는 의료 서비스 제공자로 Identity를 만들 수
                  있습니다.
                </h4>
                <h4>
                  작성하시는 제공자 정보는 블록체인 상에 저장되며 향후에
                  환자들에 대한 진단 및 청구 명세서를 작성할 수 있습니다.
                </h4>
                <h4>생성되는 Contract Hash는 분실되지 않도록 유의하세요</h4>
              </div>
            </Ibox>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <Ibox title="의료 서비스 제공자 Identity 생성">
              <div className="form-group">
                <div className="row">
                  <div className="col-lg-12">
                    <label>병원 이름</label>
                    <input
                      type="text"
                      placeholder="Enter Name"
                      className="form-control m-b"
                      onChange={e =>
                        this.onValueChange("facilityName", e.target.value)
                      }
                      value={this.state.facilityName}
                    />
                  </div>
                  <div className="col-lg-12">
                    <label>Provider Administrator Address</label>
                    <select
                      className="form-control m-b"
                      onChange={e =>
                        this.onValueChange("providerAddress", e.target.value)
                      }
                      value={this.state.providerAddress}
                    >
                      {sampleAddresses.map(addr => (
                        <option value={addr}>{addr}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-12">
                    <label>병원 분류</label>
                    <select
                      className="form-control m-b"
                      onChange={e =>
                        this.onValueChange("typeOfHospital", e.target.value)
                      }
                      value={this.state.typeOfHospital}
                    >
                      {typesOfHospitals.map(type => (
                        <option value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-12">
                    <label>진단과</label>
                    <select
                      className="form-control m-b"
                      onChange={e =>
                        this.onValueChange("typeOfClinic", e.target.value)
                      }
                      value={this.state.typeOfClinic}
                    >
                      {typesOfClinics.map(type => (
                        <option value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <button
                    className="btn btn-primary btn-block m-t"
                    onClick={this.createProviderAccount}
                    disabled={!this.isProvderAccountInputValid()}
                  >
                    <strong>의료 서비스 제공자 Identity 생성</strong>
                  </button>
                </div>
              </div>
            </Ibox>
          </div>
          <div className="col-lg-6">
            <Ibox title="이미 Identity를 생성한 경우, 아래 내용을 기입하여 네트워크에 접속하세요">
              <div className="form-group">
                <div className="row">
                  <div className="col-lg-12">
                    <label>Provider Contract Hash</label>
                    <input
                      type="text"
                      placeholder="Enter provider contract address registered in blockchain"
                      className="form-control"
                      value={this.state.providerContractHash}
                      onChange={e =>
                        this.onValueChange(
                          "providerContractHash",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="row">
                  <div className="col-lg-12">
                    <label>Provider Administrator Address</label>
                    <select
                      className="form-control m-b"
                      onChange={e =>
                        this.onValueChange(
                          "accountAddressToLoginAs",
                          e.target.value
                        )
                      }
                      value={this.state.accountAddressToLoginAs}
                    >
                      {sampleAddresses.map(addr => (
                        <option value={addr}>{addr}</option>
                      ))}
                    </select>
                  </div>
                  <div
                    className="col-lg-12"
                    onClick={() =>
                      alert(
                        "Signing transaction functionality is not yet supported..."
                      )
                    }
                  >
                    <label>Provider Account Private Key</label>
                    <input
                      type="text"
                      placeholder="Enter your accounts private key"
                      className="form-control"
                      disabled
                      onChange={e =>
                        this.onValueChange("accountPrivateKey", e.target.value)
                      }
                      value={this.state.accountPrivateKey}
                    />
                  </div>
                </div>
              </div>
              <div>
                <button
                  className="btn btn-primary btn-block m-t"
                  onClick={this.connectAsProvider}
                  disabled={
                    !this.state.providerContractHash ||
                    !this.state.accountAddressToLoginAs
                  }
                >
                  <strong>의료 서비스 제공자로 네트워크 연결</strong>
                </button>
              </div>
            </Ibox>
          </div>
        </div>
      </PageLayout>
    )
  }
}

export default connect()(HealthProvider)

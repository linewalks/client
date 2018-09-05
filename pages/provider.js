import React from "react"
import PageLayout from "../layout/PageLayout"
import Ibox from "../component/Ibox"
import Web3 from "web3"
import { connect } from "react-redux"
import sampleAddresses from "../util/sampleAddresses"
import axios from "axios"
import TableComponents from "../component/Table"
import { typesOfHospitals, typesOfClinics } from "../util/hospitalMetadata"

const { Wrapper, Head, HeadColumn, Body, BodyColumn } = TableComponents

const gas = 1500000
const gasPrice = "20000000000"

class Provider extends React.Component {
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
      accountAddressToLoginAs: ""
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
    accountAddressToLoginAs
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
            <Ibox title="Healthcare Provider">
              <div>
                <h5>
                  In this section, you can create your identity as a Healthcare
                  Provider
                </h5>
                <h5>
                  Your credentials, as well as the details of your facility,
                  will be created and saved on the blockchain
                </h5>
                <h5>Be careful not to forget your contract address</h5>
              </div>
            </Ibox>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <Ibox title="First, register as a Healthcare provider">
              <div className="form-group">
                <div className="row">
                  <div className="col-lg-6">
                    <label>Name of facility</label>
                    <input
                      type="text"
                      placeholder="Enter Name"
                      className="form-control"
                      onChange={e =>
                        this.onValueChange("facilityName", e.target.value)
                      }
                      value={this.state.facilityName}
                    />
                  </div>
                  <div className="col-lg-6">
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
                </div>
                <div className="row" style={{ marginTop: "10px" }}>
                  <div className="col-lg-6">
                    <label>Hospital category</label>
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
                  <div className="col-lg-6">
                    <label>Clinical field</label>
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
              </div>
              <div>
                <button
                  className="btn btn-primary btn-block m-t"
                  onClick={this.createProviderAccount}
                  disabled={!this.isProvderAccountInputValid()}
                >
                  <strong>Create Provider Account</strong>
                </button>
              </div>
            </Ibox>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <Ibox title="Login as Healthcare Provider">
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
                  <div className="col-lg-6">
                    <label>Provider Account Address</label>
                    <input
                      type="text"
                      placeholder="Enter account address registered in blockchain"
                      className="form-control"
                      onChange={e =>
                        this.onValueChange(
                          "accountAddressToLoginAs",
                          e.target.value
                        )
                      }
                      // 기본으로는 providerAddress와 동일하게 세팅 굳이 입력하면 overwrite
                      value={
                        this.state.accountAddressToLoginAs ||
                        this.state.providerAddress
                      }
                    />
                  </div>
                  <div
                    className="col-lg-6"
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
                    !this.state.accountAddressToLoginAs ||
                    !this.state.providerContractHash
                  }
                >
                  <strong>Connect as Provider</strong>
                </button>
              </div>
            </Ibox>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <Ibox title="Patient List">
              <Wrapper>
                <Head>
                  <HeadColumn>#</HeadColumn>
                  <HeadColumn>Name</HeadColumn>
                  <HeadColumn>Year of Birth</HeadColumn>
                  <HeadColumn>Gender</HeadColumn>
                </Head>
                <Body>
                  <BodyColumn>1</BodyColumn>
                  <BodyColumn>Paul</BodyColumn>
                  <BodyColumn>1986</BodyColumn>
                  <BodyColumn>Male</BodyColumn>
                </Body>
              </Wrapper>
            </Ibox>
          </div>
        </div>
      </PageLayout>
    )
  }
}

export default Provider

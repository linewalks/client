import React from "react"
import PageLayout from "../layout/PageLayout"
import Ibox from "../component/Ibox"
import Web3 from "web3"
import { connect } from "react-redux"
import sampleAddresses from "../util/sampleAddresses"
import axios from "axios"
import TableComponents from "../component/Table"
import { typesOfHospitals, typesOfClinics } from "../util/hospitalMetadata"
import {
  getHospitalInfo,
  getIssuedClaims,
  getPatients,
  sendTransactionToContract,
  issueClaimForPatient
} from "../util/contractHelpers"
const { Wrapper, Head, HeadColumn, Body, BodyColumn, BodyRow } = TableComponents
import { gas, gasPrice } from "../util/settings"
import isEmpty from "lodash/isEmpty"
import TagsInput from "react-tagsinput"

const hospitalInfoFields = [
  {
    name: "facilityName",
    label: "병원 이름"
  },
  {
    name: "typeOfHospital",
    label: "병원 종류"
  },
  {
    name: "typeOfClinic",
    label: "진단과"
  },
  {
    name: "facilityAdminAddress",
    label: "병원 관리자 주소"
  }
]

class IssueClaims extends React.Component {
  static async getInitialProps({ ctx }) {
    const resp = await axios.get("http://localhost:9090/contracts_meta")
    const networkInfoResponse = await axios.get(
      "http://localhost:9090/network_information"
    )

    const contractABIs = resp.data || []
    const networkInfo = networkInfoResponse.data

    const providerData = contractABIs.filter(abi => abi.name === "Provider")[0]
    const patientRegistrarData = contractABIs.filter(
      abi => abi.name === "PatientRegistrar"
    )[0]

    const patientRegistrarAbi = patientRegistrarData.abi
    const providerAbi = providerData.abi
    const providerBytecode = providerData.bytecode

    return {
      patientRegistrarAbi,
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
      facilityName: "",
      typeOfClinic: "",
      typeOfHospital: "",
      facilityAdminAddress: "",
      issuedClaims: [],
      patients: [],

      // Issuing claims
      patientToIssueClaim: "",
      issueAmount: 0,
      issueDesc: "",
      issueType: "주성분",
      issueTags: []
    }
    const { host } = props
    if (host) {
      this.web3 = new Web3(new Web3.providers.HttpProvider(host))
    }
  }

  componentDidMount = () => {
    const {
      providerAbi,
      providerContractHash,
      providerAddress,
      patientRegistrarAbi,
      patientContractHash
    } = this.props
    if (!providerContractHash || !providerAddress) {
      console.log(providerContractHash, providerAddress)
      window.alert("Provider로 접속하기 위한 정보가 제공되지 않았습니다.")
    }
    this.providerContractRef = new this.web3.eth.Contract(
      providerAbi,
      providerContractHash,
      { from: providerAddress }
    )

    this.patientContractRef = new this.web3.eth.Contract(
      patientRegistrarAbi,
      patientContractHash,
      { from: providerAddress }
    )

    this.retrieveClaimsIssuedByProvider()
    this.retrievePatients()
    // sendTransactionToContract()

    return getHospitalInfo(this.providerContractRef).then(hospitalInfo => {
      return this.setState({
        facilityAdminAddress: hospitalInfo.owner,
        typeOfClinic: hospitalInfo.clinicalSpecialty,
        typeOfHospital: hospitalInfo.typeOfHospital,
        facilityName: hospitalInfo.facilityName
      })
    })
  }

  retrievePatients = () => {
    return getPatients(this.patientContractRef).then(patients => {
      this.setState({ patients: patients })
    })
  }

  retrieveClaimsIssuedByProvider = () => {
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

  issueClaimForPatient = () => {
    console.log(
      `Issuing Claim for Patient Addr: ${this.state.patientToIssueClaim.code}`
    )
    return issueClaimForPatient(
      this.providerContractRef,
      this.state.facilityAdminAddress,
      this.state.patientToIssueClaim.address,
      [
        this.state.issueType,
        this.state.issueAmount,
        // Stringify issue details
        JSON.stringify({
          tags: this.state.issueTags,
          desc: this.state.issueDesc
        })
      ]
    ).then(
      resp => {
        console.log(
          `Successfully issued claim for Patient with tx hash ${resp}`
        )
        this.setState({
          issueAmount: 0,
          issueDesc: "",
          issueType: "주성분",
          patientToIssueClaim: {},
          issueTags: []
        })
      },
      err => console.log(err)
    )
    // return this.providerContractRef.methods
    //   .renderClaimForPatient(this.state.providerAddress, [
    //     "TYPE OF CLAIM",
    //     10041004,
    //     "Hello Description"
    //   ])
    //   .send({
    //     from: this.state.providerAddress,
    //     gas,
    //     gasPrice
    //   })
    //   .then(
    //     resp => {
    //       console.log(
    //         `Successfully issued claim for Patient with tx hash ${
    //           resp.transactionHash
    //         }`
    //       )
    //     },
    //     e => console.log(e)
    //   )
  }

  connectToProvider = async () => {
    const { host, port, networkId, providerAbi } = this.props
    this.web3 = new Web3(new Web3.providers.HttpProvider(host))
    this.providerContractRef = new this.web3.eth.Contract(providerAbi)
  }

  onValueChange = (field, value) => {
    this.setState({
      ...this.state,
      [field]: value
    })
  }

  renderClaimIssuingWidget = () => {
    return (
      <div>
        <Ibox title="의료 명세서 발행">
          <div className="row">
            <div className="col-lg-4">
              <div className="row mb-0">
                <div className="col-sm-4">
                  <dt>환자 코드</dt>
                </div>
                <div className="col-sm-8">
                  <dd style={{ overflow: "hidden" }} className="mb-1">
                    {this.state.patientToIssueClaim.code}
                  </dd>
                </div>
              </div>

              <div className="row mb-0">
                <div className="col-sm-4">
                  <dt>환자 성병</dt>
                </div>
                <div className="col-sm-8">
                  <dd style={{ overflow: "hidden" }} className="mb-1">
                    {this.state.patientToIssueClaim.gender}
                  </dd>
                </div>
              </div>

              <div className="row mb-0">
                <div className="col-sm-4">
                  <dt>환자 생년</dt>
                </div>
                <div className="col-sm-8">
                  <dd style={{ overflow: "hidden" }} className="mb-1">
                    {this.state.patientToIssueClaim.yearOfBirth}
                  </dd>
                </div>
              </div>

              <div className="row mb-0">
                <div className="col-sm-4">
                  <dt>환자 주소</dt>
                </div>
                <div className="col-sm-8">
                  <dd style={{ overflow: "hidden" }} className="mb-1">
                    {this.state.patientToIssueClaim.address}
                  </dd>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="form-group">
                <div className="row">
                  <div className="col-sm-6">
                    <label>명세서 종류</label>
                    <select
                      value={this.state.issueType}
                      onChange={e =>
                        this.onValueChange("issueType", e.target.value)
                      }
                      className="form-control m-b"
                      name="issueType"
                    >
                      <option value="주성분">주성분</option>
                      <option value="의료행위">의료행위</option>
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <label>청구 금액</label>
                    <input
                      value={this.state.issueAmount}
                      onChange={e =>
                        this.onValueChange("issueAmount", e.target.value)
                      }
                      type="number"
                      className="form-control m-b"
                      name="issueAmount"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <label>청구 내용</label>
                    <TagsInput
                      inputProps={{ placeholder: "처방 내용" }}
                      value={this.state.issueTags}
                      onChange={tags => this.setState({ issueTags: tags })}
                    />
                  </div>
                  <div className="col-sm-6" />
                </div>
                <div className="row">
                  <div className="col-lg-12" style={{ marginTop: "5px" }}>
                    <label>청구 내용</label>
                    <input
                      value={this.state.issueDesc}
                      onChange={e =>
                        this.onValueChange("issueDesc", e.target.value)
                      }
                      type="text"
                      className="form-control m-b"
                      name="issueDesc"
                    />
                  </div>
                </div>
              </div>
              <div>
                <button
                  className="btn btn-secondary m-t float-right"
                  style={{ marginLeft: "8px" }}
                  onClick={() => this.setState({ patientToIssueClaim: {} })}
                >
                  <strong>취소</strong>
                </button>

                <button
                  disabled={
                    !this.state.issueAmount ||
                    !this.state.issueType ||
                    isEmpty(this.state.issueTags)
                  }
                  className="btn btn-primary m-t float-right"
                  onClick={this.issueClaimForPatient}
                >
                  <strong>명세서 발행</strong>
                </button>
              </div>
            </div>
          </div>
        </Ibox>
      </div>
    )
  }

  render() {
    return (
      <PageLayout>
        <div className="row">
          <div className="col-lg-12">
            <Ibox title="Issuing Medical Claims For Patients">
              <div>
                <h4>
                  본 페이지에서는 진료한 환자에 대한 의료 명세서를 발행할 수
                  있습니다.
                </h4>
                <h4>
                  발행한 명세서는 블록체인 상에 저장되며, 환자의 동의 하에
                  데이터 분석를 위해 제 3자에게 활용될 수 있습니다.
                </h4>
              </div>
            </Ibox>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <Ibox>
              <div className="row">
                <div className="col-lg-12">
                  <div className="m-b-md">
                    <h2>의료서비스 제공자 정보</h2>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-7">
                  {hospitalInfoFields.map(field => {
                    return (
                      <div className="row mb-0">
                        <div className="col-sm-4">
                          <dt>{field.label}</dt>
                        </div>
                        <div className="col-sm-8">
                          <dd className="mb-1">{this.state[field.name]}</dd>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="col-lg-5">
                  <div>
                    <div className="m-b-1 m-t">
                      <span>누적 처방건수</span>
                      <small className="float-right">32 건</small>
                    </div>
                    <div className="progress progress-small">
                      <div style={{ width: "60%" }} class="progress-bar" />
                    </div>

                    <div className="m-b-1 m-t">
                      <span>누적 환자수</span>
                      <small className="float-right">15</small>
                    </div>
                    <div className="progress progress-small">
                      <div style={{ width: "50%" }} className="progress-bar" />
                    </div>

                    <div className="m-b-1 m-t">
                      <span>누적 처방금액</span>
                      <small className="float-right">4200000</small>
                    </div>
                    <div className="progress progress-small">
                      <div style={{ width: "40%" }} className="progress-bar" />
                    </div>
                  </div>
                </div>
              </div>
            </Ibox>
          </div>
        </div>

        {!isEmpty(this.state.patientToIssueClaim)
          ? this.renderClaimIssuingWidget()
          : null}

        <div className="row">
          <div className="col-lg-12">
            <Ibox title="환자 목록">
              <Wrapper>
                <Head>
                  <HeadColumn>#</HeadColumn>
                  <HeadColumn>환자 식별자</HeadColumn>
                  <HeadColumn>환자 생년</HeadColumn>
                  <HeadColumn>환자 성별</HeadColumn>
                  <HeadColumn>환자 주소</HeadColumn>
                  <HeadColumn>처방하기</HeadColumn>
                </Head>
                <Body>
                  {this.state.patients.map((patient, i) => (
                    <BodyRow>
                      <BodyColumn>{i + 1}</BodyColumn>
                      <BodyColumn>{patient.code}</BodyColumn>
                      <BodyColumn>{patient.yearOfBirth}</BodyColumn>
                      <BodyColumn>{patient.gender}</BodyColumn>
                      <BodyColumn>{patient.address}</BodyColumn>

                      <BodyColumn>
                        <button
                          className="btn btn-outline btn-primary"
                          onClick={() =>
                            this.setState({
                              patientToIssueClaim: patient
                            })
                          }
                        >
                          처방하기
                        </button>
                      </BodyColumn>
                    </BodyRow>
                  ))}
                </Body>
              </Wrapper>
            </Ibox>
          </div>
        </div>
      </PageLayout>
    )
  }
}

export default connect(state => ({
  providerAddress: state.providerContract.address,
  providerContractHash: state.providerContract.contractHash,
  patientContractHash: state.patientContract.contractHash
}))(IssueClaims)

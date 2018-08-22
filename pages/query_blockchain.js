import React from "react"
import PageLayout from "../layout/PageLayout"
import Ibox from "../component/Ibox"

export default class QueryBlockchain extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      patientsList: []
    }
  }
  getPatientsList = () => {}

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
          </div>
        </div>
      </PageLayout>
    )
  }
}

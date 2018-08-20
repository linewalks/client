import React from "react"
import PageLayout from "../layout/PageLayout"
import Ibox from "../component/Ibox"

export default class QueryBlockchain extends React.Component {
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
      </PageLayout>
    )
  }
}

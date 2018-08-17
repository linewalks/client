import Link from "next/link"

export default () => (
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
              <a className="dropdown-toggle">Patient</a>
            </Link>
          </li>
          <li className="dropdown">
            <Link href="/provider">
              <a className="dropdown-toggle">Provider</a>
            </Link>
          </li>

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

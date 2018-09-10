export default {
  Wrapper: ({ children }) => (
    <div className="table-responsive">
      <table className="table table-striped">{children}</table>
    </div>
  ),
  Head: ({ children }) => (
    <thead>
      <tr>{children}</tr>
    </thead>
  ),
  HeadColumn: ({ children }) => <th>{children}</th>,
  Body: ({ children }) => <tbody>{children}</tbody>,
  BodyRow: ({ children }) => <tr>{children}</tr>,
  BodyColumn: ({ children }) => (
    <td style={{ verticalAlign: "middle" }}>{children}</td>
  )
}

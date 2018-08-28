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
  Body: ({ children }) => (
    <tbody>
      <tr>{children}</tr>
    </tbody>
  ),
  BodyColumn: ({ children }) => <td>{children}</td>
}

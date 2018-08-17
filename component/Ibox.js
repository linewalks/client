const Ibox = ({ title, children }) => (
  <div className="ibox" style={{ marginBottom: "25px" }}>
    <div className="ibox-title">
      <h5>{title}</h5>
    </div>
    <div className="ibox-content">{children} </div>
  </div>
)
export default Ibox

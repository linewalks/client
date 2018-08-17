import Header from "../component/Header"
export default ({ children }) => {
  return (
    <div className="top-navigation">
      <div className="gray-bg">
        <Header />
        <div className="wrapper wrapper-content">
          <div className="container">{children}</div>
        </div>
      </div>
    </div>
  )
}

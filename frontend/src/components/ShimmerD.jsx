const Shimmer = ({ w, h, mb = 0 }) => (
  <div
    className="shimmer"
    style={{ width: w, height: h, marginBottom: mb }}
  />
);

const ShimmerD = () => (
  <div className="dashboard">
    <div className="header">
      <Shimmer w={280} h={32} mb={8} />
      <Shimmer w={200} h={24} />
    </div>

    <div className="nav">
      <Shimmer w={100} h={34} />
    </div>

    <div className="big-box">
      <div className="main">
        <div className="sessions-box">
          <Shimmer w={100} h={26} mb={14} />
          <div className="box-row">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border-box"
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
              >
                <Shimmer w={120} h={16} mb={8} />
                <Shimmer w={60} h={40} mb={6} />
                <Shimmer w={90} h={13} />
              </div>
            ))}
          </div>
        </div>

        <div className="machine-box" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Shimmer w={130} h={16} mb={12} />
          <Shimmer w={60} h={44} />
        </div>
      </div>

      <div className="personnel-box">
        <Shimmer w={150} h={22} mb={14} />
        <div className="personnel-row">
          {[1, 2, 3].map((i) => (
            <div key={i} className="personnel-card" style={{ padding: 14 }}>
              <Shimmer w={120} h={16} mb={12} />
              <Shimmer w={80} h={36} mb={8} />
              <Shimmer w={100} h={13} mb={6} />
              <Shimmer w={90} h={13} />
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="contact-box">
      <Shimmer w={100} h={22} mb={14} />
      <div className="contact-row">
        {[1, 2].map((i) => (
          <div key={i} className="contact-card" style={{ padding: 14 }}>
            <Shimmer w={160} h={16} mb={12} />
            <Shimmer w="90%" h={13} mb={8} />
            <Shimmer w="70%" h={36} mb={8} />
            <Shimmer w={120} h={34} mb={8} />
            <Shimmer w="80%" h={13} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ShimmerD;
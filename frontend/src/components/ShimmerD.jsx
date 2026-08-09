import React from "react";
import "./dashboard.css";

const Shimmer = ({ w = "100%", h = "20px", mb = 0, borderRadius = "6px" }) => (
  <div
    className="shimmer"
    style={{ width: w, height: h, marginBottom: mb, borderRadius }}
  />
);

const ShimmerD = () => (
  <div className="dashboard" style={{ background: "#F6F7FB", minHeight: "100vh", padding: "16px 24px" }}>
    {/* Skeleton Header Bar */}
    <div style={{ background: "#29377D", padding: "16px 24px", borderRadius: "8px", display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
      <Shimmer w="200px" h="24px" />
      <Shimmer w="90px" h="30px" borderRadius="6px" />
    </div>

    {/* Skeleton Nav */}
    <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Shimmer key={i} w="120px" h="36px" borderRadius="6px" />
      ))}
    </div>

    {/* Skeleton Title */}
    <Shimmer w="240px" h="28px" mb={20} />

    {/* Main Stats Skeleton */}
    <div className="main">
      <div className="sessions-box">
        <Shimmer w="120px" h="22px" mb={16} />
        <div className="box-row">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-box" style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Shimmer w="100px" h="14px" mb={10} />
              <Shimmer w="60px" h="36px" mb={8} />
              <Shimmer w="80px" h="12px" />
            </div>
          ))}
        </div>
      </div>

      <div className="machine-box" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px" }}>
        <Shimmer w="140px" h="14px" mb={14} />
        <Shimmer w="70px" h="40px" />
      </div>

      <div className="machine-box-inactive" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px" }}>
        <Shimmer w="140px" h="14px" mb={14} />
        <Shimmer w="70px" h="40px" />
      </div>
    </div>

    {/* Personnel Box Skeleton */}
    <div className="personnel-box" style={{ marginTop: "24px" }}>
      <Shimmer w="160px" h="22px" mb={16} />
      <div className="personnel-row">
        {[1, 2, 3].map((i) => (
          <div key={i} className="personnel-card" style={{ padding: "16px" }}>
            <Shimmer w="130px" h="16px" mb={14} />
            <Shimmer w="90%" h="24px" mb={10} />
            <Shimmer w="70%" h="14px" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ShimmerD;
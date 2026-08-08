// import React from "react";
// import Login from "./Login";
// import Dashboard from "./Dashboard";
// import { Routes, Route } from "react-router-dom";
// import CentreUpdates from "./CenterUpdates";
// import { useState,useEffect } from "react";

// const Body = () => {

//   return (
//     <div>
//       <Routes>
//         <Route path="/" element={<Login  />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/centre-updates" element={<CentreUpdates />} />
//       </Routes>
//     </div>
//   );
// };

// export default Body;

import React from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import { Routes, Route } from "react-router-dom";
import CentreUpdates from "./CenterUpdates";
import Layout from "./Layout";
import PartnerShare from "./PartnerShare";
import SessionPatient from "./SessionPatient";
import MaintainanceRepair from "./MaintainanceRepair";
import KeyDock from "./KeyDock";

const Placeholder = ({ title }) => (
  <div style={{ padding: "30px", fontSize: "20px", color: "#6b7280" }}>
    {title} — Coming soon
  </div>
);

const Body = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/centre-updates" element={<CentreUpdates />} />
          <Route
            path="/revenue-share" element={<PartnerShare />}
          />
          <Route
            path="/sessions-engagement"
            element={<SessionPatient />}
          />
          <Route
            path="/maintenance-repair"
            element={<MaintainanceRepair />}
          />
          <Route
            path="/keyDock"
            element={<KeyDock />}
          />
        </Route>
        
        
      </Routes>
    </div>
  );
};

export default Body;
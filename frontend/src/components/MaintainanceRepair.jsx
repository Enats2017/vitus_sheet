import React from "react";
import "./maintainanceRepair.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faScrewdriverWrench,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

import Contact from "./Contact";
import { useDashboard } from "./DashboardContext";

const MaintainanceRepair = () => {
  const { contact, machines, roData } = useDashboard();

  return (
    <>
      <div className="machines-wrapper">
        {/* ===== MACHINES ===== */}
        <h2 className="section-title">Machines</h2>

        <div className="machines-outer-box">
          <div className="machines-scroll-box">
            <div className="machines-grid">
              {machines.map((machine, index) => (
                <div className="machine-card" key={index}>
                  <div className="machine-header">
                    <h3>{machine.machine_number}</h3>
                  </div>

                  <div className="machine-body">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsTN-AMs7UOy4pbpkFmZV1lkc4eI42mhOPaA&s"
                      alt="machine"
                      className="machine-img"
                    />

                    <div className="machine-info">
                      <p>
                        <FontAwesomeIcon icon={faScrewdriverWrench} />
                        Last Maintenance:
                        <span>{machine.maintenance_date || "NA"}</span>
                      </p>

                      <p>
                        <FontAwesomeIcon icon={faStar} />
                        Last Repair:
                        <span>{machine.repair_date || "NA"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== RO PLANT ===== */}
        {/* ===== RO PLANT ===== */}
<div className="ro-card">
  <h2 className="section-title">RO Plant</h2>

  <div className="ro-grid">

    <div className="ro-item">
      <h4>Average Monthly TDS of Raw Water</h4>
      <p>{roData?.tds ?? "NA"}</p>
    </div>

    <div className="ro-item">
      <h4>Avg Monthly TDS of treated water</h4>
      <p>{roData?.avg_tds ?? "NA"}</p>
    </div>

    <div className="ro-item">
      <h4>Chlorine</h4>
      <p>{roData?.chlorine ?? "NA"}</p>
    </div>

    <div className="ro-item">
      <h4>Last Water Testing Date</h4>
      <p style={{ fontSize: "16px" }}>{roData?.water_test_date ?? "NA"}</p>
    </div>

  </div>
</div>
      </div>

      <Contact contact={contact} />
    </>
  );
};

export default MaintainanceRepair;
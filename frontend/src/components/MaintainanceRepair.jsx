import React from "react";
import "./maintainanceRepair.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faScrewdriverWrench,
  faStar,
  faLaptopMedical,
} from "@fortawesome/free-solid-svg-icons";

import Contact from "./Contact";
import { useDashboard } from "./DashboardContext";

const MaintainanceRepair = () => {
  const { contact, machines = [], roData } = useDashboard();

  return (
    <>
      <div className="machines-wrapper">
        {/* ===== MACHINES ===== */}
        <div className="machines-outer-box">
          <h2 className="section-title">Machines</h2>

          <div className="machines-scroll-box">
            <div className="machines-grid">
              {machines.map((machine, index) => (
                <div className="machine-card" key={index}>
                  <div className="machine-header">
                    <h3>{machine.machine_number}</h3>
                  </div>
                  <div className="machine-body">
                    <div className="machine-icon-box">
                      <img
                        src={machine.image || machine.photo || machine.img || machine.icon_url || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsTN-AMs7UOy4pbpkFmZV1lkc4eI42mhOPaA&s"}
                        alt={machine.machine_number || "Dialysis Machine"}
                        className="machine-img"
                      />
                    </div>

                    <div className="machine-info">
                      <div className="info-row">
                        <span className="info-label">
                          <FontAwesomeIcon icon={faScrewdriverWrench} className="info-icon" /> Last Maintenance:
                        </span>
                        <span className="info-val">{machine.maintenance_date || "NA"}</span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">
                          <FontAwesomeIcon icon={faStar} className="info-icon" /> Last Repair:
                        </span>
                        <span className="info-val">{machine.repair_date || "NA"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== RO PLANT ===== */}
        <div className="ro-card">
          <h2 className="section-title">RO Plant</h2>

          <div className="ro-grid">
            <div className="ro-item border-blue">
              <h4>Average Monthly TDS of Raw Water</h4>
              <h1>{roData?.tds ?? "NA"}</h1>
            </div>

            <div className="ro-item border-green">
              <h4>Avg Monthly TDS of Treated Water</h4>
              <h1>{roData?.avg_tds ?? "NA"}</h1>
            </div>

            <div className="ro-item border-orange">
              <h4>Chlorine</h4>
              <h1>{roData?.chlorine ?? "NA"}</h1>
            </div>

            <div className="ro-item border-navy">
              <h4>Last Water Testing Date</h4>
              <h1 className="ro-date-val">{roData?.water_test_date ?? "NA"}</h1>
            </div>
          </div>
        </div>
      </div>

      <Contact contact={contact} />
    </>
  );
};

export default MaintainanceRepair;
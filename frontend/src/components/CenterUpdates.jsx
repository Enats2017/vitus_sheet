import "./centreUpdates.css";
import Contact from "./Contact";
import { useDashboard } from "./DashboardContext";
import { useEffect, useState } from "react";


export default function CentreUpdates() {
  const { contact,updates } = useDashboard();
 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  

  return (
    <>
      <div className="big-box">
        <div className="updates-page">
          <div className="card">
            <h2 className="heading">Centre Updates</h2>

            <ul className="timeline-list">
              {!updates ? (
                <li className="timeline-item">
                  <div>Loading updates...</div>
                </li>
              ) : updates.length > 0 ? (
                updates.map((item, i) => (
                  <li key={i} className="timeline-item">
                    <div className="dot" />

                    <div>
                      <span className="dept">{item.department}:</span>{" "}
                      <span className="text">{item.update}</span>
                    </div>
                  </li>
                ))
              ) : (
                <li className="timeline-item">
                  <div>No updates found</div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="big-box">
        <Contact contact={contact} />
      </div>
    </>
  );
}

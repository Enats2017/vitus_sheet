import "./centreUpdates.css";
import Contact from "./Contact";
import { useDashboard } from "./DashboardContext";

export default function CentreUpdates() {
  const { contact, updates } = useDashboard();

  return (
    <>
      <div className="updates-page-wrapper">
        <div className="updates-card-shell">
          <h2 className="updates-heading">Centre Updates</h2>

          <ul className="timeline-list">
            {!updates ? (
              <li className="timeline-item">
                <div style={{ color: "#666880", fontSize: "14px" }}>Loading updates...</div>
              </li>
            ) : updates.length > 0 ? (
              updates.map((item, i) => (
                <li key={i} className="timeline-item">
                  <div className="dot" />
                  <div className="timeline-content">
                    <span className="dept">{item.department}:</span>{" "}
                    <span className="text">{item.update}</span>
                  </div>
                </li>
              ))
            ) : (
              <li className="timeline-item">
                <div style={{ color: "#666880", fontSize: "14px" }}>No updates found</div>
              </li>
            )}
          </ul>
        </div>
      </div>

      <Contact contact={contact} />
    </>
  );
}

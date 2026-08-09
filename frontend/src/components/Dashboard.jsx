import "./dashboard.css";
import Contact from "./Contact";
import PersonnelBox from "./PersonnelBox";
import { useDashboard } from "./DashboardContext";

// Utility: formats a date to "18 May" style
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });
};

const Dashboard = () => {
  const { session, contact, centre_personnel } = useDashboard();
  const { metrics } = session;

  return (
    <div className="dashboard">
      <div className="main">
        <div className="sessions-box">
          <h2>Sessions</h2>
          <div className="box-row">
            <div className="border-box green">
              <h4>MTD Sessions</h4>
              <h1>{metrics?.mtdSessions}</h1>
              <h3>
                as of {formatDate(new Date())}
              </h3>
            </div>
            <div className="border-box blue">
              <h4>Last Month Sessions</h4>
              <h1>{metrics?.lastMonthSessions}</h1>
            </div>
            <div className="border-box orange">
              <h4>Patients</h4>
              <h1>{metrics?.patients}</h1>
            </div>
          </div>
        </div>
        <div className="machine-box">
          <h4>Active Dialysis Machines</h4>
          <h1>{metrics?.activeMachines}</h1>
        </div>
        <div className="machine-box-inactive">
          <h4>Inactive Dialysis Machines</h4>
          <h1>{metrics?.inactiveMachines}</h1>
        </div>
      </div>
      <PersonnelBox personnel={centre_personnel} />

      <p className="footnote-text" style={{ marginTop: "12px" }}>
        Data is updated for previous month
      </p>

      <div style={{ marginTop: "24px" }}>
        <Contact contact={contact} />
      </div>
    </div>
  );
};

export default Dashboard;
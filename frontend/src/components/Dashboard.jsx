import "./Dashboard.css";
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
    <>
      <div className="big-box">
        <div className="dashboard">
          <div className="main">
            <div className="sessions-box">
              <h2 style={{ color: "white" }}>Sessions</h2>
              <div className="box-row">
                <div className="border-box green">
                  <h4>MTD Sessions</h4>
                  <h1>{metrics?.mtdSessions}</h1>
                  <h3 style={{ fontWeight: "500", margin: "4px 0" }}>
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
            <div className="border-box machine-box">
              <h4>Active Dialysis Machines</h4>
              <h1>{metrics?.activeMachines}</h1>
            </div>
            <div className="border-box machine-box-inactive">
                <h4>Inactive Dialysis Machines</h4>
                <h1>{metrics?.inactiveMachines}</h1>
              </div>
          </div>
          <PersonnelBox personnel={centre_personnel} />
        </div>
        <p style={{ marginTop: "10px", marginLeft: "10px" }}>
          Data is updated for previous month
        </p>
      </div>

      <div className="big-box">
        <Contact contact={contact} />
      </div>
    </>
  );
};

export default Dashboard;
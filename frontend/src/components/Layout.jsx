import { useEffect, useState } from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Header from "./Header";
import ShimmerD from "./ShimmerD";
import { DashboardContext } from "./DashboardContext";

const BASE = import.meta.env.VITE_API_BASE_URL;

const Layout = () => {
  const [layoutData, setLayoutData] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          sessionRes,
          contactRes,
          docRes,
          techRes,
          staffRes,
          updatesRes,
          revenueRes,
          monthRes,
          currentMonthUpdatesRes,
          machineRes,
          documentRes,
          revenueDocRes,
          roRes
        ] = await Promise.all([
          axios.get(`${BASE}/sheet/dashboard.php`, { withCredentials: true }),
          axios.get(`${BASE}/sheet/contactDetails.php`, {
            withCredentials: true,
          }),
          axios.get(`${BASE}/sheet/doctorDetails.php`, {
            withCredentials: true,
          }),
          axios.get(`${BASE}/sheet/technicianDetails.php`, {
            withCredentials: true,
          }),
          axios.get(`${BASE}/sheet/staffDetails.php`, {
            withCredentials: true,
          }),
          axios.get(`${BASE}/sheet/centerUpdates.php`, {
            withCredentials: true,
          }),
          axios.get(`${BASE}/sheet/revenueShare.php`, {
            withCredentials: true,
          }),
          axios.get(`${BASE}/sheet/getCurrentMonth.php`, {
            withCredentials: true,
          }),
          axios.get(`${BASE}/sheet/CurrentMonthUpdate.php`, {
            withCredentials: true,
          }),
          axios.get(`${BASE}/sheet/machineDetails.php`, {
            withCredentials: true,
          }),
          axios.get(`${BASE}/sheet/keyDoc.php`, {
            withCredentials: true,
          }),
          axios.get(`${BASE}/sheet/RevenueDoc.php`, {
            withCredentials: true,
          }),
           axios.get(`${BASE}/sheet/ro.php`, {
            withCredentials: true,
          }),
        ]);

        setLayoutData({
          session: sessionRes.data,
          contact: contactRes.data.contact_details,
          centre_personnel: {
            doctors: docRes.data.doctors,
            technicians: techRes.data.technicians,
            staff: staffRes.data.staff,
          },
          updates: updatesRes.data.updates,
          revenue: revenueRes.data,
          monthData: monthRes.data,
          currentMonthUpdates: currentMonthUpdatesRes.data.updates,
          machines: machineRes.data.records,
          documents: documentRes.data.documents,
          revenueDocuments: revenueDocRes.data.documents,
          roData:roRes.data
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchAll();
  }, []);

  if (!layoutData) return <ShimmerD />;
  console.log("SheetData:", {
    quick_access: layoutData?.session || [],
    dialysis: layoutData?.updates || [],
    revenue: layoutData?.revenue?.revenue || [],
  });

  return (
    <DashboardContext.Provider value={layoutData}>
      <Header session={layoutData.session} />
      <div className="nav">
        <Navbar />
      </div>
      <Outlet />
    </DashboardContext.Provider>
  );
};

export default Layout;

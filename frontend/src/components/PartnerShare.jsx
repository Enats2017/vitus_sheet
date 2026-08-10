import "./partnershare.css";
import "./KeyDock.css";
import { useDashboard } from "./DashboardContext";
import Contact from "./Contact";
import { useState } from "react";
import axios from "axios";
import Chart from "react-apexcharts";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
]

const BASE = import.meta.env.VITE_API_BASE_URL;

export default function PartnerShare() {
  const [activeIndex, setActiveIndex] = useState(null);

  const { session, contact, revenue, revenueDocuments } = useDashboard();

  const [filteredRevenue, setFilteredRevenue] = useState(revenue);
  const [loading, setLoading] = useState(false);

  const [fromMonth, setFromMonth] = useState("");
  const [fromYear, setFromYear] = useState("");
  const [toMonth, setToMonth] = useState("");
  const [toYear, setToYear] = useState("");

  const revenueData = filteredRevenue?.revenue || [];

  const months = revenueData.map((item) => item.month);
  const data = revenueData.map((item) => Number(item.revenue) / 1000);
  const totalRevenue = filteredRevenue?.totalRevenue || 0;

  const applyFilter = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/sheet/revenueShare.php`, {
        params: { fromMonth, fromYear, toMonth, toYear },
        withCredentials: true,
      });
      setFilteredRevenue(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilter = async () => {
    setFromMonth(""); setFromYear(""); setToMonth(""); setToYear("");
    setFilteredRevenue(revenue);
  };

  // ================= DOWNLOAD FILE =================
  const handleDownload = (link) => {
    if (!link) return;
    const fileIdMatch = link.match(/\/d\/(.*?)\//);
    if (!fileIdMatch) {
      window.open(link, "_blank");
      return;
    }
    const fileId = fileIdMatch[1];
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.setAttribute("download", "");
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // ✅ Flat data viz: Navy bars with a single red highlight bar for active/last index
  const colors = data.map((_, i) => {
    if (activeIndex !== null) {
      return activeIndex === i ? "#EE272A" : "#29377D";
    }
    // Highlight last bar in red as primary focus, others in Navy
    return i === data.length - 1 ? "#EE272A" : "#29377D";
  });

  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      background: "transparent",
      fontFamily: "'Inter', sans-serif",
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const i = config.dataPointIndex;
          setActiveIndex(activeIndex === i ? null : i);
        },
      },
    },

    xaxis: {
      categories: months,
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 600,
          colors: "#666880",
        },
      },
      axisBorder: {
        color: "#DEE1EA",
      },
      axisTicks: {
        color: "#DEE1EA",
      },
    },

    yaxis: {
      labels: {
        formatter: (val) => `${val}k`,
        style: {
          fontSize: "12px",
          fontWeight: 600,
          colors: "#666880",
        },
      },
    },

    plotOptions: {
      bar: {
        columnWidth: "35%",
        borderRadius: 4,
        distributed: true,
      },
    },

    dataLabels: {
      enabled: true,
      style: {
        colors: ["#FFFFFF"],
        fontSize: "11px",
        fontWeight: 700,
      },
      formatter: (val) => `${parseFloat(val.toFixed(1))}k`,
      offsetY: 0,
    },

    colors: colors,

    grid: {
      borderColor: "#DEE1EA",
      strokeDashArray: 0,
    },

    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "12px",
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
      labels: {
        colors: "#282E3D",
      },
      markers: {
        width: 12,
        height: 12,
        radius: 2,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 8,
      },
    },

    tooltip: {
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const month = w.globals.labels[dataPointIndex];
        const value = series[seriesIndex][dataPointIndex];
        return `
          <div style="
            background:#FFFFFF;
            border:1px solid #DEE1EA;
            border-radius:8px;
            padding:8px 12px;
            box-shadow:0 4px 12px rgba(41,55,125,0.1);
            font-family:'Inter', sans-serif;
          ">
            <div style="color:#29377D;font-weight:700;font-size:12px;margin-bottom:4px;">
              ${month}
            </div>
            <div style="color:#282E3D;font-size:13px;display:flex;align-items:center;gap:6px;">
              <span style="width:8px;height:8px;border-radius:50%;background:#EE272A;display:inline-block;"></span>
              Revenue: ₹${Math.round(value * 1000).toLocaleString()}
            </div>
          </div>
        `;
      },
    },
  };

  const series = [
    {
      name: "Revenue",
      data: data,
    },
  ];

  return (
    <>
      <div className="partner-container">
        {/* Top Card */}
        <div className="partner-card">
          <h2 className="title">Partner share</h2>

          <div className="filter-row">
            <div className="filter-group">
              <label>From</label>
              <div className="filter-inputs">
                <select value={fromMonth} onChange={(e) => setFromMonth(e.target.value)}>
                  <option value="">Month</option>
                  {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <input
                  type="number"
                  placeholder="Year"
                  value={fromYear}
                  onChange={(e) => setFromYear(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>To</label>
              <div className="filter-inputs">
                <select value={toMonth} onChange={(e) => setToMonth(e.target.value)}>
                  <option value="">Month</option>
                  {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <input
                  type="number"
                  placeholder="Year"
                  value={toYear}
                  onChange={(e) => setToYear(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-actions">
              <button className="btn-apply" onClick={applyFilter} disabled={loading}>
                {loading ? "Loading..." : "Apply"}
              </button>
              <button className="btn-reset" onClick={resetFilter} disabled={loading}>Reset</button>
            </div>
          </div>

          <div className="partner-content">
            <div className="income-box">
              <p className="label">Partner income generated</p>
              <h1 className="amount">₹{totalRevenue.toLocaleString()}</h1>
              <p className="sub">Till date</p>
            </div>

            <div className="chart-box">
              <h3 className="chart-title">Monthwise</h3>

              {data.length === 0 ? (
                <p>No Chart Found...</p>
              ) : (
                <Chart
                  options={options}
                  series={series}
                  type="bar"
                  height={340}
                />
              )}

              <p className="note">Data is updated for previous month</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="files-section">
          <h4>Revenue Sheets for previous months</h4>

          <div className="doc-grid" style={{marginTop:"25px"}}>
            {(revenueDocuments || []).length > 0 ? (
              revenueDocuments.map((doc, i) => (
                <div
                  key={i}
                  className="doc-item"
                  onClick={() => handleDownload(doc.link)}
                >
                  <div className="doc-icon">
                    <i className="fa-solid fa-file-lines"></i>
                  </div>
                  <p>{doc.text}</p>
                </div>
              ))
            ) : (
              <p>No documents found</p>
            )}
          </div>
          <p style={{
            marginTop: "20px",
            fontSize: "12px",
            color: "#666880",
            fontStyle: "italic",
            borderTop: "1px solid #DEE1EA",
            paddingTop: "12px"
          }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ color: "#C07C1E", marginRight: "6px" }}></i> <strong>Note:</strong> This data is only of the direct dialysis revenue share for the partner. Other additional revenue generated by the hospital is not included.
          </p>
        </div>
      </div>

      {/* Contact */}
      <div className="big-box">
        <Contact contact={contact} />
      </div>
    </>
  );
}
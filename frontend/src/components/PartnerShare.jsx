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

  // ✅ theme colors: red gradient bars, dimmed unselected bar
  const colors = data.map((_, i) => {
    if (activeIndex === null) return "#e02020";
    if (activeIndex === i) return "#ff5252";
    return "rgba(255,255,255,0.15)";
  });

  const options = {
   chart: {
      type: "bar",
      toolbar: { show: false },
      background: "transparent",
      parentHeightOffset: 0,
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
          fontSize: "13px",
          fontWeight: 600,
          colors: "#d7dae8", // ✅ visible on navy
        },
      },
      axisBorder: {
        color: "rgba(255,255,255,0.15)",
      },
      axisTicks: {
        color: "rgba(255,255,255,0.15)",
      },
    },

    yaxis: {
      labels: {
        formatter: (val) => `${val}k`,
        style: {
          fontSize: "12px",
          fontWeight: 600,
          colors: "#d7dae8", // ✅ visible on navy
        },
      },
    },

    plotOptions: {
      bar: {
        columnWidth: "30%",
        borderRadius: 4,
        distributed: true,
      },
    },

    dataLabels: {
      enabled: true,
      style: {
        colors: ["#ffffff"], // ✅ readable value labels
        fontSize: "12px",
        fontWeight: 700,
      },
      formatter: (val) => {
        return `${parseFloat(val.toFixed(1))}k`;
      },
    },

    colors: colors,

    grid: {
      borderColor: "rgba(255,255,255,0.08)", // ✅ faint gridlines, not harsh white
      strokeDashArray: 0,
    },

  legend: {
      position: "bottom",
      horizontalAlign: "center",
      floating: false,
      offsetY: 8,
      itemMargin: {
        horizontal: 14,
        vertical: 8,
      },
      markers: {
        width: 10,
        height: 10,
        radius: 3,
        fillColors: months.map(() => "#e02020"),
        offsetX: -2,
      },
      labels: {
        colors: "#d7dae8",
        useSeriesColors: false,
      },
    },

tooltip: {
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const month = w.globals.labels[dataPointIndex];
        const value = series[seriesIndex][dataPointIndex];
        return `
          <div style="
            background:#1e1b5e;
            border:1px solid rgba(255,255,255,0.15);
            border-radius:8px;
            padding:8px 12px;
            box-shadow:0 6px 16px rgba(0,0,0,0.4);
          ">
            <div style="color:#ffffff;font-weight:700;font-size:13px;margin-bottom:4px;">
              ${month}
            </div>
            <div style="color:#ffffff;font-size:13px;display:flex;align-items:center;gap:6px;">
              <span style="width:8px;height:8px;border-radius:50%;background:#e02020;display:inline-block;"></span>
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

            <div className="filter-group">
              <label>To</label>
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

            <button onClick={applyFilter} disabled={loading}>
              {loading ? "Loading..." : "Apply"}
            </button>
            <button onClick={resetFilter} disabled={loading}>Reset</button>
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
                  height={300}
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
                  <div className="doc-icon">📄</div>
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
            color: "rgba(255,255,255,0.6)",
            fontStyle: "italic",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: "12px"
          }}>
            ⚠️ <strong>Note:</strong> This data is only of the direct dialysis revenue share for the partner. Other additional revenue generated by the hospital is not included.
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
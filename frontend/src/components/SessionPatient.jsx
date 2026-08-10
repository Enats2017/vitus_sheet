import React, { useState, useEffect, useRef } from "react";
import "./sessionpatient.css";
import { useDashboard } from "./DashboardContext";
import Contact from "./Contact";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
const BASE = import.meta.env.VITE_API_BASE_URL;

const SessionPatient = () => {
    const [loading, setLoading] = useState(false);
    const { contact, monthData, currentMonthUpdates, session } = useDashboard();
    const { metrics } = session;
    const { postedDates } = metrics;
    const listRef = useRef(null);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [filterApplied, setFilterApplied] = useState(false);
    const [error, setError] = useState(null);
    const [totalPatients, setTotalPatients] = useState(0);

    const postedDatesFromContext = session?.metrics?.postedDates;
    const totalMonthlyPatients = totalPatients;

    const monthlyTotalRow = {
        date: <strong>All Data (Overall)</strong>,
        count: <strong>{totalMonthlyPatients || 0}</strong>,
    };

    const defaultData =
        tableData.length > 0 ? tableData : postedDatesFromContext;

    const tableDataSafe = filterApplied
        ? tableData
        : [monthlyTotalRow, ...(defaultData || [])];

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const handleRefresh = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${BASE}/sheet/filterTotalPatients.php`,
                {
                    params: {
                        startDate: "2000-01-01",
                        endDate: formatDate(new Date()),
                    },
                    withCredentials: true,
                },
            );

            if (res.data.status === "success") {
                setTableData(res.data.dailyData || []);
                setTotalPatients(res.data.totalPatients || 0);
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        handleRefresh();
    }, []);

    useEffect(() => {
        if (listRef.current) {
            const items = listRef.current.querySelectorAll("li");
            const count = items.length;
            const lineHeight = count * 40;
            listRef.current.style.setProperty(
                "--line-height",
                `${lineHeight}px`,
            );
        }
    }, [currentMonthUpdates]);

    const applyFilter = async () => {
        if (!startDate && !endDate) {
            setError("Please select start date and end date");
            return;
        }

        if (!startDate) {
            setError("Start date is required");
            return;
        }

        if (!endDate) {
            setError("End date is required");
            return;
        }

        setLoading(true);
        setFilterApplied(true);
        setError(null);

        try {
            const res = await axios.get(
                `${BASE}/sheet/filterTotalPatients.php`,
                {
                    params: {
                        startDate: formatDate(startDate),
                        endDate: formatDate(endDate),
                    },
                    withCredentials: true,
                },
            );

            if (res.data.status === "success" && res.data.totalPatients > 0) {
                setTotalPatients(res.data.totalPatients);

                const totalRow = {
                    date: (
                        <strong>
                            {res.data.startDate} - {res.data.endDate} (Overall
                            Data)
                        </strong>
                    ),
                    count: <strong>{res.data.totalPatients}</strong>,
                };

                const dailyRows = res.data.dailyData || [];
                setTableData([totalRow, ...dailyRows]);
            } else {
                setTableData([]);
                setError("No data found for selected date range");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong while applying filter");
            setTableData([]);
        }

        setLoading(false);
    };

    const clearFilter = async () => {
        setStartDate(null);
        setEndDate(null);
        setFilterApplied(false);
        setError(null);
        handleRefresh();
    };

    const downloadExcel = () => {
        const data = tableDataSafe.map((item) => ({
            Day: item.date,
            Count: item.count,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sessions");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const file = new Blob([excelBuffer], {
            type: "application/octet-stream",
        });

        saveAs(file, "sessions.xlsx");
    };

    return (
        <div className="session-patient">
            {/* ================= PEO ================= */}
            <div className="peo-outer-box">
                <div className="card-peo">
                    <h2 className="peo-title">PEO Activities</h2>
                    <div className="peo-line"></div>

                    <div className="peo-container">
                        <div className="peo-left">
                            <div className="peo-stat-box">
                                <p>New patients added</p>
                                <h1>{monthData?.count || 0}</h1>
                                <span>In {monthData?.month || ""}</span>
                            </div>

                            <div className="peo-stat-box overall">
                                <p>Overall patients</p>
                                <h1>{monthData?.overallCount || 0}</h1>
                                <span>Till date</span>
                            </div>
                        </div>

                        <div className="peo-list-container">
                            <ul className="peo-list" ref={listRef}>
                                {currentMonthUpdates?.length > 0 ? (
                                    currentMonthUpdates.map((item, index) => (
                                        <li key={index}>
                                            <span className="dote"></span>
                                            <span className="text">
                                                {item.department} -{" "}
                                                {item.update}
                                            </span>
                                        </li>
                                    ))
                                ) : (
                                    <li>No updates for this month</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= SESSIONS ================= */}
            <div className="sessions-card">
                <h2 className="sessions-title">Sessions</h2>

                <div className="sessions-container">
                    {/* FILTER BOX */}
                    <div className="filters-box">
                        <h3>Filters</h3>

                        <div className="filter-group">
                            <label>Start Date</label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="Select start date"
                                className="date-input"
                            />
                        </div>

                        <div className="filter-group">
                            <label>End Date</label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                placeholderText="Select end date"
                                className="date-input"
                            />
                        </div>

                        <div className="filter-actions">
                            <button
                                className="apply-filter-btn"
                                onClick={applyFilter}
                            >
                                Apply Filter
                            </button>

                            {filterApplied && (
                                <button
                                    className="clear-filter-btn"
                                    onClick={clearFilter}
                                >
                                    Clear Filter
                                </button>
                            )}
                        </div>

                        {error && (
                            <p style={{ color: "#EE272A", marginTop: "10px", fontSize: "12px" }}>
                                {error}
                            </p>
                        )}
                    </div>

                    {/* TABLE */}
                    <div className="table-box">
                        <div className="table-scroll">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Day</th>
                                        <th>Count</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="2">
                                                <div className="table-spinner">
                                                    <div className="spinner"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : tableDataSafe.length > 0 ? (
                                        tableDataSafe.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.date}</td>
                                                <td>{item.count}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2">
                                                No data available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="table-footer-actions">
                            <span>{tableDataSafe.length} results</span>

                            <div className="table-actions">
                                <button
                                    className="download-btn"
                                    onClick={downloadExcel}
                                >
                                    <FontAwesomeIcon icon={faDownload} />
                                </button>

                                <button
                                    className="refresh-btn"
                                    onClick={handleRefresh}
                                >
                                    <FontAwesomeIcon icon={faArrowsRotate} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Contact contact={contact} />
        </div>
    );
};

export default SessionPatient;

import { useState } from "react";
import "./contact.css";

const BASE = import.meta.env.VITE_API_BASE_URL;

const Contact = ({ contact }) => {
    const [feedback, setFeedback] = useState("");
    const [status, setStatus] = useState("");
    const [activeContact, setActiveContact] = useState(null);

    const phone = JSON.parse(localStorage.getItem("loginData") || "{}")?.phone;

    if (!contact) {
        return (
            <p style={{ marginLeft: "100px", marginTop: "10px", color: "#666880" }}>
                No Contacts
            </p>
        );
    }

    const handleSend = async () => {
        if (!feedback.trim()) {
            setStatus("empty");
            return;
        }
        setStatus("sending");
        try {
            const res = await fetch(`${BASE}/sheet/send-mail.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ feedback }),
            });
            const data = await res.json();
            if (data.success) {
                setStatus("success");
                setFeedback("");
            } else {
                setStatus("error");
            }
        } catch (err) {
            setStatus("error");
        }
    };

    const isMobile = () => window.innerWidth <= 768;

    const points = [
        {
            label: "Operations",
            name: contact.operations,
            phone: contact.operations_no,
        },
        {
            label: "Biomedical",
            name: contact.biomedical,
            phone: contact.biomedical_no,
        },
        {
            label: "Clinical",
            name: contact.clinical,
            phone: contact.clinical_no,
        },
        {
            label: "Centre Partnership",
            name: contact.partnership,
            phone: contact.partnership_no,
        },
        { label: "Finance", name: contact.finance, phone: contact.finance_no },
        {
            label: "Patient Engagement",
            name: contact.patient_engagement,
            phone: contact.patient_engagement_no,
        },
    ];

    const handleIconClick = (index, phone) => {
        if (isMobile()) {
            window.location.href = `tel:${phone}`;
        } else {
            setActiveContact(activeContact === index ? null : index);
        }
    };

    const handleWhatsAppClick = (phone) => {
        const cleanPhone = phone.replace(/\D/g, "");
        const fullPhone =
            cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
        window.open(`https://wa.me/${fullPhone}`, "_blank");
    };

    return (
        <div className="contact-box">
            <h2>Contact</h2>

            <div className="helpline-banner">
                <a
                    href={`tel:${phone}`}
                    className="helpline-icon"
                    style={{ textDecoration: "none", color: "#29377D", display: "flex", alignItems: "center" }}
                >
                    <i className="fa-solid fa-phone" style={{ fontSize: "24px" }}></i>
                </a>
                <span
                    onClick={() =>
                        handleWhatsAppClick(contact?.whatsapp_no || phone)
                    }
                    className="helpline-icon"
                    style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                    title="Open WhatsApp"
                >
                    <i
                        className="fa-brands fa-whatsapp"
                        style={{ color: "#25D366", fontSize: "26px" }}
                    ></i>
                </span>
                <span className="helpline-label">Central Helpline</span>
                <span className="helpline-number">{phone}</span>
            </div>

            <div className="contact-row">
                <div className="contact-card">
                    <h4>Share Feedforward</h4>
                    <div className="contact-info">
                        <p>
                            <strong>
                                Please enter your feedforward in the box below:
                            </strong>
                        </p>
                        <textarea
                            placeholder="Enter your feedforward here..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        />
                        {status === "empty" && (
                            <p style={{ color: "#C07C1E", margin: "6px 0", fontSize: "13px" }}>
                                Please enter some feedback before sending.
                            </p>
                        )}
                        {status === "sending" && (
                            <p style={{ color: "#666880", margin: "6px 0", fontSize: "13px" }}>
                                Sending...
                            </p>
                        )}
                        {status === "success" && (
                            <p style={{ color: "#2E9E6D", margin: "6px 0", fontSize: "13px" }}>
                                Feedback sent successfully!
                            </p>
                        )}
                        {status === "error" && (
                            <p style={{ color: "#EE272A", margin: "6px 0", fontSize: "13px" }}>
                                Failed to send. Please try again.
                            </p>
                        )}
                        <button
                            onClick={handleSend}
                            disabled={status === "sending"}
                            style={{
                                cursor:
                                    status === "sending"
                                        ? "not-allowed"
                                        : "pointer",
                                opacity: status === "sending" ? 0.7 : 1,
                            }}
                        >
                            {status === "sending" ? "Sending..." : "Send Email"}
                        </button>
                    </div>
                </div>

                <div className="contact-card">
                    <h4>Points of Contact</h4>
                    <div className="contact-info" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {points.map((point, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "10px 14px",
                                    background: "#EEF0F8",
                                    borderRadius: "8px",
                                    border: "1px solid #DEE1EA",
                                }}
                            >
                                {point.phone ? (
                                    <a
                                        href={`tel:${point.phone}`}
                                        style={{ textDecoration: "none", color: "#29377D", display: "flex", alignItems: "center" }}
                                        title={`Call ${point.name || point.label}`}
                                    >
                                        <i className="fa-solid fa-phone" style={{ fontSize: "16px" }}></i>
                                    </a>
                                ) : (
                                    <i className="fa-solid fa-phone" style={{ fontSize: "16px", color: "#666880" }}></i>
                                )}

                                {point.phone && (
                                    <span
                                        onClick={() => handleWhatsAppClick(point.phone)}
                                        style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                                        title="Open WhatsApp"
                                    >
                                        <i className="fa-brands fa-whatsapp" style={{ color: "#25D366", fontSize: "18px" }}></i>
                                    </span>
                                )}

                                <span style={{ fontSize: "14px", fontWeight: "600", color: "#282E3D" }}>
                                    {point.label}: <span style={{ fontWeight: "500" }}>{point.name || "—"}</span>
                                </span>

                                {point.phone && (
                                    <a
                                        href={`tel:${point.phone}`}
                                        style={{
                                            marginLeft: "auto",
                                            color: "#29377D",
                                            fontWeight: "700",
                                            fontSize: "15px",
                                            textDecoration: "none",
                                            fontFamily: "'Inter', sans-serif"
                                        }}
                                    >
                                        {point.phone}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

import { useState } from "react";
import "./Contact.css";

const BASE = import.meta.env.VITE_API_BASE_URL;

const Contact = ({ contact }) => {
    const [feedback, setFeedback] = useState("");
    const [status, setStatus] = useState("");
    const [activeContact, setActiveContact] = useState(null);

    const phone = JSON.parse(localStorage.getItem("loginData") || "{}")?.phone; // ← ADDED

    if (!contact) {
        return (
            <p style={{ marginLeft: "100px", marginTop: "10px" }}>
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
        // { label: "WhatsApp",           name: contact.whatsapp_no,        phone: contact.whatsapp_no },
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
                    style={{ textDecoration: "none" }}
                >
                    📞
                </a>
                <span
                    onClick={() =>
                        handleWhatsAppClick(contact?.whatsapp_no || phone)
                    }
                    className="helpline-icon"
                    style={{ cursor: "pointer" }}
                    title="Open WhatsApp"
                >
                    <i
                        className="fa-brands fa-whatsapp"
                        style={{ color: "#25D366" }}
                    ></i>
                </span>
                <span className="helpline-label">Central Helpline</span>
                <span className="helpline-number">{phone}</span>{" "}
                {/* ← CHANGED */}
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
                            <p style={{ color: "orange", margin: "6px 0" }}>
                                ⚠️ Please enter some feedback before sending.
                            </p>
                        )}
                        {status === "sending" && (
                            <p style={{ color: "gray", margin: "6px 0" }}>
                                ⏳ Sending...
                            </p>
                        )}
                        {status === "success" && (
                            <p style={{ color: "green", margin: "6px 0" }}>
                                ✅ Feedback sent successfully!
                            </p>
                        )}
                        {status === "error" && (
                            <p style={{ color: "red", margin: "6px 0" }}>
                                ❌ Failed to send. Please try again.
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
                    <div className="contact-info">
                        {points.map((point, index) => (
                            <p
                                key={index}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <span
                                    onClick={() =>
                                        handleIconClick(index, point.phone)
                                    }
                                    style={{
                                        cursor: "pointer",
                                        fontSize: "16px",
                                        color: "#c2185b",
                                        flexShrink: 0,
                                    }}
                                    title={
                                        isMobile()
                                            ? `Call ${point.label}`
                                            : "Click to see number"
                                    }
                                >
                                    📞
                                </span>
                                <span>
                                    {point.label}: {point.name}
                                </span>
                                {activeContact === index && (
                                    <span
                                        style={{
                                            marginLeft: "auto",
                                            color: "#c2185b",
                                            fontWeight: "500",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {point.phone}
                                    </span>
                                )}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

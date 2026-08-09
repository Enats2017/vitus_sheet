import "./dashboard.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faChevronLeft, faChevronRight, faMobileScreenButton } from "@fortawesome/free-solid-svg-icons";

const PersonnelBox = ({ personnel }) => {
  const [currentDoc, setCurrentDoc] = useState(0);
  const [currentTech, setCurrentTech] = useState(0);
  const [currentStaff, setCurrentStaff] = useState(0);
  const [revealedPhone, setRevealedPhone] = useState(null);

  const doctors = personnel?.doctors || [];
  const technicians = personnel?.technicians || [];
  const staff = personnel?.staff || [];

  const prevDoc = () => { setCurrentDoc((p) => p - 1); setRevealedPhone(null); };
  const nextDoc = () => { setCurrentDoc((p) => p + 1); setRevealedPhone(null); };

  const prevTech = () => { setCurrentTech((p) => p - 1); setRevealedPhone(null); };
  const nextTech = () => { setCurrentTech((p) => p + 1); setRevealedPhone(null); };

  const prevStaff = () => { setCurrentStaff((p) => p - 1); setRevealedPhone(null); };
  const nextStaff = () => { setCurrentStaff((p) => p + 1); setRevealedPhone(null); };

  const isMobile = () =>
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    window.matchMedia("(max-width: 768px)").matches;

  const handleCallClick = (phone, key) => {
    if (!phone) return;
    if (isMobile()) {
      window.location.href = `tel:${phone}`;
    } else {
      setRevealedPhone(revealedPhone === key ? null : key);
    }
  };

  const CallButton = ({ phone, cardKey }) => {
    if (!phone) return null;
    const isRevealed = revealedPhone === cardKey;
    return (
      <button
        className={`call-icon-btn ${isRevealed ? "revealed" : ""}`}
        onClick={() => handleCallClick(phone, cardKey)}
        title={isMobile() ? `Call ${phone}` : "Click to reveal number"}
      >
        <FontAwesomeIcon icon={faPhone} style={{ color: "#29377D", fontSize: "13px" }} />
      </button>
    );
  };

  return (
    <div className="personnel-box">
      <h2>Centre Personnel</h2>

      <div className="personnel-row">

        {/* ───── Doctors ───── */}
        <div className="personnel-card green">
          <h4>
            <span>Consulting Nephrologist</span>
            {doctors.length > 0 && (
              <span className="doc-number">#{currentDoc + 1}</span>
            )}
          </h4>

          <div className="personnel-info">
            {doctors.length > 0 ? (
              <>
                <div className="doctor-name-row">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CallButton
                      phone={doctors[currentDoc]?.phone}
                      cardKey={`doc-${currentDoc}`}
                    />
                    <p className="personnel-name">
                      <strong>{doctors[currentDoc]?.name}</strong>
                    </p>
                  </div>

                  {doctors.length > 1 && (
                    <span className="slide-arrows">
                      <button 
                        className="arrow-btn" 
                        onClick={prevDoc} 
                        disabled={currentDoc === 0}
                        style={{ opacity: currentDoc === 0 ? 0.4 : 1 }}
                      >
                        <FontAwesomeIcon icon={faChevronLeft} />
                      </button>
                      <button 
                        className="arrow-btn" 
                        onClick={nextDoc} 
                        disabled={currentDoc === doctors.length - 1}
                        style={{ opacity: currentDoc === doctors.length - 1 ? 0.4 : 1 }}
                      >
                        <FontAwesomeIcon icon={faChevronRight} />
                      </button>
                    </span>
                  )}
                </div>

                {revealedPhone === `doc-${currentDoc}` && (
                  <p className="phone-reveal">
                    <FontAwesomeIcon icon={faMobileScreenButton} style={{ marginRight: "6px" }} />
                    {doctors[currentDoc]?.phone}
                  </p>
                )}

                <p className="visiting-text">Visiting: {doctors[currentDoc]?.visiting}</p>
              </>
            ) : (
              <p style={{ color: "#666880", margin: 0 }}>No doctors found</p>
            )}
          </div>
        </div>

        {/* ───── Technicians ───── */}
        <div className="personnel-card blue">
          <h4>
            <span>Technicians</span>
            {technicians.length > 0 && (
              <span className="doc-number">#{currentTech + 1}</span>
            )}
          </h4>

          <div className="personnel-info">
            {technicians.length > 0 ? (
              <>
                <div className="doctor-name-row">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CallButton
                      phone={technicians[currentTech]?.phone}
                      cardKey={`tech-${currentTech}`}
                    />
                    <p className="personnel-name">
                      <strong>{technicians[currentTech]?.name}</strong>
                    </p>
                  </div>

                  {technicians.length > 1 && (
                    <span className="slide-arrows">
                      <button 
                        className="arrow-btn" 
                        onClick={prevTech} 
                        disabled={currentTech === 0}
                        style={{ opacity: currentTech === 0 ? 0.4 : 1 }}
                      >
                        <FontAwesomeIcon icon={faChevronLeft} />
                      </button>
                      <button 
                        className="arrow-btn" 
                        onClick={nextTech} 
                        disabled={currentTech === technicians.length - 1}
                        style={{ opacity: currentTech === technicians.length - 1 ? 0.4 : 1 }}
                      >
                        <FontAwesomeIcon icon={faChevronRight} />
                      </button>
                    </span>
                  )}
                </div>

                {revealedPhone === `tech-${currentTech}` && (
                  <p className="phone-reveal">
                    <FontAwesomeIcon icon={faMobileScreenButton} style={{ marginRight: "6px" }} />
                    {technicians[currentTech]?.phone}
                  </p>
                )}
              </>
            ) : (
              <p style={{ color: "#666880", margin: 0 }}>No technicians found</p>
            )}
          </div>
        </div>

        {/* ───── Staff ───── */}
        <div className="personnel-card orange">
          <h4>
            <span>Other Staff</span>
            {staff.length > 0 && (
              <span className="doc-number">#{currentStaff + 1}</span>
            )}
          </h4>

          <div className="personnel-info">
            {staff.length > 0 ? (
              <>
                <div className="doctor-name-row">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CallButton
                      phone={staff[currentStaff]?.phone}
                      cardKey={`staff-${currentStaff}`}
                    />
                    <p className="personnel-name">
                      <strong>{staff[currentStaff]?.name}</strong>
                    </p>
                  </div>

                  {staff.length > 1 && (
                    <span className="slide-arrows">
                      <button 
                        className="arrow-btn" 
                        onClick={prevStaff} 
                        disabled={currentStaff === 0}
                        style={{ opacity: currentStaff === 0 ? 0.4 : 1 }}
                      >
                        <FontAwesomeIcon icon={faChevronLeft} />
                      </button>
                      <button 
                        className="arrow-btn" 
                        onClick={nextStaff} 
                        disabled={currentStaff === staff.length - 1}
                        style={{ opacity: currentStaff === staff.length - 1 ? 0.4 : 1 }}
                      >
                        <FontAwesomeIcon icon={faChevronRight} />
                      </button>
                    </span>
                  )}
                </div>

                {revealedPhone === `staff-${currentStaff}` && (
                  <p className="phone-reveal">
                    <FontAwesomeIcon icon={faMobileScreenButton} style={{ marginRight: "6px" }} />
                    {staff[currentStaff]?.phone}
                  </p>
                )}
              </>
            ) : (
              <p style={{ color: "#666880", margin: 0 }}>No staff found</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PersonnelBox;
import "./Dashboard.css";
import { useState } from "react";

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
        📞
      </button>
    );
  };

  return (
    <div className="personnel-box">
      <h2 style={{ color: "white" }}>Centre Personnel</h2>

      <div className="personnel-row">

        {/* ───── Doctors ───── */}
        <div className="personnel-card green">
          <h4>
            Consulting Nephrologist
            {doctors.length > 0 && (
              <span className="doc-number">#{currentDoc + 1}</span>
            )}
          </h4>

          <div className="personnel-info">
            {doctors.length > 0 ? (
              <>
                <div className="doctor-name-row">
                  <CallButton
                    phone={doctors[currentDoc]?.phone}
                    cardKey={`doc-${currentDoc}`}
                  />
                  <p className="personnel-name">
                    <strong>{doctors[currentDoc]?.name}</strong>
                  </p>

                  {doctors.length > 1 && (
                    <span className="slide-arrows">
                      {currentDoc > 0 && (
                        <button className="arrow-btn" onClick={prevDoc}>&#8592;</button>
                      )}
                      {currentDoc < doctors.length - 1 && (
                        <button className="arrow-btn" onClick={nextDoc}>&#8594;</button>
                      )}
                    </span>
                  )}
                </div>

                {revealedPhone === `doc-${currentDoc}` && (
                  <p className="phone-reveal">📱 {doctors[currentDoc]?.phone}</p>
                )}

                <p className="visiting-text">Visiting: {doctors[currentDoc]?.visiting}</p>
              </>
            ) : (
              <p>No doctors found</p>
            )}
          </div>
        </div>

        {/* ───── Technicians ───── */}
        <div className="personnel-card blue">
          <h4>
            Technicians
            {technicians.length > 0 && (
              <span className="doc-number">#{currentTech + 1}</span>
            )}
          </h4>

          <div className="personnel-info">
            {technicians.length > 0 ? (
              <>
                <div className="doctor-name-row">
                  <CallButton
                    phone={technicians[currentTech]?.phone}
                    cardKey={`tech-${currentTech}`}
                  />
                  <p className="personnel-name">
                    <strong>{technicians[currentTech]?.name}</strong>
                  </p>

                  {technicians.length > 1 && (
                    <span className="slide-arrows">
                      {currentTech > 0 && (
                        <button className="arrow-btn" onClick={prevTech}>&#8592;</button>
                      )}
                      {currentTech < technicians.length - 1 && (
                        <button className="arrow-btn" onClick={nextTech}>&#8594;</button>
                      )}
                    </span>
                  )}
                </div>

                {revealedPhone === `tech-${currentTech}` && (
                  <p className="phone-reveal">📱 {technicians[currentTech]?.phone}</p>
                )}

                
              </>
            ) : (
              <p>No technicians found</p>
            )}
          </div>
        </div>

        {/* ───── Staff ───── */}
        <div className="personnel-card orange">
          <h4>
            Other Staff
            {staff.length > 0 && (
              <span className="doc-number">#{currentStaff + 1}</span>
            )}
          </h4>

          <div className="personnel-info">
            {staff.length > 0 ? (
              <>
                <div className="doctor-name-row">
                  <CallButton
                    phone={staff[currentStaff]?.phone}
                    cardKey={`staff-${currentStaff}`}
                  />
                  <p className="personnel-name">
                    <strong>{staff[currentStaff]?.name}</strong>
                  </p>

                  {staff.length > 1 && (
                    <span className="slide-arrows">
                      {currentStaff > 0 && (
                        <button className="arrow-btn" onClick={prevStaff}>&#8592;</button>
                      )}
                      {currentStaff < staff.length - 1 && (
                        <button className="arrow-btn" onClick={nextStaff}>&#8594;</button>
                      )}
                    </span>
                  )}
                </div>

                {revealedPhone === `staff-${currentStaff}` && (
                  <p className="phone-reveal">📱 {staff[currentStaff]?.phone}</p>
                )}

            
              </>
            ) : (
              <p>No staff found</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PersonnelBox;
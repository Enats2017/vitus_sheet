import React from "react";
import "./KeyDock.css";

import Contact from "./Contact";
import { useDashboard } from "./DashboardContext";

const KeyDock = () => {

  const { contact, documents } = useDashboard();

  // ================= DOWNLOAD FILE =================
const handleDownload = (link) => {

  if (!link) return;

  const fileIdMatch = link.match(/\/d\/(.*?)\//);

  if (!fileIdMatch) {
    window.open(link, "_blank");
    return;
  }

  const fileId = fileIdMatch[1];

  const downloadUrl =
    `https://drive.google.com/uc?export=download&id=${fileId}`;

  const a = document.createElement("a");

  a.href = downloadUrl;

  a.setAttribute("download", "");

  document.body.appendChild(a);

  a.click();

  a.remove();
};

  return (
    <>
      <div className="doc-container">

        <div className="doc-grid">

          {documents && documents.length > 0 ? (

            documents.map((doc, index) => (

              <div
                key={index}
                className="doc-item"
                onClick={() => handleDownload(doc.link)}
              >

                <div className="doc-icon">📄</div>

                <p>{doc.text}</p>
                {doc.valid_upto && (
    <span className="doc-valid">Valid Upto: {doc.valid_upto}</span>
  )}

              </div>
            ))

          ) : (

            <p>No documents found</p>

          )}

        </div>
      </div>

      <Contact contact={contact} />
    </>
  );
};

export default KeyDock;
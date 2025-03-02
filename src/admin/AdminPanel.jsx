import React, { useState } from "react";
import "./adminPanel.scss"; // Updated styles

// Import the four sections:
import EntradasSection from "./EntradasSection"; 
import EventoSection from "./EventoSection";
import PreventasSection from "./PreventasSection";
import QrSection from "./QrSection";

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState("entradas");

  return (
    <div className="admin-panel">
      {/* Fixed Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">Envuelto Admin</div>
        <nav className="sidebar-nav">
          <button
            className={activeSection === "entradas" ? "active" : ""}
            onClick={() => setActiveSection("entradas")}
          >
            Entradas
          </button>
          <button
            className={activeSection === "evento" ? "active" : ""}
            onClick={() => setActiveSection("evento")}
          >
            Evento
          </button>
          <button
            className={activeSection === "preventas" ? "active" : ""}
            onClick={() => setActiveSection("preventas")}
          >
            Preventas
          </button>
          <button
            className={activeSection === "qr" ? "active" : ""}
            onClick={() => setActiveSection("qr")}
          >
            QR
          </button>
        </nav>
      </aside>

      {/* Main Content rendered with a left margin to avoid being overlapped by the sidebar */}
      <main className="main-content">
        {activeSection === "entradas" && <EntradasSection />}
        {activeSection === "evento" && <EventoSection />}
        {activeSection === "preventas" && <PreventasSection />}
        {activeSection === "qr" && <QrSection />}
      </main>
    </div>
  );
}

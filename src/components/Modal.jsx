import React from "react";
import "../styles/Modal.css";

export default function Modal({ isOpen, onClose, children, lista = [] }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        {children}

        {lista.length > 0 && (
          <ul style={{ marginTop: "1rem" }}>
            {lista.map((ev) => (
              <li key={ev.id}>
                🔥 <strong>{ev.titulo}</strong> — prazo: {ev.due_date}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

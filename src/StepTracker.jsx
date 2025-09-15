import { useState } from "react";
import "./styles/StepTracker.css";

const STATUS = ["Não iniciado", "Em progresso", "Finalizado"];

export default function EventStepTracker() {
  const [events, setEvents] = useState([
    {
      id: 1,
      titulo: "Criação de Vídeo",
      steps: [
        { id: 1, titulo: "Gravação", status: "Não iniciado" },
        { id: 2, titulo: "Edição", status: "Não iniciado" },
      ],
    },
  ]);

  const [novoEvento, setNovoEvento] = useState("");
  const [novoStep, setNovoStep] = useState("");

  // Criar novo evento
  const addEvento = () => {
    if (!novoEvento.trim()) return;
    const evento = {
      id: Date.now(),
      titulo: novoEvento.trim(),
      steps: [],
    };
    setEvents((prev) => [...prev, evento]);
    setNovoEvento("");
  };

  // Criar nova etapa dentro do evento
  const addStep = (eventoId) => {
    if (!novoStep.trim()) return;
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventoId
          ? {
              ...e,
              steps: [
                ...e.steps,
                {
                  id: Date.now(),
                  titulo: novoStep.trim(),
                  status: "Não iniciado",
                },
              ],
            }
          : e
      )
    );
    setNovoStep("");
  };

  // Atualizar status da etapa
  const changeStatus = (eventoId, stepId) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventoId
          ? {
              ...e,
              steps: e.steps.map((s) => {
                if (s.id === stepId) {
                  const idx = STATUS.indexOf(s.status);
                  const next = (idx + 1) % STATUS.length;
                  return { ...s, status: STATUS[next] };
                }
                return s;
              }),
            }
          : e
      )
    );
  };

  // Remover etapa
  const removeStep = (eventoId, stepId) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventoId
          ? { ...e, steps: e.steps.filter((s) => s.id !== stepId) }
          : e
      )
    );
  };

  // Remover evento
  const removeEvento = (eventoId) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventoId));
  };

  const percentDone = (steps) =>
    steps.length === 0
      ? 0
      : Math.round(
          (steps.filter((s) => s.status === "Finalizado").length /
            steps.length) *
            100
        );

  return (
    <div className="step-tracker">
      <h1>Eventos e Etapas</h1>

      <div className="new-step" style={{ marginBottom: "1rem" }}>
        <input
          placeholder="Novo evento"
          value={novoEvento}
          onChange={(e) => setNovoEvento(e.target.value)}
        />
        <button onClick={addEvento}>Adicionar Evento</button>
      </div>

      {events.map((e) => (
        <div
          key={e.id}
          style={{
            marginBottom: "2rem",
            padding: "1rem",
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>{e.titulo}</h2>
            <button className="delete" onClick={() => removeEvento(e.id)}>
              Remover Evento
            </button>
          </div>

          {/* Barra de progresso */}
          <div className="progress-bar" style={{ margin: "0.5rem 0" }}>
            <div
              className="progress-fill"
              style={{ width: `${percentDone(e.steps)}%` }}
            />
          </div>
          <small>{percentDone(e.steps)}% concluído</small>

          <ul className="step-list">
            {e.steps.map((s) => (
              <li key={s.id} className="step-item">
                <span>{s.titulo}</span>
                <span
                  style={{
                    cursor: "pointer",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    background:
                      s.status === "Não iniciado"
                        ? "#ccc"
                        : s.status === "Em progresso"
                        ? "#fbbf24"
                        : "#34d399",
                    color: s.status === "Em progresso" ? "#000" : "#fff",
                  }}
                  onClick={() => changeStatus(e.id, s.id)}
                >
                  {s.status}
                </span>
                <button
                  className="delete"
                  onClick={() => removeStep(e.id, s.id)}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>

          <div className="new-step">
            <input
              placeholder="Nova etapa"
              value={novoStep}
              onChange={(e) => setNovoStep(e.target.value)}
            />
            <button onClick={() => addStep(e.id)}>Adicionar Etapa</button>
          </div>
        </div>
      ))}
    </div>
  );
}

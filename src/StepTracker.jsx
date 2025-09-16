import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import "./styles/StepTracker.css";

const STATUS = ["Não iniciado", "Em progresso", "Finalizado"];

export default function EventStepTracker() {
  const [events, setEvents] = useState([]);
  const [steps, setSteps] = useState({});
  const [novoEvento, setNovoEvento] = useState("");
  const [novoStep, setNovoStep] = useState("");

  // Carregar eventos e etapas do Supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data: eventos } = await supabase.from("events").select("*");
      setEvents(eventos || []);

      const { data: etapas } = await supabase.from("steps").select("*");
      if (etapas) {
        const agrupadas = etapas.reduce((acc, s) => {
          acc[s.event_id] = acc[s.event_id] ? [...acc[s.event_id], s] : [s];
          return acc;
        }, {});
        setSteps(agrupadas);
      }
    };

    fetchData();
  }, []);

  // Criar novo evento
  const addEvento = async () => {
    if (!novoEvento.trim()) return;
    const { data, error } = await supabase
      .from("events")
      .insert([{ titulo: novoEvento.trim() }])
      .select();
    if (!error && data) {
      setEvents((prev) => [...prev, data[0]]);
    }
    setNovoEvento("");
  };

  // Criar nova etapa dentro do evento
  const addStep = async (eventoId) => {
    if (!novoStep.trim()) return;
    const { data, error } = await supabase
      .from("steps")
      .insert([
        { titulo: novoStep.trim(), status: "Não iniciado", event_id: eventoId },
      ])
      .select();
    if (!error && data) {
      setSteps((prev) => ({
        ...prev,
        [eventoId]: [...(prev[eventoId] || []), data[0]],
      }));
    }
    setNovoStep("");
  };

  // Atualizar status da etapa
  const changeStatus = async (stepId, currentStatus) => {
    const idx = STATUS.indexOf(currentStatus);
    const next = STATUS[(idx + 1) % STATUS.length];
    const { data, error } = await supabase
      .from("steps")
      .update({ status: next })
      .eq("id", stepId)
      .select();

    if (!error && data) {
      const step = data[0];
      setSteps((prev) => ({
        ...prev,
        [step.event_id]: prev[step.event_id].map((s) =>
          s.id === stepId ? { ...s, status: next } : s
        ),
      }));
    }
  };

  // Remover etapa
  const removeStep = async (stepId) => {
    const { data, error } = await supabase
      .from("steps")
      .delete()
      .eq("id", stepId)
      .select();

    if (!error && data) {
      const step = data[0];
      setSteps((prev) => ({
        ...prev,
        [step.event_id]: prev[step.event_id].filter((s) => s.id !== stepId),
      }));
    }
  };

  // Remover evento (e suas etapas associadas)
  const removeEvento = async (eventoId) => {
    await supabase.from("steps").delete().eq("event_id", eventoId);
    await supabase.from("events").delete().eq("id", eventoId);
    setEvents((prev) => prev.filter((e) => e.id !== eventoId));
    setSteps((prev) => {
      const copy = { ...prev };
      delete copy[eventoId];
      return copy;
    });
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
              style={{ width: `${percentDone(steps[e.id] || [])}%` }}
            />
          </div>
          <small>{percentDone(steps[e.id] || [])}% concluído</small>

          <ul className="step-list">
            {(steps[e.id] || []).map((s) => (
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
                  onClick={() => changeStatus(s.id, s.status)}
                >
                  {s.status}
                </span>
                <button className="delete" onClick={() => removeStep(s.id)}>
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

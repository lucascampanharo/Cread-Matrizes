import { supabase } from "../../supabase";
import StepItem from "../step_component/StepItem.jsx";
import NewStepForm from "../step_component/NewStepForm.jsx";
import { useEffect } from "react";

export default function EventItem({
  event,
  steps,
  setSteps,
  setEvents,
  onPrazoVencido,
}) {
  // 🔥 Detecta atraso
  useEffect(() => {
    if (!event?.due_date) return;

    const hoje = new Date();
    const prazo = new Date(event.due_date);

    if (hoje > prazo) {
      onPrazoVencido?.(event);
    }
  }, [event, onPrazoVencido]);

  const percentDone = (steps) =>
    steps.length === 0
      ? 0
      : Math.round(
          (steps.filter((s) => s.status === "Finalizado").length /
            steps.length) *
            100
        );

  const removeEvento = async () => {
    await supabase.from("steps").delete().eq("event_id", event.id);
    await supabase.from("events").delete().eq("id", event.id);

    setSteps((prev) => {
      const copy = { ...prev };
      delete copy[event.id];
      return copy;
    });

    setEvents((prev) => prev.filter((e) => e.id !== event.id));
  };

  const updateEventDate = async (newDate) => {
    await supabase
      .from("events")
      .update({ due_date: newDate })
      .eq("id", event.id);

    setEvents((prev) =>
      prev.map((e) => (e.id === event.id ? { ...e, due_date: newDate } : e))
    );
  };

  return (
    <div
      style={{
        marginBottom: "2rem",
        padding: "1rem",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {/* =======================
          CABEÇALHO EVENTO
      ======================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>{event.titulo}</h2>

        <button className="delete" onClick={removeEvento}>
          Remover Evento
        </button>
      </div>

      {/* =======================
          LINK DRIVE (NOVO)
      ======================= */}
      {event.link_drive && (
        <div style={{ marginTop: "0.8rem" }}>
          <a
            href={event.link_drive}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#007bff",
              color: "white",
              padding: "0.4rem 0.8rem",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "0.85rem",
              display: "inline-block",
            }}
          >
            📁 Acessar material
          </a>
        </div>
      )}

      {/* =======================
          PRAZO
      ======================= */}
      <div style={{ marginTop: "0.8rem" }}>
        <label>
          Prazo:
          <input
            type="date"
            value={event.due_date || ""}
            onChange={(ev) => updateEventDate(ev.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
      </div>

      {/* =======================
          BARRA DE PROGRESSO
      ======================= */}
      <div className="progress-bar" style={{ margin: "0.6rem 0" }}>
        <div
          className="progress-fill"
          style={{ width: `${percentDone(steps)}%` }}
        />
      </div>
      <small>{percentDone(steps)}% concluído</small>

      {/* =======================
          LISTA DE STEPS
      ======================= */}
      <ul className="step-list">
        {steps.map((s) => (
          <StepItem
            key={s.id}
            step={s}
            eventId={event.id}
            setSteps={setSteps}
          />
        ))}
      </ul>

      {/* =======================
          NOVO STEP
      ======================= */}
      <NewStepForm eventId={event.id} setSteps={setSteps} steps={steps} />
    </div>
  );
}

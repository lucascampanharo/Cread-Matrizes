import { supabase } from "../../supabase";
import StepItem from "../step_component/StepItem.jsx";
import NewStepForm from "../step_component/NewStepForm.jsx";

export default function EventItem({ event, steps, setSteps, setEvents }) {
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* usar o campo que está no banco (events.titulo) */}
        <h2>{event.titulo}</h2>
        <button className="delete" onClick={removeEvento}>
          Remover Evento
        </button>
      </div>

      <div style={{ marginTop: "0.5rem" }}>
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

      <div className="progress-bar" style={{ margin: "0.5rem 0" }}>
        <div
          className="progress-fill"
          style={{ width: `${percentDone(steps)}%` }}
        />
      </div>
      <small>{percentDone(steps)}% concluído</small>

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

      {/* passo steps para NewStepForm para ajudar na detecção de campo */}
      <NewStepForm eventId={event.id} setSteps={setSteps} steps={steps} />
    </div>
  );
}

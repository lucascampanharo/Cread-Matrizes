import { supabase } from "../supabase";

const STATUS = ["Não iniciado", "Em progresso", "Finalizado"];

export default function StepItem({ step, eventId, setSteps }) {
  const changeStatus = async (stepId, currentStatus) => {
    const idx = STATUS.indexOf(currentStatus);
    const next = STATUS[(idx + 1) % STATUS.length];
    const { data } = await supabase
      .from("steps")
      .update({ status: next })
      .eq("id", stepId)
      .select();
    if (data) {
      setSteps((prev) => ({
        ...prev,
        [eventId]: prev[eventId].map((s) =>
          s.id === stepId ? { ...s, status: next } : s
        ),
      }));
    }
  };

  const removeStep = async (stepId) => {
    const { data } = await supabase
      .from("steps")
      .delete()
      .eq("id", stepId)
      .select();
    if (data) {
      setSteps((prev) => ({
        ...prev,
        [eventId]: prev[eventId].filter((s) => s.id !== stepId),
      }));
    }
  };

  return (
    <li className="step-item">
      <span>{step.titulo}</span>

      {/* Prazo da etapa */}
      <span style={{ marginLeft: "1rem" }}>
        Prazo:
        <input
          type="date"
          value={step.due_date || ""}
          onChange={async (ev) => {
            const newDate = ev.target.value;
            await supabase
              .from("steps")
              .update({ due_date: newDate })
              .eq("id", step.id);
            setSteps((prev) => ({
              ...prev,
              [eventId]: prev[eventId].map((st) =>
                st.id === step.id ? { ...st, due_date: newDate } : st
              ),
            }));
          }}
          style={{ marginLeft: "0.25rem" }}
        />
      </span>

      <span
        style={{
          cursor: "pointer",
          padding: "0.25rem 0.5rem",
          borderRadius: "4px",
          background:
            step.status === "Não iniciado"
              ? "#ccc"
              : step.status === "Em progresso"
              ? "#fbbf24"
              : "#34d399",
          color: step.status === "Em progresso" ? "#000" : "#fff",
          marginLeft: "0.5rem",
        }}
        onClick={() => changeStatus(step.id, step.status)}
      >
        {step.status}
      </span>

      <button
        className="delete"
        onClick={() => removeStep(step.id)}
        style={{ marginLeft: "0.5rem" }}
      >
        Remover
      </button>
    </li>
  );
}

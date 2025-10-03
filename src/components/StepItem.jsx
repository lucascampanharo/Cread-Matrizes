import { supabase } from "../supabase";

const STATUS = ["Não iniciado", "Em progresso", "Finalizado"];

export default function StepItem({ step, eventId, setSteps }) {
  const changeStatus = async () => {
    const idx = STATUS.indexOf(step.status);
    const next = STATUS[(idx + 1) % STATUS.length];

    const { data } = await supabase
      .from("steps")
      .update({ status: next })
      .eq("id", step.id)
      .select();

    if (data) {
      setSteps((prev) => ({
        ...prev,
        [eventId]: prev[eventId].map((s) =>
          s.id === step.id ? { ...s, status: next } : s
        ),
      }));
    }
  };

  const removeStep = async () => {
    const { data } = await supabase
      .from("steps")
      .delete()
      .eq("id", step.id)
      .select();

    if (data) {
      setSteps((prev) => ({
        ...prev,
        [eventId]: prev[eventId].filter((s) => s.id !== step.id),
      }));
    }
  };

  const updateStepDate = async (newDate) => {
    await supabase
      .from("steps")
      .update({ due_date: newDate })
      .eq("id", step.id);

    setSteps((prev) => ({
      ...prev,
      [eventId]: prev[eventId].map((s) =>
        s.id === step.id ? { ...s, due_date: newDate } : s
      ),
    }));
  };

  return (
    <li className="step-item">
      {/* corrigido: description */}
      <span>{step.description}</span>
      <span style={{ marginLeft: "1rem" }}>
        Prazo:
        <input
          type="date"
          value={step.due_date || ""}
          onChange={(ev) => updateStepDate(ev.target.value)}
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
        onClick={changeStatus}
      >
        {step.status}
      </span>

      <button
        className="delete"
        onClick={removeStep}
        style={{ marginLeft: "0.5rem" }}
      >
        Remover
      </button>
    </li>
  );
}

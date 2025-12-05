import { supabase } from "../../supabase";

const STATUS = ["Não Iniciado", "Em Progresso", "Finalizado"];

export default function StepItem({ step, eventId, setSteps }) {
  const label =
    step.nome ??
    step.titulo ??
    step.description ??
    step.descricao ??
    "(sem título)";

  const changeStatus = async () => {
    const idx = STATUS.indexOf(step.status);
    const next = STATUS[(idx + 1) % STATUS.length];

    const { error } = await supabase
      .from("steps")
      .update({ status: next })
      .eq("id", step.id);

    if (error) {
      console.error("Erro ao atualizar status:", error.message);
      return;
    }

    setSteps((prev) => ({
      ...prev,
      [eventId]: prev[eventId].map((s) =>
        s.id === step.id ? { ...s, status: next } : s
      ),
    }));
  };

  const updateStepDate = async (newDate) => {
    const { error } = await supabase
      .from("steps")
      .update({ due_date: newDate })
      .eq("id", step.id);

    if (error) {
      console.error("Erro ao atualizar prazo:", error.message);
      return;
    }

    setSteps((prev) => ({
      ...prev,
      [eventId]: prev[eventId].map((s) =>
        s.id === step.id ? { ...s, due_date: newDate } : s
      ),
    }));
  };

  return (
    <li className="step-item">
      <span>{label}</span>

      <input
        type="date"
        value={step.due_date || ""}
        onChange={(ev) => updateStepDate(ev.target.value)}
        style={{ marginLeft: "1rem" }}
      />

      <span
        onClick={changeStatus}
        style={{
          marginLeft: "1rem",
          cursor: "pointer",
          background:
            step.status === "Não Iniciado"
              ? "#ccc"
              : step.status === "Em Progresso"
              ? "#fbbf24"
              : "#34d399",
          padding: "0.25rem 0.5rem",
          borderRadius: "4px",
          color: step.status === "Em Progresso" ? "#000" : "#fff",
        }}
      >
        {step.status}
      </span>
    </li>
  );
}

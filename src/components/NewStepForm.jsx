import { useState } from "react";
import { supabase } from "../supabase";

export default function NewStepForm({ eventId, setSteps }) {
  const [novoStep, setNovoStep] = useState("");

  const addStep = async () => {
    if (!novoStep.trim()) return;
    const { data, error } = await supabase
      .from("steps")
      .insert([
        { titulo: novoStep.trim(), status: "Não iniciado", event_id: eventId },
      ])
      .select();

    if (!error && data) {
      setSteps((prev) => ({
        ...prev,
        [eventId]: [...(prev[eventId] || []), data[0]],
      }));
    }
    setNovoStep("");
  };

  return (
    <div className="new-step">
      <input
        placeholder="Nova etapa"
        value={novoStep}
        onChange={(e) => setNovoStep(e.target.value)}
      />
      <button onClick={addStep}>Adicionar Etapa</button>
    </div>
  );
}

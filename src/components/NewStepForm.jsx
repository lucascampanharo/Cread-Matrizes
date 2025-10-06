import { useState } from "react";
import { supabase } from "../supabase";

/**
 * NewStepForm tenta inserir a etapa usando o(s) nome(s) de coluna mais prováveis.
 * Props:
 * - eventId
 * - setSteps (estado global agrupado por eventId)
 * - steps (array de steps já existentes para esse event) - opcional, usado para detectar o nome da coluna
 */
export default function NewStepForm({ eventId, setSteps, steps = [] }) {
  const [novoStep, setNovoStep] = useState("");

  // ordem de tentativas de nomes de coluna
  const triedKeys = ["titulo", "description", "title", "nome", "descricao"];

  const addStep = async () => {
    if (!novoStep.trim()) return;

    // Se já há steps, tenta primeiro a chave encontrada no primeiro objeto
    const keysToTry = (() => {
      if (steps && steps.length > 0) {
        const present = Object.keys(steps[0]);
        const found = triedKeys.find((k) => present.includes(k));
        return found
          ? [found, ...triedKeys.filter((k) => k !== found)]
          : triedKeys;
      }
      return triedKeys;
    })();

    let lastError = null;

    for (const key of keysToTry) {
      const payload = { status: "Não iniciado", event_id: eventId };
      payload[key] = novoStep.trim();

      const { data, error } = await supabase
        .from("steps")
        .insert([payload])
        .select();

      if (!error && data && data[0]) {
        setSteps((prev) => ({
          ...prev,
          [eventId]: [...(prev[eventId] || []), data[0]],
        }));
        setNovoStep("");
        return;
      }

      lastError = error;
      // se erro indica coluna inexistente, continua para a próxima chave; caso contrário, interrompe
      if (error && !/column .* does not exist/i.test(error.message || "")) {
        break;
      }
    }

    console.error("Não foi possível criar a etapa. Último erro:", lastError);
  };

  return (
    <div className="new-step">
      <input
        placeholder="Nova etapa"
        value={novoStep}
        onChange={(e) => setNovoStep(e.target.value)}
      />
      <button type="button" onClick={addStep}>
        Adicionar Etapa
      </button>
    </div>
  );
}

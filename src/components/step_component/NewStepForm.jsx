import { useState } from "react";
import { supabase } from "../../supabase";

/**
 * NewStepForm
 * Cria uma nova etapa (step) vinculada a um evento e ao usuário logado.
 *
 * Props:
 * - eventId: ID do evento ao qual a etapa pertence
 * - setSteps: função para atualizar o estado global agrupado por eventId
 * - steps: lista atual de etapas desse evento (opcional)
 */
export default function NewStepForm({ eventId, setSteps, steps = [] }) {
  const [novoStep, setNovoStep] = useState("");
  const [loading, setLoading] = useState(false);

  // possíveis nomes de colunas onde o nome da etapa pode ser armazenado
  const triedKeys = ["titulo", "description", "title", "nome", "descricao"];

  const addStep = async () => {
    if (!novoStep.trim()) return;

    setLoading(true);

    // 🔹 obtém usuário logado
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Usuário não autenticado. Faça login novamente.");
      setLoading(false);
      return;
    }

    // 🔹 identifica coluna correta para o nome da etapa
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
      const payload = {
        status: "Não iniciado",
        event_id: eventId,
        user_id: user.id, // 👈 vincula a etapa ao usuário logado
      };
      payload[key] = novoStep.trim();

      const { data, error } = await supabase
        .from("steps")
        .insert([payload])
        .select();

      if (!error && data && data[0]) {
        // atualiza estado local
        setSteps((prev) => ({
          ...prev,
          [eventId]: [...(prev[eventId] || []), data[0]],
        }));
        setNovoStep("");
        setLoading(false);
        return;
      }

      lastError = error;

      // se erro for de coluna inexistente, tenta o próximo nome
      if (error && !/column .* does not exist/i.test(error.message || "")) {
        break;
      }
    }

    setLoading(false);
    console.error("Não foi possível criar a etapa. Último erro:", lastError);
    alert("Erro ao criar etapa.");
  };

  return (
    <div className="new-step">
      <input
        placeholder="Nova etapa"
        value={novoStep}
        onChange={(e) => setNovoStep(e.target.value)}
        disabled={loading}
      />
      <button type="button" onClick={addStep} disabled={loading}>
        {loading ? "Adicionando..." : "Adicionar Etapa"}
      </button>
    </div>
  );
}

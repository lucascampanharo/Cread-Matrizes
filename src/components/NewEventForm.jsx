import { useState } from "react";
import { supabase } from "../supabase";

export default function NewEventForm({ events, setEvents, disciplinaId }) {
  const [novoEvento, setNovoEvento] = useState("");
  const [loading, setLoading] = useState(false);

  const addEvento = async () => {
    if (!novoEvento.trim()) return;

    setLoading(true);

    // 🔹 Obtém o usuário autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Usuário não autenticado. Faça login novamente.");
      setLoading(false);
      return;
    }

    // 🔹 Insere evento vinculado ao usuário e à disciplina
    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          titulo: novoEvento.trim(),
          disciplina_id: disciplinaId,
          user_id: user.id, // 👈 associa o evento ao usuário logado
        },
      ])
      .select();

    setLoading(false);

    if (error) {
      console.error("Erro ao inserir evento:", error.message);
      alert("Erro ao criar evento.");
      return;
    }

    if (data) {
      setEvents([...events, data[0]]);
      setNovoEvento("");
    }
  };

  return (
    <div className="new-step" style={{ marginBottom: "1rem" }}>
      <input
        placeholder="Novo evento"
        value={novoEvento}
        onChange={(e) => setNovoEvento(e.target.value)}
        disabled={loading}
      />
      <button onClick={addEvento} disabled={loading}>
        {loading ? "Adicionando..." : "Adicionar Evento"}
      </button>
    </div>
  );
}

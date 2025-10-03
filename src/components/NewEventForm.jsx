import { useState } from "react";
import { supabase } from "../supabase";

export default function NewEventForm({ events, setEvents, disciplinaId }) {
  const [novoEvento, setNovoEvento] = useState("");

  const addEvento = async () => {
    if (!novoEvento.trim()) return;

    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          titulo: novoEvento.trim(), // campo correto
          disciplina_id: disciplinaId, // vínculo com disciplina
        },
      ])
      .select();

    if (error) {
      console.error("Erro ao inserir evento:", error.message);
      return;
    }

    if (data) setEvents([...events, data[0]]);
    setNovoEvento("");
  };

  return (
    <div className="new-step" style={{ marginBottom: "1rem" }}>
      <input
        placeholder="Novo evento"
        value={novoEvento}
        onChange={(e) => setNovoEvento(e.target.value)}
      />
      <button onClick={addEvento}>Adicionar Evento</button>
    </div>
  );
}

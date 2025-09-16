import { useState } from "react";
import { supabase } from "../supabase";

export default function NewEventForm({ events, setEvents }) {
  const [novoEvento, setNovoEvento] = useState("");

  const addEvento = async () => {
    if (!novoEvento.trim()) return;
    const { data, error } = await supabase
      .from("events")
      .insert([{ titulo: novoEvento.trim() }])
      .select();

    if (!error && data) {
      setEvents([...events, data[0]]); // Atualiza estado imediatamente
    }

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

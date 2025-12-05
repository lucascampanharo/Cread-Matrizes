import { useState } from "react";
import { supabase } from "../../supabase";

export default function NewEventForm({ events, setEvents, disciplinaId }) {
  const [novoEvento, setNovoEvento] = useState("");
  const [linkDrive, setLinkDrive] = useState("");
  const [loading, setLoading] = useState(false);

  const addEvento = async () => {
    if (!novoEvento.trim()) return;

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Usuário não autenticado. Faça login novamente.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          titulo: novoEvento.trim(),
          disciplina_id: disciplinaId,
          user_id: user.id,
          link_drive: linkDrive.trim() || null, // 👈 salva link
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
      setLinkDrive("");
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

      <input
        placeholder="Link para materiais (Drive, OneDrive, etc)"
        value={linkDrive}
        onChange={(e) => setLinkDrive(e.target.value)}
        disabled={loading}
        style={{ marginLeft: "0.5rem" }}
      />

      <button
        onClick={addEvento}
        disabled={loading}
        style={{ marginLeft: "0.5rem" }}
      >
        {loading ? "Adicionando..." : "Adicionar Evento"}
      </button>
    </div>
  );
}

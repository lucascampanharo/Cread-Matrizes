import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [disciplinas, setDisciplinas] = useState([]);

  // 🔹 Buscar disciplinas inicialmente
  useEffect(() => {
    const fetchDisciplinas = async () => {
      const { data, error } = await supabase
        .from("disciplinas")
        .select("id, nome, created_at")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Erro ao buscar disciplinas:", error.message);
      } else {
        setDisciplinas(data || []);
      }
    };

    fetchDisciplinas();

    // 🔹 Assinar mudanças em tempo real
    const channel = supabase
      .channel("disciplinas-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // insere, atualiza ou deleta
          schema: "public",
          table: "disciplinas",
        },
        (payload) => {
          console.log("Mudança detectada:", payload);

          // Atualiza a lista dependendo do tipo de evento
          if (payload.eventType === "INSERT") {
            setDisciplinas((prev) => [...prev, payload.new]);
          }
          if (payload.eventType === "UPDATE") {
            setDisciplinas((prev) =>
              prev.map((disc) =>
                disc.id === payload.new.id ? payload.new : disc
              )
            );
          }
          if (payload.eventType === "DELETE") {
            setDisciplinas((prev) =>
              prev.filter((disc) => disc.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup ao desmontar
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleClick = (id) => {
    navigate(`/eventos/${id}`);
  };

  return (
    <div className="home-container">
      <h1>Disciplinas</h1>
      <div className="disciplinas-grid">
        {disciplinas.map((disc) => (
          <div
            key={disc.id}
            className="disciplina-card"
            onClick={() => handleClick(disc.id)}
          >
            {disc.nome}
          </div>
        ))}

        {/* Card para criar nova disciplina */}
        <div
          className="disciplina-card nova-disciplina-card"
          onClick={() => navigate("/nova-disciplina")}
        >
          ➕ Nova Disciplina
        </div>
      </div>
    </div>
  );
}

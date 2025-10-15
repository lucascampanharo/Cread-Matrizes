import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import SidebarStats from "../components/SidebarStats";
import "../styles/Home.css";

export default function Home({ user }) {
  const navigate = useNavigate();
  const [disciplinas, setDisciplinas] = useState([]);

  useEffect(() => {
    if (!user) return;

    // 🔹 Buscar apenas disciplinas do usuário logado
    const fetchDisciplinas = async () => {
      const { data, error } = await supabase
        .from("disciplinas")
        .select("id, nome, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Erro ao buscar disciplinas:", error.message);
      } else {
        setDisciplinas(data || []);
      }
    };

    fetchDisciplinas();

    // 🔹 Escutar mudanças em tempo real (somente do usuário atual)
    const channel = supabase
      .channel("disciplinas-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "disciplinas",
          filter: `user_id=eq.${user.id}`, // <-- 🔥 apenas as do usuário logado
        },
        (payload) => {
          console.log("Mudança detectada:", payload);

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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleClick = (id) => {
    navigate(`/eventos/${id}`);
  };

  return (
    <div style={{ display: "flex" }}>
      {/* 🧭 Sidebar de estatísticas */}
      <SidebarStats user={user} />

      {/* 🧩 Conteúdo principal */}
      <div className="home-container" style={{ marginLeft: "240px", flex: 1 }}>
        <h1>Minhas Disciplinas</h1>
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
    </div>
  );
}

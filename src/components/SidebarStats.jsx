import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function SidebarStats({ disciplinaId = null }) {
  const [stats, setStats] = useState({
    finalizadas: 0,
    progresso: 0,
    naoIniciadas: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      // Busca todas as etapas (ou só da disciplina, se informado)
      let query = supabase
        .from("steps")
        .select("status, event_id, events!inner(disciplina_id)");

      if (disciplinaId) {
        query = query.eq("events.disciplina_id", disciplinaId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar estatísticas:", error.message);
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setStats({ finalizadas: 0, progresso: 0, naoIniciadas: 0 });
        setLoading(false);
        return;
      }

      // Contagem por status
      const total = data.length;
      const finalizadas = data.filter((s) => s.status === "Finalizado").length;
      const progresso = data.filter((s) => s.status === "Em progresso").length;
      const naoIniciadas = data.filter(
        (s) => s.status === "Não iniciado" || !s.status
      ).length;

      setStats({
        finalizadas: Math.round((finalizadas / total) * 100),
        progresso: Math.round((progresso / total) * 100),
        naoIniciadas: Math.round((naoIniciadas / total) * 100),
      });

      setLoading(false);
    };

    fetchStats();
  }, [disciplinaId]);

  return (
    <aside
      style={{
        width: "240px",
        background: "#f8fafc",
        padding: "1.5rem",
        borderRight: "1px solid #e2e8f0",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
        Estatísticas
      </h2>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <StatBar
            label="Finalizadas"
            color="#34d399"
            value={stats.finalizadas}
          />
          <StatBar
            label="Em progresso"
            color="#fbbf24"
            value={stats.progresso}
          />
          <StatBar
            label="Não iniciadas"
            color="#f87171"
            value={stats.naoIniciadas}
          />
        </div>
      )}
    </aside>
  );
}

function StatBar({ label, value, color }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.25rem",
          fontSize: "0.875rem",
        }}
      >
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div
        style={{
          background: "#e5e7eb",
          borderRadius: "4px",
          height: "8px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            background: color,
            height: "8px",
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}

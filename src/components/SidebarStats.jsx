import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "../styles/component_styles/SidebarStats.css";

export default function SidebarStats({ aberta, setAberta }) {
  const [stats, setStats] = useState({
    finalizadas: 0,
    emProgresso: 0,
    naoIniciadas: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.from("steps").select("status");

      if (error) {
        console.error("Erro ao buscar stats:", error);
        return;
      }

      if (!data || data.length === 0) {
        // Sem dados → tudo 0
        setStats({
          finalizadas: 0,
          emProgresso: 0,
          naoIniciadas: 100,
        });
        return;
      }

      const total = data.length;

      const finalizadas = data.filter(
        (s) => s.status?.trim() === "Finalizado"
      ).length;

      const emProgresso = data.filter(
        (s) => s.status?.trim() === "Em Progresso"
      ).length;

      const naoIniciadas = total - finalizadas - emProgresso;

      const percent = (v) => Math.round((v / total) * 100);

      setStats({
        finalizadas: percent(finalizadas),
        emProgresso: percent(emProgresso),
        naoIniciadas: percent(naoIniciadas),
      });
    };

    fetchStats();
  }, []);

  return (
    <aside className={`sidebar-stats ${aberta ? "aberta" : "fechada"}`}>
      <button className="toggle-btn" onClick={() => setAberta(!aberta)}>
        {aberta ? "❮" : "☰"}
      </button>

      {aberta && (
        <>
          <h2>📊 Estatísticas</h2>

          <div className="stat-item">
            <span>Finalizadas</span>
            <div className="progress-bar">
              <div
                className="progress-fill finalizadas"
                style={{
                  width: `${stats.finalizadas}%`,
                }}
              />
            </div>
            <span className="percent">{stats.finalizadas}%</span>
          </div>

          <div className="stat-item">
            <span>Em Progresso</span>
            <div className="progress-bar">
              <div
                className="progress-fill progresso"
                style={{
                  width: `${stats.emProgresso}%`,
                }}
              />
            </div>
            <span className="percent">{stats.emProgresso}%</span>
          </div>

          <div className="stat-item">
            <span>Não Iniciadas</span>
            <div className="progress-bar">
              <div
                className="progress-fill pendente"
                style={{
                  width: `${stats.naoIniciadas}%`,
                }}
              />
            </div>
            <span className="percent">{stats.naoIniciadas}%</span>
          </div>
        </>
      )}
    </aside>
  );
}

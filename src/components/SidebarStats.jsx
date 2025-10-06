import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "../styles/SidebarStats.css";

export default function SidebarStats() {
  const [stats, setStats] = useState({
    finalizadas: 0,
    emProgresso: 0,
    naoIniciadas: 0,
  });

  const [aberta, setAberta] = useState(true); // controla se a sidebar está aberta

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.from("steps").select("status");

      if (!error && data) {
        const total = data.length || 1;
        const finalizadas = data.filter(
          (s) => s.status === "Finalizado"
        ).length;
        const emProgresso = data.filter(
          (s) => s.status === "Em Progresso"
        ).length;
        const naoIniciadas = total - finalizadas - emProgresso;

        setStats({
          finalizadas: Math.round((finalizadas / total) * 100),
          emProgresso: Math.round((emProgresso / total) * 100),
          naoIniciadas: Math.round((naoIniciadas / total) * 100),
        });
      }
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
                style={{ width: `${stats.finalizadas}%` }}
              ></div>
            </div>
            <span className="percent">{stats.finalizadas}%</span>
          </div>

          <div className="stat-item">
            <span>Em Progresso</span>
            <div className="progress-bar">
              <div
                className="progress-fill progresso"
                style={{ width: `${stats.emProgresso}%` }}
              ></div>
            </div>
            <span className="percent">{stats.emProgresso}%</span>
          </div>

          <div className="stat-item">
            <span>Não Iniciadas</span>
            <div className="progress-bar">
              <div
                className="progress-fill pendente"
                style={{ width: `${stats.naoIniciadas}%` }}
              ></div>
            </div>
            <span className="percent">{stats.naoIniciadas}%</span>
          </div>
        </>
      )}
    </aside>
  );
}

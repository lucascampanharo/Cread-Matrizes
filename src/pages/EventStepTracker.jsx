import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase.js";
import NewEventForm from "../components/NewEventForm.jsx";
import EventList from "../components/EventList.jsx";
import "../styles/StepTracker.css";

export default function EventStepTracker() {
  const { disciplinaId } = useParams(); // vem da rota
  const [disciplina, setDisciplina] = useState(null);
  const [events, setEvents] = useState([]);
  const [steps, setSteps] = useState({});
  const navigate = useNavigate();

  // 🔹 Buscar disciplina e seus eventos/etapas
  useEffect(() => {
    const fetchData = async () => {
      if (!disciplinaId) return;

      // Buscar dados da disciplina
      const { data: discData, error: discError } = await supabase
        .from("disciplinas")
        .select("*")
        .eq("id", disciplinaId)
        .single();

      if (discError) {
        console.error("Erro ao buscar disciplina:", discError.message);
        return;
      }
      setDisciplina(discData);

      // Buscar eventos da disciplina
      const { data: eventos, error: eventosError } = await supabase
        .from("events")
        .select("*")
        .eq("disciplina_id", disciplinaId);

      if (eventosError) {
        console.error("Erro ao buscar eventos:", eventosError.message);
        return;
      }

      setEvents(eventos || []);

      // Buscar etapas vinculadas aos eventos
      if (eventos && eventos.length > 0) {
        const { data: etapas, error: etapasError } = await supabase
          .from("steps")
          .select("*")
          .in(
            "event_id",
            eventos.map((e) => e.id)
          );

        if (etapasError) {
          console.error("Erro ao buscar etapas:", etapasError.message);
          return;
        }

        // Agrupar etapas por evento
        const agrupadas = etapas.reduce((acc, s) => {
          if (!acc[s.event_id]) acc[s.event_id] = [];
          acc[s.event_id].push(s);
          return acc;
        }, {});

        setSteps(agrupadas);
      }
    };

    fetchData();
  }, [disciplinaId]);

  // 🔹 Função para excluir a disciplina e tudo dentro dela
  const deleteDisciplina = async () => {
    if (!disciplina) return;

    const confirmar = window.confirm(
      `Tem certeza que deseja excluir a disciplina "${disciplina.nome}"?\n\nIsso também excluirá todos os eventos e etapas associadas.`
    );
    if (!confirmar) return;

    try {
      // Buscar eventos da disciplina
      const { data: eventos } = await supabase
        .from("events")
        .select("id")
        .eq("disciplina_id", disciplinaId);

      if (eventos?.length > 0) {
        const eventIds = eventos.map((e) => e.id);

        // Apagar etapas
        await supabase.from("steps").delete().in("event_id", eventIds);

        // Apagar eventos
        await supabase.from("events").delete().in("id", eventIds);
      }

      // Apagar disciplina
      await supabase.from("disciplinas").delete().eq("id", disciplinaId);

      alert("Disciplina excluída com sucesso!");
      navigate("/"); // volta para a home
    } catch (error) {
      console.error("Erro ao excluir disciplina:", error.message);
      alert("Erro ao excluir disciplina.");
    }
  };

  return (
    <div className="step-tracker">
      <div className="tracker-header">
        <h1>{disciplina ? disciplina.nome : "Carregando..."}</h1>

        <div className="tracker-buttons">
          <button className="back-button" onClick={() => navigate("/")}>
            ⬅ Voltar
          </button>

          <button className="delete-disciplina-btn" onClick={deleteDisciplina}>
            🗑️ Excluir Disciplina
          </button>
        </div>
      </div>

      {/* Criar novo evento */}
      <NewEventForm
        events={events}
        setEvents={setEvents}
        disciplinaId={disciplinaId}
      />

      {/* Lista de eventos e etapas */}
      <EventList
        events={events}
        steps={steps}
        setSteps={setSteps}
        setEvents={setEvents}
      />
    </div>
  );
}

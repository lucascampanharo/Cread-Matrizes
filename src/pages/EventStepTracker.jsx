import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase.js";
import NewEventForm from "../components/event_component/NewEventForm.jsx";
import EventList from "../components/step_component/EventList.jsx";
import "../styles/StepTracker.css";

export default function EventStepTracker() {
  const { disciplinaId } = useParams();
  const [disciplina, setDisciplina] = useState(null);
  const [events, setEvents] = useState([]);
  const [steps, setSteps] = useState({});
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 🔹 Obtém o usuário atual
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
      } else {
        setUser(user);
      }
    };
    getUser();
  }, [navigate]);

  // 🔹 Buscar disciplina, eventos e etapas do usuário
  useEffect(() => {
    const fetchData = async () => {
      if (!disciplinaId || !user) return;

      // 🔸 Buscar disciplina específica do usuário
      const { data: discData, error: discError } = await supabase
        .from("disciplinas")
        .select("*")
        .eq("id", disciplinaId)
        .eq("user_id", user.id)
        .single();

      if (discError) {
        console.error("Erro ao buscar disciplina:", discError.message);
        alert("Disciplina não encontrada ou sem permissão de acesso.");
        navigate("/");
        return;
      }

      setDisciplina(discData);

      // 🔸 Buscar eventos dessa disciplina
      const { data: eventos, error: eventosError } = await supabase
        .from("events")
        .select("*")
        .eq("disciplina_id", disciplinaId);

      if (eventosError) {
        console.error("Erro ao buscar eventos:", eventosError.message);
        return;
      }

      setEvents(eventos || []);

      // 🔸 Buscar etapas vinculadas aos eventos
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
  }, [disciplinaId, user, navigate]);

  // 🔹 Excluir disciplina e seus dados
  const deleteDisciplina = async () => {
    if (!disciplina) return;

    const confirmar = window.confirm(
      `Tem certeza que deseja excluir a disciplina "${disciplina.nome}"?\n\nIsso também excluirá todos os eventos e etapas associadas.`
    );
    if (!confirmar) return;

    try {
      const { data: eventos } = await supabase
        .from("events")
        .select("id")
        .eq("disciplina_id", disciplinaId);

      if (eventos?.length > 0) {
        const eventIds = eventos.map((e) => e.id);

        await supabase.from("steps").delete().in("event_id", eventIds);
        await supabase.from("events").delete().in("id", eventIds);
      }

      await supabase
        .from("disciplinas")
        .delete()
        .eq("id", disciplinaId)
        .eq("user_id", user.id);

      alert("Disciplina excluída com sucesso!");
      navigate("/");
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

      {disciplina && (
        <>
          <NewEventForm
            events={events}
            setEvents={setEvents}
            disciplinaId={disciplinaId}
          />
          <EventList
            events={events}
            steps={steps}
            setSteps={setSteps}
            setEvents={setEvents}
          />
        </>
      )}
    </div>
  );
}

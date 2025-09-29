import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // <-- importar useNavigate
import { supabase } from "../supabase.js";
import NewEventForm from "../components/NewEventForm.jsx";
import EventList from "../components/EventList.jsx";
import "../styles/StepTracker.css";

export default function EventStepTracker() {
  const { disciplinaId } = useParams();
  const [events, setEvents] = useState([]);
  const [steps, setSteps] = useState({});
  const navigate = useNavigate(); // <-- hook para navegação

  useEffect(() => {
    const fetchData = async () => {
      const { data: eventos, error: eventosError } = await supabase
        .from("events")
        .select("*")
        .eq("disciplina_id", disciplinaId);

      if (eventosError) {
        console.error("Erro ao buscar eventos:", eventosError.message);
      }

      setEvents(eventos || []);

      const { data: etapas, error: etapasError } = await supabase
        .from("steps")
        .select("*")
        .in(
          "event_id",
          (eventos || []).map((e) => e.id)
        );

      if (etapasError) {
        console.error("Erro ao buscar etapas:", etapasError.message);
      }

      if (etapas) {
        const agrupadas = etapas.reduce((acc, s) => {
          acc[s.event_id] = acc[s.event_id] ? [...acc[s.event_id], s] : [s];
          return acc;
        }, {});
        setSteps(agrupadas);
      }
    };

    if (disciplinaId) {
      fetchData();
    }
  }, [disciplinaId]);

  return (
    <div className="step-tracker">
      <h1>Eventos e Etapas</h1>

      {/* Botão de voltar */}
      <button className="back-button" onClick={() => navigate("/")}>
        ⬅ Voltar ao Menu
      </button>

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
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // para pegar disciplinaId
import { supabase } from "../supabase.js";
import NewEventForm from "../components/NewEventForm.jsx";
import EventList from "../components/EventList.jsx";
import "../styles/StepTracker.css";

export default function EventStepTracker() {
  const { disciplinaId } = useParams(); // pega o ID da disciplina da URL
  const [events, setEvents] = useState([]);
  const [steps, setSteps] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      // Busca eventos filtrados pela disciplina
      const { data: eventos, error: eventosError } = await supabase
        .from("events")
        .select("*")
        .eq("disciplina_id", disciplinaId); // <-- filtro

      if (eventosError) {
        console.error("Erro ao buscar eventos:", eventosError.message);
      }

      setEvents(eventos || []);

      // Busca etapas de todos os eventos daquela disciplina
      const { data: etapas, error: etapasError } = await supabase
        .from("steps")
        .select("*")
        .in(
          "event_id",
          (eventos || []).map((e) => e.id) // pega os ids dos eventos da disciplina
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
      <NewEventForm
        events={events}
        setEvents={setEvents}
        disciplinaId={disciplinaId} // opcional: passar para o form já vincular a disciplina
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

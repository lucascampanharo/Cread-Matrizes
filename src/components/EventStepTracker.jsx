import { useEffect, useState } from "react";
import { supabase } from "../supabase.js";
import NewEventForm from "./NewEventForm";
import EventList from "./EventList.jsx";
import "../styles/StepTracker.css";

export default function EventStepTracker() {
  const [events, setEvents] = useState([]);
  const [steps, setSteps] = useState({});

  // Carregar eventos e etapas
  useEffect(() => {
    const fetchData = async () => {
      const { data: eventos } = await supabase.from("events").select("*");
      setEvents(eventos || []);

      const { data: etapas } = await supabase.from("steps").select("*");
      if (etapas) {
        const agrupadas = etapas.reduce((acc, s) => {
          acc[s.event_id] = acc[s.event_id] ? [...acc[s.event_id], s] : [s];
          return acc;
        }, {});
        setSteps(agrupadas);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="step-tracker">
      <h1>Eventos e Etapas</h1>
      <NewEventForm events={events} setEvents={setEvents} />
      <EventList events={events} steps={steps} setSteps={setSteps} />
    </div>
  );
}

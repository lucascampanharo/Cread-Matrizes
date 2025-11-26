import EventItem from "./EventItem";

export default function EventList({
  events,
  steps,
  setSteps,
  setEvents,
  onPrazoVencido, // 🔥 receber a função
}) {
  return events.map((e) => (
    <EventItem
      key={e.id}
      event={e}
      steps={steps[e.id] || []}
      setSteps={setSteps}
      setEvents={setEvents}
      onPrazoVencido={onPrazoVencido} // 🔥 repassar
    />
  ));
}

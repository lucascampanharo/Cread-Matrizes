import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase.js";
import NewEventForm from "../components/event_component/NewEventForm.jsx";
import EventList from "../components/step_component/EventList.jsx";
import Modal from "../components/Modal.jsx";
import "../styles/StepTracker.css";

export default function EventStepTracker() {
  const { disciplinaId } = useParams();
  const [disciplina, setDisciplina] = useState(null);
  const [events, setEvents] = useState([]);
  const [steps, setSteps] = useState({});
  const [user, setUser] = useState(null);

  // 🔥 lista dos atrasados
  const [atrasados, setAtrasados] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchData = async () => {
      if (!disciplinaId || !user) return;

      const { data: discData } = await supabase
        .from("disciplinas")
        .select("*")
        .eq("id", disciplinaId)
        .eq("user_id", user.id)
        .single();

      setDisciplina(discData);

      const { data: eventos } = await supabase
        .from("events")
        .select("*")
        .eq("disciplina_id", disciplinaId);

      setEvents(eventos || []);

      if (eventos?.length > 0) {
        const { data: etapas } = await supabase
          .from("steps")
          .select("*")
          .in(
            "event_id",
            eventos.map((e) => e.id)
          );

        const agrupadas = etapas.reduce((acc, s) => {
          if (!acc[s.event_id]) acc[s.event_id] = [];
          acc[s.event_id].push(s);
          return acc;
        }, {});

        setSteps(agrupadas);
      }
    };

    fetchData();
  }, [disciplinaId, user]);

  // 🔥 recebe eventos atrasados vindos do EventItem
  const handlePrazoVencido = useCallback((event) => {
    setAtrasados((prev) => {
      const jaExiste = prev.some((e) => e.id === event.id);
      if (jaExiste) return prev;
      return [...prev, event];
    });

    setModalOpen(true);
  }, []);

  const deleteDisciplina = async () => {
    if (!disciplina) return;

    const confirmar = window.confirm(
      `Tem certeza que deseja excluir a disciplina "${disciplina.nome}"?`
    );
    if (!confirmar) return;

    const { data: eventos } = await supabase
      .from("events")
      .select("id")
      .eq("disciplina_id", disciplinaId);

    if (eventos?.length > 0) {
      await supabase
        .from("steps")
        .delete()
        .in(
          "event_id",
          eventos.map((e) => e.id)
        );
      await supabase
        .from("events")
        .delete()
        .in(
          "id",
          eventos.map((e) => e.id)
        );
    }

    await supabase
      .from("disciplinas")
      .delete()
      .eq("id", disciplinaId)
      .eq("user_id", user.id);

    alert("Disciplina excluída com sucesso!");
    navigate("/");
  };

  return (
    <div className="step-tracker-container">
      <div className="step-tracker">
        <div className="tracker-header">
          <h1>{disciplina ? disciplina.nome : "Carregando..."}</h1>

          <div className="tracker-buttons">
            <button className="back-button" onClick={() => navigate("/")}>
              ⬅ Voltar
            </button>

            <button
              className="delete-disciplina-btn"
              onClick={deleteDisciplina}
            >
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
              onPrazoVencido={handlePrazoVencido}
            />
          </>
        )}
      </div>

      {/* 🔥 MODAL COM LISTA COMPLETA */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        lista={atrasados}
      >
        <h2>⚠ Eventos em atraso</h2>
        <p>Os seguintes eventos estão com o prazo vencido:</p>
      </Modal>
    </div>
  );
}

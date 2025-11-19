import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import Modal from "../components/Modal"; // Ajuste o caminho se necessário
import { FaRegWindowMaximize } from "react-icons/fa"; // Ícone para abrir modal
import "../styles/Home.css";

export default function Home({ user }) {
  const navigate = useNavigate();
  const [disciplinas, setDisciplinas] = useState([]);

  // Estado do modal genérico
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchDisciplinas = async () => {
      const { data, error } = await supabase
        .from("disciplinas")
        .select("id, nome, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Erro ao buscar disciplinas:", error.message);
      } else {
        setDisciplinas(data || []);
      }
    };

    fetchDisciplinas();

    const channel = supabase
      .channel("disciplinas-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "disciplinas",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setDisciplinas((prev) => [...prev, payload.new]);
          }

          if (payload.eventType === "UPDATE") {
            setDisciplinas((prev) =>
              prev.map((disc) =>
                disc.id === payload.new.id ? payload.new : disc
              )
            );
          }

          if (payload.eventType === "DELETE") {
            setDisciplinas((prev) =>
              prev.filter((disc) => disc.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleClick = (id) => {
    navigate(`/eventos/${id}`);
  };

  return (
    <div className="home-container">
      <h1>Minhas Disciplinas</h1>

      {/* Ícone do modal genérico */}
      <div style={{ marginBottom: "20px" }}>
        <FaRegWindowMaximize
          style={{ fontSize: "32px", cursor: "pointer" }}
          onClick={() => setModalOpen(true)}
        />
      </div>

      <div className="disciplinas-grid">
        {disciplinas.map((disc) => (
          <div
            key={disc.id}
            className="disciplina-card"
            onClick={() => handleClick(disc.id)}
          >
            {disc.nome}
          </div>
        ))}

        <div
          className="disciplina-card nova-disciplina-card"
          onClick={() => navigate("/nova-disciplina")}
        >
          ➕ Nova Disciplina
        </div>
      </div>

      {/* Modal genérico */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div style={{ padding: "20px", minWidth: "300px", minHeight: "150px" }}>
          {/* Aqui você adicionará conteúdo futuramente */}
        </div>
      </Modal>
    </div>
  );
}

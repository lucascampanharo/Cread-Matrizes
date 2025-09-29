import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/NewDisciplina.css";

export default function NewDisciplina() {
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim()) {
      alert("Digite o nome da disciplina!");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("disciplinas").insert([{ nome }]); // insere no banco

    setLoading(false);

    if (error) {
      console.error("Erro ao criar disciplina:", error.message);
      alert("Erro ao criar disciplina.");
    } else {
      alert("Disciplina criada com sucesso!");
      navigate("/"); // volta para a Home
    }
  };

  return (
    <div className="new-disciplina-container">
      <h1>Criar Nova Disciplina</h1>
      <form onSubmit={handleSubmit} className="new-disciplina-form">
        <input
          type="text"
          placeholder="Nome da disciplina"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Criar"}
        </button>
      </form>

      <button className="back-button" onClick={() => navigate("/")}>
        ⬅ Voltar
      </button>
    </div>
  );
}

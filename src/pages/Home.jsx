import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();

  const disciplinas = [
    { id: 1, nome: "Algoritmos e Programação" },
    { id: 2, nome: "Comunicação" },
    { id: 3, nome: "Modelos de Gestão" },
    { id: 4, nome: "Competências Pessoais" },
    { id: 5, nome: "Economia e Mercado" },
    { id: 6, nome: "Sistemas de Produção" },
  ];

  const handleClick = (id) => {
    // você pode passar o id da disciplina via rota
    navigate(`/eventos/${id}`);
  };

  return (
    <div className="home-container">
      <h1>Disciplinas</h1>
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
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User } from "lucide-react";
import { supabase } from "../supabase";
import "../styles/component_styles/Header.css";

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();

  // Função para sair
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login"); // redireciona para a tela de login
    } catch (error) {
      console.error("Erro ao sair:", error.message);
    }
  };

  return (
    <header className="header">
      <header className="header-left">
        <h2>Olá</h2>
      </header>
      <div className="header-right">
        <button className="icon-button">
          <Bell size={18} />
        </button>

        <div className="user-menu">
          <button
            className="user-avatar"
            onClick={() => setMenuAberto(!menuAberto)}
          >
            <User size={20} />
          </button>

          {menuAberto && (
            <div className="dropdown-menu">
              <p onClick={() => navigate("/perfil")}>👤 Meu Perfil</p>
              <p onClick={() => navigate("/config")}>⚙️ Configurações</p>
              <p onClick={handleSignOut}>🚪 Sair</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

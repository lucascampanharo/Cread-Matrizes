import { useState } from "react";
import { Bell, ChevronDown, User } from "lucide-react";
import "../styles/Header.css";

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="header">
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
              <p>👤 Meu Perfil</p>
              <p>⚙️ Configurações</p>
              <p>🚪 Sair</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

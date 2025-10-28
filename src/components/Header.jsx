import React from "react";
import { supabase } from "../supabase";
import { Link, useNavigate } from "react-router-dom";
import "../styles/component_styles/Header.css";

export default function Header({ user }) {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut(); // encerra sessão
    navigate("/"); // volta para a tela inicial ou login
  }

  return (
    <header className="header">
      <h1>Bem-vindo, {user?.user_metadata?.name || "Usuário"}</h1>

      <nav className="header-nav">
        <Link to="/">Início</Link>
        <Link to="/perfil">Perfil</Link>
        <button onClick={() => navigate("/config")}>Configurações</button>
        <button className="logout-btn" onClick={handleLogout}>
          Sair
        </button>
      </nav>
    </header>
  );
}

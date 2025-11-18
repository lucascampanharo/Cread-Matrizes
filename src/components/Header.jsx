import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Link, useNavigate } from "react-router-dom";
import "../styles/component_styles/Header.css";

export default function Header({ user, sidebarAberta }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function fetchUserName() {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Erro ao buscar nome do usuário:", error);
      } else {
        setUserName(data?.full_name || "");
      }
    }

    fetchUserName();
  }, [user]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <header
      className={`header ${
        sidebarAberta ? "header-sidebar-open" : "header-sidebar-closed"
      }`}
    >
      <h1>
        Bem-vindo{userName ? `, ${userName}` : user ? `, ${user.email}` : ""}!
      </h1>

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

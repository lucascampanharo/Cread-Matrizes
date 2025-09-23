import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import EventStepTracker from "./pages/EventStepTracker";
import LoginPage from "./pages/Login";
import Home from "./pages/Home"; // nova página que criamos
import "./styles/App.css"; // CSS separado para o App

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica usuário atual
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Escuta mudanças de autenticação
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <p className="loading">Carregando...</p>;
  }

  if (!user) {
    return <LoginPage />; // Tela de login se não tiver usuário
  }

  return (
    <Router>
      <div className="app-container">
        <button
          className="logout-button"
          onClick={() => supabase.auth.signOut()}
        >
          Sair
        </button>

        <Routes>
          {/* Home com as disciplinas */}
          <Route path="/" element={<Home />} />

          {/* Página de eventos filtrada pela disciplina */}
          <Route path="/eventos/:disciplinaId" element={<EventStepTracker />} />

          {/* Redireciona qualquer rota inválida para a Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

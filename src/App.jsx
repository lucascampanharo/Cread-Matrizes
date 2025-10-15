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
import Home from "./pages/Home";
import NewDisciplina from "./pages/NewDisciplina";
import "./styles/App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se já existe um usuário logado
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Escuta mudanças na autenticação (login/logout)
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

  // Caso não esteja logado → vai pra tela de login
  if (!user) {
    return <LoginPage />;
  }

  return (
    <Router>
      <div className="app-container">
        <div className="app-header">
          <button
            className="logout-button"
            onClick={() => supabase.auth.signOut()}
          >
            Sair
          </button>
        </div>

        <Routes>
          {/* Página inicial */}
          <Route path="/" element={<Home user={user} />} />

          {/* Criação de nova disciplina */}
          <Route
            path="/nova-disciplina"
            element={<NewDisciplina user={user} />}
          />

          {/* Página de eventos de uma disciplina */}
          <Route
            path="/eventos/:disciplinaId"
            element={<EventStepTracker user={user} />}
          />

          {/* Rotas inválidas redirecionam para Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

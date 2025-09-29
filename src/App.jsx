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
import NewDisciplina from "./pages/NewDisciplina"; // <-- nova tela
import "./styles/App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

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
    return <LoginPage />; // Tela de login
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
          {/* Página inicial = Home */}
          <Route path="/" element={<Home />} />

          {/* Página para criação de nova disciplina */}
          <Route path="/nova-disciplina" element={<NewDisciplina />} />

          {/* Página de eventos filtrada pela disciplina */}
          <Route path="/eventos/:disciplinaId" element={<EventStepTracker />} />

          {/* Qualquer rota inválida leva para Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

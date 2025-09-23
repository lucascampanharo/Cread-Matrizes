import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";
import EventStepTracker from "./pages/EventStepTracker";
import LoginPage from "./pages/Login";
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
    return <LoginPage />; // tela de login se não tiver usuário
  }

  return (
    <div className="app-container">
      <button className="logout-button" onClick={() => supabase.auth.signOut()}>
        Sair
      </button>
      <EventStepTracker />
    </div>
  );
}

export default App;

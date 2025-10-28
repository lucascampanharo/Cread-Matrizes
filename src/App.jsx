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
import Header from "./components/header.jsx";
import SidebarStats from "./components/SidebarStats";
import Perfil from "./pages/Perfil";
import Config from "./pages/Config";
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
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  if (loading) return <p className="loading">Carregando...</p>;
  if (!user) return <LoginPage />;

  return (
    <Router>
      <div className="layout">
        <SidebarStats />
        <div className="main-content">
          <Header user={user} />
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route
              path="/nova-disciplina"
              element={<NewDisciplina user={user} />}
            />
            <Route
              path="/eventos/:disciplinaId"
              element={<EventStepTracker user={user} />}
            />
            <Route path="/perfil" element={<Perfil user={user} />} />
            <Route path="/config" element={<Config />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "../styles/Perfil.css";

export default function Perfil({ user }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      // Busca os dados do perfil (nome e papel, se tiver)
      const { data, error } = await supabase
        .from("profiles")
        .select("role, created_at")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Erro ao buscar perfil:", error);
      } else {
        setProfile(data);
      }
    }

    fetchProfile();
  }, [user]);

  return (
    <div className="perfil-container">
      <h2>Meu Perfil</h2>

      {user ? (
        <div className="perfil-card">
          <p>
            <strong>Nome:</strong>{" "}
            {user.user_metadata?.name || "Sem nome definido"}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          {profile && (
            <>
              <p>
                <strong>Função:</strong> {profile.role}
              </p>
              <p>
                <strong>Data de Criação:</strong>{" "}
                {new Date(profile.created_at).toLocaleDateString("pt-BR")}
              </p>
            </>
          )}
        </div>
      ) : (
        <p>Carregando perfil...</p>
      )}
    </div>
  );
}

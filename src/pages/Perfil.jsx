import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "../styles/Perfil.css";

export default function Perfil({ user }) {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, role, created_at")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Erro ao buscar perfil:", error);
      } else {
        setProfile(data);
        setNewName(data?.full_name || "");
      }
    }

    fetchProfile();
  }, [user]);

  async function handleSaveName() {
    if (!newName.trim()) return alert("O nome não pode estar vazio.");

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: newName })
      .eq("id", user.id);

    if (error) {
      console.error("Erro ao atualizar nome:", error);
      alert("Erro ao salvar nome.");
    } else {
      setProfile((prev) => ({ ...prev, full_name: newName }));
      setEditing(false);
      alert("Nome atualizado com sucesso!");
    }
  }

  return (
    <div className="perfil-container">
      <h2>Meu Perfil</h2>

      {user ? (
        <div className="perfil-card">
          <div className="perfil-row">
            <strong>Nome:</strong>{" "}
            {editing ? (
              <>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="perfil-input"
                />
                <button onClick={handleSaveName} className="perfil-btn salvar">
                  Salvar
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setNewName(profile.full_name || "");
                  }}
                  className="perfil-btn cancelar"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span>{profile?.full_name || "Sem nome definido"}</span>
                <button
                  onClick={() => setEditing(true)}
                  className="perfil-btn editar"
                >
                  Editar
                </button>
              </>
            )}
          </div>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          {profile && (
            <>
              <p>
                <strong>Função:</strong> {profile.role}
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

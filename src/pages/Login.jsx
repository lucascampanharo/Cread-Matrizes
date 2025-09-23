import React, { useState } from "react";
import { supabase } from "../supabase";
import "../styles/Login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [modo, setModo] = useState("login"); // "login" ou "register"
  const [erro, setErro] = useState(null);

  const handleAuth = async () => {
    setErro(null);

    try {
      if (modo === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: senha,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password: senha,
        });
        if (error) throw error;
        alert("Conta criada! Se necessário, confirme o email.");
      }
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{modo === "login" ? "Login" : "Registrar"}</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="login-input"
        />

        {erro && <p className="login-error">{erro}</p>}

        <button onClick={handleAuth} className="login-button">
          {modo === "login" ? "Entrar" : "Criar Conta"}
        </button>

        <p className="login-toggle">
          {modo === "login" ? (
            <>
              Não tem conta?{" "}
              <span onClick={() => setModo("register")}>Registre-se</span>
            </>
          ) : (
            <>
              Já tem conta?{" "}
              <span onClick={() => setModo("login")}>Faça login</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

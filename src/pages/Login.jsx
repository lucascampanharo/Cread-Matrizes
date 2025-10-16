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
      console.error(err);

      if (err.message.includes("Invalid login credentials")) {
        setErro("Email ou senha incorretos.");
      } else if (err.message.includes("User already registered")) {
        setErro("Este email já está cadastrado.");
      } else if (err.message.includes("Password should be at least")) {
        setErro("A senha deve ter pelo menos 6 caracteres.");
      } else {
        setErro("Ocorreu um erro. Tente novamente mais tarde.");
      }
    }
  };

  return (
    <div className="login-page">
      {/* Lado esquerdo */}
      <div className="left-side">
        <h1 className="logo">FTEC</h1>
      </div>

      {/* Lado direito */}
      <div className="right-side">
        <h2>Bem-vindo!</h2>
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
    </div>
  );
}

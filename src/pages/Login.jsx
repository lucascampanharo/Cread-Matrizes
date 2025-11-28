import React, { useState } from "react";
import { supabase } from "../supabase";
import "../styles/Login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [modo, setModo] = useState("login");
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setErro(null);

    if (!email || !senha || (modo === "register" && !nome)) {
      setErro("Preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      let error;

      if (modo === "login") {
        const { error: errLogin } = await supabase.auth.signInWithPassword({
          email,
          password: senha,
        });

        error = errLogin;
      } else {
        // REGISTRO + ENVIAR O NOME PARA O METADATA
        const { error: errRegister } = await supabase.auth.signUp({
          email,
          password: senha,
          options: {
            data: { full_name: nome },
          },
        });

        error = errRegister;

        if (!error) {
          alert("Conta criada! Verifique seu email.");
        }
      }

      if (error) throw error;
    } catch (err) {
      console.error(err);

      const msg = err?.message || "";

      if (msg.includes("Invalid login credentials")) {
        setErro("Email ou senha incorretos.");
      } else if (msg.includes("User already registered")) {
        setErro("Este email já está cadastrado.");
      } else if (msg.includes("Password should be at least")) {
        setErro("A senha deve ter pelo menos 6 caracteres.");
      } else {
        setErro("Ocorreu um erro inesperado. Tente novamente.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="left-side">
        <h1 className="logo">Uniftec</h1>
      </div>

      <div className="right-side">
        <h2>Bem-vindo!</h2>

        <div className="login-box">
          <h2>{modo === "login" ? "Login" : "Registrar"}</h2>

          {modo === "register" && (
            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="login-input"
            />
          )}

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

          <button
            onClick={handleAuth}
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Aguarde..."
              : modo === "login"
              ? "Entrar"
              : "Criar Conta"}
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

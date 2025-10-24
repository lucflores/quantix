import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) navigate("/dashboard", { replace: true });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow-sm">
      <h4 className="text-center mb-3">Iniciar sesión</h4>

      <div className="mb-3">
        <label className="form-label">Correo</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Contraseña</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <button className="btn btn-primary w-100" type="submit" disabled={loading}>
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
};

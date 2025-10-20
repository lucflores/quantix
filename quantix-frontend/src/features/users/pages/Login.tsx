import { useState } from "react";
import { useAuth } from "../../../core/auth/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("admin@quantix.com");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState<string|null>(null);
  const login = useAuth((s) => s.login);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Credenciales inválidas");
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ padding: 24, maxWidth: 360 }}>
      <h2>Ingresar</h2>
      <label>Email</label>
      <input value={email} onChange={(e)=>setEmail(e.target.value)} />
      <label>Contraseña</label>
      <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button type="submit">Entrar</button>
      {error && <p style={{color:"crimson"}}>{error}</p>}
    </form>
  );
}

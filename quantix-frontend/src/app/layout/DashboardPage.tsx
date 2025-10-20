import { useAuth } from '@/core/auth/useAuth'

export default function DashboardPage() {
  const logout = useAuth(s => s.logout)
  return (
    <div className="container py-5">
      <h2>Quantix 1.0.0</h2>
      <p>Bienvenido al panel principal</p>
      <button className="btn btn-outline-danger" onClick={logout}>Cerrar sesión</button>
    </div>
  )
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from './hooks/useLogin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import { toast } from 'sonner';
import waveBg from '@/assets/wave-bg.png';

export default function LoginPage() { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // podés usar isPending en vez de tu isLoading local
  const { mutateAsync: login, isPending } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    try {
      await login({ email, password });
      toast.success('Sesión iniciada correctamente');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: `url(${waveBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      <Card className="w-full max-w-md p-8 glass-card relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 shadow-glow">
            <span className="text-3xl font-bold text-foreground">Q</span>
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Quantix</h1>
          <p className="text-muted-foreground">Sistema de Gestión Inteligente</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@quantix.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-input border-border"
            />
          </div>

          <Button type="submit" className="w-full btn-gradient" disabled={isPending}>
            <LogIn className="w-4 h-4 mr-2" />
            {isPending ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Demo: cualquier email/password funciona
        </p>
      </Card>
    </div>
  );
}

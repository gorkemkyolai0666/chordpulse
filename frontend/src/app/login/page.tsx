'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Flower2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('demo@istanbulenstrumanatolyesi.com');
  const [password, setPassword] = useState('demo123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch {
      setError('Geçersiz e-posta veya şifre. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="cp-artisan-bg pointer-events-none fixed inset-0 -z-10" aria-hidden />
      <div className="mb-8 text-center">
        <h1 className="flex items-center justify-center gap-2 font-display text-4xl">
          <Flower2 className="h-8 w-8 text-primary" aria-hidden />
          Bloom<span className="text-primary">Pulse</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Çiçek stüdyosu operasyon yönetimi</p>
      </div>

      <Card className="cp-card w-full max-w-md shadow-none">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Giriş</CardTitle>
          <CardDescription>Çiçek stüdyonuzu yönetmek için giriş yapın</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className="rounded-sm border border-destructive bg-destructive/10 p-3 text-sm text-destructive"
                role="alert"
              >
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Hesabınız yok mu?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Kayıt olun
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

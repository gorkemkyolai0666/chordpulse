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

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    firmName: '',
    phone: '',
    city: '',
    state: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      router.push('/dashboard');
    } catch {
      setError('Kayıt başarısız. Bilgilerinizi kontrol edin.');
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
        <p className="mt-1 text-muted-foreground">Yeni çiçek stüdyosu hesabı oluşturun</p>
      </div>

      <Card className="cp-card w-full max-w-lg shadow-none">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Kayıt Ol</CardTitle>
          <CardDescription>Çiçek stüdyonuzu dijitalleştirin</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            {error && (
              <div
                className="border-2 border-destructive bg-destructive/10 p-3 text-sm text-destructive sm:col-span-2"
                role="alert"
              >
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label>Ad</Label>
              <Input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Soyad</Label>
              <Input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Firma Adı</Label>
              <Input
                value={form.firmName}
                onChange={(e) => setForm({ ...form, firmName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>E-posta</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Şifre</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={8}
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" className="w-full font-display uppercase" disabled={loading}>
                {loading ? 'Kaydediliyor...' : 'Hesap Oluştur'}
              </Button>
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Zaten hesabınız var mı?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Giriş yapın
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

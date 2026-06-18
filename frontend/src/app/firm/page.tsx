'use client';

import { useEffect, useState } from 'react';
import { AuthenticatedLayout } from '@/components/authenticated-layout';
import { LoadingSpinner, ErrorState } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

interface FirmProfile {
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  totalRepairBenches: number;
  timezone: string;
}

export default function FirmPage() {
  const { token } = useAuth();
  const [firm, setFirm] = useState<FirmProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    api.firm
      .get(token)
      .then((data) => setFirm(data as FirmProfile))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !firm) return;
    setSaving(true);
    setSuccess(false);
    try {
      await api.firm.update(token, firm as unknown as Record<string, unknown>);
      setSuccess(true);
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase">Firma Profili</h1>
          <p className="text-muted-foreground">Taş işleme atölyesi bilgileri ve CNC kapasitesi</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorState onRetry={load} />}
        {firm && !loading && (
          <Card className="cp-brutal-card shadow-none">
            <CardHeader>
              <CardTitle className="font-display uppercase">Firma Bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                {success && (
                  <div className="border-2 border-success bg-success/10 p-3 text-sm text-success">
                    Ayarlar kaydedildi.
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Firma Adı</Label>
                  <Input value={firm.name} onChange={(e) => setFirm({ ...firm, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Telefon</Label>
                  <Input value={firm.phone || ''} onChange={(e) => setFirm({ ...firm, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Adres</Label>
                  <Input value={firm.address || ''} onChange={(e) => setFirm({ ...firm, address: e.target.value })} />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Şehir</Label>
                    <Input value={firm.city || ''} onChange={(e) => setFirm({ ...firm, city: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Bölge</Label>
                    <Input value={firm.state || ''} onChange={(e) => setFirm({ ...firm, state: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Posta Kodu</Label>
                    <Input value={firm.zipCode || ''} onChange={(e) => setFirm({ ...firm, zipCode: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Toplam CNC Makine</Label>
                  <Input
                    type="number"
                    value={firm.totalRepairBenches}
                    onChange={(e) => setFirm({ ...firm, totalRepairBenches: parseInt(e.target.value, 10) })}
                  />
                </div>
                <Button type="submit" disabled={saving} className="font-display uppercase">
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}

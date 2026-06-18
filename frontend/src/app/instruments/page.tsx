'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { AuthenticatedLayout } from '@/components/authenticated-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { formatInstrumentCondition, formatLaborHours } from '@/lib/utils';

interface StemItem {
  id: string;
  instrumentName: string;
  instrumentFamily?: string;
  laborHours?: number;
  stage: string;
  status: string;
}

export default function StemsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<StemItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ instrumentName: '', instrumentFamily: '', laborHours: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    api.instruments
      .list(token)
      .then((data) => setItems((data as { data: StemItem[] }).data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      await api.instruments.create(token, {
        ...form,
        laborHours: form.laborHours ? parseFloat(form.laborHours) : undefined,
      });
      setForm({ instrumentName: '', instrumentFamily: '', laborHours: '' });
      setShowForm(false);
      load();
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl">Çiçek Stokları</h1>
            <p className="text-muted-foreground">Stok envanteri ve tazelik durumu takibi</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Stok Ekle
          </Button>
        </div>

        {showForm && (
          <Card className="cp-card shadow-none">
            <CardHeader>
              <CardTitle className="font-display">Stok Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="instrumentName">Lot Adı</Label>
                  <Input
                    id="instrumentName"
                    value={form.instrumentName}
                    onChange={(e) => setForm({ ...form, instrumentName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="instrumentFamily">Çiçek Türü</Label>
                  <Input
                    id="instrumentFamily"
                    value={form.instrumentFamily}
                    onChange={(e) => setForm({ ...form, instrumentFamily: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="laborHours">Demet Sayısı</Label>
                  <Input
                    id="laborHours"
                    type="number"
                    step="0.01"
                    value={form.laborHours}
                    onChange={(e) => setForm({ ...form, laborHours: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading && <LoadingSpinner />}
        {error && <ErrorState onRetry={load} />}
        {!loading && !error && items.length === 0 && (
          <EmptyState title="Stok bulunamadı" description="İlk çiçek stok kaydınızı ekleyerek başlayın." />
        )}
        {!loading && !error && items.length > 0 && (
          <Card className="cp-card shadow-none">
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2">Lot</th>
                      <th className="pb-2">Çiçek Türü</th>
                      <th className="pb-2">Demet</th>
                      <th className="pb-2">Tazelik</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-border/50">
                        <td className="py-2 font-medium">{item.instrumentName}</td>
                        <td className="py-2">{item.instrumentFamily || '—'}</td>
                        <td className="py-2">{item.laborHours ? formatLaborHours(item.laborHours) : '—'}</td>
                        <td className="py-2">
                          <Badge variant="secondary">{formatInstrumentCondition(item.stage)}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}

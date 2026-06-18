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
import { formatOrderStatus, formatOrderType } from '@/lib/utils';

interface Order {
  id: string;
  orderNumber: string;
  clientName: string;
  status: string;
  orderType?: string;
  instrumentCount?: number;
  benchName?: string;
}

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ orderNumber: '', clientName: '', instrumentCount: '', benchName: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.orders
      .list(token)
      .then((data) => setOrders((data as { data: Order[] }).data))
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
      await api.orders.create(token, {
        ...form,
        instrumentCount: form.instrumentCount ? parseInt(form.instrumentCount, 10) : undefined,
        orderType: 'retail',
      });
      setForm({ orderNumber: '', clientName: '', instrumentCount: '', benchName: '' });
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
            <h1 className="font-display text-4xl">Çiçek Siparişleri</h1>
            <p className="text-muted-foreground">Sipariş takibi, soğuk oda ataması ve durum yönetimi</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Sipariş
          </Button>
        </div>

        {showForm && (
          <Card className="cp-card shadow-none">
            <CardHeader>
              <CardTitle className="font-display">Sipariş Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="orderNumber">Sipariş No</Label>
                  <Input
                    id="orderNumber"
                    value={form.orderNumber}
                    onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="clientName">Müşteri</Label>
                  <Input
                    id="clientName"
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="instrumentCount">Dal Sayısı</Label>
                  <Input
                    id="instrumentCount"
                    type="number"
                    value={form.instrumentCount}
                    onChange={(e) => setForm({ ...form, instrumentCount: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="benchName">Soğuk Oda</Label>
                  <Input
                    id="benchName"
                    value={form.benchName}
                    onChange={(e) => setForm({ ...form, benchName: e.target.value })}
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
        {!loading && !error && orders.length === 0 && (
          <EmptyState title="Sipariş bulunamadı" description="İlk çiçek siparişinizi ekleyerek başlayın." />
        )}
        {!loading && !error && orders.length > 0 && (
          <Card className="cp-card shadow-none">
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2">Sipariş No</th>
                      <th className="pb-2">Müşteri</th>
                      <th className="pb-2">Tip</th>
                      <th className="pb-2">Dal Sayısı</th>
                      <th className="pb-2">Soğuk Oda</th>
                      <th className="pb-2">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-border/50">
                        <td className="py-2 font-medium">{order.orderNumber}</td>
                        <td className="py-2">{order.clientName}</td>
                        <td className="py-2 text-muted-foreground">
                          {formatOrderType(order.orderType || 'retail')}
                        </td>
                        <td className="py-2">{order.instrumentCount ?? '—'}</td>
                        <td className="py-2">{order.benchName || '—'}</td>
                        <td className="py-2">
                          <Badge variant="secondary">{formatOrderStatus(order.status)}</Badge>
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

'use client';

import { useEffect, useState } from 'react';
import { AuthenticatedLayout } from '@/components/authenticated-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/states';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { formatDate, formatHandoffStatus, formatHandoffType } from '@/lib/utils';

interface Delivery {
  id: string;
  handoffName: string;
  scheduledAt: string;
  status: string;
  handoffType: string;
  travelKm?: number;
  caseLoad?: number;
  benchName?: string;
  order?: { orderNumber: string; clientName: string };
}

export default function DeliveriesPage() {
  const { token } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    api.handoffs
      .list(token)
      .then((data) => setDeliveries((data as { data: Delivery[] }).data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-4xl">Teslimat Planı</h1>
          <p className="text-muted-foreground">Teslimat rotası, araç yükü ve durum takibi</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorState onRetry={load} />}
        {!loading && !error && deliveries.length === 0 && (
          <EmptyState title="Teslimat kaydı yok" description="Henüz teslimat planı oluşturulmamış." />
        )}
        {!loading && !error && deliveries.length > 0 && (
          <Card className="cp-card shadow-none">
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2">Teslimat</th>
                      <th className="pb-2">Sipariş</th>
                      <th className="pb-2">Tarih</th>
                      <th className="pb-2">Tip</th>
                      <th className="pb-2">Rota (km)</th>
                      <th className="pb-2">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveries.map((delivery) => (
                      <tr key={delivery.id} className="border-b border-border/50">
                        <td className="py-2 font-medium">{delivery.handoffName}</td>
                        <td className="py-2">{delivery.order?.orderNumber}</td>
                        <td className="py-2">{formatDate(delivery.scheduledAt)}</td>
                        <td className="py-2">{formatHandoffType(delivery.handoffType)}</td>
                        <td className="py-2">{delivery.travelKm ? `${delivery.travelKm} km` : '—'}</td>
                        <td className="py-2">
                          <Badge variant="secondary">{formatHandoffStatus(delivery.status)}</Badge>
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

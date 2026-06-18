'use client';

import { useEffect, useState } from 'react';
import { AuthenticatedLayout } from '@/components/authenticated-layout';
import { LoadingSpinner, ErrorState } from '@/components/states';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import {
  formatDate,
  formatPercent,
  formatLaborHours,
  formatHandoffStatus,
  formatHandoffType,
} from '@/lib/utils';

interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  orderFulfillmentRate: number;
  totalInstruments: number;
  completedHandoffs: number;
  pendingHandoffs: number;
  upcomingBenches: number;
  totalLaborHours: number;
  recentHandoffs: Array<{
    id: string;
    scheduledAt: string;
    status: string;
    handoffType: string;
    handoffName: string;
    order?: { orderNumber: string; clientName: string };
  }>;
  repairBenches: Array<{ benchName: string | null; orderCount: number }>;
  monthlyTrend: Array<{ month: string; handoffJobs: number; completed: number }>;
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadStats = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.dashboard
      .stats(token)
      .then((data) => setStats(data as DashboardStats))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStats();
  }, [token]);

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-4xl">Operasyon Paneli</h1>
          <p className="mt-1 text-muted-foreground">Sipariş, stok ve teslimat planı özeti</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorState onRetry={loadStats} />}
        {stats && !loading && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="cp-card">
                <p className="text-xs uppercase text-muted-foreground">Sipariş Karşılama</p>
                <p className="cp-stat-value text-primary">{formatPercent(stats.orderFulfillmentRate)}</p>
                <p className="text-sm text-muted-foreground">
                  {stats.activeOrders}/{stats.totalOrders} sipariş aktif
                </p>
              </div>
              <div className="cp-card">
                <p className="text-xs uppercase text-muted-foreground">Aktif Stoklar</p>
                <p className="cp-stat-value">{stats.totalInstruments}</p>
                <p className="text-sm text-muted-foreground">{formatLaborHours(stats.totalLaborHours)} toplam</p>
              </div>
              <div className="cp-card">
                <p className="text-xs uppercase text-muted-foreground">Teslimat & Atölyeler</p>
                <p className="cp-stat-value">{stats.pendingHandoffs}</p>
                <p className="text-sm text-muted-foreground">{stats.upcomingBenches} yaklaşan atölye</p>
              </div>
              <div className="cp-card">
                <p className="text-xs uppercase text-muted-foreground">Tamamlanan Teslimat</p>
                <p className="cp-stat-value">{stats.completedHandoffs}</p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="cp-card shadow-none">
                <CardHeader>
                  <CardTitle className="font-display text-xl">Son Teslimatlar</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.recentHandoffs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Henüz teslimat kaydı yok.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b text-left text-muted-foreground">
                            <th className="pb-2">Sipariş</th>
                            <th className="pb-2">Tarih</th>
                            <th className="pb-2">Tip</th>
                            <th className="pb-2">Durum</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recentHandoffs.map((delivery) => (
                            <tr key={delivery.id} className="border-b border-border/50">
                              <td className="py-2 font-medium">
                                {delivery.order?.orderNumber}
                                <span className="ml-1 text-muted-foreground">({delivery.order?.clientName})</span>
                              </td>
                              <td className="py-2">{formatDate(delivery.scheduledAt)}</td>
                              <td className="py-2">{formatHandoffType(delivery.handoffType)}</td>
                              <td className="py-2">
                                <Badge variant="secondary">{formatHandoffStatus(delivery.status)}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="cp-card shadow-none">
                <CardHeader>
                  <CardTitle className="font-display text-xl">Soğuk Oda Dağılımı</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.repairBenches.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Henüz soğuk oda atanmamış sipariş yok.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b text-left text-muted-foreground">
                            <th className="pb-2">Soğuk Oda</th>
                            <th className="pb-2">Sipariş Sayısı</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.repairBenches.map((room) => (
                            <tr key={room.benchName} className="border-b border-border/50">
                              <td className="py-2 font-medium">{room.benchName}</td>
                              <td className="py-2">
                                <Badge variant="secondary">{room.orderCount} sipariş</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="cp-card shadow-none">
              <CardHeader>
                <CardTitle className="font-display text-xl">Aylık Teslimat Trendi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-2">Ay</th>
                        <th className="pb-2">Teslimat</th>
                        <th className="pb-2">Tamamlanan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.monthlyTrend.map((row) => (
                        <tr key={row.month} className="border-b border-border/50">
                          <td className="py-2 font-medium">{row.month}</td>
                          <td className="py-2">{row.handoffJobs}</td>
                          <td className="py-2">{row.completed}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AuthenticatedLayout>
  );
}

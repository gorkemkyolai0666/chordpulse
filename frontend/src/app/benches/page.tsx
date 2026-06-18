'use client';

import { useEffect, useState } from 'react';
import { AuthenticatedLayout } from '@/components/authenticated-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/states';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { formatDateTime, formatBenchStatus } from '@/lib/utils';

interface ServiceBench {
  id: string;
  title: string;
  instructor?: string;
  scheduledAt: string;
  maxStudents: number;
  enrolled: number;
  status: string;
}

export default function WorkshopsPage() {
  const { token } = useAuth();
  const [workshops, setWorkshops] = useState<ServiceBench[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    api.benches
      .list(token)
      .then((data) => setWorkshops((data as { data: ServiceBench[] }).data))
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
          <h1 className="font-display text-4xl">Düzenleme Atölyeleri</h1>
          <p className="text-muted-foreground">Buket, aranjman ve çiçek düzenleme atölye planlaması</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorState onRetry={load} />}
        {!loading && !error && workshops.length === 0 && (
          <EmptyState title="Atölye bulunamadı" description="Düzenleme atölyesi planı ekleyin." />
        )}
        {!loading && !error && workshops.length > 0 && (
          <Card className="cp-card shadow-none">
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2">Atölye</th>
                      <th className="pb-2">Eğitmen</th>
                      <th className="pb-2">Tarih</th>
                      <th className="pb-2">Kayıt</th>
                      <th className="pb-2">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workshops.map((workshop) => (
                      <tr key={workshop.id} className="border-b border-border/50">
                        <td className="py-2 font-medium">{workshop.title}</td>
                        <td className="py-2">{workshop.instructor || '—'}</td>
                        <td className="py-2">{formatDateTime(workshop.scheduledAt)}</td>
                        <td className="py-2">{workshop.enrolled}/{workshop.maxStudents}</td>
                        <td className="py-2">
                          <Badge variant="secondary">{formatBenchStatus(workshop.status)}</Badge>
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

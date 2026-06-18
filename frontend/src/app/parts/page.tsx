'use client';

import { useEffect, useState } from 'react';
import { AuthenticatedLayout } from '@/components/authenticated-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/states';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { formatCurrency, formatPartStatus, formatPartCategory } from '@/lib/utils';

interface Variety {
  id: string;
  title: string;
  partCategory: string;
  pricePerUnit: number;
  shelfLifeDays?: number;
  leadDays?: number;
  status: string;
}

export default function VarietiesPage() {
  const { token } = useAuth();
  const [varieties, setVarieties] = useState<Variety[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    api.parts
      .list(token)
      .then((data) => setVarieties((data as { data: Variety[] }).data))
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
          <h1 className="font-display text-4xl">Çiçek Çeşitleri</h1>
          <p className="text-muted-foreground">Çiçek kataloğu, raf ömrü ve demet fiyatlandırması</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorState onRetry={load} />}
        {!loading && !error && varieties.length === 0 && (
          <EmptyState title="Çeşit kaydı yok" description="Çiçek çeşidi tanımlayın." />
        )}
        {!loading && !error && varieties.length > 0 && (
          <Card className="cp-card shadow-none">
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2">Çeşit</th>
                      <th className="pb-2">Kategori</th>
                      <th className="pb-2">Demet Fiyatı</th>
                      <th className="pb-2">Raf Ömrü</th>
                      <th className="pb-2">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {varieties.map((variety) => (
                      <tr key={variety.id} className="border-b border-border/50">
                        <td className="py-2 font-medium">{variety.title}</td>
                        <td className="py-2 text-muted-foreground">
                          {formatPartCategory(variety.partCategory)}
                        </td>
                        <td className="py-2">{formatCurrency(variety.pricePerUnit)}</td>
                        <td className="py-2">{variety.shelfLifeDays ? `${variety.shelfLifeDays} gün` : '—'}</td>
                        <td className="py-2">
                          <Badge variant="secondary">{formatPartStatus(variety.status)}</Badge>
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

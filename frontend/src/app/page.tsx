import Link from 'next/link';
import { Guitar, Wrench, Truck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Guitar,
    title: 'Tamir Siparişleri',
    description: 'Okul, orkestra ve perakende tamir taleplerini öncelik ve teslim tarihiyle yönetin.',
  },
  {
    icon: Wrench,
    title: 'Enstrüman Takibi',
    description: 'Keman, gitar ve piyano gibi enstrümanların tamir aşamasını anlık izleyin.',
  },
  {
    icon: Truck,
    title: 'Teslimat Planı',
    description: 'Müşteri teslimatları, mesafe ve kasa yükünü tek panelden planlayın.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen cp-workshop-bg">
      <header className="border-b border-border/60 bg-card/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="flex items-center gap-2 font-display text-2xl">
            <Guitar className="h-6 w-6 text-primary" aria-hidden />
            Chord<span className="text-primary">Pulse</span>
          </span>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Giriş</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Ücretsiz Başla</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
                  Technical Artisan — Enstrüman Tamir SaaS
                </p>
                <h1 className="font-display text-5xl leading-tight md:text-6xl">
                  Her nota için kusursuz bakım
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  Tamir siparişleri, enstrüman envanteri, tezgah planı ve yedek parça stokunu Excel ve
                  kağıt defterinden kurtarın. Türkiye&apos;deki enstrüman tamir atölyeleri için tasarlandı.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button size="lg" asChild>
                    <Link href="/register">
                      Demo Hesabıyla Başla
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/login">Giriş Yap</Link>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="cp-stat-card space-y-4 p-8">
                  <p className="text-sm text-muted-foreground">Canlı operasyon özeti</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-display text-3xl text-primary">18</p>
                      <p className="text-sm text-muted-foreground">Aktif tamir</p>
                    </div>
                    <div>
                      <p className="font-display text-3xl text-primary">5</p>
                      <p className="text-sm text-muted-foreground">Bekleyen teslimat</p>
                    </div>
                    <div>
                      <p className="font-display text-3xl text-primary">47</p>
                      <p className="text-sm text-muted-foreground">Enstrüman atölyede</p>
                    </div>
                    <div>
                      <p className="font-display text-3xl text-primary">128</p>
                      <p className="text-sm text-muted-foreground">Yedek parça çeşidi</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border/60 bg-card/30 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-display text-center text-3xl md:text-4xl">Atölyeniz için üç temel modül</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title} className="cp-stat-card">
                    <Icon className="h-8 w-8 text-primary" aria-hidden />
                    <h3 className="mt-4 font-display text-xl">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

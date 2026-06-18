'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  Guitar,
  Truck,
  Hammer,
  Package,
  Building2,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Panel', icon: LayoutDashboard },
  { href: '/orders', label: 'Tamir Siparişleri', icon: ClipboardList },
  { href: '/instruments', label: 'Enstrümanlar', icon: Guitar },
  { href: '/handoffs', label: 'Teslimatlar', icon: Truck },
  { href: '/benches', label: 'Tamir Tezgahları', icon: Hammer },
  { href: '/parts', label: 'Yedek Parçalar', icon: Package },
  { href: '/firm', label: 'Atölye Profili', icon: Building2 },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { firm, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebar = (
    <aside className="cp-sidebar flex h-full flex-col">
      <div className="border-b border-border/50 px-5 py-6">
        <p className="font-display text-xl leading-none tracking-tight">
          Chord<span className="text-primary">Pulse</span>
        </p>
        <p className="mt-2 text-xs text-muted-foreground">{firm?.name ?? 'Enstrüman Atölyesi'}</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Ana menü">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className="cp-sidebar-link"
              data-active={active}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/50 p-4">
        {user && (
          <p className="mb-3 truncate text-sm text-muted-foreground">
            {user.firstName} {user.lastName}
          </p>
        )}
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Tema değiştir">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={logout} aria-label="Çıkış yap">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen cp-workshop-bg md:flex">
      <div className="hidden w-64 shrink-0 md:block">{sidebar}</div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-label="Menüyü kapat"
          />
          <div className="absolute left-0 top-0 h-full w-72 shadow-xl">{sidebar}</div>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border/60 bg-card/90 px-4 py-3 backdrop-blur-md md:hidden">
          <div>
            <p className="font-display text-lg leading-none">
              Chord<span className="text-primary">Pulse</span>
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} aria-label="Menüyü aç">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
          <div className="cp-wave-accent mb-6" aria-hidden />
          {children}
        </main>
      </div>
    </div>
  );
}

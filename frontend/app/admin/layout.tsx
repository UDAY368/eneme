'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, FolderOpen, Users, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const isLoginPage = (path: string) => path === '/admin/login';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => setMounted(true), []);

  const isLoggedIn = mounted && typeof window !== 'undefined' && !!localStorage.getItem('eneme_admin_token');

  useEffect(() => {
    if (mounted && !isLoginPage(pathname) && !isLoggedIn) {
      router.replace('/admin/login');
    }
  }, [pathname, isLoggedIn, router, mounted]);

  function handleLogout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('eneme_admin_token');
      localStorage.removeItem('eneme_admin_user');
    }
    router.replace('/admin/login');
    router.refresh();
  }

  if (isLoginPage(pathname)) {
    return <>{children}</>;
  }

  const navItems = [
    { href: '/admin', label: 'Analytics', icon: LayoutDashboard },
    {
      href: '/admin/content',
      label: 'Content',
      icon: FolderOpen,
      children: [
        { href: '/admin/content/portfolio', label: 'Portfolio' },
        { href: '/admin/content/blog', label: 'Blog' },
      ],
    },
    { href: '/admin/leads', label: 'Leads', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-cinema-black text-cinema-white flex font-sans">
      <aside
        className={cn(
          'fixed top-0 left-0 h-screen z-40 border-r border-cinema bg-cinema-dark flex flex-col transition-all duration-300 ease-in-out',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className={cn('p-4 border-b border-cinema flex items-center gap-2', sidebarCollapsed ? 'justify-center' : 'justify-between')}>
          {!sidebarCollapsed && (
            <Link href="/admin" className="text-xl font-bold text-cinema-gold truncate flex-1 min-w-0 font-display">
              ENEMME Admin
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex-shrink-0 text-cinema-secondary hover:text-cinema-gold"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-hidden">
          {navItems.map((item) => (
            <div key={item.href}>
              {item.children ? (
                <div className="space-y-1">
                  <div
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 text-cinema-muted text-sm font-medium rounded-md cursor-default',
                      sidebarCollapsed && 'justify-center px-0'
                    )}
                    onClick={sidebarCollapsed ? () => setSidebarCollapsed(false) : undefined}
                    title={sidebarCollapsed ? 'Click to expand' : undefined}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!sidebarCollapsed && item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        'flex items-center gap-2 px-6 py-2 text-sm rounded-md transition-colors',
                        pathname === child.href
                          ? 'bg-cinema-gold/20 text-cinema-gold'
                          : 'text-cinema-secondary hover:bg-white/5 hover:text-cinema-white'
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors',
                    sidebarCollapsed && 'justify-center px-0',
                    pathname === item.href
                      ? 'bg-cinema-gold/20 text-cinema-gold'
                      : 'text-cinema-secondary hover:bg-white/5 hover:text-cinema-white'
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>
        <div className={cn('p-4 border-t border-cinema', sidebarCollapsed && 'px-2')}>
          <Button
            variant="ghost"
            className={cn('w-full text-cinema-secondary hover:text-cinema-gold hover:bg-white/5', sidebarCollapsed ? 'justify-center px-0' : 'justify-start')}
            onClick={handleLogout}
            title={sidebarCollapsed ? 'Logout' : undefined}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!sidebarCollapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>
      <main
        className={cn(
          'flex-1 min-w-0 overflow-auto p-8 bg-cinema-black transition-[margin] duration-300',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        {children}
      </main>
    </div>
  );
}

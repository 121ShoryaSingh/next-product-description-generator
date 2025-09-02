'use client';
import { useSession } from '@/hooks/useSession';
import { Button } from './ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Menu, Package, Upload } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { fa } from 'zod/locales';

const data = [
  { index: 1, href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { index: 2, href: '/upload', label: 'Upload', icon: Upload },
];

export function Header() {
  const router = useRouter();
  const session = useSession();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogOut = () => {
    session.signOut();
  };
  const handleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <header className="relative bg-white border-b shadow-sm">
      <div className="z-30 fixed w-full">
        {/* Wrapper */}
        <div className="max-w-7xl h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 mx-auto">
          {/* Logo */}
          <Link
            className="flex items-center space-x-2"
            href="/dashboard"
          >
            <Package className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ProductAI</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {data.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.index}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* buttons */}
          <div className="flex items-center space-x-4">
            {session.status === 'authenticated' ? (
              <>
                <span className="text-sm text-gray-700">
                  Welcome, {session.data?.user.name}
                </span>
                <Button onClick={handleLogOut}>Logout</Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    router.push('/login');
                  }}
                >
                  Login
                </Button>
              </>
            )}
            <button
              className="md:hidden p-2"
              onClick={handleMobileMenu}
            >
              <Menu />
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <nav className="md:hidden h-screen border-t bg-gray-50">
            <div className="px-2 py-3 space-y-1">
              {data.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.index}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium',
                      pathname === item.href
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

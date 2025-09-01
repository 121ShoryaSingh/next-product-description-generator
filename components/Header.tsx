'use client';
import { useSession } from '@/hooks/useSession';
import { Button } from './ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Upload } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const data = [
  { index: 1, href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { index: 2, href: '/upload', label: 'Upload', icon: Upload },
];

export function Header() {
  const router = useRouter();
  const session = useSession();
  const pathname = usePathname();

  const handleLogOut = () => {
    session.signOut();
  };
  const handleAddProduct = () => {
    router.push('/upload');
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
          <div className="space-x-6">
            {session.status === 'authenticated' ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleAddProduct}
                  className=""
                >
                  Add Product
                </Button>
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
          </div>
        </div>
      </div>
    </header>
  );
}

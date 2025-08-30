'use client';
import { useSession } from '@/hooks/useSession';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Header() {
  const router = useRouter();
  const session = useSession();

  const handleLogOut = () => {
    session.signOut();
  };
  const handleAddProduct = () => {
    router.push('/upload');
  };
  return (
    <header className="relative">
      <div className="z-30 py-6 fixed w-full">
        {/* Wrapper */}
        <div className="max-w-screen-xl flex justify-between px-8 md:px-16 mx-auto">
          {/* Logo */}
          <div>ProductAI</div>
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

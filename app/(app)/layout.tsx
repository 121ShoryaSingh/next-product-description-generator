'use client';

import { Toaster } from '@/components/ui/sonner';
import ReduxProvider from '../../redux/reduxProvider';
import { Header } from '@/components/Header';

export default function appLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <ReduxProvider>
        <Header />
        {children}
        <Toaster />
      </ReduxProvider>
    </div>
  );
}

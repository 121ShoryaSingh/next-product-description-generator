'use client';

import { Toaster } from 'sonner';
import ReduxProvider from '../../redux/reduxProvider';
import { Header } from '@/components/Header';

export default function appLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ReduxProvider>
        <Header />
        {children}
      </ReduxProvider>
      <Toaster />
    </div>
  );
}

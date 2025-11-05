'use client';

import { Toaster } from '@/components/ui/sonner';
import ReduxProvider from '../../redux/reduxProvider';

export default function appLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <ReduxProvider>
        {children}
        <Toaster />
      </ReduxProvider>
    </div>
  );
}

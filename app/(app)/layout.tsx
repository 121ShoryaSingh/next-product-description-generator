'use client';

import { Toaster } from 'sonner';
import ReduxProvider from '../../redux/reduxProvider';

export default function appLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ReduxProvider>{children}</ReduxProvider>
      <Toaster />
    </div>
  );
}

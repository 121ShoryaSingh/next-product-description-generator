'use client';

import ReduxProvider from '../store/reduxProvider';

export default function appLayout({ children }: { children: React.ReactNode }) {
  return <ReduxProvider>{children}</ReduxProvider>;
}

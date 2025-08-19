'use client';

import ReduxProvider from '../../redux/reduxProvider';

export default function appLayout({ children }: { children: React.ReactNode }) {
  return <ReduxProvider>{children}</ReduxProvider>;
}

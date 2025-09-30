'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export default function ErrorComponent({ error }: { error: string }) {
  useEffect(() => {
    toast.error('Failed to fetch products');
  }, [error]);
  return (
    <div className="flex min-w-full min-h-full justify-center items-center">
      {error}
    </div>
  );
}

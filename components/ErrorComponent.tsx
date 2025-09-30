'use client';

interface GlobalErrorHandlerProps {
  error: string | null;
}

export default function ErrorComponent({ error }: { error: string }) {
  return (
    <div className="flex min-w-full min-h-full justify-center items-center">
      {error}
    </div>
  );
}

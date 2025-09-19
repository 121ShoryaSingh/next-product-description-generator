'use client';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export function DialogButton({
  className,
  children,
  varient,
  close,
}: {
  className?: string;
  children: React.ReactNode;
  varient?:
    | 'link'
    | 'default'
    | 'destructive'
    | 'secondary'
    | 'ghost'
    | null
    | undefined;
  close?: boolean;
}) {
  const router = useRouter();
  const openCreateDialog = () => {
    router.push('?dialog=create');
  };
  const closeCreateDialog = () => {
    router.push('?');
  };
  return (
    <Button
      className={className}
      onClick={close ? closeCreateDialog : openCreateDialog}
      variant={varient ? varient : 'secondary'}
    >
      {children}
    </Button>
  );
}

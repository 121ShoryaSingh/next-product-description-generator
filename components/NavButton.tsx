'use client';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export default function NavButton({
  children,
  link,
  className,
  varient,
}: {
  children: React.ReactNode;
  link: string;
  className?: string;
  varient?:
    | 'link'
    | 'secondary'
    | 'ghost'
    | 'outline'
    | 'default'
    | 'destructive'
    | null
    | undefined;
}) {
  const router = useRouter();
  return (
    <Button
      className={className}
      variant={varient}
      onClick={() => {
        router.push(link);
      }}
    >
      {children}
    </Button>
  );
}

'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Copy, CopyCheck } from 'lucide-react';

export default function CopyButton({
  text,
  title,
  className,
}: {
  text: string;
  title?: string;
  className?: string;
}) {
  const [copyText, setCopyText] = useState(false);

  const handleCopy = async () => {
    setCopyText(true);
    await navigator.clipboard.writeText(text);
    setTimeout(() => {
      setCopyText(false);
    }, 2000);
  };

  return (
    <Button
      className={className}
      variant="outline"
      onClick={handleCopy}
    >
      {copyText ? <CopyCheck /> : <Copy />}
      {title ? title : ''}
    </Button>
  );
}

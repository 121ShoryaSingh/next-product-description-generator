'use client';

import { useState } from 'react';

interface ShowMoreTextProps {
  text: string;
  maxLength?: number;
  showMoreText?: string;
  showLessText?: string;
  className?: string;
}

export default function ShowMore({
  text,
  maxLength = 150,
  showMoreText = 'Show More',
  showLessText = 'Show Less',
  className,
}: ShowMoreTextProps) {
  const [IsExpendable, setIsExpandable] = useState<boolean>(false);

  const toggleExpandable = (): void => {
    setIsExpandable(!IsExpendable);
  };

  if (text.length <= maxLength!) {
    return <div className={className}>{text}</div>;
  }

  return (
    <div className="">
      <span>{IsExpendable ? text : `${text.slice(0, maxLength)}...`}</span>
      <button
        onClick={toggleExpandable}
        className="ml-2 text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
      >
        {IsExpendable ? showLessText : showMoreText}
      </button>
    </div>
  );
}

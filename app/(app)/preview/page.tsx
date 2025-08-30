'use client';

import { Button } from '@/components/ui/button';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

export default function Preview() {
  const router = useRouter();

  const cleanedImage = useSelector(
    (state: RootState) => state.app.cleanedImage
  );
  const aiData = useSelector((state: RootState) => state.app.aiData);
  console.log('aiData:', aiData);
  if (!aiData) {
    toast.error('Something is worng');
  }

  return (
    <div>
      <h1>
        {cleanedImage && (
          <img
            src={cleanedImage}
            alt="Cleaned product"
            className=" w-[300px]"
          />
        )}
        {aiData && (
          <div className="flex flex-col gap-2">
            <p>{aiData.newProduct.name}</p>
            <p>{aiData.newProduct.description}</p>
            <div>
              {aiData.newProduct.captions.map((caption: string) => {
                return <p key={caption}>{caption}</p>;
              })}
            </div>
            <p className="flex flex-wrap gap-2">
              {aiData.newProduct.hashtags.map((hashtag: string) => {
                return <span key={hashtag}>{`${hashtag}`}</span>;
              })}
            </p>
          </div>
        )}
      </h1>
      <Button
        onClick={() => {
          router.push('/upload');
        }}
      >
        Add Product
      </Button>
    </div>
  );
}

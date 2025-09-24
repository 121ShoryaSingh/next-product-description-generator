'use client';

import { ShowMore } from '@/components/ShowMoreText';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Wrapper } from '@/components/Wrapper';
import { RootState } from '@/redux/store';
import Image from 'next/image';
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
    <div className="min-h-screen pt-32">
      <Wrapper>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
              <CardDescription>Original uploaded image</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square rounded-lg">
                <Image
                  src={cleanedImage || ''}
                  alt={aiData.newProduct.name}
                  fill
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{aiData.newProduct.name}</CardTitle>
              <CardDescription>
                <ShowMore text={aiData.newProduct.description} />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CardTitle>Caption</CardTitle>
              <ul>
                {aiData.newProduct.captions.map(
                  (caption: string, index: number) => {
                    return <li key={index}>{caption}</li>;
                  }
                )}
              </ul>
            </CardContent>
            <CardFooter>
              <CardTitle>Hashtags</CardTitle>
              <div>
                {aiData.newProduct.hashtags.map(
                  (hashtag: string, index: number) => {
                    return <span key={index}>{hashtag}</span>;
                  }
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </Wrapper>
    </div>
  );
}

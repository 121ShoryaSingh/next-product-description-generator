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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Product Image</CardTitle>
              <CardDescription className="text-lg">
                Original uploaded image
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square rounded-lg">
                <Image
                  src={cleanedImage || ''}
                  alt={aiData.newProduct.name}
                  fill
                  className="object-contain"
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {aiData.newProduct.name}
              </CardTitle>
              <CardDescription>
                <ShowMore text={aiData.newProduct.description} />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CardTitle>Captions:</CardTitle>
              <CardDescription>
                <ul className="grid grid-cols-1 gap-4 pt-3">
                  {aiData.newProduct.captions.map(
                    (caption: string, index: number) => {
                      return (
                        <li
                          className="py-4 px-5 bg-gray-100 rounded-xl"
                          key={index}
                        >
                          {caption}
                        </li>
                      );
                    }
                  )}
                </ul>
              </CardDescription>
            </CardContent>
            <CardFooter>
              <div className="flex flex-col gap-3">
                <CardTitle>Hashtags:</CardTitle>
                <div className="flex flex-wrap pt-3 bg-gray-100 py-4 px-5 rounded-xl gap-2">
                  {aiData.newProduct.hashtags.map(
                    (hashtag: string, index: number) => {
                      return (
                        <span
                          className="text-blue-600"
                          key={index}
                        >
                          {hashtag}
                        </span>
                      );
                    }
                  )}
                </div>
              </div>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Set Price for your Product</CardTitle>
              <CardDescription>
                Compare the product from vairous website across your region
              </CardDescription>
              <CardContent>
                <Input type="number" />
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      </Wrapper>
    </div>
  );
}

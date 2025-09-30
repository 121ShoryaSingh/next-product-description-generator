'use client';

import MarketResearch from '@/components/MarketResearch';
import { ShowMore } from '@/components/ShowMoreText';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Wrapper } from '@/components/Wrapper';
import { RootState } from '@/redux/store';
import axios from 'axios';
import { TagIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

export default function Preview() {
  const router = useRouter();

  const [price, setPrice] = useState(0);

  const cleanedImage = useSelector(
    (state: RootState) => state.app.cleanedImage
  );
  const aiData = useSelector((state: RootState) => state.app.aiData);
  if (!aiData) {
    return (
      <div className=" min-h-screen flex items-center justify-center">
        <div className="mx-auto flex items-center justify-center gap-8">
          <div className="">No product data avaliable </div>
          <Button
            variant="outline"
            onClick={() => {
              router.push('/upload');
            }}
          >
            Upload data
          </Button>
        </div>
      </div>
    );
  }

  const handlePrice = (e: any) => {
    setPrice(e.target.value);
    router.push('/dashboard');
  };

  const handleSetPrice = async () => {
    try {
      const response = await axios.patch('/api/setPrice', {
        id: aiData.newProduct._id,
        price: Number(price),
      });
      const data = response.data;
      if (response.status === 200) {
        toast.success('Price changed successfully');
      }
    } catch (error) {
      toast.error('Error setting price of product');
    }
  };
  return (
    <div className="min-h-screen pt-32 bg-gray-100">
      <Wrapper className=" flex-col gap-8">
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
                  src={
                    cleanedImage || '' || aiData.newProduct.processedImages[0]
                  }
                  alt={aiData.newProduct.name}
                  fill
                  className="object-contain"
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col gap-8">
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
                  <div className="flex gap-2 pt-4">
                    <Input
                      type="number"
                      placeholder="Enter price"
                      className=""
                      onChange={handlePrice}
                    />
                    <Button onClick={handleSetPrice}>
                      <TagIcon />
                      Set price
                    </Button>
                  </div>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </div>
        {/* Market Research */}
        <div>
          <MarketResearch name={aiData.newProduct.name} />
        </div>
      </Wrapper>
    </div>
  );
}

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
  // const aiData = useSelector((state: RootState) => state.app.aiData);
  // if (!aiData) {
  //   return (
  //     <div className=" min-h-screen flex items-center justify-center">
  //       <div className="mx-auto flex items-center justify-center gap-8">
  //         <div className="">No product data avaliable </div>
  //         <Button
  //           variant="outline"
  //           onClick={() => {
  //             router.push('/upload');
  //           }}
  //         >
  //           Upload data
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  const handlePrice = (e: any) => {
    setPrice(e.target.value);
  };

  const aiData = {
    message: 'Product generated & saved',
    newProduct: {
      baseDetails: 'Nikon Camera, D750, DSLR',
      captions: [
        'Capture the world in breathtaking detail with the Nikon D750.',
        'The Nikon D750: Your gateway to professional-quality photography.',
        'Elevate your visual storytelling with the versatile Nikon D750 DSLR.',
      ],
      createdAt: '2025-09-25T09:29:32.134Z',
      description:
        "Unleash your creative potential with the Nikon D750 DSLR camera. Designed for both aspiring and professional photographers, this full-frame powerhouse delivers exceptional image quality, stunning Full HD 1080p video capabilities, and unmatched versatility. Its 24.3MP CMOS sensor captures breathtaking detail and vibrant colors, while the advanced 51-point autofocus system ensures tack-sharp focus in any shooting situation. \n\nThe D750 excels in low-light conditions, thanks to its wide ISO range of 100-12800 (expandable to 50-51200), allowing you to capture clean, noise-free images even in challenging environments. Its robust construction and weather-sealed body make it ideal for outdoor adventures and demanding shoots. \n\nWhether you're shooting portraits, landscapes, or action-packed moments, the Nikon D750 provides the tools you need to bring your vision to life. Experience the difference a full-frame sensor and advanced features can make. Upgrade your photography gear today and see your images soar. This camera is perfect for photography enthusiasts, semi-professionals, and anyone seeking to elevate their visual storytelling. With easy sharing features and built in Wi-Fi, instantly share your creations with the world.",
      hashtags: [
        'NikonD750',
        'DSLRCamera',
        'FullFrameCamera',
        'Photography',
        'NikonPhotography',
        'CameraGear',
        'PhotoOfTheDay',
        'Photographers',
        'Camera',
        'PhotographyLovers',
        'DSLR',
        'FullFrame',
        'Nikon',
        'ProfessionalPhotography',
        'CreativePhotography',
      ],
      name: 'Nikon D750 DSLR Camera: Capture Stunning Photos & Videos',
      price: 0,
      processedImages: [
        'https://pub-3cc03a744b15424c91b9057076a57e4e.r2.dev/product-fdcx7mmfz7op9v.68ba7e7aaeac521dba42ce98',
      ],
      updatedAt: '2025-09-25T09:29:32.134Z',
      userId: '68ba7e7aaeac521dba42ce98',

      _id: '68d50b7c301c4d25aafa1e92',
    },
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

'use client';
import { Button } from '@/components/ui/button';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  setCleanedImage,
  setAiData,
} from '../../../redux/features/app/appSlice';
import axios from 'axios';
import { Wrapper } from '@/components/Wrapper';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { product } from '@/types/types';
import { Header } from '@/components/Header';

interface ProductData {
  details: string;
  title: string;
  description: string;
  price: number | null;
  captions: string[];
  hashtags: string[];
}

export default function Upload() {
  const router = useRouter();

  //redux state
  const dispatch = useDispatch();
  // local useState()
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');
  const [cleanedBlob, setCleanedBlob] = useState<Blob | null>(null);
  const [product, setProduct] = useState<ProductData>({
    details: '',
    title: '',
    description: '',
    price: 0,
    captions: [],
    hashtags: [],
  });
  //function to update redux state
  const handleSetCleanedImage = (imageUrl: string) => {
    dispatch(setCleanedImage(imageUrl));
  };

  const handleSetAiData = (data: product) => {
    console.log(data);
    dispatch(setAiData(data));
    return true;
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setPreview(URL.createObjectURL(file));
    try {
      const { removeBackground } = await import('@imgly/background-removal');
      const blob = await removeBackground(file, {
        output: {
          format: 'image/png',
        },
      });
      setCleanedBlob(blob);
      const cleanedUrl = URL.createObjectURL(blob);
      handleSetCleanedImage(cleanedUrl);
      setPreview(cleanedUrl);
    } catch (error) {
      console.error('Background removal failed', error);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async () => {
    if (!cleanedBlob) {
      alert('Please upload and process an image first');
      return;
    }
    const formData = new FormData();
    formData.append('product', product.details);
    formData.append('image', cleanedBlob, 'cleaned-image.png');

    const res = await axios.post('/api/generate', formData);
    const data = await res.data;

    if (handleSetAiData(data)) {
      router.push('/preview');
    }
  };
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100">
        <Wrapper className="pt-32 flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <div className="space-y-8">
                <CardHeader>
                  <CardTitle>Upload & Clean Background</CardTitle>
                  <CardDescription>
                    Upload high-quality image of your product
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-3 border-dashed border-blue-500  rounded-xl p-6">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={onFile}
                    />
                    {loading && (
                      <p className="text-sm text-gray-600">Processing…</p>
                    )}
                    {preview && (
                      <div className="aspect-square relative">
                        <Image
                          src={preview}
                          alt="preview"
                          className="object-contain rounded border"
                          fill
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
            <Card>
              <div className="space-y-8">
                <CardHeader>
                  <CardTitle>Basic Details</CardTitle>
                  <CardDescription>
                    Enter basic information related to your product
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    className="w-full rounded border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder='e.g. "red cotton shirt, men’s, size M"'
                    value={product.details}
                    onChange={(e) =>
                      setProduct({ ...product, details: e.target.value })
                    }
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleSubmit}
                    className="w-full"
                  >
                    Next
                  </Button>
                </CardFooter>
              </div>
            </Card>
          </div>
        </Wrapper>
      </div>
    </>
  );
}

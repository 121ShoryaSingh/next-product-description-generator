'use client';
import { Button } from '@/components/ui/button';
import { removeBackground } from '@imgly/background-removal';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { setCleanedImage, setAiData } from '../../redux/features/app/appSlice';

interface ProductData {
  details: string;
  title: string;
  description: string;
  price: number | null;
  captions: string[];
  hashtags: string[];
}

export default function Home() {
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

  const handleSetAiData = (data: any) => {
    dispatch(setAiData(data));
  };

  const onFile = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setPreview(URL.createObjectURL(file));
    try {
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
    formData.append('product', JSON.stringify(product));
    formData.append('image', cleanedBlob, 'cleaned-image.png');

    const res = await fetch('api/generate', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    console.log(data);
    handleSetAiData(data);
    if (data) {
      router.push('/preview');
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-2xl p-6 space-y-6">
        <h1 className="text-2xl font-semibold">
          Step 1 · Upload & Clean Background
        </h1>

        <div className="rounded-xl bg-white p-5 shadow space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={onFile}
          />
          {loading && <p className="text-sm text-gray-600">Processing…</p>}
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-full max-h-96 object-contain rounded border"
            />
          )}
        </div>

        <div className="rounded-xl bg-white p-5 shadow space-y-2">
          <label className="text-sm font-medium">Basic details</label>
          <textarea
            className="w-full rounded border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder='e.g. "red cotton shirt, men’s, size M"'
            value={product.details}
            onChange={(e) =>
              setProduct({ ...product, details: e.target.value })
            }
          />
          <Button onClick={handleSubmit}>Next</Button>
        </div>
      </div>
    </div>
  );
}

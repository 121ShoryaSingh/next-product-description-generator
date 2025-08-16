'use client';

import { Button } from '@/components/ui/button';
// import { useProduct } from '@/context/ProductContext';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { aiDataState } from '../state/appState';

export default function Preview() {
  // const { cleanedImageUrl, product } = useProduct();
  const [aiData, setAiData] = useRecoilState(aiDataState);

  async function generateData() {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, cleanedImageUrl }),
    });
    const data = await res.json();
    setAiData(data);
  }

  return (
    <div>
      <h1>
        {cleanedImageUrl && (
          <img
            src={cleanedImageUrl}
            alt="Cleaned product"
            className=" w-[300px]"
          />
        )}
        <p>{product.details}</p>
        <Button onClick={generateData}>Generate AI Data</Button>
        {aiData && (
          <div>
            <h2>{aiData.title}</h2>
            <p>{aiData.description}</p>
            <p>Price: {aiData.price}</p>
            <p>Caption: {aiData.captions}</p>
            <p>Hashtags: {aiData.hashtag}</p>
          </div>
        )}
      </h1>
    </div>
  );
}

'use client';

import { RootState } from '@/app/store/store';
import { useSelector } from 'react-redux';

export default function Preview() {
  const cleanedImage = useSelector(
    (state: RootState) => state.app.cleanedImage
  );
  const aiData = useSelector((state: RootState) => state.app.aiData);

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
            <p>{aiData.title}</p>
            <p>{aiData.description}</p>
            <p>{aiData.captions}</p>
            <p>{aiData.hashtags}</p>
          </div>
        )}
      </h1>
    </div>
  );
}

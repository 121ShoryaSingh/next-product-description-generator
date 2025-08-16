'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type ProductData = {
  details: string;
  title: string;
  description: string;
  price: number | null;
  captions: string[];
  hashtags: string[];
};
type Ctx = {
  cleanedImageUrl: string | null;
  setCleanedImageUrl: (v: string | null) => void;
  product: ProductData;
  setProduct: (p: ProductData) => void;
};

const ProductContext = createContext<Ctx>({} as any);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [cleanedImageUrl, setCleanedImageUrl] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductData>('');
  return (
    <ProductContext.Provider
      value={{ cleanedImageUrl, setCleanedImageUrl, product, setProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
}
export const useProduct = () => useContext(ProductContext);

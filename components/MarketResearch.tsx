'use client';
import axios from 'axios';
import { Badge } from './ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { Button } from './ui/button';
import { handleError } from '@/lib/handleError';
import { productTypes } from '@/types/types';


export default function MarketResearch({ name }: { name: string }) {
  const [productData, setProductData] = useState<productTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function MarketData() {
      try {
        setLoading(true);
        setError(null);
        if (!name) return;
        const response = await axios.get(`/api/getMarketResearch/?q=${name}`);
        if (response.data?.data && Array.isArray(response.data.data)) {
          setProductData(response.data.data);
        } else {
          setProductData([]);
        }
      } catch (error: unknown) {
        const errorMessage = handleError(error);
        setError(errorMessage);
        toast.error('Failed to fetch Market Research data');
      } finally {
        setLoading(false);
      }
    }
    MarketData();
  }, [name]);
  return (
    <div>
      <Card>
        <div>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CardTitle>Similar Products Online</CardTitle>
              <Badge>Market Research</Badge>
            </div>
            <CardDescription>
              Compare your product with similar items available online
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex justify-center items-center">
                <p>Loading....</p>
              </div>
            )}

            {error && (
              <div className="flex justify-center items-center">
                <p>Something went wrong.</p>
              </div>
            )}

            {!loading && !error && productData.length === 0 && (
              <div className="flex justify-center items-center">
                <p>No similar product found.</p>
              </div>
            )}
            {!loading && productData.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {productData.map((product: productTypes, index: number) => {
                  return (
                    <Card key={index}>
                      <div>
                        <CardHeader>
                          <div className="aspect-square relative">
                            <Image
                              src={
                                product.thumbnail ||
                                '/default-product-thumbnail.png'
                              }
                              alt={product.title || 'product-image'}
                              fill
                              className="object-contain"
                              sizes="(max-width:768px) 100vw"
                            />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col gap-4 h-8">
                            <CardTitle>{product.title}</CardTitle>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <CardDescription className="w-full mt-12">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="aspect-square relative">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={
                                      product.source_icon || '/default-icon.png'
                                    }
                                    alt={product.source || 'souce-icon'}
                                    className="object-contain h-6 w-6"
                                  />
                                </div>
                                <span>{product.source}</span>
                              </div>
                              <p className="text-black">
                                <strong>{product.price}</strong>
                              </p>
                            </div>
                            <a
                              href={product.product_link}
                              target="0"
                            >
                              <Button className="mt-2 w-full cursor-pointer">
                                View Button
                              </Button>
                            </a>
                          </CardDescription>
                        </CardFooter>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

import { CopyButton } from '@/components/CopyButton';
import ImageCarousel from '@/components/ImageCarousel';
import { ShowMore } from '@/components/ShowMoreText';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UploadComponent } from '@/components/UplaodComponent';
import { Wrapper } from '@/components/Wrapper';
import axios from 'axios';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  MessageSquareIcon,
  TagIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// app/products/[slug]/page.tsx
const API_BASE_URL =
  process.env.NEXTAUTH_URL || process.env.BASE_URL || 'http://localhost:3000';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    return <div>No slug provided</div>;
  }

  // Extract ID from slug
  const parts = id.split('-');
  const extractedId = parts[parts.length - 1];

  if (!extractedId || extractedId === 'undefined') {
    return <div className="pt-28">Invalid product ID extracted from slug</div>;
  }
  let product;
  try {
    const response = await axios(
      `${API_BASE_URL}/api/getDetails/${extractedId}`
    );

    if (!response) {
      throw new Error(`API call failed`);
    }

    const result = await response.data;
    product = result.data || result;
  } catch (error) {
    console.error('API Error:', error);
    product = null;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="mb-2">
            Product with ID: {extractedId} could not be loaded
          </p>
          <a
            href="/dashboard"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 relative bg-gray-200">
      <Wrapper className="pt-16 flex-col">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center w-full gap-3">
          <Link
            href={'http://localhost:3000/dashboard'}
            className="w-full sm:w-fit"
          >
            <Button
              variant="outline"
              className="w-full sm:w-fit"
            >
              <ArrowLeft />
              Back to dashboard
            </Button>
          </Link>
          <UploadComponent productId={id} />
        </div>
        {/* Product Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="relative">
            <CardContent className="p-6 md:sticky top-16">
              <ImageCarousel images={product.processedImages} />
            </CardContent>
          </Card>
          {/* Product Details */}
          <div className="space-y-6">
            <Card className="p-6">
              <CardHeader>
                <div className="flex items-start space-x-4 text-sm text-gray-600">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold">
                      {product.name}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{product.price}</span>
                      </span>
                      {product.createdAt && (
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(product.createdAt).toLocaleDateString()}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Description
                    </h4>
                    <ShowMore text={product.description} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center gap-2">
                      <MessageSquareIcon className="h-6 w-6" />{' '}
                      <span className="text-2xl font-semibold">Captions</span>
                      <span className="px-2 py-1 bg-gray-100 rounded-lg">
                        {product.captions.length}
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="flex flex-col gap-5">
                    {product.captions.map((caption: string, index: number) => {
                      return (
                        <li
                          key={index}
                          className="bg-gray-100 py-3 px-2 flex justify-between items-center rounded-lg"
                        >
                          <p className="text-md">{caption}</p>
                          <CopyButton text={caption} />
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
                <CardFooter>
                  <div className="border-t-2 border-gray-100 pt-4 w-full">
                    <CopyButton
                      text={product.captions.toString()}
                      title="Copy All Captions"
                      className="w-full text-md"
                    />
                  </div>
                </CardFooter>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center gap-2">
                      <TagIcon className="h-6 w-6" />{' '}
                      <span className="text-2xl font-semibold">Hashtags</span>
                      <span className="px-2 py-1 bg-gray-100 rounded-lg">
                        {product.hashtags.length}
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="flex flex-wrap gap-2">
                    {product.hashtags.map((hashtags: string, index: number) => {
                      return (
                        <span
                          key={index}
                          className="text-blue-600 bg-gray-100 px-2 py-1 rounded-full"
                        >
                          <span className="text-sm">#{hashtags}</span>
                        </span>
                      );
                    })}
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="border-t-2 border-gray-100 pt-4 w-full">
                    <CopyButton
                      text={product.captions.toString()}
                      title="Copy All Hashtags"
                      className="w-full text-md"
                    />
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}

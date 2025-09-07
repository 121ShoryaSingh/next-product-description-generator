import { product } from '@/types/types';
import { Card, CardContent, CardFooter } from './ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { Eye } from 'lucide-react';
import { Badge } from './ui/badge';

export function ProductCard({
  id,
  name,
  description,
  price,
  caption,
  hashtags,
  processedImages,
}: product) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="aspect-square relative mb-4 rounded-lg overflow-hidden bg-gray-100">
          {processedImages.map((src: string, index: number) => {
            return (
              <Image
                key={index}
                src={src}
                alt={name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="{max-width: 768} 100vw, {max-width:1200px} 50vw, 35vw"
              />
            );
          })}
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2 text-gray-900">
            {name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-blue-600">${price}</span>
            <span className="text-xs text-gray-500">{caption}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex-col">
        <div className="line-clamp-2 mb-5">
          {hashtags.map((hashtage: string, index: number) => {
            return (
              <Badge
                key={index}
                variant="outline"
              >
                #{hashtage}
              </Badge>
            );
          })}
        </div>
        <Link
          href=""
          className="w-full"
        >
          <Button className="w-full flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

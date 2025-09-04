import { product } from '@/types/types';
import { Card, CardContent, CardFooter } from './ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { Eye } from 'lucide-react';

export function ProductCard({
  id,
  name,
  description,
  price,
  caption,
  hashtages,
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
                className=""
              />
            );
          })}
        </div>
        <div>
          <h3>{name}</h3>
          <p>{description}</p>
          <div>
            <span>${price}</span>
            <span>{caption}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href="">
          <Button>
            <Eye />
            <span>View Details</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

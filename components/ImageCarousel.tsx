import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { DownloadIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

export default function ImageCarousel({ images }: { images: string[] }) {
  console.log(images);
  return (
    <div>
      <Carousel
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {images.map((imageLink, index) => {
            return (
              <CarouselItem key={index}>
                <div className="relative aspect-square w-full group">
                  <div className=" hidden absolute right-0 top-0 group-hover:block transition-all duration-500">
                    <Button
                      className="cursor-pointer"
                      variant="outline"
                    >
                      <Link
                        href={imageLink}
                        download={'image.jpg'}
                        className="text-gray-600"
                      >
                        <DownloadIcon />
                      </Link>
                    </Button>
                  </div>
                  <Image
                    src={imageLink}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="hidden">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
}

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { DownloadIcon } from 'lucide-react';

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
                  <div className=" opacity-0 absolute right-0 top-0 group-hover:opacity-100 transition-all duration-500">
                    <a
                      href={imageLink}
                      download={'image.jpg'}
                      className="cursor-pointer"
                    >
                      <DownloadIcon />
                    </a>
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

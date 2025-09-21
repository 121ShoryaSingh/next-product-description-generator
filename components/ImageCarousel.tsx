import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';

export default function ImageCarousel({ images }: { images: string[] }) {
  console.log(images);
  return (
    <div>
      <Carousel>
        <CarouselContent>
          {images.map((imageLink, index) => {
            return (
              <CarouselItem key={index}>
                <div className="relative aspect-square w-full">
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
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

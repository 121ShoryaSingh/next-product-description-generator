export interface product {
  id: string;
  name: string;
  description: string;
  price: number;
  processedImages: string[];
  caption: string[];
  hashtages: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface product {
  id: string;
  name: string;
  description: string;
  price: number;
  processedImages: string[];
  caption: string[];
  hashtags: string[];
  createdAt: Date;
  updatedAt: Date;
}

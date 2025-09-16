export interface product {
  _id: string;
  name: string;
  description: string;
  price: number;
  processedImages: string[];
  caption: string[];
  hashtags: string[];
  createdAt: Date;
  updatedAt: Date;
}

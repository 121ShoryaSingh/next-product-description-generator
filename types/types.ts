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

export interface productTypes {
  product_id: string;
  title: string;
  product_link: string;
  source: string;
  source_icon: string;
  price: string;
  rating: number;
  thumbnail: string;
}

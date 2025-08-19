import mongoose, { Schema } from 'mongoose';

export interface Product extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  baseDetails: string;
  processedImage: string[];
  captions: string[];
  createdAt: Date;
  upDatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    baseDetails: { type: String, required: true },
    processedImages: [{ type: String }],
    captions: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model<Product>('Product', ProductSchema);

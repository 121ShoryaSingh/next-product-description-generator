import { dbConnect } from '@/lib/mongoDb';
import Product from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    const product = await Product.findOne({ _id: new ObjectId(id) });

    if (!product) {
      return NextResponse.json(
        {
          error: 'Product not found',
        },
        { status: 404 }
      );
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: 'Failed to fetch product',
      },
      { status: 500 }
    );
  }
}

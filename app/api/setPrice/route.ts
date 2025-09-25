import { dbConnect } from '@/lib/mongoDb';
import Product from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    console.log(req);
    const body = await req.json();
    const { id, price } = body;

    if (!price || typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { message: 'Please enter a valid price' },
        { status: 400 }
      );
    }
    console.log('control reached here');
    const setPrice = await Product.findByIdAndUpdate(id, {
      $set: {
        price: price,
      },
    });

    if (!setPrice) {
      return NextResponse.json(
        { error: 'Error saving price' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'New price is set successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error setting price', error);
    return NextResponse.json(
      { message: 'Failed to save error' },
      { status: 500 }
    );
  }
}

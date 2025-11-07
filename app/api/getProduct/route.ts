import { verifyToken } from '@/lib/auth';
import { dbConnect } from '@/lib/mongoDb';
import Product from '@/models/Product';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    //Db connect
    const token = req.cookies.get('token')?.value;
    if (!token || token.length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();
    // Taking token and verfying user
    const { email } = verifyToken(token);
    //Get user's product data based on email
    const user = await User.findOne({ email });
    const ProductData = await Product.find({
      _id: { $in: user?.product },
    });
    return NextResponse.json({ message: ProductData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching data', error);
    return NextResponse.json(
      { message: 'Something went wrong error fetching data' },
      { status: 500 }
    );
  }
}

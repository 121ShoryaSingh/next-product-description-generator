import { verifyToken } from '@/lib/auth';
import { dbConnect } from '@/lib/mongoDb';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const decode = verifyToken(token);

    await dbConnect();
    const session = await User.findOne({ email: decode.email });
    if (session?.email === decode.email) {
      return NextResponse.json(
        {
          user: {
            id: session?._id.toString(),
            name: session?.name,
            email: session?.email,
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
  }
}

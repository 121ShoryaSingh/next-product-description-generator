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
    const session = await User.findOne(decode.email);

    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
  }
}

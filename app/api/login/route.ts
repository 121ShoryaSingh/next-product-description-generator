import { signToken } from '@/lib/auth';
import { dbConnect } from '@/lib/mongoDb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'Wrong Email or Password' },
        { status: 400 }
      );
    }
    const checkPassword = bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return NextResponse.json(
        { message: 'Incorrect Password' },
        { status: 400 }
      );
    }
    const token = signToken({ id: user._id.toString(), email });
    const response = NextResponse.json({ message: 'Logged In' });
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
    });
  } catch (error) {
    console.error('Error verfying user', error);
    return NextResponse.json(
      { message: 'Error logging user' },
      { status: 500 }
    );
  }
}

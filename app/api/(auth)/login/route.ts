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
      return NextResponse.json({ message: 'Wrong Email' }, { status: 401 });
    }
    const checkPassword = bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return NextResponse.json(
        { message: 'Incorrect Password' },
        { status: 400 },
      );
    }
    const token = signToken({ id: user._id.toString(), email });
    const response = NextResponse.json(
      {
        message: 'Logged In',
        success: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        },
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      { status: 200 },
    );
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    console.error('Error verfying user', error);
    return NextResponse.json(
      { message: 'Error logging user' },
      { status: 500 },
    );
  }
}

import { dbConnect } from '@/lib/mongoDb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    await dbConnect();

    //Checking for existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: 'User exists' }, { status: 400 });
    }
    //Encrypting password for security
    const hashedPassword = await bcrypt.hash(password, 24);
    User.create({ name, email, password: hashedPassword });
    return NextResponse.json(
      { message: 'User is registered' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error registering user', error);
    return NextResponse.json(
      { Message: 'Error registering user' },
      { status: 500 }
    );
  }
}

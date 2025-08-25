import { dbConnect } from '@/lib/mongoDb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          message: 'All fields are required',
        },
        { status: 400 }
      );
    }
    console.log(name, email, password);
    await dbConnect();

    //Checking for existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }
    //Encrypting password for security342wsdxc 6
    const hashedPassword = await bcrypt.hash(password, 12);
    const res = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    console.log(res);
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

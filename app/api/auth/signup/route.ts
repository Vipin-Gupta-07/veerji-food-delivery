import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Name, email and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
    });

    const token = signToken({ userId: user._id.toString(), email: user.email, role: user.role });

    const response = NextResponse.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    }, { status: 201 });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 500 });
  }
}

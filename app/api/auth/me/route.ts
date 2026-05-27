import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(payload.userId).select('-password');
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to get user' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MenuItem from '@/models/MenuItem';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    await connectDB();

    const items = await MenuItem.find({}).sort({ category: 1, name: 1 });
    return NextResponse.json({ success: true, data: items });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message === 'Unauthorized' || message.includes('Admin')) {
      return NextResponse.json({ success: false, error: message }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);
    await connectDB();

    const body = await req.json();
    const item = await MenuItem.create(body);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message === 'Unauthorized' || message.includes('Admin')) {
      return NextResponse.json({ success: false, error: message }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: 'Failed to create item' }, { status: 500 });
  }
}

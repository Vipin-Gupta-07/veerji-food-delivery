import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MenuItem from '@/models/MenuItem';
import { requireAdmin } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAdmin(req);
    await connectDB();

    const body = await req.json();
    const item = await MenuItem.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!item) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message === 'Unauthorized' || message.includes('Admin')) {
      return NextResponse.json({ success: false, error: message }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAdmin(req);
    await connectDB();

    const item = await MenuItem.findByIdAndDelete(params.id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message === 'Unauthorized' || message.includes('Admin')) {
      return NextResponse.json({ success: false, error: message }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MenuItem from '@/models/MenuItem';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const item = await MenuItem.findById(params.id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch item' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const item = await MenuItem.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!item) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const item = await MenuItem.findByIdAndDelete(params.id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete item' }, { status: 500 });
  }
}

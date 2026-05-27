import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAdmin(req);
    await connectDB();

    const body = await req.json();
    const order = await Order.findOneAndUpdate({ orderId: params.id }, body, { new: true });
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message === 'Unauthorized' || message.includes('Admin')) {
      return NextResponse.json({ success: false, error: message }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAdmin(req);
    await connectDB();
    const order = await Order.findOne({ orderId: params.id });
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message === 'Unauthorized' || message.includes('Admin')) {
      return NextResponse.json({ success: false, error: message }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: 'Fetch failed' }, { status: 500 });
  }
}

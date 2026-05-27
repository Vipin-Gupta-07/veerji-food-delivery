import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const order = await Order.findOne({ orderId: params.id });
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const order = await Order.findOneAndUpdate({ orderId: params.id }, body, { new: true });
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}

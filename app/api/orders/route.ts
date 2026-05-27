import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { generateOrderId, calculateTotal } from '@/lib/utils';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const user = getUserFromRequest(req);

    const { items, deliveryAddress, paymentMethod, specialInstructions, customerName, customerEmail, customerPhone } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'No items in cart' }, { status: 400 });
    }

    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
      0
    );
    const { deliveryFee, tax, total } = calculateTotal(subtotal);

    const order = await Order.create({
      orderId: generateOrderId(),
      user: user?.userId,
      customerName,
      customerEmail,
      customerPhone,
      items,
      deliveryAddress,
      subtotal,
      deliveryFee,
      tax,
      total,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      specialInstructions,
      estimatedDelivery: new Date(Date.now() + 35 * 60 * 1000), // 35 mins from now
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error('Order create error:', error);
    return NextResponse.json({ success: false, error: 'Failed to place order' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = getUserFromRequest(req);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const orderId = searchParams.get('orderId');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = {};

    if (orderId) {
      query.orderId = orderId;
    } else if (user?.role === 'admin') {
      if (status) query.status = status;
    } else if (user) {
      query.user = user.userId;
      if (status) query.status = status;
    } else {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (status && status !== 'all') query.status = status;

    const orders = await Order.find(query).sort({ createdAt: -1 });
    const stats = {
      total: await Order.countDocuments(),
      pending: await Order.countDocuments({ status: 'pending' }),
      preparing: await Order.countDocuments({ status: 'preparing' }),
      delivered: await Order.countDocuments({ status: 'delivered' }),
      revenue: (await Order.aggregate([
        { $match: { status: { $in: ['delivered', 'confirmed', 'preparing', 'out_for_delivery'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]))[0]?.total || 0,
    };

    return NextResponse.json({ success: true, data: orders, stats });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message === 'Unauthorized' || message.includes('Admin')) {
      return NextResponse.json({ success: false, error: message }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MenuItem from '@/models/MenuItem';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const bestseller = searchParams.get('bestseller');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { isAvailable: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (bestseller === 'true') {
      query.isBestseller = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const items = await MenuItem.find(query).sort({ isBestseller: -1, rating: -1 });

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Menu fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch menu' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Basic admin check (full auth in admin route)
    const body = await req.json();
    const item = await MenuItem.create(body);

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error('Menu create error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create menu item' }, { status: 500 });
  }
}

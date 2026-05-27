import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import { CATEGORIES_DATA } from '@/lib/data';

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 });

    if (categories.length === 0) {
      return NextResponse.json({ success: true, data: CATEGORIES_DATA, source: 'static' });
    }

    return NextResponse.json({ success: true, data: categories });
  } catch {
    return NextResponse.json({ success: true, data: CATEGORIES_DATA, source: 'static-fallback' });
  }
}

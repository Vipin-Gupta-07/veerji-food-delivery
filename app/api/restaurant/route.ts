import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';
import { RESTAURANT_DATA } from '@/lib/data';

export async function GET() {
  try {
    await connectDB();
    const restaurant = await Restaurant.findOne({});

    // Fallback to static data if DB empty
    if (!restaurant) {
      return NextResponse.json({ success: true, data: RESTAURANT_DATA, source: 'static' });
    }

    return NextResponse.json({ success: true, data: restaurant });
  } catch (error) {
    // Return static data on DB error (useful for demo without MongoDB)
    return NextResponse.json({ success: true, data: RESTAURANT_DATA, source: 'static-fallback' });
  }
}

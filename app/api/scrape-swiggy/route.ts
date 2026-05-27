import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MenuItem from '@/models/MenuItem';
import Category from '@/models/Category';
import Restaurant from '@/models/Restaurant';
import { RESTAURANT_DATA, CATEGORIES_DATA, MENU_ITEMS_DATA } from '@/lib/data';

// NOTE: This endpoint uses pre-extracted data from Swiggy.
// Live scraping of Swiggy requires Puppeteer and a headless browser environment.
// For production scraping, run: npm run scrape
// Data extracted is for DEMO/EDUCATIONAL purposes only.

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Seed restaurant
    await Restaurant.deleteMany({});
    const restaurant = await Restaurant.create(RESTAURANT_DATA);

    // Seed categories
    await Category.deleteMany({});
    const categories = await Category.insertMany(CATEGORIES_DATA);

    // Seed menu items
    await MenuItem.deleteMany({});
    const menuItems = await MenuItem.insertMany(MENU_ITEMS_DATA);

    return NextResponse.json({
      success: true,
      message: 'Data seeded successfully from extracted Swiggy data',
      data: {
        restaurant: restaurant.name,
        categories: categories.length,
        menuItems: menuItems.length,
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, error: 'Seeding failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to seed the database with restaurant data',
    note: 'This uses pre-extracted data from Swiggy for Veer Ji Malai Chaap Wale',
  });
}

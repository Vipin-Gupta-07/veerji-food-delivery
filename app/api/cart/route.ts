import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Cart from '@/models/Cart';
import { getUserFromRequest } from '@/lib/auth';

// Server-side cart (optional backup to Zustand/localStorage)

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = getUserFromRequest(req);
    const sessionId = req.cookies.get('session-id')?.value;

    const query = user ? { user: user.userId } : { sessionId };
    const cart = await Cart.findOne(query).populate('items.menuItem', 'name price image isVeg');

    return NextResponse.json({ success: true, data: cart || { items: [], subtotal: 0 } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to get cart' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = getUserFromRequest(req);
    const sessionId = req.cookies.get('session-id')?.value || `session-${Date.now()}`;
    const body = await req.json();
    const { menuItemId, name, price, quantity = 1, image, isVeg, selectedOptions } = body;

    const query = user ? { user: user.userId } : { sessionId };
    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = new Cart({ ...query, items: [] });
    }

    const existingIdx = cart.items.findIndex(
      (i: { menuItem: { toString: () => string } }) => i.menuItem.toString() === menuItemId
    );

    if (existingIdx >= 0) {
      cart.items[existingIdx].quantity += quantity;
    } else {
      cart.items.push({ menuItem: menuItemId, name, price, quantity, image, isVeg, selectedOptions });
    }

    await cart.save();

    const response = NextResponse.json({ success: true, data: cart }, { status: 201 });
    if (!user) {
      response.cookies.set('session-id', sessionId, { httpOnly: true, maxAge: 7 * 24 * 3600 });
    }
    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const user = getUserFromRequest(req);
    const sessionId = req.cookies.get('session-id')?.value;
    const { itemId, quantity } = await req.json();

    const query = user ? { user: user.userId } : { sessionId };
    const cart = await Cart.findOne(query);

    if (!cart) {
      return NextResponse.json({ success: false, error: 'Cart not found' }, { status: 404 });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (i: { _id: { toString: () => string } }) => i._id.toString() !== itemId
      );
    } else {
      const item = cart.items.find(
        (i: { _id: { toString: () => string } }) => i._id.toString() === itemId
      );
      if (item) item.quantity = quantity;
    }

    await cart.save();
    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update cart' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const user = getUserFromRequest(req);
    const sessionId = req.cookies.get('session-id')?.value;

    const query = user ? { user: user.userId } : { sessionId };
    await Cart.findOneAndDelete(query);

    return NextResponse.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to clear cart' }, { status: 500 });
  }
}

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET: Retrieve all cart items for current user
export async function GET(req: NextRequest) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.userId },
      include: {
        foodItem: {
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
                deliveryFee: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, cartItems });
  } catch (error) {
    console.error('GET Cart API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Add a food item to cart
export async function POST(req: NextRequest) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { foodItemId, quantity = 1, forceClear = false } = await req.json();

    if (!foodItemId) {
      return NextResponse.json({ error: 'Food item ID is required' }, { status: 400 });
    }

    const foodItem = await prisma.foodItem.findUnique({
      where: { id: foodItemId },
    });

    if (!foodItem) {
      return NextResponse.json({ error: 'Food item not found' }, { status: 404 });
    }

    // Check if the user has items from a different restaurant
    const existingItems = await prisma.cartItem.findMany({
      where: { userId: session.userId },
      include: { foodItem: true },
    });

    if (existingItems.length > 0) {
      const activeRestaurantId = existingItems[0].foodItem.restaurantId;
      if (activeRestaurantId !== foodItem.restaurantId) {
        if (forceClear) {
          // Empty cart first
          await prisma.cartItem.deleteMany({
            where: { userId: session.userId },
          });
        } else {
          return NextResponse.json(
            {
              error: 'RESTAURANT_MISMATCH',
              message: 'Your cart contains items from another restaurant. Start a new order?',
            },
            { status: 409 }
          );
        }
      }
    }

    // Add or increment item
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_foodItemId: {
          userId: session.userId,
          foodItemId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        userId: session.userId,
        foodItemId,
        quantity,
      },
    });

    return NextResponse.json({ success: true, cartItem });
  } catch (error) {
    console.error('POST Cart API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Update quantity of a cart item
export async function PUT(req: NextRequest) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cartItemId, quantity } = await req.json();

    if (!cartItemId || quantity === undefined) {
      return NextResponse.json({ error: 'Cart item ID and quantity are required' }, { status: 400 });
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { id: cartItemId, userId: session.userId },
      });
      return NextResponse.json({ success: true, message: 'Item removed from cart' });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItemId, userId: session.userId },
      data: { quantity },
    });

    return NextResponse.json({ success: true, cartItem: updatedItem });
  } catch (error) {
    console.error('PUT Cart API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Remove specific cart item, or clear entire cart
export async function DELETE(req: NextRequest) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const clearAll = searchParams.get('clear') === 'true';
    const cartItemId = searchParams.get('cartItemId');

    if (clearAll) {
      await prisma.cartItem.deleteMany({
        where: { userId: session.userId },
      });
      return NextResponse.json({ success: true, message: 'Cart cleared successfully' });
    }

    if (!cartItemId) {
      return NextResponse.json({ error: 'Cart item ID is required' }, { status: 400 });
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId, userId: session.userId },
    });

    return NextResponse.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('DELETE Cart API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET: Retrieve order history for current user
export async function GET(req: NextRequest) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.userId },
      include: {
        restaurant: {
          select: {
            name: true,
            logo: true,
            cuisine: true,
          },
        },
        orderItems: {
          include: {
            foodItem: {
              select: {
                name: true,
                image: true,
                isVeg: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('GET Orders API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Place a new order (Checkout)
export async function POST(req: NextRequest) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { deliveryAddress, paymentMethod } = await req.json();

    if (!deliveryAddress || !paymentMethod) {
      return NextResponse.json({ error: 'Delivery address and payment method are required' }, { status: 400 });
    }

    // Get current cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.userId },
      include: {
        foodItem: {
          include: {
            restaurant: true,
          },
        },
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 });
    }

    const firstItem = cartItems[0];
    const restaurant = firstItem.foodItem.restaurant;

    const subtotal = cartItems.reduce((acc, item) => acc + item.foodItem.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST
    const deliveryCharge = restaurant.deliveryFee;
    const total = Math.round((subtotal + tax + deliveryCharge) * 100) / 100;

    // Place order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create order
      const newOrder = await tx.order.create({
        data: {
          userId: session.userId,
          restaurantId: restaurant.id,
          deliveryAddress,
          paymentMethod,
          subtotal,
          tax,
          deliveryCharge,
          total,
          status: 'COMPLETED', // Simulated successful placement
        },
      });

      // 2. Create order items
      for (const item of cartItems) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            foodItemId: item.foodItemId,
            quantity: item.quantity,
            price: item.foodItem.price,
          },
        });
      }

      // 3. Clear cart items
      await tx.cartItem.deleteMany({
        where: { userId: session.userId },
      });

      return newOrder;
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('POST Orders API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

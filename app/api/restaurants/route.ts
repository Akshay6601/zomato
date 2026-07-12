import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import type { RestaurantWhereInput } from '@/types/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const minRating = parseFloat(searchParams.get('rating') || '0');

    const where: RestaurantWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { cuisine: { contains: search } },
        { description: { contains: search } },
        {
          foodItems: {
            some: {
              name: { contains: search },
            },
          },
        },
      ];
    }

    if (category) {
      where.foodItems = {
        some: {
          category: {
            name: category,
          },
        },
      };
    }

    if (minRating > 0) {
      where.rating = {
        gte: minRating,
      };
    }

    const restaurants = await prisma.restaurant.findMany({
      where,
      orderBy: { rating: 'desc' },
    });

    const categories = await prisma.category.findMany();

    return NextResponse.json({
      success: true,
      restaurants,
      categories,
    });
  } catch (error) {
    console.error('Fetch Restaurants API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

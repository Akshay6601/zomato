import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        foodItems: {
          include: {
            category: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    // Get unique categories present in the restaurant's menu
    const menuCategoriesMap = new Map();
    restaurant.foodItems.forEach((item) => {
      if (!menuCategoriesMap.has(item.category.id)) {
        menuCategoriesMap.set(item.category.id, {
          id: item.category.id,
          name: item.category.name,
          image: item.category.image,
        });
      }
    });
    const menuCategories = Array.from(menuCategoriesMap.values());

    // Recommended dishes: rating >= 4.7
    const recommendedDishes = restaurant.foodItems.filter((item) => item.rating >= 4.7);

    return NextResponse.json({
      success: true,
      restaurant,
      menuCategories,
      recommendedDishes,
    });
  } catch (error) {
    console.error('Fetch Restaurant Detail API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

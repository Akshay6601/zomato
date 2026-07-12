/** Cart line item loaded for checkout with nested food and restaurant. */
export type CheckoutCartItem = {
  id: string;
  userId: string;
  foodItemId: string;
  quantity: number;
  foodItem: {
    price: number;
    restaurant: {
      id: string;
      deliveryFee: number;
    };
  };
};

export type MenuCategorySummary = {
  id: string;
  name: string;
  image: string;
};

export type RestaurantFoodItemWithCategory = {
  id: string;
  name: string;
  description: string | null;
  image: string;
  price: number;
  isVeg: boolean;
  rating: number;
  restaurantId: string;
  categoryId: string;
  category: MenuCategorySummary;
};

export type RestaurantReviewWithUser = {
  id: string;
  userId: string;
  restaurantId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user: {
    name: string;
  };
};

/** Restaurant detail query result with menu and reviews. */
export type RestaurantWithMenuAndReviews = {
  id: string;
  name: string;
  description: string | null;
  bannerImage: string;
  logo: string;
  cuisine: string;
  rating: number;
  deliveryTime: number;
  deliveryFee: number;
  distance: number;
  priceRange: string;
  foodItems: RestaurantFoodItemWithCategory[];
  reviews: RestaurantReviewWithUser[];
};

/** Filter object for restaurant list/search queries. */
export type RestaurantWhereInput = {
  OR?: Array<{
    name?: { contains: string };
    cuisine?: { contains: string };
    description?: { contains: string };
    foodItems?: {
      some: {
        name: { contains: string };
      };
    };
  }>;
  foodItems?: {
    some: {
      category: {
        name: string;
      };
    };
  };
  rating?: {
    gte: number;
  };
};

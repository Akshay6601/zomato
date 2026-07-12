export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description?: string | null;
  bannerImage: string;
  logo: string;
  cuisine: string;
  rating: number;
  deliveryTime: number;
  deliveryFee: number;
  distance: number;
  priceRange: string;
  foodItems?: FoodItem[];
  reviews?: Review[];
  createdAt: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description?: string | null;
  image: string;
  price: number;
  isVeg: boolean;
  rating: number;
  restaurantId: string;
  categoryId: string;
  category?: Category;
  restaurant?: Restaurant;
}

export interface CartItem {
  id: string;
  userId: string;
  foodItemId: string;
  quantity: number;
  foodItem: FoodItem & {
    restaurant: {
      id: string;
      name: string;
      deliveryFee: number;
    };
  };
}

export interface Review {
  id: string;
  userId: string;
  restaurantId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
  };
}

export interface OrderItem {
  id: string;
  orderId: string;
  foodItemId: string;
  quantity: number;
  price: number;
  foodItem: {
    name: string;
    image: string;
    isVeg: boolean;
  };
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  deliveryAddress: string;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  deliveryCharge: number;
  total: number;
  status: string;
  createdAt: string;
  restaurant: {
    name: string;
    logo: string;
    cuisine: string;
  };
  orderItems: OrderItem[];
}

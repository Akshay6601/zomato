'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { FoodItemSkeleton } from '@/components/Skeleton';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { Restaurant, FoodItem, Category } from '@/types';
import { FiStar, FiClock, FiSearch, FiAlertTriangle, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuCategories, setMenuCategories] = useState<Category[]>([]);
  const [recommendedDishes, setRecommendedDishes] = useState<FoodItem[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews'>('menu');
  const [menuSearch, setMenuSearch] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  // Mismatch modal state
  const [mismatchModalOpen, setMismatchModalOpen] = useState(false);
  const [pendingFoodItemId, setPendingFoodItemId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        const res = await fetch(`/api/restaurants/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setRestaurant(data.restaurant);
            setMenuCategories(data.menuCategories || []);
            setRecommendedDishes(data.recommendedDishes || []);
          } else {
            showToast('Restaurant not found', 'error');
            router.push('/');
          }
        } else {
          showToast('Failed to load restaurant details', 'error');
          router.push('/');
        }
      } catch (err) {
        console.error('Fetch restaurant detail error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  const handleAddToCart = async (foodItemId: string, forceClear = false) => {
    const result = await addToCart(foodItemId, 1, forceClear);
    
    if (result.success) {
      showToast('Item added to cart!', 'success');
      setMismatchModalOpen(false);
      setPendingFoodItemId(null);
    } else if (result.errorType === 'RESTAURANT_MISMATCH') {
      setPendingFoodItemId(foodItemId);
      setMismatchModalOpen(true);
    } else {
      showToast(result.error || 'Failed to add item', 'error');
    }
  };

  const handleConfirmClearCart = () => {
    if (pendingFoodItemId) {
      handleAddToCart(pendingFoodItemId, true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="h-64 bg-neutral-200 animate-pulse rounded-3xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-8 bg-neutral-200 animate-pulse w-1/3 rounded-lg" />
              {Array(4).fill(null).map((_, i) => <FoodItemSkeleton key={i} />)}
            </div>
            <div className="space-y-6">
              <div className="h-40 bg-neutral-200 animate-pulse rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) return null;

  // Filtered menu items
  const filteredFoodItems = restaurant.foodItems?.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(menuSearch.toLowerCase()));
    const matchesVeg = vegOnly ? item.isVeg : true;
    return matchesSearch && matchesVeg;
  }) || [];

  // Group items by category name
  const groupedMenu: Record<string, FoodItem[]> = {};
  filteredFoodItems.forEach((item) => {
    const catName = item.category?.name || 'Other';
    if (!groupedMenu[catName]) {
      groupedMenu[catName] = [];
    }
    groupedMenu[catName].push(item);
  });

  return (
    <div className="min-h-screen pb-16 bg-neutral-50">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full select-none bg-neutral-900 overflow-hidden">
        <img
          src={restaurant.bannerImage}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <img
                src={restaurant.logo}
                alt={`${restaurant.name} Logo`}
                className="w-16 h-16 rounded-2xl border-2 border-white object-cover shadow-md bg-white flex-shrink-0"
              />
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{restaurant.name}</h1>
                <p className="text-neutral-300 text-sm font-semibold">{restaurant.cuisine}</p>
              </div>
            </div>
            {restaurant.description && (
              <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl font-medium mt-2 leading-relaxed">
                {restaurant.description}
              </p>
            )}
          </div>

          <div className="flex gap-4 sm:gap-6 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex-shrink-0">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-yellow-400 font-extrabold text-lg">
                <span>{restaurant.rating.toFixed(1)}</span>
                <FiStar className="fill-current w-4 h-4" />
              </div>
              <p className="text-[10px] text-neutral-300 font-bold uppercase tracking-wider mt-1">
                {restaurant.reviews?.length || 0} Reviews
              </p>
            </div>
            <div className="w-[1px] bg-white/20 self-stretch" />
            <div className="text-center">
              <div className="text-white font-extrabold text-lg flex items-center justify-center gap-1">
                <FiClock className="w-4 h-4 text-rose-400" />
                <span>{restaurant.deliveryTime}m</span>
              </div>
              <p className="text-[10px] text-neutral-300 font-bold uppercase tracking-wider mt-1">
                Delivery Time
              </p>
            </div>
            <div className="w-[1px] bg-white/20 self-stretch" />
            <div className="text-center">
              <div className="text-white font-extrabold text-lg">
                {restaurant.deliveryFee === 0 ? 'Free' : `₹${restaurant.deliveryFee}`}
              </div>
              <p className="text-[10px] text-neutral-300 font-bold uppercase tracking-wider mt-1">
                Del. Fee
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu / Reviews */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex gap-8 border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('menu')}
            className={`pb-4 text-base font-extrabold relative transition-colors cursor-pointer ${
              activeTab === 'menu' ? 'text-rose-600' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Order Online
            {activeTab === 'menu' && (
              <motion.div layoutId="detail-tab-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-base font-extrabold relative transition-colors cursor-pointer ${
              activeTab === 'reviews' ? 'text-rose-600' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Reviews ({restaurant.reviews?.length || 0})
            {activeTab === 'reviews' && (
              <motion.div layoutId="detail-tab-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600" />
            )}
          </button>
        </div>

        {activeTab === 'menu' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
            {/* Sidebar Categories (Desktop) */}
            <aside className="hidden lg:block space-y-2 sticky top-28 self-start">
              <h3 className="font-extrabold text-neutral-900 text-sm uppercase tracking-wider mb-4 px-3">
                Categories
              </h3>
              {menuCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    const el = document.getElementById(`category-${cat.name}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-100 hover:text-rose-600 transition-all cursor-pointer"
                >
                  {cat.name}
                </button>
              ))}
            </aside>

            {/* Menu Feed */}
            <div className="lg:col-span-3 space-y-10">
              {/* Menu Search and Filters */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-neutral-100 shadow-xs">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    placeholder="Search within menu..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                </div>
                <button
                  onClick={() => setVegOnly(!vegOnly)}
                  className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                    vegOnly
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  Veg Only
                  {vegOnly && <FiCheck className="w-4 h-4 text-emerald-600" />}
                </button>
              </div>

              {/* Recommended Items */}
              {recommendedDishes.length > 0 && !menuSearch && !vegOnly && (
                <section>
                  <h3 className="font-extrabold text-neutral-900 text-xl mb-4">Recommended Dishes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendedDishes.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-neutral-100 rounded-2xl p-4 flex gap-4 hover:shadow-md transition-shadow group"
                      >
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span
                                className={`w-3.5 h-3.5 border flex items-center justify-center rounded-xs ${
                                  item.isVeg ? 'border-emerald-500' : 'border-rose-500'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                                  }`}
                                />
                              </span>
                              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                                {item.isVeg ? 'Veg' : 'Non-Veg'}
                              </span>
                            </div>
                            <h4 className="font-bold text-neutral-900 text-base">{item.name}</h4>
                            <span className="font-extrabold text-neutral-800 text-sm mt-1 block">₹{item.price}</span>
                          </div>
                          
                          <button
                            onClick={() => handleAddToCart(item.id)}
                            className="mt-3 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/50 hover:border-rose-200 rounded-xl px-4 py-2 text-xs font-bold transition-all w-fit cursor-pointer"
                          >
                            + Add to Cart
                          </button>
                        </div>

                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-neutral-50 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Grouped Category Menus */}
              {Object.keys(groupedMenu).length > 0 ? (
                Object.keys(groupedMenu).map((catName) => (
                  <section key={catName} id={`category-${catName}`} className="space-y-4 pt-4">
                    <h3 className="font-extrabold text-neutral-900 text-xl border-b border-neutral-100 pb-2">
                      {catName}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {groupedMenu[catName].map((item) => (
                        <div
                          key={item.id}
                          className="bg-white border border-neutral-100 rounded-2xl p-4 flex gap-4 hover:shadow-md transition-shadow group"
                        >
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span
                                  className={`w-3.5 h-3.5 border flex items-center justify-center rounded-xs ${
                                    item.isVeg ? 'border-emerald-500' : 'border-rose-500'
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                                    }`}
                                  />
                                </span>
                                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                                  {item.isVeg ? 'Veg' : 'Non-Veg'}
                                </span>
                                {item.rating > 0 && (
                                  <span className="flex items-center gap-0.5 text-xs text-yellow-500 font-bold ml-auto">
                                    <FiStar className="fill-current w-3.5 h-3.5" />
                                    {item.rating.toFixed(1)}
                                  </span>
                                )}
                              </div>
                              <h4 className="font-bold text-neutral-900 text-base">{item.name}</h4>
                              <span className="font-extrabold text-neutral-800 text-sm mt-1 block">₹{item.price}</span>
                              {item.description && (
                                <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            
                            <button
                              onClick={() => handleAddToCart(item.id)}
                              className="mt-4 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/50 hover:border-rose-200 rounded-xl px-4 py-2.5 text-xs font-bold transition-all w-fit cursor-pointer"
                            >
                              + Add to Cart
                            </button>
                          </div>

                          <div className="w-28 h-28 rounded-xl overflow-hidden bg-neutral-50 flex-shrink-0 relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))
              ) : (
                <div className="text-center py-16 bg-white border border-neutral-100 rounded-3xl">
                  <p className="text-neutral-500 font-bold">No dishes matches your filters.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Reviews Tab */
          <div className="max-w-3xl mt-8 space-y-6">
            <h3 className="font-extrabold text-neutral-900 text-xl">Customer Reviews</h3>
            
            {restaurant.reviews && restaurant.reviews.length > 0 ? (
              <div className="space-y-4">
                {restaurant.reviews.map((review) => (
                  <div key={review.id} className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                          {review.user?.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-neutral-900 text-sm">{review.user?.name}</h4>
                          <span className="text-[10px] text-neutral-400 font-semibold">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 bg-rose-50 text-rose-600 px-2 py-0.5 rounded-lg text-xs font-bold">
                        <span>{review.rating}</span>
                        <FiStar className="fill-current w-3 h-3" />
                      </div>
                    </div>

                    <p className="text-sm text-neutral-600 leading-relaxed pl-13">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white border border-neutral-100 rounded-3xl">
                <p className="text-neutral-500 font-bold">No reviews yet. Be the first to order and review!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cart Mismatch Warning Modal Dialog */}
      <AnimatePresence>
        {mismatchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMismatchModalOpen(false)}
              className="absolute inset-0 bg-black/50"
            />
            {/* Content Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl border border-neutral-100 max-w-md w-full p-6 shadow-2xl relative z-10 text-center"
            >
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
                <FiAlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Replace Cart Items?</h3>
              <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
                Your cart contains items from another restaurant. Would you like to clear your cart and start a new order with this item instead?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setMismatchModalOpen(false)}
                  className="flex-1 border border-neutral-200 rounded-xl py-3 text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmClearCart}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-3 text-sm font-bold shadow-md cursor-pointer transition-colors"
                >
                  Replace Items
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

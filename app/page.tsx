'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { RestaurantCard } from '@/components/RestaurantCard';
import { RestaurantCardSkeleton } from '@/components/Skeleton';
import { Restaurant, Category } from '@/types';
import { FiCheck, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick filters
  const [ratingFilter, setRatingFilter] = useState(false);
  const [vegFilter, setVegFilter] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        if (ratingFilter) params.set('rating', '4.0');

        const res = await fetch(`/api/restaurants?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            let list = data.restaurants || [];
            // Apply client-side veg filtering if enabled
            if (vegFilter) {
              // Filters restaurants whose foodItems list contains at least one veg item, or has "Vegetarian" in cuisine
              list = list.filter((r: Restaurant) => 
                r.cuisine.toLowerCase().includes('vegetarian') || 
                r.cuisine.toLowerCase().includes('veg')
              );
            }
            setRestaurants(list);
            setCategories(data.categories || []);
          }
        }
      } catch (err) {
        console.error('Error fetching restaurants:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [search, category, ratingFilter, vegFilter]);

  const handleCategoryClick = (catName: string) => {
    const params = new URLSearchParams(window.location.search);
    if (category === catName) {
      params.delete('category');
    } else {
      params.set('category', catName);
    }
    router.push(`/?${params.toString()}`);
  };

  const clearFilters = () => {
    setRatingFilter(false);
    setVegFilter(false);
    router.push('/');
  };

  // Featured restaurants (rating >= 4.5)
  const featuredRestaurants = restaurants.filter(r => r.rating >= 4.5).slice(0, 3);
  
  // Popular restaurants (rating >= 4.3)
  const popularRestaurants = restaurants.filter(r => r.rating >= 4.3).slice(0, 4);

  return (
    <div className="min-h-screen pb-16">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative bg-neutral-900 text-white overflow-hidden py-16 sm:py-20 select-none">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600')] bg-cover bg-center opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/80 to-transparent pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4"
          >
            Find the best food in your city
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-300 text-lg max-w-2xl mb-8"
          >
            Discover top-rated restaurants, cuisines, and gourmet delights delivered straight to your door.
          </motion.p>
          
          {/* Mobile Search Bar inside Hero */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const val = (e.currentTarget.elements.namedItem('searchHero') as HTMLInputElement).value;
              router.push(val ? `/?search=${encodeURIComponent(val)}` : '/');
            }}
            className="flex md:hidden w-full max-w-md relative"
          >
            <input
              type="text"
              name="searchHero"
              defaultValue={search}
              placeholder="Search for restaurants, cuisines..."
              className="w-full bg-white text-neutral-900 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Categories Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-extrabold text-neutral-900 mb-6">What&apos;s on your mind?</h2>
          
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => {
              const isActive = category === cat.name;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="flex flex-col items-center flex-shrink-0 cursor-pointer focus:outline-none group"
                >
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 p-1.5 transition-all duration-300 ${
                      isActive ? 'border-rose-500 scale-105 shadow-md shadow-rose-100' : 'border-neutral-100 hover:border-rose-300'
                    }`}
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span
                    className={`mt-2 text-xs sm:text-sm font-bold text-center transition-colors ${
                      isActive ? 'text-rose-600' : 'text-neutral-700 group-hover:text-rose-500'
                    }`}
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Filters Section */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-neutral-100 pb-5">
          <div className="flex flex-wrap items-center gap-3">
            {/* Rating Filter Button */}
            <button
              onClick={() => setRatingFilter(!ratingFilter)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                ratingFilter
                  ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              Rating: 4.0+
              {ratingFilter && <FiCheck className="w-4 h-4" />}
            </button>

            {/* Pure Veg Filter Button */}
            <button
              onClick={() => setVegFilter(!vegFilter)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                vegFilter
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              Pure Veg / Vegetarian
              {vegFilter && <FiCheck className="w-4 h-4 text-emerald-600" />}
            </button>

            {/* Clear Filters */}
            {(ratingFilter || vegFilter || search || category) && (
              <button
                onClick={clearFilters}
                className="text-xs sm:text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
          </div>
          
          <div className="text-xs sm:text-sm text-neutral-500 font-semibold">
            Showing {restaurants.length} {restaurants.length === 1 ? 'restaurant' : 'restaurants'}
          </div>
        </div>

        {/* Featured Restaurants Carousel/Section (Only show when no filters) */}
        {!search && !category && !ratingFilter && !vegFilter && featuredRestaurants.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1.5 h-6 bg-rose-500 rounded-full" />
              <h2 className="text-2xl font-extrabold text-neutral-900">Featured Restaurants</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading
                ? Array(3).fill(null).map((_, i) => <RestaurantCardSkeleton key={i} />)
                : featuredRestaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                  ))}
            </div>
          </section>
        )}

        {/* Popular Restaurants Section (Only show when no filters) */}
        {!search && !category && !ratingFilter && !vegFilter && popularRestaurants.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1.5 h-6 bg-rose-500 rounded-full" />
              <h2 className="text-2xl font-extrabold text-neutral-900">Popular Brands</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading
                ? Array(4).fill(null).map((_, i) => <RestaurantCardSkeleton key={i} />)
                : popularRestaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                  ))}
            </div>
          </section>
        )}

        {/* All Restaurants List */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-6 bg-rose-500 rounded-full" />
            <h2 className="text-2xl font-extrabold text-neutral-900">
              {search || category ? 'Search Results' : 'All Restaurants'}
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(null).map((_, i) => <RestaurantCardSkeleton key={i} />)}
            </div>
          ) : restaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-neutral-200 rounded-3xl bg-neutral-50 max-w-xl mx-auto">
              <p className="text-lg font-bold text-neutral-600 mb-2">No restaurants found</p>
              <p className="text-neutral-500 text-sm mb-4">
                We couldn&apos;t find any matches for your current search or filter combinations.
              </p>
              <button
                onClick={clearFilters}
                className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-5 py-2.5 text-sm font-bold shadow-md cursor-pointer transition-all"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiStar, FiClock } from 'react-icons/fi';
import { Restaurant } from '@/types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const ratingColor =
    restaurant.rating >= 4.5
      ? 'bg-emerald-600 text-white'
      : restaurant.rating >= 4.0
      ? 'bg-emerald-500 text-white'
      : 'bg-amber-500 text-white';

  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full cursor-pointer group"
      >
        {/* Banner image wrapper */}
        <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
          <img
            src={restaurant.bannerImage}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg shadow-xs text-xs font-bold text-neutral-800 flex items-center gap-1">
            <FiClock className="w-3.5 h-3.5 text-rose-500" />
            {restaurant.deliveryTime} mins
          </div>
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-semibold text-white">
            {restaurant.distance} km away
          </div>
        </div>

        {/* Card info */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="font-bold text-lg text-neutral-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                {restaurant.name}
              </h3>
              <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-md text-xs font-bold ${ratingColor} flex-shrink-0`}>
                <span>{restaurant.rating.toFixed(1)}</span>
                <FiStar className="w-3 h-3 fill-current" />
              </div>
            </div>

            <p className="text-xs font-medium text-neutral-500 mb-2 truncate">
              {restaurant.cuisine}
            </p>
            
            {restaurant.description && (
              <p className="text-xs text-neutral-400 line-clamp-2 mb-4 leading-relaxed">
                {restaurant.description}
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600 font-semibold">
            <span>{restaurant.priceRange}</span>
            <span className="text-neutral-400">•</span>
            <span>
              {restaurant.deliveryFee === 0 ? (
                <span className="text-emerald-600 font-bold">FREE Delivery</span>
              ) : (
                `₹${restaurant.deliveryFee} Delivery`
              )}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
export default RestaurantCard;

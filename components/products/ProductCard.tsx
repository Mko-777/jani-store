'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const stockBadge = () => {
    if (product.stock === 0) return { text: 'Sold Out', color: 'bg-red-100 text-red-700' };
    if (product.stock <= 5) return { text: `Only ${product.stock} left!`, color: 'bg-orange-100 text-orange-700' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-700' };
  };

  const badge = stockBadge();

  return (
    <div className={`bg-white rounded-2xl shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${product.stock === 0 ? 'opacity-75' : ''}`}>
      <Link href={`/products/${product.id}`}>
        <div className="relative overflow-hidden h-56">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-300 hover:scale-105 ${product.stock === 0 ? 'grayscale' : ''}`}
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Sold Out</span>
            </div>
          )}
          <span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-medium ${badge.color}`}>
            {badge.text}
          </span>
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{product.category}</p>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-forest transition-colors mb-2 font-playfair">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-gold font-bold text-lg">{formatPrice(product.price)}</span>
          <button
            onClick={() => addItem(product, 1)}
            disabled={product.stock === 0}
            className="px-4 py-2 bg-forest text-white text-sm rounded-lg hover:bg-gold hover:text-forest transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/products/${params.id}`)
        .then(r => r.json())
        .then(data => { setProduct(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🌸</div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">😔</div>
          <p className="text-gray-500 mb-4">Product not found</p>
          <Link href="/products" className="text-forest hover:text-gold">← Back to Shop</Link>
        </div>
      </div>
    );
  }

  const stockColor = product.stock === 0 ? 'text-red-600' : product.stock <= 5 ? 'text-orange-500' : 'text-green-600';

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/products" className="inline-flex items-center text-forest hover:text-gold mb-8 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="relative h-96 md:h-full min-h-96 rounded-2xl overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm text-gold font-medium uppercase tracking-wide mb-2">{product.category}</p>
            <h1 className="font-playfair text-4xl font-bold text-forest mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-gold mb-6">{formatPrice(product.price)}</p>
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            <p className={`text-sm font-medium mb-6 ${stockColor}`}>
              {product.stock === 0 ? 'Out of stock' : `${product.stock} left in stock`}
            </p>

            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 text-gray-900 font-medium min-w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                product.stock === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : added
                  ? 'bg-green-600 text-white'
                  : 'bg-forest text-white hover:bg-gold hover:text-forest'
              }`}
            >
              {product.stock === 0 ? 'Out of Stock' : added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

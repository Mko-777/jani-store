'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-8xl mb-6 animate-bounce">✅</div>
        <h1 className="font-playfair text-4xl font-bold text-forest mb-4">
          Order Confirmed!
        </h1>
        <p className="text-gray-600 mb-4 text-lg">
          Thank you for your purchase! Your beautiful flowers are on their way.
        </p>
        {orderId && (
          <p className="text-sm text-gray-400 mb-8">
            Order ID: <span className="font-mono">{orderId}</span>
          </p>
        )}
        <p className="text-gray-500 mb-8">
          You will receive a confirmation email shortly with your order details and tracking information.
        </p>
        <Link
          href="/products"
          className="inline-block px-8 py-3 bg-forest text-white font-semibold rounded-full hover:bg-gold hover:text-forest transition-all duration-200"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

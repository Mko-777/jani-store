import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products?featured=true&limit=4`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const CATEGORY_IMAGES = {
  Bouquets: 'https://images.unsplash.com/photo-1490750967868-88df5691cc9e?w=600&auto=format',
  Roses: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600&auto=format',
  Tulips: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format',
  Special: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format',
};

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1487530811015-780780169a22?w=1600&auto=format"
            alt="Beautiful flowers"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Animated Petals */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="petal"
            style={{
              left: `${10 + i * 11}%`,
              top: `${20 + (i % 3) * 20}%`,
              animationDuration: `${3 + i * 0.5}s`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}

        <div className="relative z-10 text-center text-white px-4 fade-in-up">
          <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Nature&apos;s Most<br />Beautiful Gift
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto">
            Fresh flowers, delivered with love
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="px-8 py-4 bg-gold text-forest font-semibold rounded-full hover:opacity-90 transition-all duration-200 hover:shadow-lg text-lg"
            >
              Shop Now
            </Link>
            <Link
              href="/products"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-200 text-lg"
            >
              View Collections
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-ivory">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-4xl font-bold text-forest mb-4">Our Bestsellers</h2>
              <div className="w-24 h-1 bg-gold mx-auto rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/products"
                className="inline-block px-8 py-3 bg-forest text-white font-semibold rounded-full hover:bg-gold hover:text-forest transition-all duration-200"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl font-bold text-forest mb-4">Shop by Category</h2>
            <div className="w-24 h-1 bg-gold mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(CATEGORY_IMAGES).map(([cat, img]) => (
              <Link key={cat} href={`/products?category=${cat}`}>
                <div className="relative h-48 rounded-2xl overflow-hidden group cursor-pointer">
                  <Image src={img} alt={cat} fill className="object-cover transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-playfair text-xl font-bold">{cat}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-blush">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl font-bold text-forest mb-4">Why Choose JaNi?</h2>
            <div className="w-24 h-1 bg-gold mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: '🚚', title: 'Free Shipping', desc: 'Free delivery on orders over $75' },
              { emoji: '⚡', title: 'Same-Day Delivery', desc: 'Order by 2pm for same-day delivery' },
              { emoji: '🌿', title: '100% Fresh Guarantee', desc: 'All flowers are fresh or we replace them' },
              { emoji: '🎁', title: 'Gift Wrapping', desc: 'Beautiful gift wrapping available' },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{emoji}</div>
                <h3 className="font-semibold text-forest mb-2 font-playfair">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-forest text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 font-playfair">🌸 JaNi</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Premium flower shop delivering fresh, beautiful arrangements with love since 2024.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/" className="hover:text-gold transition-colors">Home</a></li>
              <li><a href="/products" className="hover:text-gold transition-colors">Shop</a></li>
              <li><a href="/cart" className="hover:text-gold transition-colors">Cart</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gold">Customer Service</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Free returns within 24h</li>
              <li>Same-day delivery available</li>
              <li>support@jani.com</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gold">Stay Connected</h4>
            <p className="text-sm text-gray-300 mb-3">Get updates on new arrivals & special offers</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 text-sm text-gray-900 rounded-l-lg focus:outline-none"
              />
              <button className="px-4 py-2 bg-gold text-forest text-sm font-semibold rounded-r-lg hover:opacity-90 transition-opacity">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-forest-light text-center text-sm text-gray-400">
          © 2026 JaNi Store. Made with 🌸 and love.
        </div>
      </div>
    </footer>
  );
}

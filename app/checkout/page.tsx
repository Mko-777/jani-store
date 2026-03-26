'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { ShippingAddress, ShippingOption } from '@/types';
import { formatPrice, US_STATES } from '@/lib/utils';

const STEPS = ['Contact & Shipping', 'Shipping Method', 'Payment'];

const EMPTY_ADDRESS: ShippingAddress = {
  firstName: '', lastName: '', email: '', phone: '',
  address1: '', address2: '', city: '', state: '', zip: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState<ShippingAddress>(EMPTY_ADDRESS);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [taxAmount, setTaxAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (items.length === 0) router.push('/cart');
  }, [items, router]);

  const fetchShippingRates = async () => {
    const res = await fetch(`/api/shipping/rates?subtotal=${subtotal}`);
    const rates = await res.json();
    setShippingOptions(rates);
    setSelectedShipping(rates[0]);
  };

  const fetchTax = async () => {
    const res = await fetch('/api/tax/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: address.state, subtotal, shipping: selectedShipping?.price || 0 }),
    });
    const data = await res.json();
    setTaxAmount(data.taxAmount);
  };

  const validateStep0 = () => {
    const required: (keyof ShippingAddress)[] = ['firstName', 'lastName', 'email', 'phone', 'address1', 'city', 'state', 'zip'];
    return required.every(k => address[k].trim() !== '');
  };

  const handleStep0 = async () => {
    if (!validateStep0()) { setError('Please fill in all required fields.'); return; }
    setError('');
    await fetchShippingRates();
    setStep(1);
  };

  const handleStep1 = async () => {
    if (!selectedShipping) { setError('Please select a shipping method.'); return; }
    setError('');
    await fetchTax();
    setStep(2);
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    try {
      const total = subtotal + (selectedShipping?.price || 0) + taxAmount;
      const res = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          customerEmail: address.email,
          metadata: {
            customerName: `${address.firstName} ${address.lastName}`,
            shippingAddress: JSON.stringify(address),
            shippingMethod: selectedShipping?.id,
            items: JSON.stringify(items.map(i => ({ id: i.id, quantity: i.quantity, price: i.price }))),
            subtotal,
            taxAmount,
            shippingAmount: selectedShipping?.price || 0,
          },
        }),
      });
      const data = await res.json();
      if (data.error) {
        // Stripe not configured - simulate success for demo
        clearCart();
        router.push('/checkout/success?order=DEMO-' + Date.now());
        return;
      }
      // Would normally load Stripe Elements here
      clearCart();
      router.push('/checkout/success?order=' + data.clientSecret?.split('_secret')[0]);
    } catch {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const total = subtotal + (selectedShipping?.price || 0) + taxAmount;

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-playfair text-4xl font-bold text-forest mb-8 text-center">Checkout</h1>

        {/* Step Indicators */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i <= step ? 'bg-forest text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`ml-2 text-sm hidden sm:block ${i <= step ? 'text-forest font-medium' : 'text-gray-400'}`}>
                {s}
              </span>
              {i < STEPS.length - 1 && <div className={`mx-4 h-px w-8 sm:w-16 ${i < step ? 'bg-forest' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>
        )}

        {/* Step 0: Contact & Shipping Address */}
        {step === 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="font-playfair text-2xl font-bold text-forest mb-6">Contact & Shipping</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(['firstName', 'lastName'] as const).map(field => (
                <input
                  key={field}
                  type="text"
                  placeholder={field === 'firstName' ? 'First Name *' : 'Last Name *'}
                  value={address[field]}
                  onChange={e => setAddress(a => ({ ...a, [field]: e.target.value }))}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
                />
              ))}
              <input
                type="email"
                placeholder="Email *"
                value={address.email}
                onChange={e => setAddress(a => ({ ...a, email: e.target.value }))}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
              />
              <input
                type="tel"
                placeholder="Phone *"
                value={address.phone}
                onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
              />
              <input
                type="text"
                placeholder="Address Line 1 *"
                value={address.address1}
                onChange={e => setAddress(a => ({ ...a, address1: e.target.value }))}
                className="md:col-span-2 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
              />
              <input
                type="text"
                placeholder="Address Line 2 (optional)"
                value={address.address2}
                onChange={e => setAddress(a => ({ ...a, address2: e.target.value }))}
                className="md:col-span-2 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
              />
              <input
                type="text"
                placeholder="City *"
                value={address.city}
                onChange={e => setAddress(a => ({ ...a, city: e.target.value }))}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
              />
              <select
                value={address.state}
                onChange={e => setAddress(a => ({ ...a, state: e.target.value }))}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
              >
                <option value="">State *</option>
                {US_STATES.map(s => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="ZIP Code *"
                value={address.zip}
                onChange={e => setAddress(a => ({ ...a, zip: e.target.value }))}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
              />
            </div>
            <button
              onClick={handleStep0}
              className="mt-6 w-full py-4 bg-forest text-white font-semibold rounded-xl hover:bg-gold hover:text-forest transition-all"
            >
              Continue to Shipping
            </button>
          </div>
        )}

        {/* Step 1: Shipping Method */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="font-playfair text-2xl font-bold text-forest mb-6">Shipping Method</h2>
            {subtotal >= 75 && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                🎉 You qualify for free standard shipping!
              </div>
            )}
            <div className="space-y-3">
              {shippingOptions.map(option => (
                <label
                  key={option.id}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedShipping?.id === option.id ? 'border-forest bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    value={option.id}
                    checked={selectedShipping?.id === option.id}
                    onChange={() => setSelectedShipping(option)}
                    className="mr-4"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{option.name}</div>
                    <div className="text-sm text-gray-500">{option.days} · {option.carrier}</div>
                  </div>
                  <div className="font-bold text-forest">
                    {option.price === 0 ? 'FREE' : formatPrice(option.price)}
                  </div>
                </label>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(0)}
                className="flex-1 py-4 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleStep1}
                className="flex-1 py-4 bg-forest text-white font-semibold rounded-xl hover:bg-gold hover:text-forest transition-all"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="font-playfair text-2xl font-bold text-forest mb-6">Payment</h2>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800 mb-6">
                💳 Configure Stripe to enable payments. For demo purposes, click Pay to simulate a successful order.
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Card number: 4242 4242 4242 4242"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
                  readOnly
                />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM/YY" className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none" readOnly />
                  <input type="text" placeholder="CVC" className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none" readOnly />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1 py-4 bg-forest text-white font-semibold rounded-xl hover:bg-gold hover:text-forest transition-all disabled:opacity-60"
                >
                  {loading ? 'Processing...' : `🔒 Pay ${formatPrice(total)}`}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
              <h3 className="font-playfair text-lg font-bold text-forest mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name} × {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span>{selectedShipping?.price === 0 ? 'FREE' : formatPrice(selectedShipping?.price || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span>{formatPrice(taxAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-gold">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

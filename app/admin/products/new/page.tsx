'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: 'Bouquets',
    stock: '', image: '', isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock, 10),
        }),
      });
      if (res.ok) {
        router.push('/admin/products');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create product');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-forest text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold font-playfair">🌸 JaNi Admin</h1>
        <Link href="/admin/products" className="text-sm text-white/70 hover:text-white">← Products</Link>
      </div>
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-playfair">Add New Product</h2>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <input
            type="text" placeholder="Product Name" required
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
          />
          <textarea
            placeholder="Description" required rows={4}
            value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold resize-none"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number" placeholder="Price" required step="0.01" min="0"
              value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
            />
            <input
              type="number" placeholder="Stock" required min="0"
              value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
            />
          </div>
          <select
            value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
          >
            <option value="Bouquets">Bouquets</option>
            <option value="Roses">Roses</option>
            <option value="Tulips">Tulips</option>
            <option value="Special">Special</option>
          </select>
          <input
            type="text" placeholder="Image URL" required
            value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
          />
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
              className="w-4 h-4 accent-forest"
            />
            <span className="text-sm text-gray-700">Active (visible in store)</span>
          </label>
          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-forest text-white font-semibold rounded-xl hover:bg-gold hover:text-forest transition-all disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
}

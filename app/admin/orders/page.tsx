'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  items: { quantity: number }[];
  total: number;
  status: string;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-green-100 text-green-700',
  SHIPPED: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-gray-100 text-gray-700',
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          router.push('/admin/login');
        }
        setLoading(false);
      })
      .catch(() => router.push('/admin/login'));
  }, [router]);

  const filtered = statusFilter === 'ALL' ? orders : orders.filter(o => o.status === statusFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-forest text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold font-playfair">🌸 JaNi Admin</h1>
        <Link href="/admin" className="text-sm text-white/70 hover:text-white">← Dashboard</Link>
      </div>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 font-playfair">Orders</h2>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none"
          >
            {['ALL', 'PENDING', 'PAID', 'SHIPPED', 'DELIVERED'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No orders found</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Order ID', 'Customer', 'Email', 'Date', 'Items', 'Total', 'Status'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">{order.id.slice(0, 8)}...</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.customerName}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{order.customerEmail}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {order.items?.reduce((s, i) => s + i.quantity, 0) || 0}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold">{formatPrice(order.total)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

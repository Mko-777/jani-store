'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  productsCount: number;
  lowStock: number;
}

interface OrderRow {
  id: string;
  customerName: string;
  createdAt: string;
  total: number;
  status: string;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-green-100 text-green-700',
  SHIPPED: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-gray-100 text-gray-700',
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ totalRevenue: 0, totalOrders: 0, productsCount: 0, lowStock: 0 });
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then(r => r.json()),
      fetch('/api/products').then(r => r.json()),
    ]).then(([ordersData, productsData]) => {
      if (Array.isArray(ordersData)) {
        setOrders(ordersData.slice(0, 10));
        setStats({
          totalRevenue: ordersData.reduce((s: number, o: OrderRow) => s + (o.total || 0), 0),
          totalOrders: ordersData.length,
          productsCount: productsData.length,
          lowStock: productsData.filter((p: { stock: number }) => p.stock <= 5).length,
        });
      } else {
        // Not authenticated - redirect to login
        router.push('/admin/login');
      }
    }).catch(() => router.push('/admin/login')).finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center"><div className="text-4xl mb-4">🌸</div><p>Loading...</p></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-forest text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold font-playfair">🌸 JaNi Admin</h1>
        <div className="flex gap-4">
          <Link href="/" className="text-sm text-white/70 hover:text-white">← View Store</Link>
          <button
            onClick={async () => { await fetch('/api/admin/logout', { method: 'POST' }); router.push('/admin/login'); }}
            className="text-sm text-white/70 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-playfair">Dashboard</h2>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), color: 'text-green-600' },
            { label: 'Total Orders', value: stats.totalOrders, color: 'text-blue-600' },
            { label: 'Products', value: stats.productsCount, color: 'text-purple-600' },
            { label: 'Low Stock', value: stats.lowStock, color: 'text-red-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-sm text-gray-500 mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link href="/admin/products/new" className="px-4 py-2 bg-forest text-white rounded-lg text-sm font-medium hover:bg-gold hover:text-forest transition-all">
            + Add Product
          </Link>
          <Link href="/admin/orders" className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">
            View All Orders
          </Link>
          <Link href="/admin/products" className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">
            Manage Products
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold text-gray-900">Recent Orders</h3>
          </div>
          {orders.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No orders yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Order ID', 'Customer', 'Date', 'Total', 'Status'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">{order.id.slice(0, 8)}...</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{order.customerName}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
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
          )}
        </div>
      </div>
    </div>
  );
}

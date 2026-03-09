"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Admin page for managing orders
export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || (session.user as any).role !== 'ADMIN') {
      router.push('/');
    } else {
      fetchOrders();
    }
  }, [session, status]);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch('/api/orders');
    if (res.ok) {
      const data = await res.json();
      setOrders(data);
    }
    setLoading(false);
  };

  const updateStatus = async (orderId: string, status: string) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      fetchOrders();
    } else {
      alert('Error updating status');
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin - Orders</h1>
      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded space-y-2">
              <p>
                <strong>Order ID:</strong> {order.id}
              </p>
              <p>
                <strong>User:</strong> {order.user?.email}
              </p>
              <p>
                <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Total:</strong> ${Number(order.total).toFixed(2)}
              </p>
              <p>
                <strong>Status:</strong>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="ml-2 border p-1 rounded"
                >
                  {['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </p>
              <div className="border-t pt-2 mt-2 text-sm">
                {order.items && order.items.length > 0 && (
                  <div>
                    <strong>Items:</strong>
                    <ul className="list-disc list-inside">
                      {order.items.map((item: any) => (
                        <li key={item.id}>
                          {item.quantity} × {item.productId || item.product?.name} — $
                          {Number(item.price).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {order.shippingName && (
                  <div className="mt-1">
                    <strong>Shipping:</strong> {order.shippingName}, {order.shippingAddress}, {order.shippingCity}{' '}
                    {order.shippingPostalCode}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
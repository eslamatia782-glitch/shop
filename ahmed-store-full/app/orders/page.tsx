import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

// Orders page showing user's orders and their items
export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }
  const userId = (session!.user as any).id;
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border p-4 rounded space-y-2">
            <p>
              <strong>Order ID:</strong> {order.id}
            </p>
            <p>
              <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Total:</strong> ${Number(order.total).toFixed(2)}
            </p>
            <div className="border-t pt-2 mt-2">
              <h3 className="font-semibold">Items</h3>
              <ul className="list-disc list-inside space-y-1">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.product.name} × {item.quantity} — $
                    {Number(item.price).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
            {order.shippingName && (
              <div className="mt-2 text-sm text-gray-700">
                <p>
                  <strong>Shipping to:</strong> {order.shippingName}, {order.shippingAddress}, {order.shippingCity} {order.shippingPostalCode}
                </p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
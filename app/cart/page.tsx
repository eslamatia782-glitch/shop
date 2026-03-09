"use client";

import { useCart } from '@/components/CartProvider';
import { useSearchParams, useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeItem, clear } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  const total = items.reduce(
    (acc, item) => acc + item.quantity * Number(item.product.price),
    0
  );

  const handleCheckout = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    const data = await res.json();
    if (data.url) {
      // Clear the cart locally after starting checkout; order creation can be handled via webhook.
      clear();
      window.location.href = data.url;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Your Cart</h1>
      {success && (
        <p className="text-green-600">Payment successful! Your order has been placed.</p>
      )}
      {canceled && (
        <p className="text-red-600">Payment canceled or failed. Please try again.</p>
      )}
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="border p-4 flex justify-between items-center rounded"
            >
              <div>
                <p className="font-semibold">{item.product.name}</p>
                <p>
                  Quantity: {item.quantity} × ${Number(item.product.price).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.product.id)}
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
          <button
            onClick={handleCheckout}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
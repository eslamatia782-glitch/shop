"use client";

import Link from 'next/link';
import { useCart } from './CartProvider';

export default function ProductCard({ product }: { product: any }) {
  const { addItem } = useCart();
  return (
    <div className="border p-4 rounded shadow-sm hover:shadow-md transition">
      <Link href={`/product/${product.id}`} className="block">
        <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
      </Link>
      <div className="flex items-center justify-between mt-3">
        <span className="font-bold">${Number(product.price).toFixed(2)}</span>
        <button
          onClick={() => addItem(product)}
          className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
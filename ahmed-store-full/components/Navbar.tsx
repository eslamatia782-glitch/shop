"use client";

import Link from 'next/link';
import { useCart } from './CartProvider';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Navbar() {
  const { items } = useCart();
  const { data: session, status } = useSession();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <nav className="bg-gray-800 text-white py-3">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold">
            Ahmed Store
          </Link>
          <Link href="/cart" className="relative">
            Cart
            <span className="ml-1 rounded-full bg-red-500 text-white px-2 py-0.5 text-xs">
              {cartCount}
            </span>
          </Link>
          {session?.user && (
            <>
              <Link href="/orders">Orders</Link>
              {(session.user as any).role === 'ADMIN' && (
                <>
                  <Link href="/admin/products">Admin</Link>
                  <Link href="/admin/orders">Admin Orders</Link>
                </>
              )}
            </>
          )}
        </div>
        <div>
          {status === 'loading' ? null : session ? (
            <button
              onClick={() => signOut()}
              className="border border-white px-3 py-1 rounded hover:bg-white hover:text-gray-800 transition"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => signIn()}
              className="border border-white px-3 py-1 rounded hover:bg-white hover:text-gray-800 transition"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
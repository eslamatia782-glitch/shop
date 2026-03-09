"use client";

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from './CartProvider';

// This component wraps its children with any client-side providers such as
// SessionProvider and CartProvider. It is used in the root layout.
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
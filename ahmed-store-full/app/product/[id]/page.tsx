import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { useCart } from '@/components/CartProvider';

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) return notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p>{product.description}</p>
      <p className="text-xl font-semibold">${Number(product.price).toFixed(2)}</p>
      <AddButton product={product} />
    </div>
  );
}

function AddButton({ product }: { product: any }) {
  'use client';
  const { addItem } = useCart();
  return (
    <button
      onClick={() => addItem(product)}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Add to cart
    </button>
  );
}
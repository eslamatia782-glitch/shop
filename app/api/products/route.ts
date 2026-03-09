import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Handle GET: return all products
export async function GET() {
  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}

// Handle POST: create new product (admin only)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { name, description, price, stock, imageUrl } = await request.json();
  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        imageUrl,
      },
    });
    return NextResponse.json(product);
  } catch (e) {
    return NextResponse.json({ error: 'Error creating product' }, { status: 500 });
  }
}
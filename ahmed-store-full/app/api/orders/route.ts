import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Retrieve orders for the current user or all orders for admin
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = (session.user as any).id;
  const role = (session.user as any).role;
  let orders;
  if (role === 'ADMIN') {
    orders = await prisma.order.findMany({ include: { items: true, user: true } });
  } else {
    orders = await prisma.order.findMany({ where: { userId }, include: { items: { include: { product: true } } } });
  }
  return NextResponse.json(orders);
}

// Create a new order. Payload must include items, shipping info and total.
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = (session.user as any).id;
  const body = await request.json();
  const { items, shippingName, shippingAddress, shippingCity, shippingPostalCode, total } = body;
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'No items' }, { status: 400 });
  }
  // Create order and order items transactionally
  try {
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        shippingName,
        shippingAddress,
        shippingCity,
        shippingPostalCode,
        items: {
          create: items.map((item: any) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { items: true },
    });
    return NextResponse.json(order);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
  }
}
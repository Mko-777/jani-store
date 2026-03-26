import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get('admin_session');
  if (cookie?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const order = await prisma.order.create({
      data: {
        stripePaymentId: body.stripePaymentId,
        status: body.status || 'PAID',
        customerEmail: body.customerEmail,
        customerName: body.customerName,
        shippingAddress: body.shippingAddress,
        subtotal: body.subtotal,
        taxAmount: body.taxAmount,
        shippingAmount: body.shippingAmount,
        total: body.total,
        shippingMethod: body.shippingMethod,
        items: {
          create: body.items.map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

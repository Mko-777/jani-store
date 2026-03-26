import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
    return NextResponse.json({ received: true });
  }
  try {
    const { stripe } = await import('@/lib/stripe');
    const sig = request.headers.get('stripe-signature') || '';
    const body = await request.text();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as {
        id: string;
        metadata: Record<string, string>;
        receipt_email?: string;
        amount: number;
      };
      const meta = paymentIntent.metadata;

      let items: { id: string; quantity: number; price: number }[] = [];
      try { items = JSON.parse(meta.items || '[]'); } catch { items = []; }

      const subtotal = parseFloat(meta.subtotal || '0');
      const taxAmount = parseFloat(meta.taxAmount || '0');
      const shippingAmount = parseFloat(meta.shippingAmount || '0');

      const order = await prisma.order.create({
        data: {
          stripePaymentId: paymentIntent.id,
          status: 'PAID',
          customerEmail: paymentIntent.receipt_email || meta.customerEmail || '',
          customerName: meta.customerName || '',
          shippingAddress: meta.shippingAddress || '',
          subtotal,
          taxAmount,
          shippingAmount,
          total: paymentIntent.amount / 100,
          shippingMethod: meta.shippingMethod || 'standard',
          items: {
            create: items.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      // Decrement stock for each product
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      console.log('Order created:', order.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

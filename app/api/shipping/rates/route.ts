import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subtotal = parseFloat(searchParams.get('subtotal') || '0');

  const rates = [
    { id: 'standard', name: 'Standard Shipping', days: '5-7 business days', price: subtotal >= 75 ? 0 : 5.99, carrier: 'USPS' },
    { id: 'express', name: 'Express Shipping', days: '2-3 business days', price: 12.99, carrier: 'FedEx' },
    { id: 'overnight', name: 'Overnight', days: 'Next business day', price: 24.99, carrier: 'UPS' },
  ];

  return NextResponse.json(rates);
}

import { NextRequest, NextResponse } from 'next/server';
import { getStateTaxRate } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { state, subtotal, shipping } = body;
    const taxRate = getStateTaxRate(state);
    const taxableAmount = subtotal + (shipping || 0);
    const taxAmount = parseFloat((taxableAmount * taxRate).toFixed(2));
    const total = subtotal + (shipping || 0) + taxAmount;
    return NextResponse.json({ taxRate, taxAmount, total });
  } catch {
    return NextResponse.json({ error: 'Failed to calculate tax' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, customerPhone } = await req.json()

    if (!orderNumber || !customerPhone) {
      return NextResponse.json({ error: 'Order number and phone are required' }, { status: 400 })
    }

    const order = await prisma.order.findFirst({
      where: {
        orderNumber: orderNumber.trim().toUpperCase(),
        customerPhone: customerPhone.trim(),
      },
      include: {
        items: { include: { product: { select: { name: true, images: true } } } },
        store: { select: { name: true, paymentInstructions: true } },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found. Please check your order number and phone number.' }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Track order error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

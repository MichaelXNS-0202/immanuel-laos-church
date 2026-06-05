import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const store = await prisma.store.findUnique({ where: { sellerId: session.user.id } })
  if (!store) return NextResponse.json({ error: 'No store found' }, { status: 404 })

  const order = await prisma.order.findFirst({
    where: { id: params.id, storeId: store.id },
    include: { items: { include: { product: true } } },
  })

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  return NextResponse.json({ order })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const store = await prisma.store.findUnique({ where: { sellerId: session.user.id } })
  if (!store) return NextResponse.json({ error: 'No store found' }, { status: 404 })

  const existing = await prisma.order.findFirst({ where: { id: params.id, storeId: store.id } })
  if (!existing) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  try {
    const body = await req.json()
    const { orderStatus, paymentStatus, deliveryStatus, trackingNumber } = body

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        ...(orderStatus ? { orderStatus } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
        ...(deliveryStatus ? { deliveryStatus } : {}),
        ...(trackingNumber !== undefined ? { trackingNumber } : {}),
      },
    })

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

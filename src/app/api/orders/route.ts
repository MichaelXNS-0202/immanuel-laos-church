import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const search = searchParams.get('search') || ''

  const store = await prisma.store.findUnique({ where: { sellerId: session.user.id } })
  if (!store) return NextResponse.json({ orders: [] })

  const orders = await prisma.order.findMany({
    where: {
      storeId: store.id,
      ...(status ? { orderStatus: status as any } : {}),
      ...(search ? {
        OR: [
          { orderNumber: { contains: search, mode: 'insensitive' } },
          { customerName: { contains: search, mode: 'insensitive' } },
          { customerPhone: { contains: search } },
        ],
      } : {}),
    },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ orders })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      storeId, customerName, customerPhone, customerEmail,
      province, district, address, deliveryNote, orderNote,
      paymentMethod, items,
    } = body

    if (!storeId || !customerName || !customerPhone || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const store = await prisma.store.findUnique({ where: { id: storeId } })
    if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

    // Fetch products and calculate totals
    const productIds = items.map((i: any) => i.productId)
    const products = await prisma.product.findMany({ where: { id: { in: productIds }, storeId } })

    const orderItems = items.map((item: any) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) throw new Error(`Product not found: ${item.productId}`)
      const price = product.salePrice ?? product.price
      return { productId: product.id, quantity: item.quantity, price }
    })

    const subtotal = orderItems.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0)

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName,
        customerPhone,
        customerEmail,
        province,
        district,
        address,
        deliveryNote,
        orderNote,
        paymentMethod: paymentMethod ?? 'CASH_ON_DELIVERY',
        subtotal,
        total: subtotal,
        storeId,
        items: { create: orderItems },
      },
      include: { items: { include: { product: true } }, store: true },
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Order create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')

  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 })

  const product = await prisma.product.findUnique({
    where: { id: productId, isActive: true },
    include: {
      store: {
        select: { id: true, name: true, slug: true, paymentInstructions: true, isActive: true },
      },
    },
  })

  if (!product || !product.store.isActive) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  return NextResponse.json({ product })
}

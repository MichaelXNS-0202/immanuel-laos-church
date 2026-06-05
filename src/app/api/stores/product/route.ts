import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const storeSlug = searchParams.get('storeSlug')
  const productSlug = searchParams.get('productSlug')

  if (!storeSlug || !productSlug) {
    return NextResponse.json({ error: 'storeSlug and productSlug are required' }, { status: 400 })
  }

  const store = await prisma.store.findUnique({ where: { slug: storeSlug, isActive: true } })
  if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

  const product = await prisma.product.findFirst({
    where: { slug: productSlug, storeId: store.id, isActive: true },
    include: { store: { select: { name: true, slug: true } } },
  })

  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  return NextResponse.json({ product })
}

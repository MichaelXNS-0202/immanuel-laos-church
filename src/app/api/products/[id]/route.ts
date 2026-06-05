import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function getProductWithOwnership(productId: string, userId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { store: true },
  })
  if (!product) return null
  if (product.store.sellerId !== userId) return null
  return product
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const product = await getProductWithOwnership(params.id, session.user.id)
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  return NextResponse.json({ product })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const product = await getProductWithOwnership(params.id, session.user.id)
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  try {
    const body = await req.json()
    const { name, slug, description, price, salePrice, stockQuantity, images, isActive, isFeatured, categoryId } = body

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        stockQuantity: parseInt(stockQuantity ?? 0),
        images: images ?? [],
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        categoryId: categoryId || null,
      },
    })

    return NextResponse.json({ product: updated })
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const product = await getProductWithOwnership(params.id, session.user.id)
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  await prisma.product.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}

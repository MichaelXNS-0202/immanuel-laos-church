import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''

  const store = await prisma.store.findUnique({ where: { sellerId: session.user.id } })
  if (!store) return NextResponse.json({ products: [] })

  const products = await prisma.product.findMany({
    where: {
      storeId: store.id,
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
    },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ products })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { name, slug, description, price, salePrice, stockQuantity, images, isActive, isFeatured, categoryId } = body

    if (!name || !slug || price === undefined) {
      return NextResponse.json({ error: 'Name, slug and price are required' }, { status: 400 })
    }

    const store = await prisma.store.findUnique({ where: { sellerId: session.user.id } })
    if (!store) return NextResponse.json({ error: 'Create a store first' }, { status: 400 })

    const product = await prisma.product.create({
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
        storeId: store.id,
        categoryId: categoryId || null,
      },
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A product with this URL already exists' }, { status: 409 })
    }
    console.error('Product create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

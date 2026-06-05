import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const store = await prisma.store.findUnique({
    where: { sellerId: session.user.id },
    include: { categories: true },
  })

  return NextResponse.json({ store })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const {
      name, slug, description, phone, whatsappNumber, facebookUrl,
      tiktokUrl, address, paymentInstructions, logo, banner,
    } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Store name and slug are required' }, { status: 400 })
    }

    const existing = await prisma.store.findUnique({ where: { slug } })
    if (existing && existing.sellerId !== session.user.id) {
      return NextResponse.json({ error: 'This URL is already taken' }, { status: 409 })
    }

    const existingStore = await prisma.store.findUnique({ where: { sellerId: session.user.id } })

    let store
    if (existingStore) {
      store = await prisma.store.update({
        where: { sellerId: session.user.id },
        data: { name, slug, description, phone, whatsappNumber, facebookUrl, tiktokUrl, address, paymentInstructions, logo, banner },
      })
    } else {
      store = await prisma.store.create({
        data: {
          name, slug, description, phone, whatsappNumber, facebookUrl,
          tiktokUrl, address, paymentInstructions, logo, banner,
          sellerId: session.user.id,
        },
      })
    }

    return NextResponse.json({ store })
  } catch (error) {
    console.error('Store save error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

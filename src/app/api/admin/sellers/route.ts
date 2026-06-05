import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const sellers = await prisma.user.findMany({
    where: { role: 'SELLER' },
    include: { store: { select: { id: true, name: true, slug: true, isActive: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ sellers })
}

export async function PUT(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { userId, action } = await req.json()
    if (!userId || !action) return NextResponse.json({ error: 'userId and action required' }, { status: 400 })

    let updateData: any = {}
    if (action === 'verify') updateData = { isVerified: true, isSuspended: false }
    else if (action === 'suspend') updateData = { isSuspended: true }
    else if (action === 'unsuspend') updateData = { isSuspended: false }
    else return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

    const user = await prisma.user.update({ where: { id: userId }, data: updateData })
    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

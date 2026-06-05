'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/dashboard/OrderStatusBadge'
import { formatPrice } from '@/lib/utils'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  total: number
  orderStatus: string
  paymentStatus: string
  createdAt: string
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((d) => { setOrders(d.orders || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const today = new Date().toDateString()
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today)

  const count = (status: string) => orders.filter((o) => o.orderStatus === status).length

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-500">Loading...</div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link href="/dashboard/orders" className="text-orange-500 text-sm font-medium hover:underline">
          View all orders →
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatsCard label="Today's Orders" value={todayOrders.length} icon="📅" color="orange" />
        <StatsCard label="Pending" value={count('PENDING')} icon="⏳" color="yellow" />
        <StatsCard label="Paid" value={orders.filter((o) => o.paymentStatus === 'PAID').length} icon="💰" color="green" />
        <StatsCard label="Shipped" value={count('SHIPPED')} icon="🚚" color="blue" />
        <StatsCard label="Delivered" value={count('DELIVERED')} icon="✅" color="green" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <span className="text-sm text-gray-500">{orders.length} total</span>
        </div>

        {orders.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <div className="text-4xl mb-2">🛍️</div>
            <p>No orders yet. Share your store to start receiving orders!</p>
            <Link href="/dashboard/store" className="mt-4 inline-block text-orange-500 font-medium hover:underline">
              Set up your store →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {orders.slice(0, 10).map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-mono font-medium text-sm text-gray-900">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{order.customerName} · {order.customerPhone}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="font-bold text-orange-500">{formatPrice(order.total)}</p>
                  <OrderStatusBadge status={order.orderStatus} />
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { OrderStatusBadge, PaymentStatusBadge, DeliveryStatusBadge } from '@/components/dashboard/OrderStatusBadge'
import { formatPrice } from '@/lib/utils'

const STATUS_TABS = ['All', 'PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELED']

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  total: number
  orderStatus: string
  paymentStatus: string
  deliveryStatus: string
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')

  const fetchOrders = (status?: string, q = '') => {
    setLoading(true)
    const params = new URLSearchParams()
    if (status && status !== 'All') params.set('status', status)
    if (q) params.set('search', q)
    fetch(`/api/orders?${params}`)
      .then((r) => r.json())
      .then((d) => { setOrders(d.orders || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    fetchOrders(tab, search)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchOrders(activeTab, search)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-4">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab === 'All' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order number, name or phone..."
          className="max-w-sm"
        />
        <button type="submit" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700">
          Search
        </button>
      </form>

      {loading ? (
        <div className="py-16 text-center text-gray-400">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <div className="text-4xl mb-2">📭</div>
          <p>No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/dashboard/orders/${order.id}`}
              className="block bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono font-bold text-gray-900">{order.orderNumber}</p>
                  <p className="text-gray-700 font-medium">{order.customerName}</p>
                  <p className="text-sm text-gray-500">{order.customerPhone}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-1.5">
                  <p className="font-bold text-orange-500 text-lg">{formatPrice(order.total)}</p>
                  <OrderStatusBadge status={order.orderStatus} />
                  <PaymentStatusBadge status={order.paymentStatus} />
                  <DeliveryStatusBadge status={order.deliveryStatus} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

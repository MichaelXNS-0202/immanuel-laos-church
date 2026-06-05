'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

interface TrackedOrder {
  orderNumber: string
  customerName: string
  customerPhone: string
  total: number
  paymentMethod: string
  orderStatus: string
  paymentStatus: string
  deliveryStatus: string
  trackingNumber?: string
  createdAt: string
  items: Array<{ quantity: number; price: number; product: { name: string } }>
  store: { name: string; paymentInstructions?: string | null }
}

const ORDER_TIMELINE = [
  { key: 'PENDING', label: 'Order Placed', icon: '📝' },
  { key: 'CONFIRMED', label: 'Confirmed', icon: '✅' },
  { key: 'PACKED', label: 'Packed', icon: '📦' },
  { key: 'SHIPPED', label: 'Shipped', icon: '🚚' },
  { key: 'DELIVERED', label: 'Delivered', icon: '🏠' },
]

const STATUS_ORDER = ['PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED']

export default function TrackOrderPage() {
  const [form, setForm] = useState({ orderNumber: '', customerPhone: '' })
  const [order, setOrder] = useState<TrackedOrder | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.orderNumber.trim() || !form.customerPhone.trim()) {
      setError('Please enter both order number and phone number')
      return
    }
    setError('')
    setOrder(null)
    setLoading(true)
    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Order not found')
      } else {
        setOrder(data.order)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentStep = order ? STATUS_ORDER.indexOf(order.orderStatus) : -1
  const isCanceled = order?.orderStatus === 'CANCELED'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-orange-500 text-lg">🛒 LaoShopLink</Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Your Order</h1>
        <p className="text-gray-500 mb-6">Enter your order number and phone number to see the status.</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-5 space-y-4 mb-6">
          <Input
            label="Order Number"
            value={form.orderNumber}
            onChange={(e) => setForm((prev) => ({ ...prev, orderNumber: e.target.value.toUpperCase() }))}
            placeholder="e.g. LSL-ABC123-XYZ"
            className="font-mono"
          />
          <Input
            label="Phone Number"
            type="tel"
            value={form.customerPhone}
            onChange={(e) => setForm((prev) => ({ ...prev, customerPhone: e.target.value }))}
            placeholder="+856 20 xxxxxxxx"
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Track Order
          </Button>
        </form>

        {order && (
          <div className="space-y-4">
            {/* Order number */}
            <div className="bg-orange-500 text-white rounded-xl p-5 text-center">
              <p className="text-orange-100 text-sm mb-1">Order Number</p>
              <p className="text-2xl font-bold font-mono">{order.orderNumber}</p>
              <p className="text-orange-100 text-sm mt-1">{order.store.name}</p>
            </div>

            {/* Timeline */}
            {!isCanceled && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h2 className="font-bold text-gray-900 mb-4">Order Progress</h2>
                <div className="space-y-3">
                  {ORDER_TIMELINE.map((step, index) => {
                    const done = index <= currentStep
                    const active = index === currentStep
                    return (
                      <div key={step.key} className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
                          done ? 'bg-orange-100' : 'bg-gray-100'
                        } ${active ? 'ring-2 ring-orange-500' : ''}`}>
                          {step.icon}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium text-sm ${done ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step.label}
                          </p>
                        </div>
                        {done && <span className="text-green-500 text-sm">✓</span>}
                      </div>
                    )
                  })}
                </div>
                {order.trackingNumber && (
                  <div className="mt-4 bg-blue-50 rounded-lg p-3 text-sm">
                    <span className="text-blue-600 font-medium">Tracking Number: </span>
                    <span className="font-mono">{order.trackingNumber}</span>
                  </div>
                )}
              </div>
            )}

            {isCanceled && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">❌</div>
                <p className="font-bold text-red-700">Order Canceled</p>
                <p className="text-red-600 text-sm mt-1">This order has been canceled.</p>
              </div>
            )}

            {/* Payment & delivery status */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="font-bold text-gray-900 mb-3">Status Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment</span>
                  <span className={`font-medium ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.paymentStatus.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery</span>
                  <span className="font-medium text-gray-700">{order.deliveryStatus.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total</span>
                  <span className="font-bold text-orange-500">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Order items */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="font-bold text-gray-900 mb-3">Items</h2>
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1">
                  <span className="text-gray-700">{item.product.name} x{item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {order.paymentMethod !== 'CASH_ON_DELIVERY' && order.store.paymentInstructions && order.paymentStatus !== 'PAID' && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                <h2 className="font-bold text-orange-800 mb-2">Payment Instructions</h2>
                <p className="text-orange-700 text-sm whitespace-pre-wrap">{order.store.paymentInstructions}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

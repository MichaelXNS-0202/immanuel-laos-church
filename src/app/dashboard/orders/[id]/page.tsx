'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { OrderStatusBadge, PaymentStatusBadge, DeliveryStatusBadge } from '@/components/dashboard/OrderStatusBadge'
import { formatPrice } from '@/lib/utils'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  province?: string
  district?: string
  address?: string
  deliveryNote?: string
  orderNote?: string
  subtotal: number
  deliveryFee: number
  total: number
  paymentMethod: string
  orderStatus: string
  paymentStatus: string
  deliveryStatus: string
  trackingNumber?: string
  createdAt: string
  items: Array<{
    id: string
    quantity: number
    price: number
    product: { name: string; images: string[] }
  }>
}

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELED']
const PAYMENT_STATUSES = ['UNPAID', 'WAITING_CONFIRMATION', 'PAID', 'FAILED', 'REFUNDED']
const DELIVERY_STATUSES = ['NOT_SHIPPED', 'PREPARING', 'HANDED_TO_DELIVERY', 'IN_TRANSIT', 'DELIVERED', 'FAILED_DELIVERY']

export default function OrderDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [statusForm, setStatusForm] = useState({
    orderStatus: '', paymentStatus: '', deliveryStatus: '', trackingNumber: '',
  })

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.order) {
          setOrder(d.order)
          setStatusForm({
            orderStatus: d.order.orderStatus,
            paymentStatus: d.order.paymentStatus,
            deliveryStatus: d.order.deliveryStatus,
            trackingNumber: d.order.trackingNumber || '',
          })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    setSuccess(false)
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusForm),
      })
      if (res.ok) {
        const data = await res.json()
        setOrder((prev) => prev ? { ...prev, ...data.order } : null)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="py-16 text-center text-gray-400">Loading...</div>
  if (!order) return <div className="py-16 text-center text-gray-400">Order not found</div>

  const paymentMethodLabel: Record<string, string> = {
    CASH_ON_DELIVERY: 'Cash on Delivery',
    BANK_TRANSFER: 'Bank Transfer',
    QR_PAYMENT: 'QR Payment',
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/orders" className="text-gray-400 hover:text-gray-600">← Back</Link>
        <h1 className="text-xl font-bold text-gray-900">Order {order.orderNumber}</h1>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
          Status updated successfully!
        </div>
      )}

      {/* Status badges */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4 flex gap-2 flex-wrap">
        <OrderStatusBadge status={order.orderStatus} />
        <PaymentStatusBadge status={order.paymentStatus} />
        <DeliveryStatusBadge status={order.deliveryStatus} />
        <span className="text-xs text-gray-400 self-center">{new Date(order.createdAt).toLocaleString()}</span>
      </div>

      {/* Customer info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
        <h2 className="font-bold text-gray-900 mb-3">Customer Information</h2>
        <div className="space-y-1 text-sm">
          <p><span className="text-gray-500">Name:</span> <span className="font-medium">{order.customerName}</span></p>
          <p><span className="text-gray-500">Phone:</span> <span className="font-medium">{order.customerPhone}</span></p>
          {order.customerEmail && <p><span className="text-gray-500">Email:</span> {order.customerEmail}</p>}
          {order.province && <p><span className="text-gray-500">Province:</span> {order.province}</p>}
          {order.district && <p><span className="text-gray-500">District:</span> {order.district}</p>}
          {order.address && <p><span className="text-gray-500">Address:</span> {order.address}</p>}
          {order.deliveryNote && <p><span className="text-gray-500">Delivery Note:</span> {order.deliveryNote}</p>}
          {order.orderNote && <p><span className="text-gray-500">Order Note:</span> {order.orderNote}</p>}
          <p><span className="text-gray-500">Payment:</span> {paymentMethodLabel[order.paymentMethod]}</p>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
        <h2 className="font-bold text-gray-900 mb-3">Order Items</h2>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="font-medium text-sm">{item.product.name}</p>
                <p className="text-xs text-gray-500">x{item.quantity} @ {formatPrice(item.price)}</p>
              </div>
              <p className="font-semibold text-orange-500">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-orange-500">{formatPrice(order.total)}</span>
        </div>
      </div>

      {/* Status update */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-900 mb-4">Update Status</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
            <select
              value={statusForm.orderStatus}
              onChange={(e) => setStatusForm((prev) => ({ ...prev, orderStatus: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
            <select
              value={statusForm.paymentStatus}
              onChange={(e) => setStatusForm((prev) => ({ ...prev, paymentStatus: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Status</label>
            <select
              value={statusForm.deliveryStatus}
              onChange={(e) => setStatusForm((prev) => ({ ...prev, deliveryStatus: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {DELIVERY_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <Input
            label="Tracking Number"
            value={statusForm.trackingNumber}
            onChange={(e) => setStatusForm((prev) => ({ ...prev, trackingNumber: e.target.value }))}
            placeholder="e.g. EMS12345678"
          />
          <Button onClick={handleSave} size="lg" className="w-full" loading={saving}>
            Save Status
          </Button>
        </div>
      </div>
    </div>
  )
}

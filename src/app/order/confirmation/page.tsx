'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/dashboard/OrderStatusBadge'
import { formatPrice } from '@/lib/utils'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  province?: string
  address?: string
  paymentMethod: string
  orderStatus: string
  paymentStatus: string
  total: number
  createdAt: string
  items: Array<{ quantity: number; price: number; product: { name: string } }>
  store: { name: string; slug: string; paymentInstructions?: string | null }
}

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) return
    fetch(`/api/checkout/order?orderId=${orderId}`)
      .then((r) => r.json())
      .then((d) => { setOrder(d.order || null); setLoading(false) })
      .catch(() => setLoading(false))
  }, [orderId])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  if (!order) return <div className="min-h-screen flex items-center justify-center text-gray-400">Order not found</div>

  const paymentMethodLabel: Record<string, string> = {
    CASH_ON_DELIVERY: 'Cash on Delivery',
    BANK_TRANSFER: 'Bank Transfer',
    QR_PAYMENT: 'QR Payment',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Success header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900">Order Placed!</h1>
          <p className="text-gray-500 mt-1">Thank you, {order.customerName}</p>
        </div>

        {/* Order number - prominent */}
        <div className="bg-orange-500 text-white rounded-2xl p-6 text-center mb-4">
          <p className="text-orange-100 text-sm font-medium mb-1">⚠️ SAVE THIS ORDER NUMBER</p>
          <p className="text-3xl font-bold font-mono tracking-wider">{order.orderNumber}</p>
          <p className="text-orange-100 text-xs mt-2">You&apos;ll need this to track your order</p>
        </div>

        {/* Status */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500">Status:</span>
          <OrderStatusBadge status={order.orderStatus} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
          <h2 className="font-bold text-gray-900 mb-3">Order Summary</h2>
          <p className="text-sm text-gray-500 mb-3">Store: {order.store.name}</p>
          <div className="space-y-2 mb-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-700">{item.product.name} x{item.quantity}</span>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-orange-500">{formatPrice(order.total)}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Payment: {paymentMethodLabel[order.paymentMethod]}</p>
        </div>

        {/* Payment instructions */}
        {order.paymentMethod !== 'CASH_ON_DELIVERY' && order.store.paymentInstructions && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-4">
            <h2 className="font-bold text-orange-800 mb-2">Payment Instructions</h2>
            <p className="text-orange-700 text-sm whitespace-pre-wrap">{order.store.paymentInstructions}</p>
          </div>
        )}

        {/* Customer info */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
          <h2 className="font-bold text-gray-900 mb-3">Delivery To</h2>
          <div className="text-sm space-y-1 text-gray-600">
            <p>📞 {order.customerPhone}</p>
            {order.province && <p>📍 {order.province}</p>}
            {order.address && <p>🏠 {order.address}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href={`/order/track`}
            className="block text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors"
          >
            Track My Order
          </Link>
          <Link
            href={`/store/${order.store.slug}`}
            className="block text-center bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 rounded-xl border border-gray-200 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  )
}

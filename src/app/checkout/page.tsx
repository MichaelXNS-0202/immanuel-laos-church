'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { formatPrice, LAO_PROVINCES } from '@/lib/utils'

interface Product {
  id: string
  name: string
  price: number
  salePrice?: number | null
  images: string[]
  store: { id: string; name: string; slug: string; paymentInstructions?: string | null }
}

function CheckoutForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const storeSlug = searchParams.get('storeSlug') || ''
  const productId = searchParams.get('productId') || ''
  const qtyParam = parseInt(searchParams.get('qty') || '1')

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [qty] = useState(qtyParam)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    customerName: '', customerPhone: '', customerEmail: '',
    province: '', district: '', address: '', deliveryNote: '',
    paymentMethod: 'CASH_ON_DELIVERY', orderNote: '',
  })

  useEffect(() => {
    if (!storeSlug || !productId) return
    fetch(`/api/stores/product?storeSlug=${storeSlug}&productSlug=${productId}`)
      .then((r) => r.json())
      .then((d) => {
        // try by id
        if (!d.product) {
          return fetch(`/api/checkout/product?productId=${productId}`)
            .then((r) => r.json())
            .then((d2) => { setProduct(d2.product || null); setLoading(false) })
        }
        setProduct(d.product)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [storeSlug, productId])

  // Fetch product by ID directly
  useEffect(() => {
    if (!productId) return
    fetch(`/api/checkout/product?productId=${productId}`)
      .then((r) => r.json())
      .then((d) => { if (d.product) { setProduct(d.product); setLoading(false) } })
      .catch(() => {})
  }, [productId])

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.customerName.trim()) errs.customerName = 'Name is required'
    if (!form.customerPhone.trim()) errs.customerPhone = 'Phone number is required'
    if (!form.province) errs.province = 'Province is required'
    if (!form.address.trim()) errs.address = 'Address is required'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSubmitting(true)
    try {
      const displayPrice = product.salePrice ?? product.price
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: product.store.id,
          ...form,
          items: [{ productId: product.id, quantity: qty }],
        }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push(`/order/confirmation?orderId=${data.order.id}`)
      } else {
        alert(data.error || 'Failed to place order')
      }
    } catch {
      alert('Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 flex-col gap-3">
      <p>Product not found</p>
    </div>
  )

  const displayPrice = product.salePrice ?? product.price
  const total = displayPrice * qty
  const img = product.images[0] || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&size=200&background=fed7aa&color=c2410c`

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-lg mx-auto">
          <h1 className="font-bold text-lg text-gray-900">Checkout</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Product summary */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex gap-3 items-center">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
            <Image src={img} alt={product.name} fill className="object-cover" sizes="64px" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{product.name}</p>
            <p className="text-sm text-gray-500">From: {product.store.name}</p>
            <p className="text-sm text-gray-500">Qty: {qty}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-orange-500">{formatPrice(total)}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <h2 className="font-bold text-gray-900 mb-4">Your Information</h2>

          <Input label="Full Name *" value={form.customerName} onChange={update('customerName')} error={errors.customerName} placeholder="Your name" />
          <Input label="Phone Number *" type="tel" value={form.customerPhone} onChange={update('customerPhone')} error={errors.customerPhone} placeholder="+856 20 xxxxxxxx" />
          <Input label="Email (optional)" type="email" value={form.customerEmail} onChange={update('customerEmail')} placeholder="for order updates" />

          <h2 className="font-bold text-gray-900 pt-2">Delivery Address</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
            <select
              value={form.province}
              onChange={update('province')}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-base ${errors.province ? 'border-red-400' : 'border-gray-300'}`}
            >
              <option value="">Select province...</option>
              {LAO_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.province && <p className="text-xs text-red-600 mt-1">{errors.province}</p>}
          </div>

          <Input label="District" value={form.district} onChange={update('district')} placeholder="District / ເມືອງ" />
          <Textarea label="Address *" value={form.address} onChange={update('address')} error={errors.address} placeholder="House number, street, village..." rows={2} />
          <Textarea label="Delivery Note" value={form.deliveryNote} onChange={update('deliveryNote')} placeholder="Special delivery instructions..." rows={2} />

          <h2 className="font-bold text-gray-900 pt-2">Payment Method</h2>
          <div className="space-y-2">
            {[
              { value: 'CASH_ON_DELIVERY', label: '💵 Cash on Delivery', desc: 'Pay when you receive' },
              { value: 'BANK_TRANSFER', label: '🏦 Bank Transfer', desc: 'Transfer before shipping' },
              { value: 'QR_PAYMENT', label: '📱 QR Payment', desc: 'Scan & pay' },
            ].map((method) => (
              <label key={method.value} className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${form.paymentMethod === method.value ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.value}
                  checked={form.paymentMethod === method.value}
                  onChange={update('paymentMethod')}
                  className="accent-orange-500"
                />
                <div>
                  <p className="font-medium text-sm">{method.label}</p>
                  <p className="text-xs text-gray-500">{method.desc}</p>
                </div>
              </label>
            ))}
          </div>

          {form.paymentMethod !== 'CASH_ON_DELIVERY' && product.store.paymentInstructions && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm">
              <p className="font-medium text-orange-800 mb-1">Payment Instructions:</p>
              <p className="text-orange-700 whitespace-pre-wrap">{product.store.paymentInstructions}</p>
            </div>
          )}

          <Textarea label="Order Note (optional)" value={form.orderNote} onChange={update('orderNote')} placeholder="Any special requests..." rows={2} />

          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-orange-500 text-xl">{formatPrice(total)}</span>
          </div>

          <Button type="submit" size="lg" className="w-full" loading={submitting}>
            Place Order
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <CheckoutForm />
    </Suspense>
  )
}

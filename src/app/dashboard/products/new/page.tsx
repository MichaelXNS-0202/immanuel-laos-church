'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { generateSlug } from '@/lib/utils'

export default function NewProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', slug: '', description: '', price: '', salePrice: '',
    stockQuantity: '0', images: ['', '', '', '', ''], isActive: true, isFeatured: false, categoryId: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.value
    setForm((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === 'name') updated.slug = generateSlug(value)
      return updated
    })
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const updateImage = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const images = [...form.images]
    images[index] = e.target.value
    setForm((prev) => ({ ...prev, images }))
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Product name is required'
    if (!form.slug.trim()) errs.slug = 'Product URL is required'
    if (!form.price || isNaN(parseFloat(form.price))) errs.price = 'Valid price is required'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          images: form.images.filter(Boolean),
          price: parseFloat(form.price),
          salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
          stockQuantity: parseInt(form.stockQuantity) || 0,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create product')
      } else {
        router.push('/dashboard/products')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/products" className="text-gray-400 hover:text-gray-600">← Back</Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <Input label="Product Name *" value={form.name} onChange={update('name')} error={errors.name} placeholder="e.g. Handmade Silk Scarf" />
        <Input label="Product URL *" value={form.slug} onChange={update('slug')} error={errors.slug} placeholder="handmade-silk-scarf" hint="URL-friendly name for the product page" />
        <Textarea label="Description" value={form.description} onChange={update('description')} placeholder="Describe your product..." rows={4} />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Price (LAK) *" type="number" value={form.price} onChange={update('price')} error={errors.price} placeholder="50000" min="0" />
          <Input label="Sale Price (LAK)" type="number" value={form.salePrice} onChange={update('salePrice')} placeholder="45000 (optional)" min="0" />
        </div>

        <Input label="Stock Quantity" type="number" value={form.stockQuantity} onChange={update('stockQuantity')} min="0" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Images (URLs, up to 5)</label>
          <div className="space-y-2">
            {form.images.map((img, i) => (
              <Input
                key={i}
                value={img}
                onChange={updateImage(i)}
                placeholder={`Image ${i + 1} URL (https://...)`}
                type="url"
              />
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 accent-orange-500"
            />
            <span className="text-sm font-medium text-gray-700">Active (visible in store)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm((prev) => ({ ...prev, isFeatured: e.target.checked }))}
              className="w-4 h-4 accent-orange-500"
            />
            <span className="text-sm font-medium text-gray-700">Featured</span>
          </label>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={saving}>
          Create Product
        </Button>
      </form>
    </div>
  )
}

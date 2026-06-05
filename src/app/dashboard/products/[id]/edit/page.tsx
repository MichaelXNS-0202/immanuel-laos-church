'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    name: '', slug: '', description: '', price: '', salePrice: '',
    stockQuantity: '0', images: ['', '', '', '', ''], isActive: true, isFeatured: false, categoryId: '',
  })

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.product) {
          const p = d.product
          const imgs = [...(p.images || []), '', '', '', '', ''].slice(0, 5)
          setForm({
            name: p.name || '',
            slug: p.slug || '',
            description: p.description || '',
            price: String(p.price || ''),
            salePrice: String(p.salePrice || ''),
            stockQuantity: String(p.stockQuantity || 0),
            images: imgs,
            isActive: p.isActive ?? true,
            isFeatured: p.isFeatured ?? false,
            categoryId: p.categoryId || '',
          })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
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
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
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
        setError(data.error || 'Failed to update product')
      } else {
        router.push('/dashboard/products')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="py-16 text-center text-gray-400">Loading...</div>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/products" className="text-gray-400 hover:text-gray-600">← Back</Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <Input label="Product Name *" value={form.name} onChange={update('name')} error={errors.name} />
        <Input label="Product URL *" value={form.slug} onChange={update('slug')} error={errors.slug} hint="URL-friendly name" />
        <Textarea label="Description" value={form.description} onChange={update('description')} rows={4} />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Price (LAK) *" type="number" value={form.price} onChange={update('price')} error={errors.price} min="0" />
          <Input label="Sale Price (LAK)" type="number" value={form.salePrice} onChange={update('salePrice')} min="0" />
        </div>

        <Input label="Stock Quantity" type="number" value={form.stockQuantity} onChange={update('stockQuantity')} min="0" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Images (URLs, up to 5)</label>
          <div className="space-y-2">
            {form.images.map((img, i) => (
              <Input key={i} value={img} onChange={updateImage(i)} placeholder={`Image ${i + 1} URL`} type="url" />
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))} className="w-4 h-4 accent-orange-500" />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((prev) => ({ ...prev, isFeatured: e.target.checked }))} className="w-4 h-4 accent-orange-500" />
            <span className="text-sm font-medium text-gray-700">Featured</span>
          </label>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={saving}>
          Save Changes
        </Button>
      </form>
    </div>
  )
}

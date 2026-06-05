'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatPrice } from '@/lib/utils'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  salePrice?: number | null
  stockQuantity: number
  images: string[]
  isActive: boolean
  isFeatured: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchProducts = (q = '') => {
    setLoading(true)
    fetch(`/api/products?search=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((d) => { setProducts(d.products || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProducts(search)
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    })
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, isActive: !isActive } : p))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    setDeleting(id)
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    setProducts((prev) => prev.filter((p) => p.id !== id))
    setDeleting(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link href="/dashboard/products/new">
          <Button size="md">+ Add Product</Button>
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="max-w-xs"
        />
        <Button type="submit" variant="secondary">Search</Button>
      </form>

      {loading ? (
        <div className="py-16 text-center text-gray-400">Loading...</div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <div className="text-4xl mb-2">📦</div>
          <p>No products yet.</p>
          <Link href="/dashboard/products/new" className="mt-4 inline-block text-orange-500 font-medium hover:underline">
            Add your first product →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {products.map((product) => {
              const img = product.images[0] || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&size=80&background=fed7aa&color=c2410c`
              return (
                <div key={product.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image src={img} alt={product.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-orange-500 font-medium">{formatPrice(product.salePrice ?? product.price)}</p>
                    <p className="text-xs text-gray-400">Stock: {product.stockQuantity}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleActive(product.id, product.isActive)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        product.isActive
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <Link href={`/dashboard/products/${product.id}/edit`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      loading={deleting === product.id}
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

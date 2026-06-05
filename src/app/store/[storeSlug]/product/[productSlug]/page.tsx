'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ShareButtons } from '@/components/store/ShareButtons'
import { formatPrice } from '@/lib/utils'

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  salePrice?: number | null
  stockQuantity: number
  images: string[]
  store: { name: string; slug: string }
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const storeSlug = params.storeSlug as string
  const productSlug = params.productSlug as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    fetch(`/api/stores/product?storeSlug=${storeSlug}&productSlug=${productSlug}`)
      .then((r) => r.json())
      .then((d) => { setProduct(d.product || null); setLoading(false) })
      .catch(() => setLoading(false))
  }, [storeSlug, productSlug])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  )

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-400 gap-4">
      <div className="text-5xl">😔</div>
      <p>Product not found</p>
      <Link href={`/store/${storeSlug}`} className="text-orange-500 hover:underline">← Back to store</Link>
    </div>
  )

  const displayPrice = product.salePrice ?? product.price
  const isOnSale = product.salePrice && product.salePrice < product.price
  const inStock = product.stockQuantity > 0
  const images = product.images.length > 0
    ? product.images
    : [`https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&size=600&background=fed7aa&color=c2410c`]

  const handleOrder = () => {
    router.push(`/checkout?storeSlug=${storeSlug}&productId=${product.id}&qty=${qty}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <Link href={`/store/${storeSlug}`} className="text-orange-500 font-medium text-sm hover:underline">
            ← {product.store.name}
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Image gallery */}
        <div className="bg-white rounded-2xl overflow-hidden mb-4 shadow-sm">
          <div className="relative aspect-square">
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 640px"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    selectedImage === i ? 'border-orange-500' : 'border-transparent'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl font-bold text-orange-500">{formatPrice(displayPrice)}</span>
            {isOnSale && (
              <span className="text-gray-400 line-through text-lg">{formatPrice(product.price)}</span>
            )}
          </div>

          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium mb-4 ${
            inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
          }`}>
            <span>{inStock ? '✓' : '✗'}</span>
            {inStock ? `In Stock (${product.stockQuantity} available)` : 'Out of Stock'}
          </div>

          {product.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{product.description}</p>
          )}

          {inStock && (
            <div className="flex items-center gap-3 mb-5">
              <label className="text-sm font-medium text-gray-700">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-bold rounded-l-lg"
                >-</button>
                <span className="px-5 py-2 font-semibold text-gray-900 min-w-[3rem] text-center">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stockQuantity, q + 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-bold rounded-r-lg"
                >+</button>
              </div>
            </div>
          )}

          {inStock ? (
            <button
              onClick={handleOrder}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-lg transition-colors"
            >
              Order Now — {formatPrice(displayPrice * qty)}
            </button>
          ) : (
            <button disabled className="w-full bg-gray-200 text-gray-500 font-bold py-4 rounded-xl text-lg cursor-not-allowed">
              Out of Stock
            </button>
          )}
        </div>

        {/* Share */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-sm font-medium text-gray-700 mb-3">Share this product</p>
          <ShareButtons url={`/store/${storeSlug}/product/${productSlug}`} title={product.name} />
        </div>
      </div>

      <div className="text-center py-8 text-sm text-gray-400">
        <Link href="/" className="hover:text-orange-500">Powered by 🛒 LaoShopLink</Link>
      </div>
    </div>
  )
}

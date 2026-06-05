import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    salePrice?: number | null
    images: string[]
    stockQuantity: number
  }
  storeSlug: string
}

export function ProductCard({ product, storeSlug }: ProductCardProps) {
  const displayPrice = product.salePrice ?? product.price
  const isOnSale = product.salePrice && product.salePrice < product.price
  const inStock = product.stockQuantity > 0
  const imageUrl = product.images[0] || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&size=400&background=fed7aa&color=c2410c`

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/store/${storeSlug}/product/${product.slug}`}>
        <div className="relative aspect-square bg-gray-100">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
          {isOnSale && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              SALE
            </span>
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="bg-gray-800 text-white text-sm font-medium px-3 py-1 rounded">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3">
        <Link href={`/store/${storeSlug}/product/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-orange-500 transition-colors mb-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-orange-500 font-bold">{formatPrice(displayPrice)}</span>
          {isOnSale && (
            <span className="text-gray-400 text-xs line-through">{formatPrice(product.price)}</span>
          )}
        </div>

        {inStock ? (
          <Link
            href={`/checkout?storeSlug=${storeSlug}&productId=${product.id}`}
            className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
          >
            Order Now
          </Link>
        ) : (
          <button disabled className="w-full bg-gray-200 text-gray-500 font-semibold py-2.5 rounded-lg text-sm cursor-not-allowed">
            Out of Stock
          </button>
        )}
      </div>
    </div>
  )
}

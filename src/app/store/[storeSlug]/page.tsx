import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/store/ProductCard'
import { ShareButtons } from '@/components/store/ShareButtons'

interface PageProps {
  params: { storeSlug: string }
  searchParams: { category?: string }
}

export async function generateMetadata({ params }: PageProps) {
  const store = await prisma.store.findUnique({ where: { slug: params.storeSlug } })
  if (!store) return { title: 'Store Not Found' }
  return {
    title: `${store.name} | LaoShopLink`,
    description: store.description || `Shop at ${store.name} on LaoShopLink`,
  }
}

export default async function StorePage({ params, searchParams }: PageProps) {
  const store = await prisma.store.findUnique({
    where: { slug: params.storeSlug, isActive: true },
    include: {
      categories: true,
      products: {
        where: {
          isActive: true,
          ...(searchParams.category ? { categoryId: searchParams.category } : {}),
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      },
    },
  })

  if (!store) notFound()

  const logoUrl = store.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(store.name)}&size=200&background=fed7aa&color=c2410c`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-start gap-4">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-orange-100 flex-shrink-0">
              <Image src={logoUrl} alt={store.name} fill className="object-cover" sizes="80px" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
              {store.description && <p className="text-gray-600 mt-1 text-sm">{store.description}</p>}
              <div className="flex flex-wrap gap-3 mt-3">
                {store.phone && (
                  <a href={`tel:${store.phone}`} className="text-sm text-orange-500 font-medium flex items-center gap-1">
                    📞 {store.phone}
                  </a>
                )}
                {store.facebookUrl && (
                  <a href={store.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 font-medium">
                    📘 Facebook
                  </a>
                )}
                {store.whatsappNumber && (
                  <a href={`https://api.whatsapp.com/send?phone=${store.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 font-medium">
                    💬 WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <ShareButtons url={`/store/${store.slug}`} title={`Shop at ${store.name}`} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Category filter */}
        {store.categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            <Link
              href={`/store/${store.slug}`}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                !searchParams.category ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              All
            </Link>
            {store.categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/store/${store.slug}?category=${cat.id}`}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  searchParams.category === cat.id ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {store.products.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <div className="text-4xl mb-2">📦</div>
            <p>No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {store.products.map((product) => (
              <ProductCard key={product.id} product={product} storeSlug={store.slug} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-sm text-gray-400">
        <Link href="/" className="hover:text-orange-500 transition-colors">
          Powered by 🛒 LaoShopLink
        </Link>
      </div>
    </div>
  )
}

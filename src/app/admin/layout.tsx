import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/auth/login')
  if (session.user.role !== 'ADMIN') redirect('/')

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-56 bg-gray-900 text-white min-h-screen p-4 flex flex-col">
        <div className="mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">LaoShopLink</p>
          <p className="font-bold text-orange-400">Admin Panel</p>
        </div>
        <nav className="space-y-1 flex-1">
          {[
            { href: '/admin', label: '📊 Overview' },
            { href: '/admin/sellers', label: '👥 Sellers' },
            { href: '/admin/orders', label: '🛍️ Orders' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white text-sm transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-gray-700 pt-3">
          <Link href="/dashboard" className="block px-3 py-2 rounded-lg text-gray-400 hover:text-white text-xs">
            ← Seller Dashboard
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}

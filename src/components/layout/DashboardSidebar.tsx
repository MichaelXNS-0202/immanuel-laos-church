'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '📊', exact: true },
  { href: '/dashboard/store', label: 'Store Settings', icon: '🏪' },
  { href: '/dashboard/products', label: 'Products', icon: '📦' },
  { href: '/dashboard/orders', label: 'Orders', icon: '🛍️' },
]

interface DashboardSidebarProps {
  userName?: string | null
}

export function DashboardSidebar({ userName }: DashboardSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="font-bold text-xl text-orange-500">🛒 LaoShopLink</Link>
          {userName && (
            <p className="text-sm text-gray-500 mt-1 truncate">Hello, {userName}</p>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors',
                isActive(item.href, item.exact)
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex-1 flex flex-col items-center justify-center py-2 text-xs font-medium transition-colors',
              isActive(item.href, item.exact)
                ? 'text-orange-500'
                : 'text-gray-500'
            )}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="mt-0.5">{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  )
}

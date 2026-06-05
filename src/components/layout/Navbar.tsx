'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-orange-500">
          🛒 LaoShopLink
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">Home</Link>
          <Link href="/#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium">For Sellers</Link>
          {session ? (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-medium"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 font-medium">Login</Link>
              <Link href="/auth/register" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-medium">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3">
          <Link href="/" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/#how-it-works" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>For Sellers</Link>
          {session ? (
            <>
              <Link href="/dashboard" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="text-left text-red-600 font-medium py-2">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/auth/register" className="btn-primary text-center" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

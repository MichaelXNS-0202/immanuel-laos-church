'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface Seller {
  id: string
  name?: string | null
  email: string
  isVerified: boolean
  isSuspended: boolean
  createdAt: string
  store?: { name: string; slug: string } | null
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/sellers')
      .then((r) => r.json())
      .then((d) => { setSellers(d.sellers || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleAction = async (userId: string, action: string) => {
    setActionLoading(userId + action)
    try {
      const res = await fetch('/api/admin/sellers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      })
      if (res.ok) {
        setSellers((prev) => prev.map((s) => {
          if (s.id !== userId) return s
          if (action === 'verify') return { ...s, isVerified: true, isSuspended: false }
          if (action === 'suspend') return { ...s, isSuspended: true }
          if (action === 'unsuspend') return { ...s, isSuspended: false }
          return s
        }))
      }
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) return <div className="py-16 text-center text-gray-400">Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sellers ({sellers.length})</h1>

      {sellers.length === 0 ? (
        <div className="py-16 text-center text-gray-400">No sellers registered yet</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Seller</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Store</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Joined</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{seller.name || 'No name'}</p>
                    <p className="text-gray-500 text-xs">{seller.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    {seller.store ? (
                      <a href={`/store/${seller.store.slug}`} target="_blank" className="text-orange-500 hover:underline font-medium">
                        {seller.store.name}
                      </a>
                    ) : (
                      <span className="text-gray-400">No store</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {seller.isVerified ? (
                        <Badge color="green">Verified</Badge>
                      ) : (
                        <Badge color="yellow">Unverified</Badge>
                      )}
                      {seller.isSuspended && <Badge color="red">Suspended</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(seller.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      {!seller.isVerified && (
                        <Button
                          size="sm"
                          variant="secondary"
                          loading={actionLoading === seller.id + 'verify'}
                          onClick={() => handleAction(seller.id, 'verify')}
                        >
                          Verify
                        </Button>
                      )}
                      {!seller.isSuspended ? (
                        <Button
                          size="sm"
                          variant="danger"
                          loading={actionLoading === seller.id + 'suspend'}
                          onClick={() => handleAction(seller.id, 'suspend')}
                        >
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          loading={actionLoading === seller.id + 'unsuspend'}
                          onClick={() => handleAction(seller.id, 'unsuspend')}
                        >
                          Unsuspend
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

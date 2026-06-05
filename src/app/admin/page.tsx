import { prisma } from '@/lib/prisma'
import { StatsCard } from '@/components/dashboard/StatsCard'

export default async function AdminOverviewPage() {
  const [totalSellers, totalStores, totalOrders, totalProducts] = await Promise.all([
    prisma.user.count({ where: { role: 'SELLER' } }),
    prisma.store.count(),
    prisma.order.count(),
    prisma.product.count(),
  ])

  const recentOrders = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { store: { select: { name: true } } },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Total Sellers" value={totalSellers} icon="👥" color="blue" />
        <StatsCard label="Total Stores" value={totalStores} icon="🏪" color="orange" />
        <StatsCard label="Total Orders" value={totalOrders} icon="🛍️" color="green" />
        <StatsCard label="Total Products" value={totalProducts} icon="📦" color="purple" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-bold text-gray-900 mb-4">Recent Orders (Platform-wide)</h2>
        {recentOrders.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-500 font-medium">Order #</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Store</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Customer</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-2 font-mono font-medium">{order.orderNumber}</td>
                    <td className="py-2 text-gray-600">{order.store.name}</td>
                    <td className="py-2 text-gray-600">{order.customerName}</td>
                    <td className="py-2 text-right">
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

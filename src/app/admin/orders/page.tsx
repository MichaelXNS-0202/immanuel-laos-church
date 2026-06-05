import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/dashboard/OrderStatusBadge'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { store: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Orders ({orders.length})</h1>

      {orders.length === 0 ? (
        <div className="py-16 text-center text-gray-400">No orders yet</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Order #</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Store</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Customer</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Total</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-medium text-xs">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-gray-600">{order.store.name}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-xs text-gray-400">{order.customerPhone}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-orange-500">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <OrderStatusBadge status={order.orderStatus} />
                        <PaymentStatusBadge status={order.paymentStatus} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

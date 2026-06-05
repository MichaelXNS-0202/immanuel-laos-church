import { Badge } from '@/components/ui/Badge'

type BadgeColor = 'gray' | 'orange' | 'green' | 'blue' | 'red' | 'yellow' | 'purple'

export function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: BadgeColor }> = {
    PENDING: { label: 'Pending', color: 'yellow' },
    CONFIRMED: { label: 'Confirmed', color: 'blue' },
    PACKED: { label: 'Packed', color: 'purple' },
    SHIPPED: { label: 'Shipped', color: 'orange' },
    DELIVERED: { label: 'Delivered', color: 'green' },
    CANCELED: { label: 'Canceled', color: 'red' },
  }
  const { label, color } = map[status] ?? { label: status, color: 'gray' }
  return <Badge color={color}>{label}</Badge>
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: BadgeColor }> = {
    UNPAID: { label: 'Unpaid', color: 'red' },
    WAITING_CONFIRMATION: { label: 'Waiting', color: 'yellow' },
    PAID: { label: 'Paid', color: 'green' },
    FAILED: { label: 'Failed', color: 'red' },
    REFUNDED: { label: 'Refunded', color: 'purple' },
  }
  const { label, color } = map[status] ?? { label: status, color: 'gray' }
  return <Badge color={color}>{label}</Badge>
}

export function DeliveryStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: BadgeColor }> = {
    NOT_SHIPPED: { label: 'Not Shipped', color: 'gray' },
    PREPARING: { label: 'Preparing', color: 'yellow' },
    HANDED_TO_DELIVERY: { label: 'Handed Over', color: 'blue' },
    IN_TRANSIT: { label: 'In Transit', color: 'orange' },
    DELIVERED: { label: 'Delivered', color: 'green' },
    FAILED_DELIVERY: { label: 'Failed', color: 'red' },
  }
  const { label, color } = map[status] ?? { label: status, color: 'gray' }
  return <Badge color={color}>{label}</Badge>
}

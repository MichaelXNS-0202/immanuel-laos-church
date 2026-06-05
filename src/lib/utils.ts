export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('lo-LA', {
    style: 'currency',
    currency: 'LAK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `LSL-${timestamp}-${random}`
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-ກ-ໝ]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export const LAO_PROVINCES = [
  'ວຽງຈັນ (ນະຄອນຫຼວງ)',
  'ວຽງຈັນ (ແຂວງ)',
  'ບໍລິຄຳໄຊ',
  'ບໍ່ແກ້ວ',
  'ຈຳປາສັກ',
  'ຫົວພັນ',
  'ຄຳມ່ວນ',
  'ລວງນາມທາ',
  'ຫຼວງພະບາງ',
  'ອຸດົມໄຊ',
  'ຜົ້ງສາລີ',
  'ສາລະວັນ',
  'ສະຫວັນນະເຂດ',
  'ເຊກອງ',
  'ໄຊຍະບູລີ',
  'ໄຊສົມບູນ',
  'ອັດຕະປື',
  'ວຽງທອງ',
]

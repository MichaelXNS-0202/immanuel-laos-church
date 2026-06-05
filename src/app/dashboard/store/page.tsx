'use client'

import { useEffect, useState } from 'react'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { generateSlug } from '@/lib/utils'

interface Store {
  id: string
  name: string
  slug: string
  description?: string
  phone?: string
  whatsappNumber?: string
  facebookUrl?: string
  tiktokUrl?: string
  address?: string
  paymentInstructions?: string
  logo?: string
}

export default function StoreSettingsPage() {
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', slug: '', description: '', phone: '', whatsappNumber: '',
    facebookUrl: '', tiktokUrl: '', address: '', paymentInstructions: '', logo: '',
  })

  useEffect(() => {
    fetch('/api/stores')
      .then((r) => r.json())
      .then((d) => {
        if (d.store) {
          setStore(d.store)
          setForm({
            name: d.store.name || '',
            slug: d.store.slug || '',
            description: d.store.description || '',
            phone: d.store.phone || '',
            whatsappNumber: d.store.whatsappNumber || '',
            facebookUrl: d.store.facebookUrl || '',
            tiktokUrl: d.store.tiktokUrl || '',
            address: d.store.address || '',
            paymentInstructions: d.store.paymentInstructions || '',
            logo: d.store.logo || '',
          })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    setForm((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === 'name' && !store) {
        updated.slug = generateSlug(value)
      }
      return updated
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.slug.trim()) {
      setError('Store name and URL are required')
      return
    }
    setError('')
    setSaving(true)
    setSuccess(false)
    try {
      const res = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save store')
      } else {
        setStore(data.store)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-16 text-gray-400">Loading...</div>

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {store ? 'Store Settings' : 'Create Your Store'}
      </h1>
      {store && (
        <p className="text-sm text-gray-500 mb-6">
          Your store:{' '}
          <a
            href={`/store/${store.slug}`}
            target="_blank"
            className="text-orange-500 font-medium hover:underline"
          >
            /store/{store.slug}
          </a>
        </p>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
          Store saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <Input label="Store Name *" value={form.name} onChange={update('name')} placeholder="My Lao Shop" />
        <Input
          label="Store URL *"
          value={form.slug}
          onChange={update('slug')}
          placeholder="my-lao-shop"
          hint="Your store link: laoshoplink.com/store/your-url"
        />
        <Textarea label="Description" value={form.description} onChange={update('description')} placeholder="Tell customers about your store..." rows={3} />
        <Input label="Phone Number" value={form.phone} onChange={update('phone')} placeholder="+856 20 xxxxxxxx" type="tel" />
        <Input label="WhatsApp Number" value={form.whatsappNumber} onChange={update('whatsappNumber')} placeholder="+856 20 xxxxxxxx" />
        <Input label="Facebook Page URL" value={form.facebookUrl} onChange={update('facebookUrl')} placeholder="https://facebook.com/yourpage" type="url" />
        <Input label="TikTok URL" value={form.tiktokUrl} onChange={update('tiktokUrl')} placeholder="https://tiktok.com/@yourpage" type="url" />
        <Input label="Store Logo URL" value={form.logo} onChange={update('logo')} placeholder="https://..." type="url" />
        <Textarea label="Address" value={form.address} onChange={update('address')} placeholder="Your store address..." rows={2} />
        <Textarea
          label="Payment Instructions"
          value={form.paymentInstructions}
          onChange={update('paymentInstructions')}
          placeholder="e.g. Transfer to BCEL account 12345678, name: Your Name. Send screenshot to WhatsApp."
          rows={4}
        />
        <Button type="submit" size="lg" className="w-full" loading={saving}>
          {store ? 'Save Changes' : 'Create Store'}
        </Button>
      </form>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import DevicesGrid from '@/components/dashboard/devices-grid'

export default function DevicesPage() {
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    device_name: '',
    rustdesk_id: '',
    password: '',
    client_name: '',
    client_email: '',
    notes: '',
    group_name: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('You must be logged in to add devices')
        return
      }

      const { error: insertError } = await supabase.from('devices').insert({
        user_id: user.id,
        device_name: formData.device_name,
        rustdesk_id: formData.rustdesk_id,
        password: formData.password,
        client_name: formData.client_name,
        client_email: formData.client_email,
        notes: formData.notes,
        group_name: formData.group_name,
        status: 'offline',
      })

      if (insertError) {
        setError(insertError.message)
        return
      }

      setFormData({
        device_name: '',
        rustdesk_id: '',
        password: '',
        client_name: '',
        client_email: '',
        notes: '',
        group_name: '',
      })
      setShowForm(false)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Devices</h1>
          <p className="text-muted-foreground mt-2">Manage and monitor your remote devices.</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {showForm ? 'Cancel' : 'Add Device'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 border-border">
          <h2 className="text-xl font-semibold text-primary mb-6">Add New Device</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Device Name *
                </label>
                <Input
                  type="text"
                  name="device_name"
                  placeholder="My Computer"
                  value={formData.device_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  RustDesk ID *
                </label>
                <Input
                  type="text"
                  name="rustdesk_id"
                  placeholder="123456789"
                  value={formData.rustdesk_id}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Group Name
                </label>
                <Input
                  type="text"
                  name="group_name"
                  placeholder="Clients"
                  value={formData.group_name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Client Name
                </label>
                <Input
                  type="text"
                  name="client_name"
                  placeholder="John Doe"
                  value={formData.client_name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Client Email
                </label>
                <Input
                  type="email"
                  name="client_email"
                  placeholder="client@example.com"
                  value={formData.client_email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                placeholder="Any additional notes about this device..."
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                rows={3}
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? 'Adding...' : 'Add Device'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="flex-1 border-border"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <DevicesGrid />
    </div>
  )
}

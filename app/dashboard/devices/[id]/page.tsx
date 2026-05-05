'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function DeviceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const deviceId = params.id as string
  const [device, setDevice] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    device_name: '',
    password: '',
    client_name: '',
    client_email: '',
    notes: '',
  })

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const { data } = await supabase.from('devices').select('*').eq('id', deviceId).single()

        if (data) {
          setDevice(data)
          setFormData({
            device_name: data.device_name,
            password: data.password || '',
            client_name: data.client_name || '',
            client_email: data.client_email || '',
            notes: data.notes || '',
          })
        }
      } catch (err) {
        console.error('[v0] Error fetching device:', err)
        setError('Device not found')
      } finally {
        setLoading(false)
      }
    }

    fetchDevice()
  }, [deviceId, supabase])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('devices')
        .update({
          device_name: formData.device_name,
          password: formData.password,
          client_name: formData.client_name,
          client_email: formData.client_email,
          notes: formData.notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', deviceId)

      if (updateError) {
        setError(updateError.message)
        return
      }

      setEditing(false)
      // Refetch device
      const { data } = await supabase.from('devices').select('*').eq('id', deviceId).single()
      if (data) {
        setDevice(data)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this device?')) return

    setSaving(true)

    try {
      const { error: deleteError } = await supabase.from('devices').delete().eq('id', deviceId)

      if (deleteError) {
        setError(deleteError.message)
        return
      }

      router.push('/dashboard/devices')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-4 border-border border-t-accent animate-spin mx-auto mb-3"></div>
          <p className="text-muted-foreground">Loading device...</p>
        </div>
      </div>
    )
  }

  if (!device) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/devices">
          <Button variant="outline" className="border-border">
            ← Back to Devices
          </Button>
        </Link>
        <Card className="p-8 text-center border-border">
          <p className="text-destructive font-medium">{error || 'Device not found'}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/devices">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground p-0">
                ← Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-primary">{device.device_name}</h1>
              <p className="text-muted-foreground mt-1">ID: {device.rustdesk_id}</p>
            </div>
          </div>
        </div>
        <div
          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
            device.status === 'online'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
          }`}
        >
          {device.status === 'online' ? '● Online' : '○ Offline'}
        </div>
      </div>

      <Card className="p-6 border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-primary">Device Information</h2>
          {!editing && (
            <Button
              onClick={() => setEditing(true)}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Edit
            </Button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Device Name
                </label>
                <Input
                  type="text"
                  name="device_name"
                  value={formData.device_name}
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
                  value={formData.password}
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
                  value={formData.client_email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                rows={4}
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
                disabled={saving}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditing(false)
                  setError(null)
                }}
                className="flex-1 border-border"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">RustDesk ID</p>
                <p className="text-lg font-mono text-foreground mt-1">{device.rustdesk_id}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Status</p>
                <p className="text-lg text-foreground mt-1 capitalize">{device.status}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Client Name</p>
                <p className="text-lg text-foreground mt-1">{device.client_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Client Email</p>
                <p className="text-lg text-foreground mt-1">{device.client_email || 'N/A'}</p>
              </div>
            </div>

            {device.notes && (
              <div className="pt-4">
                <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Notes</p>
                <p className="text-foreground p-3 bg-secondary/50 rounded-lg">{device.notes}</p>
              </div>
            )}

            <div className="pt-4 text-xs text-muted-foreground">
              Added {new Date(device.created_at).toLocaleDateString()} at{' '}
              {new Date(device.created_at).toLocaleTimeString()}
            </div>
          </div>
        )}
      </Card>

      {!editing && (
        <Card className="p-6 border-border/50">
          <h2 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h2>
          <Button
            onClick={handleDelete}
            disabled={saving}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Device
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            This action cannot be undone. The device will be permanently removed from your account.
          </p>
        </Card>
      )}
    </div>
  )
}

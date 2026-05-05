'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [rustdeskServer, setRustdeskServer] = useState('')
  const [rustdeskKey, setRustdeskKey] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        const { data } = await supabase
          .from('settings')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (data) {
          setRustdeskServer(data.rustdesk_server || '')
          setRustdeskKey(data.rustdesk_key || '')
        }
      } catch (err) {
        console.error('[v0] Error fetching settings:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [supabase])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('You must be logged in')
        return
      }

      const { error: upsertError } = await supabase.from('settings').upsert(
        {
          user_id: user.id,
          rustdesk_server: rustdeskServer,
          rustdesk_key: rustdeskKey,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )

      if (upsertError) {
        setError(upsertError.message)
        return
      }

      setSuccess('Settings saved successfully!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Settings</h1>
        <p className="text-muted-foreground mt-2">Configure RustDesk server settings.</p>
      </div>

      <Card className="max-w-2xl p-6 border-border">
        <h2 className="text-xl font-semibold text-primary mb-6">RustDesk Configuration</h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 rounded-full border-4 border-border border-t-accent animate-spin mx-auto mb-3"></div>
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                RustDesk Server
              </label>
              <Input
                type="text"
                placeholder="https://rustdesk.example.com"
                value={rustdeskServer}
                onChange={(e) => setRustdeskServer(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">
                The URL of your RustDesk server (if using a custom server)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                RustDesk API Key
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={rustdeskKey}
                onChange={(e) => setRustdeskKey(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">
                API key for RustDesk server integration (optional)
              </p>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-100/50 border border-green-300/50 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-400">{success}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        )}
      </Card>

      <Card className="max-w-2xl p-6 border-border">
        <h2 className="text-xl font-semibold text-primary mb-4">About NotelDesk</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Version:</span> 1.0.0
          </p>
          <p>
            <span className="font-medium text-foreground">Purpose:</span> Remote device management
            system powered by RustDesk
          </p>
          <p>
            <span className="font-medium text-foreground">Features:</span> Device monitoring, access
            logs, multi-user support, and centralized management.
          </p>
        </div>
      </Card>
    </div>
  )
}

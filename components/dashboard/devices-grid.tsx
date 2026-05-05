'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import DeviceCard from './device-card'

export default function DevicesGrid() {
  const [devices, setDevices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const { data } = await supabase
          .from('devices')
          .select('*')
          .order('created_at', { ascending: false })

        if (data) {
          setDevices(data)
        }
      } catch (error) {
        console.error('[v0] Error fetching devices:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDevices()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('devices')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'devices' },
        () => {
          fetchDevices()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-48 bg-card rounded-lg border border-border animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (devices.length === 0) {
    return (
      <Card className="p-12 text-center border-border">
        <svg
          className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-foreground mb-2">No devices yet</h3>
        <p className="text-muted-foreground mb-6">
          Add your first device to get started managing remote connections.
        </p>
        <Link href="/dashboard/devices">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Add Device
          </Button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {devices.map((device) => (
        <DeviceCard key={device.id} device={device} onUpdate={() => {}} />
      ))}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import DevicesGrid from '@/components/dashboard/devices-grid'
import StatsOverview from '@/components/dashboard/stats-overview'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [deviceCount, setDeviceCount] = useState(0)
  const [onlineCount, setOnlineCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: devices } = await supabase
          .from('devices')
          .select('*', { count: 'exact', head: false })

        if (devices) {
          setDeviceCount(devices.length)
          const online = devices.filter((d) => d.status === 'online').length
          setOnlineCount(online)
        }
      } catch (error) {
        console.error('[v0] Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to NotelDesk. Manage your remote devices.</p>
      </div>

      {!loading && (
        <StatsOverview
          deviceCount={deviceCount}
          onlineCount={onlineCount}
        />
      )}

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">Your Devices</h2>
        </div>
        <DevicesGrid />
      </div>
    </div>
  )
}

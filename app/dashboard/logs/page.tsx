'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'

export default function AccessLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await supabase
          .from('access_logs')
          .select('*, device:devices(device_name)')
          .order('created_at', { ascending: false })
          .limit(100)

        if (data) {
          setLogs(data)
        }
      } catch (error) {
        console.error('[v0] Error fetching logs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('access_logs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'access_logs' },
        (payload) => {
          setLogs((prev) => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Access Logs</h1>
        <p className="text-muted-foreground mt-2">View all device access events and activities.</p>
      </div>

      <Card className="border-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 rounded-full border-4 border-border border-t-accent animate-spin mx-auto mb-3"></div>
            <p className="text-muted-foreground">Loading logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center">
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
            <h3 className="text-lg font-semibold text-foreground mb-2">No logs yet</h3>
            <p className="text-muted-foreground">Device access logs will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Date & Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-border hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-foreground">
                        {log.device?.device_name || 'Unknown Device'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-semibold bg-accent/20 text-accent rounded-full">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground font-mono">
                        {log.ip_address || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

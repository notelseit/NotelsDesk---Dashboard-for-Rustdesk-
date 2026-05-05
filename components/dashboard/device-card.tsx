'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DeviceCard({ device, onUpdate }: { device: any; onUpdate: () => void }) {
  return (
    <Card className="border-border overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-primary line-clamp-1">
              {device.device_name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              ID: {device.rustdesk_id}
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              device.status === 'online'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
            }`}
          >
            {device.status === 'online' ? '● Online' : '○ Offline'}
          </div>
        </div>

        {device.client_name && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground">Client</p>
            <p className="text-sm font-medium text-foreground">{device.client_name}</p>
          </div>
        )}

        {device.client_email && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm text-foreground break-all">{device.client_email}</p>
          </div>
        )}

        {device.notes && (
          <div className="mb-4 p-3 bg-secondary/50 rounded-lg">
            <p className="text-sm text-foreground line-clamp-2">{device.notes}</p>
          </div>
        )}

        {device.tags && device.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {device.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="text-xs text-muted-foreground mb-4">
          Added {new Date(device.created_at).toLocaleDateString()}
        </div>

        <div className="flex gap-2">
          <Link href={`/dashboard/devices/${device.id}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full border-border text-primary hover:bg-primary/5"
            >
              View Details
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="text-accent hover:bg-accent/10"
            title="Copy RustDesk ID"
            onClick={() => {
              navigator.clipboard.writeText(device.rustdesk_id)
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </Button>
        </div>
      </div>
    </Card>
  )
}

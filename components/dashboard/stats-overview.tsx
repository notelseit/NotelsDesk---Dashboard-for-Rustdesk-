import { Card } from '@/components/ui/card'

export default function StatsOverview({
  deviceCount,
  onlineCount,
}: {
  deviceCount: number
  onlineCount: number
}) {
  const offlineCount = deviceCount - onlineCount
  const uptime = deviceCount > 0 ? Math.round((onlineCount / deviceCount) * 100) : 0

  const stats = [
    {
      label: 'Total Devices',
      value: deviceCount,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 3v2m6-2v2M9 5h6m6 0h2m-2 0a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2"
          />
        </svg>
      ),
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Online Now',
      value: onlineCount,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      color: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Offline',
      value: offlineCount,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      color: 'text-gray-600 dark:text-gray-400',
    },
    {
      label: 'Uptime',
      value: `${uptime}%`,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      color: 'text-purple-600 dark:text-purple-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6 border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold text-primary mt-2">{stat.value}</p>
            </div>
            <div className={`p-3 bg-accent/10 rounded-lg ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function TopNav() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 md:px-8">
      <div className="flex-1" />

      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-accent">
                  {user.email?.[0].toUpperCase()}
                </span>
              </div>
              <div className="text-sm">
                <p className="font-medium text-foreground">{user.email}</p>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              Logout
            </Button>
          </>
        )}
      </div>
    </header>
  )
}

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border shadow-lg">
        <div className="p-8 text-center">
          <div className="mb-6">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-primary">Check Your Email</h1>
          </div>

          <p className="text-muted-foreground mb-2">
            We&apos;ve sent a confirmation link to your email address.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Please click the link to verify your email and complete your signup.
          </p>

          <div className="p-4 bg-secondary/50 rounded-lg mb-8">
            <p className="text-sm text-foreground font-medium">Didn&apos;t receive the email?</p>
            <p className="text-xs text-muted-foreground mt-1">
              Check your spam folder or try signing up again.
            </p>
          </div>

          <Link href="/auth/login">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2">
              Return to Login
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

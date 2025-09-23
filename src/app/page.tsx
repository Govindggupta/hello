import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md text-center">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Multi-Tenant App</h1>
            <p className="text-muted-foreground mt-2">
              Secure multi-organization platform with role-based access control
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button asChild size="lg">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/sign-up">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

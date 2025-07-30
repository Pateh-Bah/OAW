import { redirect } from 'next/navigation'
import { auth } from '@/lib/supabase'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await auth.getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}

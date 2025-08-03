"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Back to home link */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors min-touch-target"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs sm:text-sm">
                OAW
              </div>
              <Badge variant="secondary" className="text-xs">
                Workshop Management
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Sign in to your Overhead Aluminium Workshop account
            </p>
          </div>

          <Card className="border-0 shadow-none p-0">
            <CardContent className="p-0">
              <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 sm:h-12 text-base"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 sm:h-12 text-base"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 h-4 w-4 text-muted-foreground hover:text-foreground min-touch-target flex items-center justify-center"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-950 dark:border-red-800 dark:text-red-400">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full h-11 sm:h-12 text-base font-medium" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-blue-600 hover:underline min-touch-target">
                  Contact administrator
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center text-white p-6 xl:p-8 max-w-md">
          <div className="mb-6 xl:mb-8">
            <div className="inline-flex h-14 w-14 xl:h-16 xl:w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur text-xl xl:text-2xl font-bold mb-4">
              OAW
            </div>
            <h2 className="text-2xl xl:text-3xl font-bold mb-3 xl:mb-4">
              Overhead Aluminium Workshop
            </h2>
            <p className="text-blue-100 text-base xl:text-lg leading-relaxed">
              Professional workshop management system designed for aluminium fabrication businesses. 
              Streamline your operations and grow your business.
            </p>
          </div>

          <div className="space-y-3 xl:space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-white/60 flex-shrink-0" />
              <span>Comprehensive project management</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-white/60 flex-shrink-0" />
              <span>Real-time collaboration tools</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-white/60 flex-shrink-0" />
              <span>Advanced reporting and analytics</span>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 right-1/4 h-24 w-24 xl:h-32 xl:w-32 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 h-20 w-20 xl:h-24 xl:w-24 rounded-full bg-white/5 blur-2xl" />
      </div>
    </div>
  )
}
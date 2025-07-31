"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { 
  Building, 
  Users, 
  Calculator, 
  Camera, 
  Shield, 
  Zap, 
  Phone, 
  Mail, 
  MapPin,
  ArrowRight,
  CheckCircle,
  Star
} from "lucide-react"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="container relative mx-auto px-4 py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 text-sm">
              🚀 Professional Workshop Management
            </Badge>
            <h1 className="mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-white dark:to-gray-300 lg:text-7xl">
              Overhead Aluminium
              <span className="block text-blue-600 dark:text-blue-400">Workshop</span>
            </h1>
            <p className="mb-8 text-xl text-gray-600 dark:text-gray-300 lg:text-2xl">
              Transform your aluminium workshop with our comprehensive management platform. 
              Streamline operations, manage projects, and grow your business.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link href="/auth/login">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to manage your workshop
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features designed specifically for aluminium workshops and fabrication businesses
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg transition-all hover:shadow-xl dark:from-blue-950/50 dark:to-indigo-950/50">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Staff Management</CardTitle>
                <CardDescription className="text-base">
                  Complete team management with role-based access control and activity tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Employee profiles and roles
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Activity logging and reporting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Permission management
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg transition-all hover:shadow-xl dark:from-green-950/50 dark:to-emerald-950/50">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 text-white">
                  <Building className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Project Management</CardTitle>
                <CardDescription className="text-base">
                  Track customers, projects, and site locations with detailed records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Customer database
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Project timeline tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Site location management
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg transition-all hover:shadow-xl dark:from-purple-950/50 dark:to-pink-950/50">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600 text-white">
                  <Calculator className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Budget & Quotes</CardTitle>
                <CardDescription className="text-base">
                  Handle budgets, generate professional quotes, and manage finances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Automated calculations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    PDF quote generation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Financial tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-red-50 shadow-lg transition-all hover:shadow-xl dark:from-orange-950/50 dark:to-red-950/50">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-600 text-white">
                  <Camera className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Media Management</CardTitle>
                <CardDescription className="text-base">
                  Store and organize project photos, documents, and media files
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Photo galleries
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Document storage
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Progress tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-teal-50 to-cyan-50 shadow-lg transition-all hover:shadow-xl dark:from-teal-950/50 dark:to-cyan-950/50">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-600 text-white">
                  <Shield className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Security & Access</CardTitle>
                <CardDescription className="text-base">
                  Enterprise-grade security with role-based permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Secure authentication
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    User permissions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Audit trails
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-lg transition-all hover:shadow-xl dark:from-yellow-950/50 dark:to-amber-950/50">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-600 text-white">
                  <Zap className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Real-time Updates</CardTitle>
                <CardDescription className="text-base">
                  Stay connected with instant notifications and real-time data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Live notifications
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Real-time sync
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Instant updates
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold">500+</div>
              <div className="text-blue-100">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold">50+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold">99.9%</div>
              <div className="text-blue-100">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Trusted by professionals
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our customers say about our workshop management system
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription>
                  "This system has completely transformed how we manage our aluminium projects. 
                  The efficiency gains are incredible!"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">Sarah Johnson</div>
                <div className="text-sm text-muted-foreground">AlumTech Solutions</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription>
                  "The project tracking and budget management features have saved us countless hours. 
                  Highly recommended!"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">Michael Chen</div>
                <div className="text-sm text-muted-foreground">Pro Aluminium Works</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription>
                  "Outstanding customer support and a platform that actually understands 
                  the needs of workshop businesses."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">David Williams</div>
                <div className="text-sm text-muted-foreground">Elite Fabrication</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-50 py-24 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Get in touch
              </h2>
              <p className="text-lg text-muted-foreground">
                Ready to transform your workshop? Contact us today for a personalized demo
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Contact Information</CardTitle>
                  <CardDescription>
                    Reach out to us through any of these channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-muted-foreground">overheadaluminium@gmail.com</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-medium">Phone</div>
                      <div className="text-muted-foreground">
                        +232-77-902-889<br />+232-74-902-889<br />+232-31-902-889
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-medium">Address</div>
                      <div className="text-muted-foreground">5c Hill Cot Road, Freetown</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
                <CardHeader>
                  <CardTitle className="text-2xl">Ready to get started?</CardTitle>
                  <CardDescription>
                    Join hundreds of workshops already using our platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">30-day free trial</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">No setup fees</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">24/7 customer support</span>
                    </div>
                  </div>
                  
                  <Button asChild size="lg" className="w-full">
                    <Link href="/auth/login">
                      Start Your Free Trial
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-2xl font-bold text-blue-600">OAW</div>
            <div className="text-sm text-muted-foreground">
              © 2025 Overhead Aluminium Workshop. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
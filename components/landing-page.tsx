"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import Link from "next/link"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Overhead Aluminium Workshop
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Professional aluminium workshop management system for staff, customers, 
            projects, and communications. Streamline your operations with our comprehensive platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/auth/login">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Staff Management</CardTitle>
              <CardDescription>
                Manage your team with role-based access control and activity tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>Employee profiles and roles</li>
                <li>Activity logging and reporting</li>
                <li>Permission management</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer & Projects</CardTitle>
              <CardDescription>
                Track customers, projects, and site locations with detailed records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>Customer database</li>
                <li>Project management</li>
                <li>Site location tracking</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget & Media</CardTitle>
              <CardDescription>
                Handle budgets, generate quotes, and manage project media
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>Budget calculations</li>
                <li>PDF quote generation</li>
                <li>Media management</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Contact Us
          </h2>
          <div className="text-gray-600">
            <p className="mb-2">📧 overheadaluminium@gmail.com</p>
            <p className="mb-2">📞 +232-77-902-889 | +232-31-902-889</p>
            <p>📍 8 Hill Cot Road, Freetown</p>
          </div>
        </div>
      </main>
    </div>
  )
}
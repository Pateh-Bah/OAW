'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Overhead Aluminium Workshop
              </h1>
            </div>
            <nav className="flex space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Professional Aluminium Solutions
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We specialize in high-quality aluminium fabrication, installation, and repair services
            for residential and commercial projects in Sierra Leone.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/dashboard">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="#services">
              <Button variant="outline" size="lg">Our Services</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Aluminium Fabrication</CardTitle>
                <CardDescription>Custom aluminium work</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Custom fabrication of aluminium windows, doors, frames, and structural components
                  tailored to your specific requirements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Installation Services</CardTitle>
                <CardDescription>Professional installation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Expert installation of aluminium products with precision and attention to detail,
                  ensuring long-lasting results.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Repair & Maintenance</CardTitle>
                <CardDescription>Keep your aluminium in top condition</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Comprehensive repair and maintenance services to extend the life of your
                  aluminium installations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Contact Us
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                  <CardDescription>We&apos;re here to help with your aluminium needs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <strong>Email:</strong> overheadaluminium@gmail.com
                  </div>
                  <div>
                    <strong>Phone:</strong> +232-77-902-889 / +232-31-902-889
                  </div>
                  <div>
                    <strong>Address:</strong> 8 Hill Cot Road, Freetown
                  </div>
                  <div>
                    <strong>Website:</strong> https://www.overheadaluminium.com
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Hours</CardTitle>
                  <CardDescription>When we&apos;re available</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <strong>Monday - Friday:</strong> 8:00 AM - 6:00 PM
                  </div>
                  <div>
                    <strong>Saturday:</strong> 8:00 AM - 4:00 PM
                  </div>
                  <div>
                    <strong>Sunday:</strong> Closed
                  </div>
                  <div className="mt-4">
                    <Link href="/auth/login">
                      <Button className="w-full">Access Management System</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; 2024 Overhead Aluminium Workshop. All rights reserved.</p>
            <p className="mt-2 text-gray-400">Professional aluminium solutions in Sierra Leone</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
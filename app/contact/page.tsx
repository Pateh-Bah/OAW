'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Navigation } from '@/components/navigation'
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, Building2, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: result.message || 'Your message has been sent successfully! We will get back to you soon.'
        })
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Failed to send message. Please try again.'
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50 py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 badge-enhanced border-oaw-blue/20 text-oaw-blue" variant="outline">
            Get In Touch
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-oaw-text">
            Contact Us
          </h1>
          <p className="text-xl text-oaw-text-light max-w-3xl mx-auto">
            Ready to start your aluminum project? Contact us today for a free consultation and personalized quote
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="card-enhanced hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="h-16 w-16 bg-oaw-blue rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-oaw-text">Call Us</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-2 text-oaw-text-light mb-4">
                <p className="font-medium">Primary: <a href="tel:+23277902889" className="text-oaw-blue hover:underline">+232-77-902-889</a></p>
                <p className="font-medium">Mobile: <a href="tel:+2327474902889" className="text-oaw-blue hover:underline">+232-74-74-902-889</a></p>
                <p className="font-medium">Office: <a href="tel:+2323174902889" className="text-oaw-blue hover:underline">+232-31-74-902-889</a></p>
              </div>
              <p className="text-sm text-oaw-text-light">
                Available Monday - Saturday<br />
                8:00 AM - 6:00 PM
              </p>
            </CardContent>
          </Card>

          <Card className="card-enhanced hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="h-16 w-16 bg-oaw-success rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-oaw-text">Email Us</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-oaw-text-light mb-4">
                <a href="mailto:overheadaluminiumworkshop@gmail.com" className="text-oaw-blue hover:underline font-medium">
                  overheadaluminiumworkshop@gmail.com
                </a>
              </p>
              <p className="text-sm text-oaw-text-light mb-4">
                Send us your project details and we'll respond within 24 hours
              </p>
              <Button asChild variant="outline" size="sm" className="border-oaw-success text-oaw-success hover:bg-oaw-success hover:text-white">
                <Link href="mailto:overheadaluminiumworkshop@gmail.com">Send Email</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="card-enhanced hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="h-16 w-16 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-oaw-text">Visit Us</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-oaw-text-light mb-4 font-medium">
                5c Hill Cot Road<br />
                Freetown, Sierra Leone
              </p>
              <p className="text-sm text-oaw-text-light mb-4">
                Visit our workshop to see our work and discuss your project in person
              </p>
              <Button asChild variant="outline" size="sm" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">
                <Link href="https://maps.google.com/?q=5c+Hill+Cot+Road+Freetown+Sierra+Leone" target="_blank">
                  Get Directions
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-oaw-text">Send Us a Message</h2>
            <p className="text-oaw-text-light mb-8 leading-relaxed">
              Have a specific project in mind? Fill out the form below with your details and requirements. 
              Our team will review your request and get back to you with a personalized quote and timeline.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Status Message */}
              {submitStatus.type && (
                <div className={`p-4 rounded-lg flex items-center space-x-3 ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-800 dark:text-green-300' 
                    : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-800 dark:text-red-300'
                }`}>
                  {submitStatus.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  )}
                  <p className="text-sm font-medium">{submitStatus.message}</p>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-oaw-text">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-oaw-text">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="+232-XX-XXX-XXX"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email" className="text-oaw-text">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="subject" className="text-oaw-text">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="Project type or inquiry subject"
                />
              </div>
              
              <div>
                <Label htmlFor="message" className="text-oaw-text">Message *</Label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-oaw-blue focus:border-oaw-blue dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                  placeholder="Please describe your project requirements, preferred timeline, and any specific details..."
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-oaw-blue hover:bg-oaw-blue/90 disabled:opacity-50 disabled:cursor-not-allowed" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>

          <div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-8 rounded-2xl card-enhanced">
              <h3 className="text-2xl font-bold mb-6 text-oaw-text">Why Choose Us?</h3>
              <div className="space-y-4">
                {[
                  {
                    icon: Clock,
                    title: "Quick Response",
                    description: "We respond to all inquiries within 24 hours"
                  },
                  {
                    icon: MessageSquare,
                    title: "Free Consultation",
                    description: "Get expert advice and project assessment at no cost"
                  },
                  {
                    icon: Building2,
                    title: "Quality Guarantee",
                    description: "100% satisfaction guarantee on all our work"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="h-10 w-10 bg-oaw-blue rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-oaw-text mb-1">{item.title}</h4>
                      <p className="text-sm text-oaw-text-light">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-6 bg-oaw-blue rounded-xl text-white">
              <h3 className="text-xl font-bold mb-4">Emergency Contact</h3>
              <p className="text-blue-100 mb-4">
                For urgent aluminum construction needs or emergency repairs, contact us directly:
              </p>
              <div className="space-y-2">
                <p className="font-semibold">
                  <Phone className="h-4 w-4 inline mr-2" />
                  <a href="tel:+23277902889" className="hover:underline">+232-77-902-889</a>
                </p>
                <p className="text-sm text-blue-100">Available 24/7 for emergencies</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-950/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-oaw-text">Business Hours</h2>
            <p className="text-oaw-text-light">Visit us during these hours or call to schedule an appointment</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <Card className="text-center card-enhanced">
              <CardHeader>
                <CardTitle className="text-oaw-text">Workshop Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-oaw-text-light">
                  <p><strong>Monday - Friday:</strong> 8:00 AM - 6:00 PM</p>
                  <p><strong>Saturday:</strong> 8:00 AM - 4:00 PM</p>
                  <p><strong>Sunday:</strong> Closed</p>
                </div>
              </CardContent>
            </Card>
            <Card className="text-center card-enhanced">
              <CardHeader>
                <CardTitle className="text-oaw-text">Phone Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-oaw-text-light">
                  <p><strong>Regular Hours:</strong> 8:00 AM - 8:00 PM</p>
                  <p><strong>Emergency:</strong> 24/7 Available</p>
                  <p><strong>Email:</strong> Monitored Daily</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-oaw-blue py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Project?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Don&apos;t wait! Contact us today and let&apos;s discuss how we can bring your aluminum construction vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="lg">
              <Link href="tel:+23277902889">Call Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-oaw-blue">
              <Link href="/services">View Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-oaw-blue">OAW</h3>
              <p className="text-gray-400 text-sm">
                Premium aluminum construction and fabrication in Freetown, Sierra Leone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/services" className="hover:text-white transition-colors">Windows & Doors</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Kitchen Cabinets</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Custom Construction</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>5c Hill Cot Road</p>
                <p>Freetown, Sierra Leone</p>
                <p>+232-77-902-889</p>
                <p>overheadaluminiumworkshop@gmail.com</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 mt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2024 Overhead Aluminium Workshop. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'
import { Building2, Clock, Shield, Award, Star, Users, Wrench, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

// Types for team member data
interface TeamMember {
  id: string
  full_name: string
  designation: string
  department: string
  profile_photo_url?: string
}

export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch team members from database
  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          id,
          full_name,
          designation,
          department,
          profile_photo_url
        `)
        .order('full_name', { ascending: true })

      if (error) throw error
      setTeamMembers(data || [])
    } catch (error) {
      console.error('Error fetching team members:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50 py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 badge-enhanced border-oaw-blue/20 text-oaw-blue" variant="outline">
            About Our Company
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-oaw-text">
            Overhead Aluminium Workshop
          </h1>
          <p className="text-xl text-oaw-text-light max-w-3xl mx-auto">
            Premium aluminum construction and fabrication company serving Freetown, Sierra Leone since 2020
          </p>
        </div>
      </div>

      {/* Main About Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-oaw-text">Our Story</h2>
            <p className="text-oaw-text-light mb-6 leading-relaxed">
              Founded in 2020, Overhead Aluminium Workshop is a premier aluminum construction and fabrication company 
              located at 5c Hill Cot Road, Freetown, Sierra Leone. Our team of skilled technicians and designers 
              deliver durable, modern, and elegant aluminum projects for residential and commercial buildings.
            </p>
            <p className="text-oaw-text-light mb-6 leading-relaxed">
              We use a combination of local craftsmanship and cutting-edge technology to meet construction needs 
              efficiently and professionally. Our commitment to quality and customer satisfaction has made us 
              a trusted name in Sierra Leone&apos;s construction industry.
            </p>
            <p className="text-oaw-text-light mb-8 leading-relaxed">
              Our modern workshop management system ensures every project is tracked from initial consultation 
              to final delivery, providing transparency and accountability throughout the entire process.
            </p>
            <Button asChild className="bg-oaw-blue hover:bg-oaw-blue/90">
              <Link href="/contact">Get In Touch</Link>
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50 rounded-2xl flex items-center justify-center card-enhanced shadow-lg">
              <Building2 className="h-32 w-32 text-oaw-blue" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl card-enhanced">
              <div className="text-2xl font-bold text-oaw-blue">2020</div>
              <div className="text-sm text-oaw-text-light">Founded</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-950/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-oaw-text">Our Core Values</h2>
            <p className="text-oaw-text-light max-w-2xl mx-auto">
              The principles that guide everything we do at Overhead Aluminium Workshop
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, text: "Quick Delivery", desc: "On-time project completion guaranteed" },
              { icon: Shield, text: "Quality Assured", desc: "Premium materials and craftsmanship" },
              { icon: Award, text: "Expert Team", desc: "Skilled professionals with years of experience" },
              { icon: Star, text: "Customer Focused", desc: "100% satisfaction guarantee on all work" }
            ].map((item, index) => (
              <Card key={index} className="card-enhanced hover:shadow-lg transition-all duration-300 hover:-translate-y-2 text-center">
                <CardHeader>
                  <item.icon className="h-12 w-12 text-oaw-blue mx-auto mb-2" />
                  <CardTitle className="text-lg text-oaw-text">{item.text}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-oaw-text-light">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team & Expertise */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-oaw-text">Our Expertise</h2>
          <p className="text-oaw-text-light max-w-2xl mx-auto">
            Years of experience in aluminum construction and fabrication
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Building2,
              title: "Architectural Solutions",
              description: "Custom aluminum windows, doors, and structural elements for modern buildings",
              features: ["Custom Design", "Energy Efficient", "Weather Resistant"]
            },
            {
              icon: Wrench,
              title: "Fabrication Excellence",
              description: "Precision manufacturing using modern equipment and traditional craftsmanship",
              features: ["Quality Materials", "Expert Craftsmanship", "Modern Equipment"]
            },
            {
              icon: Users,
              title: "Professional Service",
              description: "From consultation to installation, we provide complete project management",
              features: ["Project Management", "Quality Assurance", "Customer Support"]
            }
          ].map((item, index) => (
            <Card key={index} className="card-enhanced hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <item.icon className="h-12 w-12 text-oaw-blue mb-4" />
                <CardTitle className="text-xl text-oaw-text">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-oaw-text-light mb-4">{item.description}</p>
                <ul className="text-sm text-oaw-text-light space-y-2">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <Star className="h-3 w-3 text-oaw-warning mr-2" />
                      <span className="text-oaw-text">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Our Team Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-blue-200 text-blue-600">
            Meet Our Team
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Our Team
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Meet the skilled professionals who bring expertise, dedication, and craftsmanship 
            to every aluminum project we undertake.
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-64 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {teamMembers.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {teamMembers.map((member) => (
                  <Card 
                    key={member.id} 
                    className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden border-0 bg-white dark:bg-gray-800"
                  >
                    <div className="relative h-64 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 overflow-hidden">
                      {member.profile_photo_url ? (
                        <Image
                          src={member.profile_photo_url}
                          alt={member.full_name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <User className="h-16 w-16 text-blue-400 dark:text-blue-300" />
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-center font-semibold text-gray-900 dark:text-white">
                        {member.full_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 text-center">
                      <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-1">
                        {member.designation}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {member.department}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">No team members to display at the moment.</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Team information will be updated soon!</p>
              </div>
            )}
          </>
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-oaw-blue py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Project?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Let us help you bring your aluminum construction vision to life with our expertise and quality craftsmanship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="lg">
              <Link href="/services">View Our Services</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-oaw-blue">
              <Link href="/contact">Contact Us Today</Link>
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

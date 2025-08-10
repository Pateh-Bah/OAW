"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Navigation } from "@/components/navigation"
import { BackgroundTools } from "@/components/background-tools"
import { 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Users, 
  Wrench, 
  Building, 
  Award,
  Calendar,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Pause
} from "lucide-react"
import { supabase } from '@/lib/supabase'

// Types for project data
interface Project {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold'
  location: string
  start_date: string
  end_date?: string
  project_images: string[]
  customer_name: string
  site_address: string
  created_at: string
}

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock
  },
  in_progress: {
    label: 'Ongoing',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: CheckCircle
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle
  },
  on_hold: {
    label: 'On Hold',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: Pause
  }
}

export function LandingPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch projects from database
  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          description,
          status,
          location,
          start_date,
          end_date,
          project_images,
          customer_name,
          site_address,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const openGallery = (project: Project) => {
    setSelectedProject(project)
    setCurrentImageIndex(0)
  }

  const closeGallery = () => {
    setSelectedProject(null)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    if (selectedProject && selectedProject.project_images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === selectedProject.project_images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (selectedProject && selectedProject.project_images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProject.project_images.length - 1 : prev - 1
      )
    }
  }

  return (
  <div className="min-h-screen bg-background/95">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-sky-bright dark:gradient-blue-soft">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <BackgroundTools className="opacity-70" />
        <div className="container relative mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4 sm:mb-6 text-xs sm:text-sm px-3 py-1 animate-fade-in">
              🏆 Premier Aluminum Specialists in Sierra Leone
            </Badge>
            <h1 className="mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-blue-700 to-gray-600 bg-clip-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-transparent dark:from-white dark:via-blue-300 dark:to-gray-300 animate-slide-in">
              Overhead Aluminium
              <span className="block text-blue-600 dark:text-blue-400">Workshop</span>
            </h1>
            <p className="mb-6 sm:mb-8 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your trusted partner for premium aluminum fabrication in Sierra Leone. 
              We craft precision windows, doors, kitchen cabinets, and custom constructions that transform spaces.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/about" className="inline-block">
                <Button className="bg-oaw-blue hover:bg-oaw-blue-hover shadow-md btn-hover-lift">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact" className="inline-block">
                <Button variant="outline" className="border-oaw-blue text-oaw-blue hover:bg-oaw-blue-light">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
  <section className="py-12 sm:py-16 bg-card/90">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="space-y-2">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">4+</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Years Experience</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">200+</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Projects Completed</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">150+</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Happy Clients</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">99%</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
  <section className="py-16 sm:py-20 lg:py-24 bg-muted/60">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Crafting Excellence in Aluminum Solutions Since 2020
              </h2>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Overhead Aluminium Workshop has grown to become Sierra Leone's most trusted partner for premium aluminum fabrication. 
                We combine traditional craftsmanship with modern techniques to deliver exceptional results that stand the test of time.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Certified aluminum fabrication specialists</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Experienced team of skilled craftsmen</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">State-of-the-art fabrication facility</span>
                </div>
              </div>
              <Link href="/about" className="inline-block mt-8">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-2xl p-8 flex items-center justify-center">
                <Building className="h-24 w-24 sm:h-32 sm:w-32 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
  <section className="py-16 sm:py-20 lg:py-24 bg-card/90">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Specialized Services
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              From residential to commercial projects, we offer comprehensive aluminum solutions 
              tailored to your specific needs and requirements.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Building className="h-6 w-6 sm:h-8 sm:w-8" />,
                title: "Aluminum Windows & Doors",
                description: "Premium quality windows and doors designed for durability, security, and style"
              },
              {
                icon: <Wrench className="h-6 w-6 sm:h-8 sm:w-8" />,
                title: "Kitchen Cabinets",
                description: "Custom aluminum kitchen cabinets that combine functionality with modern elegance"
              },
              {
                icon: <Users className="h-6 w-6 sm:h-8 sm:w-8" />,
                title: "Imported Aluminum Chairs",
                description: "High-quality imported chairs perfect for offices and commercial spaces"
              },
              {
                icon: <Building className="h-6 w-6 sm:h-8 sm:w-8" />,
                title: "Wall Frames",
                description: "Structural aluminum wall framing solutions for modern construction projects"
              },
              {
                icon: <Wrench className="h-6 w-6 sm:h-8 sm:w-8" />,
                title: "Assembly Services",
                description: "Professional installation and assembly of all aluminum products and systems"
              },
              {
                icon: <Award className="h-6 w-6 sm:h-8 sm:w-8" />,
                title: "Custom Constructions",
                description: "Bespoke aluminum solutions designed and crafted to your exact specifications"
              }
            ].map((service, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 animate-fade-in">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors mb-3 sm:mb-4">
                    {service.icon}
                  </div>
                  <CardTitle className="text-lg sm:text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Projects Gallery */}
  <section className="py-16 sm:py-20 lg:py-24 bg-muted/60">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Recent Projects
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Explore our portfolio of completed and ongoing projects showcasing our 
              expertise in aluminum fabrication and installation across Sierra Leone.
            </p>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => {
                const StatusIcon = statusConfig[project.status].icon
                return (
                  <Card 
                    key={project.id} 
                    className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden border-0 bg-white dark:bg-gray-800"
                    onClick={() => openGallery(project)}
                  >
                    <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 overflow-hidden">
                      {project.project_images && project.project_images.length > 0 ? (
                        <Image
                          src={project.project_images[0]}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Building className="h-12 w-12 sm:h-16 sm:w-16 text-blue-400 dark:text-blue-300" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <Badge className={`${statusConfig[project.status].color} border text-xs`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[project.status].label}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{project.site_address || project.location}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(project.start_date).toLocaleDateString()}
                        </div>
                        <div className="text-blue-600 dark:text-blue-400 font-medium">
                          {project.project_images?.length || 0} photos
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {!loading && projects.length === 0 && (
            <div className="text-center py-12">
              <Building className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">No projects to display at the moment.</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Check back soon for updates on our latest work!</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-400">OAW</h3>
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

      {/* Project Gallery Modal */}
      <Dialog open={!!selectedProject} onOpenChange={closeGallery}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          {selectedProject && (
            <>
              <DialogHeader className="p-4 sm:p-6 pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <DialogTitle className="text-xl sm:text-2xl truncate">{selectedProject.title}</DialogTitle>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 mt-2 text-sm">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{selectedProject.site_address || selectedProject.location}</span>
                      <Badge className={`ml-3 ${statusConfig[selectedProject.status].color} border text-xs flex-shrink-0`}>
                        {statusConfig[selectedProject.status].label}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeGallery}
                    className="h-8 w-8 p-0 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>
              
              <div className="relative">
                {selectedProject.project_images && selectedProject.project_images.length > 0 ? (
                  <>
                    <div className="relative h-64 sm:h-96 bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={selectedProject.project_images[currentImageIndex]}
                        alt={`${selectedProject.title} - Image ${currentImageIndex + 1}`}
                        fill
                        className="object-contain"
                      />
                      
                      {selectedProject.project_images.length > 1 && (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 p-0 rounded-full"
                            onClick={prevImage}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 p-0 rounded-full"
                            onClick={nextImage}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                    
                    {selectedProject.project_images.length > 1 && (
                      <div className="flex justify-center space-x-2 p-4 bg-gray-50 dark:bg-gray-800">
                        {selectedProject.project_images.map((_, index) => (
                          <button
                            key={index}
                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                              index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                            onClick={() => setCurrentImageIndex(index)}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-64 sm:h-96 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <Building className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                      <p className="text-sm sm:text-base">No images available for this project</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 sm:p-6 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Client:</span>
                    <p className="text-gray-600 dark:text-gray-400">{selectedProject.customer_name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Start Date:</span>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(selectedProject.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  {selectedProject.end_date && (
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">End Date:</span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {new Date(selectedProject.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                    <p className="text-gray-600 dark:text-gray-400">{statusConfig[selectedProject.status].label}</p>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Description:</span>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base leading-relaxed">{selectedProject.description}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

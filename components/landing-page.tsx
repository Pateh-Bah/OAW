'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Building2, 
  DoorOpen, 
  ChefHat, 
  Hammer, 
  Shield, 
  Phone, 
  Mail, 
  MapPin,
  ArrowRight,
  Star,
  Users,
  Calendar,
  CheckCircle
} from 'lucide-react'

// Mock data for projects
const projectsData = [
  {
    id: 1,
    title: "Modern Kitchen Cabinets",
    location: "Freetown Central",
    image: "/api/placeholder/400/300",
    status: "completed" as const,
    category: "Kitchen Cabinets"
  },
  {
    id: 2,
    title: "Aluminium Windows Installation",
    location: "Hill Station",
    image: "/api/placeholder/400/300",
    status: "in_progress" as const,
    category: "Windows"
  },
  {
    id: 3,
    title: "Office Door Systems",
    location: "Downtown Business District",
    image: "/api/placeholder/400/300",
    status: "completed" as const,
    category: "Doors"
  },
  {
    id: 4,
    title: "Residential Aluminium Wall",
    location: "East End",
    image: "/api/placeholder/400/300",
    status: "in_progress" as const,
    category: "Walls"
  },
  {
    id: 5,
    title: "Custom Furniture Set",
    location: "West End",
    image: "/api/placeholder/400/300",
    status: "completed" as const,
    category: "Furniture"
  },
  {
    id: 6,
    title: "Commercial Window Project",
    location: "Central Business Area",
    image: "/api/placeholder/400/300",
    status: "in_progress" as const,
    category: "Windows"
  }
]

const services = [
  {
    icon: DoorOpen,
    title: "Windows & Doors",
    description: "High-quality aluminium windows and doors for residential and commercial properties."
  },
  {
    icon: ChefHat,
    title: "Kitchen Cabinets",
    description: "Custom-designed kitchen cabinets that combine functionality with modern aesthetics."
  },
  {
    icon: Building2,
    title: "Aluminium Walls",
    description: "Durable and stylish aluminium wall systems for contemporary architecture."
  },
  {
    icon: Hammer,
    title: "Custom Furniture",
    description: "Bespoke tables, chairs, and furniture pieces crafted to your specifications."
  }
]

const stats = [
  { value: "500+", label: "Projects Completed" },
  { value: "10+", label: "Years Experience" },
  { value: "100+", label: "Happy Customers" },
  { value: "24/7", label: "Customer Support" }
]

export default function LandingPage() {
  const [filter, setFilter] = useState<'all' | 'completed' | 'in_progress'>('all')
  const [filteredProjects, setFilteredProjects] = useState(projectsData)

  useEffect(() => {
    if (filter === 'all') {
      setFilteredProjects(projectsData)
    } else {
      setFilteredProjects(projectsData.filter(project => project.status === filter))
    }
  }, [filter])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Overhead Aluminium Workshop</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#home" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="#services" className="text-sm font-medium hover:text-primary transition-colors">
                Services
              </Link>
              <Link href="#projects" className="text-sm font-medium hover:text-primary transition-colors">
                Projects
              </Link>
              <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">
                About
              </Link>
              <Link href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Staff Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Premium <span className="text-primary">Aluminium</span> Solutions
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Transform your space with our expertly crafted aluminium windows, doors, kitchen cabinets, 
                  and custom furniture. Quality craftsmanship meets modern design.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8">
                  Get Quote Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8">
                  View Projects
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                <Building2 className="h-32 w-32 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We specialize in high-quality aluminium products and custom solutions for residential and commercial needs.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <service.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Gallery Section */}
      <section id="projects" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Our Projects</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our portfolio of completed and ongoing projects across Freetown.
            </p>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex justify-center space-x-4 mb-12">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All Projects
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilter('completed')}
            >
              Completed
            </Button>
            <Button
              variant={filter === 'in_progress' ? 'default' : 'outline'}
              onClick={() => setFilter('in_progress')}
            >
              In Progress
            </Button>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Building2 className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {project.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{project.location}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{project.category}</span>
                    {project.status === 'completed' && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">About Overhead Aluminium Workshop</h2>
              <p className="text-lg text-muted-foreground">
                With over a decade of experience in the aluminium industry, we pride ourselves on delivering 
                exceptional quality and craftsmanship. Our team of skilled professionals is dedicated to 
                bringing your vision to life with precision and attention to detail.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="text-lg">Quality Guaranteed Work</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-primary" />
                  <span className="text-lg">Experienced Team</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-6 w-6 text-primary" />
                  <span className="text-lg">Timely Project Completion</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="h-6 w-6 text-primary" />
                  <span className="text-lg">Customer Satisfaction Focus</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                <Hammer className="h-32 w-32 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Get In Touch</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ready to start your project? Contact us today for a free consultation and quote.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Call Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">+232-77-902-889</p>
                <p className="text-lg font-medium">+232-31-902-889</p>
                <p className="text-muted-foreground mt-2">Mon - Fri: 8AM - 6PM</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Email Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">overheadaluminium@gmail.com</p>
                <p className="text-muted-foreground mt-2">We'll respond within 24 hours</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Visit Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">8 Hill Cot Road</p>
                <p className="text-lg font-medium">Freetown, Sierra Leone</p>
                <p className="text-muted-foreground mt-2">Open Monday - Saturday</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8" />
                <span className="text-xl font-bold">Overhead Aluminium</span>
              </div>
              <p className="text-primary-foreground/80">
                Your trusted partner for premium aluminium solutions in Sierra Leone.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Services</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>Windows & Doors</li>
                <li>Kitchen Cabinets</li>
                <li>Aluminium Walls</li>
                <li>Custom Furniture</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><Link href="#about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#projects" className="hover:text-white transition-colors">Our Projects</Link></li>
                <li><Link href="#contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/auth/login" className="hover:text-white transition-colors">Staff Portal</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Contact Info</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>8 Hill Cot Road, Freetown</li>
                <li>+232-77-902-889</li>
                <li>overheadaluminium@gmail.com</li>
                <li>www.overheadaluminium.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/80">
            <p>&copy; 2025 Overhead Aluminium Workshop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

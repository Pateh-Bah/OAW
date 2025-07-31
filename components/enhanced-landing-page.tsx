'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  Users, 
  Star, 
  ChevronRight, 
  Phone, 
  Mail, 
  MapPin,
  Wrench,
  Shield,
  Clock,
  Award,
  ExternalLink,
  Calendar,
  Camera
} from "lucide-react"
import Link from "next/link"

export function LandingPage() {
  // Sample project data - in a real app, this would come from your database
  const projectsShowcase = [
    {
      id: 1,
      title: "Residential Complex - East End",
      location: "15 Wilkinson Road, Freetown",
      description: "Complete aluminum windows and doors installation for 20-unit residential complex",
      date: "December 2024",
      category: "Residential"
    },
    {
      id: 2,
      title: "Modern Office Building",
      location: "23 Siaka Stevens Street, Freetown",
      description: "Custom aluminum wall frames and modern kitchen cabinets for corporate headquarters",
      date: "November 2024",
      category: "Commercial"
    },
    {
      id: 3,
      title: "Luxury Villa Project",
      location: "8 Hill Station Road, Freetown",
      description: "Premium aluminum windows, doors, and imported furniture installation",
      date: "October 2024",
      category: "Luxury"
    },
    {
      id: 4,
      title: "Shopping Center Renovation",
      location: "45 Kissy Street, Freetown",
      description: "Large-scale aluminum storefront installation and kitchen cabinet setup",
      date: "September 2024",
      category: "Commercial"
    },
    {
      id: 5,
      title: "School Campus Upgrade",
      location: "12 Circular Road, Freetown",
      description: "Aluminum window replacement and classroom furniture installation",
      date: "August 2024",
      category: "Educational"
    },
    {
      id: 6,
      title: "Hotel Chain Project",
      location: "7 Aberdeen Road, Freetown",
      description: "Complete aluminum solutions for hotel rooms and common areas",
      date: "July 2024",
      category: "Hospitality"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div className="flex flex-col">
              <span className="text-xl font-bold">Overhead Aluminium Workshop</span>
              <span className="text-xs text-slate-500">Since 2020</span>
            </div>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link href="#services" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
              Services
            </Link>
            <Link href="#projects" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
              Projects
            </Link>
            <Link href="#about" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
              About
            </Link>
            <Link href="#contact" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
              Contact
            </Link>
          </nav>
          <Button asChild className="btn-hover-lift">
            <Link href="/auth/login">
              Login <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4" variant="secondary">
            Premier Aluminum Solutions Since 2020
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Overhead Aluminium Workshop
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-4 max-w-2xl mx-auto">
            Premier aluminum construction and fabrication company delivering durable, modern, and elegant aluminum projects for residential and commercial buildings.
          </p>
          <p className="text-lg text-slate-500 dark:text-slate-500 mb-8">
            Located at 5c Hill Cot Road, Freetown, Sierra Leone
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-hover-lift gradient-primary">
              <Building2 className="mr-2 h-5 w-5" />
              View Our Projects
            </Button>
            <Button variant="outline" size="lg" className="btn-hover-lift">
              <Phone className="mr-2 h-5 w-5" />
              Get Quote
            </Button>
          </div>
          <div className="mt-8 flex justify-center">
            <a 
              href="https://www.overheadaluminium.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              Visit our website <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Specialized Services</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            We combine local craftsmanship with cutting-edge technology to meet construction needs efficiently and professionally
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Aluminum Windows & Doors",
              description: "Custom-designed windows and doors for modern residential and commercial buildings",
              icon: Building2,
              features: ["Custom designs", "Energy efficient", "Weather resistant"]
            },
            {
              title: "Kitchen Cabinets",
              description: "Durable and elegant aluminum kitchen solutions with modern finishes",
              icon: Wrench,
              features: ["Modern designs", "Durable materials", "Custom sizes"]
            },
            {
              title: "Imported Aluminum Chairs",
              description: "High-quality imported aluminum furniture for offices and homes",
              icon: Users,
              features: ["Premium quality", "Ergonomic design", "Various styles"]
            },
            {
              title: "Aluminum Wall Frames",
              description: "Structural aluminum building wall frames for construction projects",
              icon: Shield,
              features: ["Strong structure", "Lightweight", "Corrosion resistant"]
            },
            {
              title: "Assembly Services",
              description: "Professional assembly of chairs, aluminum products, and cupboards",
              icon: Award,
              features: ["Expert installation", "Quality assurance", "Timely delivery"]
            },
            {
              title: "Custom Constructions",
              description: "Other custom aluminum constructions tailored to your specific needs",
              icon: Star,
              features: ["Bespoke solutions", "Professional consultation", "Quality craftsmanship"]
            }
          ].map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <service.icon className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-lg">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{service.description}</CardDescription>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Projects Showcase Section */}
      <section id="projects" className="bg-slate-50 dark:bg-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Recent Projects</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Take a look at some of our completed aluminum construction projects across Freetown
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectsShowcase.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="h-16 w-16 text-slate-400" />
                  </div>
                  <Badge className="absolute top-3 left-3" variant="secondary">
                    {project.category}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="h-4 w-4 mr-1" />
                    {project.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3">{project.description}</CardDescription>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-slate-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {project.date}
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="btn-hover-lift">
              View All Projects
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-4xl font-bold mb-2">5+</div>
              <div className="text-blue-100">Years of Excellence</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="text-blue-100">Projects Completed</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold mb-2">150+</div>
              <div className="text-blue-100">Happy Clients</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4" variant="outline">About Our Company</Badge>
            <h2 className="text-3xl font-bold mb-6">Overhead Aluminium Workshop</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Founded in 2020, Overhead Aluminium Workshop is a premier aluminum construction and fabrication company 
              located at 5c Hill Cot Road, Freetown, Sierra Leone. Our team of skilled technicians and designers 
              deliver durable, modern, and elegant aluminum projects for residential and commercial buildings.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              We use a combination of local craftsmanship and cutting-edge technology to meet construction needs 
              efficiently and professionally. Our commitment to quality and customer satisfaction has made us 
              a trusted name in Sierra Leone's construction industry.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { icon: Clock, text: "Quick Delivery", desc: "On-time project completion" },
                { icon: Shield, text: "Quality Assured", desc: "Premium materials used" },
                { icon: Award, text: "Expert Team", desc: "Skilled professionals" },
                { icon: Star, text: "Customer Focused", desc: "100% satisfaction guarantee" }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <item.icon className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <div className="font-medium text-sm">{item.text}</div>
                    <div className="text-xs text-slate-500">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl flex items-center justify-center glass">
              <Building2 className="h-32 w-32 text-blue-600" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
              <div className="text-2xl font-bold text-blue-600">2020</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Founded</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-slate-50 dark:bg-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Ready to start your aluminum project? Contact us today for a free consultation!
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Phone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle>Call Us</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <p>+232-77-902-889</p>
                  <p>+232-74-74-902-889</p>
                  <p>+232-31-74-902-889</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle>Email Us</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  overheadaluminium@gmail.com
                </p>
                <Button variant="ghost" size="sm" className="mt-2">
                  Send Email
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle>Visit Us</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  5c Hill Cot Road<br />
                  Freetown, Sierra Leone
                </p>
                <Button variant="ghost" size="sm">
                  Get Directions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="h-6 w-6" />
                <span className="font-semibold text-white">Overhead Aluminium Workshop</span>
              </div>
              <p className="text-sm mb-4">
                Premier aluminum construction and fabrication company delivering quality solutions since 2020.
              </p>
              <p className="text-xs">
                5c Hill Cot Road, Freetown, Sierra Leone
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Services</h4>
              <ul className="text-sm space-y-1">
                <li>Aluminum Windows & Doors</li>
                <li>Kitchen Cabinets</li>
                <li>Imported Furniture</li>
                <li>Wall Frames</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Contact</h4>
              <ul className="text-sm space-y-1">
                <li>+232-77-902-889</li>
                <li>overheadaluminium@gmail.com</li>
                <li>www.overheadaluminium.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm mb-4 md:mb-0">
              © 2025 Overhead Aluminium Workshop. All rights reserved.
            </div>
            <div className="text-sm">
              Built with ❤️ using Next.js & Supabase
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

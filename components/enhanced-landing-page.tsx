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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-oaw-blue" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-oaw-text">Overhead Aluminium Workshop</span>
              <span className="text-xs text-oaw-text-light">Since 2020</span>
            </div>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link href="#services" className="nav-link hover:text-oaw-blue transition-colors font-medium">
              Services
            </Link>
            <Link href="#projects" className="nav-link hover:text-oaw-blue transition-colors font-medium">
              Projects
            </Link>
            <Link href="#about" className="nav-link hover:text-oaw-blue transition-colors font-medium">
              About
            </Link>
            <Link href="#contact" className="nav-link hover:text-oaw-blue transition-colors font-medium">
              Contact
            </Link>
          </nav>
          <Button asChild className="btn-primary btn-hover-lift">
            <Link href="/auth/login">
              Login <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-oaw-blue via-blue-600 to-oaw-blue-hover bg-clip-text text-transparent">
            Overhead Aluminium Workshop
          </h1>
          <p className="text-xl text-oaw-text-light mb-4 max-w-2xl mx-auto font-medium leading-relaxed">
            Premier aluminum construction and fabrication company delivering durable, modern, and elegant aluminum projects for residential and commercial buildings.
          </p>
          <p className="text-lg text-oaw-text-muted mb-8 font-medium">
            Located at 5c Hill Cot Road, Freetown, Sierra Leone
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-primary btn-hover-lift shadow-lg">
              <Building2 className="mr-2 h-5 w-5" />
              View Our Projects
            </Button>
            <Button variant="outline" size="lg" className="btn-secondary btn-hover-lift border-2">
              <Phone className="mr-2 h-5 w-5" />
              Get Quote
            </Button>
          </div>
          
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-oaw-text">Our Specialized Services</h2>
          <p className="text-oaw-text-light max-w-2xl mx-auto font-medium leading-relaxed">
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
            <Card key={index} className="card-enhanced hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <service.icon className="h-12 w-12 text-oaw-blue mb-4" />
                <CardTitle className="text-lg text-oaw-text font-semibold">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 text-oaw-text-light">{service.description}</CardDescription>
                <ul className="text-sm text-oaw-text-light space-y-1">
                  {service.features.map((feature, idx) => (
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

      {/* Projects Showcase Section */}
      <section id="projects" className="bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-950/10 dark:to-slate-800 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-oaw-text">Our Recent Projects</h2>
            <p className="text-oaw-text-light max-w-2xl mx-auto font-medium leading-relaxed">
              Take a look at some of our completed aluminum construction projects across Freetown
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectsShowcase.map((project) => (
              <Card key={project.id} className="card-enhanced overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-3">
                <div className="relative h-48 bg-gradient-to-br from-oaw-blue-light via-blue-100/50 to-oaw-blue-light dark:from-slate-700 dark:to-slate-800">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="h-16 w-16 text-oaw-blue opacity-60" />
                  </div>
                  <Badge className="badge-enhanced badge-blue absolute top-3 left-3">
                    {project.category}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg text-oaw-text font-semibold">{project.title}</CardTitle>
                  <div className="flex items-center text-sm text-oaw-text-light">
                    <MapPin className="h-4 w-4 mr-1 text-oaw-blue" />
                    {project.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3 text-oaw-text-light">{project.description}</CardDescription>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-oaw-text-muted">
                      <Calendar className="h-4 w-4 mr-1 text-oaw-blue" />
                      {project.date}
                    </div>
                    <Button variant="ghost" size="sm" className="text-oaw-blue hover:bg-oaw-blue-light font-medium">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="btn-secondary btn-hover-lift border-2">
              View All Projects
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-oaw-blue via-blue-600 to-oaw-blue text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold mb-2 text-white">5+</div>
              <div className="text-blue-100 font-medium">Years of Excellence</div>
            </div>
            <div className="animate-fade-in hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold mb-2 text-white">200+</div>
              <div className="text-blue-100 font-medium">Projects Completed</div>
            </div>
            <div className="animate-fade-in hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold mb-2 text-white">150+</div>
              <div className="text-blue-100 font-medium">Happy Clients</div>
            </div>
            <div className="animate-fade-in hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold mb-2 text-white">24/7</div>
              <div className="text-blue-100 font-medium">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4 badge-enhanced border-oaw-blue/20 text-oaw-blue" variant="outline">About Our Company</Badge>
            <h2 className="text-3xl font-bold mb-6 text-oaw-text">Overhead Aluminium Workshop</h2>
            <p className="text-oaw-text-light mb-6 leading-relaxed">
              Founded in 2020, Overhead Aluminium Workshop is a premier aluminum construction and fabrication company 
              located at 5c Hill Cot Road, Freetown, Sierra Leone. Our team of skilled technicians and designers 
              deliver durable, modern, and elegant aluminum projects for residential and commercial buildings.
            </p>
            <p className="text-oaw-text-light mb-6 leading-relaxed">
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
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 card-enhanced hover:shadow-md transition-all duration-200">
                  <item.icon className="h-5 w-5 text-oaw-blue mt-1" />
                  <div>
                    <div className="font-medium text-sm text-oaw-text">{item.text}</div>
                    <div className="text-xs text-oaw-text-light">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
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

      {/* Contact Section */}
      <section id="contact" className="bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-950/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-oaw-text">Get In Touch</h2>
            <p className="text-oaw-text-light">
              Ready to start your aluminum project? Contact us today for a free consultation!
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="card-enhanced hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="h-12 w-12 bg-oaw-blue rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-oaw-text">Call Us</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-1 text-sm text-oaw-text-light">
                  <p>+232-77-902-889</p>
                  <p>+232-74-74-902-889</p>
                  <p>+232-31-74-902-889</p>
                </div>
              </CardContent>
            </Card>
            <Card className="card-enhanced hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="h-12 w-12 bg-oaw-success rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-oaw-text">Email Us</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-oaw-text-light mb-4">
                  overheadaluminiumworkshop@gmail.com
                </p>
                <Button variant="ghost" size="sm" className="text-oaw-blue hover:bg-oaw-blue/10">
                  Send Email
                </Button>
              </CardContent>
            </Card>
            <Card className="card-enhanced hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="h-12 w-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-oaw-text">Visit Us</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-oaw-text-light mb-2">
                  5c Hill Cot Road<br />
                  Freetown, Sierra Leone
                </p>
                <Button variant="ghost" size="sm" className="text-oaw-blue hover:bg-oaw-blue/10">
                  Get Directions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-oaw-blue rounded-lg flex items-center justify-center shadow-sm">
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-white">Overhead Aluminium Workshop</span>
              </div>
              <p className="text-sm mb-4 text-slate-300">
                Premier aluminum construction and fabrication company delivering quality solutions since 2020.
              </p>
              <p className="text-xs text-slate-400">
                5c Hill Cot Road, Freetown, Sierra Leone
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Services</h4>
              <ul className="text-sm space-y-2 text-slate-300">
                <li className="hover:text-white transition-colors cursor-pointer">Aluminum Windows & Doors</li>
                <li className="hover:text-white transition-colors cursor-pointer">Kitchen Cabinets</li>
                <li className="hover:text-white transition-colors cursor-pointer">Imported Furniture</li>
                <li className="hover:text-white transition-colors cursor-pointer">Wall Frames</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Contact</h4>
              <ul className="text-sm space-y-2 text-slate-300">
                <li className="hover:text-white transition-colors">+232-77-902-889</li>
                <li className="hover:text-white transition-colors">overheadaluminiumworkshop@gmail.com</li>
                <li className="hover:text-white transition-colors">www.overheadaluminium.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm mb-4 md:mb-0 text-slate-300">
             <center>© 2025 Overhead Aluminium Workshop. All rights reserved.</center> 
            </div>
            
          </div>
        </div>
      </footer>
    </div>
  )
}

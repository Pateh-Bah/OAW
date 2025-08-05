'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'
import { Building2, Wrench, Users, Shield, Award, Star, Phone, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function ServicesPage() {
  const services = [
    {
      title: "Aluminum Windows & Doors",
      description: "Custom-designed windows and doors for modern residential and commercial buildings",
      icon: Building2,
      features: ["Custom designs", "Energy efficient", "Weather resistant"],
      details: "Our aluminum windows and doors are designed to meet the specific needs of Sierra Leone's climate. We use high-quality materials and modern techniques to ensure durability, energy efficiency, and aesthetic appeal."
    },
    {
      title: "Kitchen Cabinets",
      description: "Durable and elegant aluminum kitchen solutions with modern finishes",
      icon: Wrench,
      features: ["Modern designs", "Durable materials", "Custom sizes"],
      details: "Transform your kitchen with our premium aluminum cabinets. We offer a wide range of designs and finishes to match your style preferences while ensuring long-lasting durability and easy maintenance."
    },
    {
      title: "Imported Aluminum Chairs",
      description: "High-quality imported aluminum furniture for offices and homes",
      icon: Users,
      features: ["Premium quality", "Ergonomic design", "Various styles"],
      details: "Our collection of imported aluminum chairs combines comfort with durability. Perfect for offices, outdoor spaces, and modern homes, these chairs are built to last and maintain their appearance over time."
    },
    {
      title: "Aluminum Wall Frames",
      description: "Structural aluminum building wall frames for construction projects",
      icon: Shield,
      features: ["Strong structure", "Lightweight", "Corrosion resistant"],
      details: "Provide your construction project with reliable structural support using our aluminum wall frames. These lightweight yet strong frames offer excellent corrosion resistance and are ideal for modern building construction."
    },
    {
      title: "Assembly Services",
      description: "Professional assembly of chairs, aluminum products, and cupboards",
      icon: Award,
      features: ["Expert installation", "Quality assurance", "Timely delivery"],
      details: "Our skilled technicians provide professional assembly services for all aluminum products. We ensure proper installation, quality workmanship, and timely completion of your project."
    },
    {
      title: "Custom Constructions",
      description: "Other custom aluminum constructions tailored to your specific needs",
      icon: Star,
      features: ["Bespoke solutions", "Professional consultation", "Quality craftsmanship"],
      details: "Have a unique project in mind? Our team specializes in custom aluminum constructions. From initial consultation to final delivery, we work closely with you to bring your vision to reality."
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50 py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 badge-enhanced border-oaw-blue/20 text-oaw-blue" variant="outline">
            Our Specialized Services
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-oaw-text">
            Premium Aluminum Solutions
          </h1>
          <p className="text-xl text-oaw-text-light max-w-3xl mx-auto">
            We combine local craftsmanship with cutting-edge technology to meet construction needs efficiently and professionally
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="card-enhanced hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <service.icon className="h-12 w-12 text-oaw-blue mb-4" />
                <CardTitle className="text-lg text-oaw-text font-semibold">{service.title}</CardTitle>
                <CardDescription className="text-oaw-text-light">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-oaw-text-light mb-4 leading-relaxed">{service.details}</p>
                <ul className="text-sm text-oaw-text-light space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <Star className="h-3 w-3 text-oaw-warning mr-2 flex-shrink-0" />
                      <span className="text-oaw-text">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-950/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-oaw-text">Our Process</h2>
            <p className="text-oaw-text-light max-w-2xl mx-auto">
              From initial consultation to final delivery, we ensure quality and satisfaction at every step
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Consultation",
                description: "We discuss your needs and provide expert recommendations"
              },
              {
                step: "02", 
                title: "Design & Quote",
                description: "Custom design creation with detailed pricing and timeline"
              },
              {
                step: "03",
                title: "Fabrication",
                description: "Precision manufacturing using quality materials and modern equipment"
              },
              {
                step: "04",
                title: "Installation",
                description: "Professional installation and quality assurance check"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-oaw-blue text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-oaw-text mb-2">{item.title}</h3>
                <p className="text-sm text-oaw-text-light">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-oaw-text">Quality You Can Trust</h2>
            <p className="text-oaw-text-light mb-6 leading-relaxed">
              At Overhead Aluminium Workshop, quality is not just a promise—it&apos;s our commitment. 
              We use only premium materials sourced from trusted suppliers and employ skilled 
              craftsmen who take pride in their work.
            </p>
            <div className="space-y-4">
              {[
                "Premium aluminum materials with corrosion resistance",
                "Skilled craftsmen with years of experience",
                "Modern equipment for precision manufacturing",
                "Quality control at every stage of production",
                "Customer satisfaction guarantee"
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <Star className="h-5 w-5 text-oaw-warning mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-oaw-text-light">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50 rounded-2xl flex items-center justify-center card-enhanced shadow-lg">
              <Shield className="h-32 w-32 text-oaw-blue" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl card-enhanced">
              <div className="text-2xl font-bold text-oaw-success">100%</div>
              <div className="text-sm text-oaw-text-light">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-oaw-blue py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Contact us today for a free consultation and quote. Let&apos;s discuss how we can bring your aluminum project to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="lg">
              <Link href="/contact">Get Free Quote</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-oaw-blue">
              <Link href="tel:+23277902889">Call Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="container mx-auto px-4 py-16">
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
              <p className="text-sm text-oaw-text-light">
                overheadaluminiumworkshop@gmail.com
              </p>
              <Button asChild variant="ghost" size="sm" className="mt-2 text-oaw-blue hover:bg-oaw-blue/10">
                <Link href="mailto:overheadaluminiumworkshop@gmail.com">Send Email</Link>
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
              <Button asChild variant="ghost" size="sm" className="text-oaw-blue hover:bg-oaw-blue/10">
                <Link href="/contact">Get Directions</Link>
              </Button>
            </CardContent>
          </Card>
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

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  CheckCircle,
  ArrowRight,
  Hand,
  Eye,
  Zap
} from "lucide-react"

export function MobileGuide() {
  const features = [
    {
      icon: <Hand className="h-5 w-5" />,
      title: "Touch-Friendly Interface",
      description: "44px minimum touch targets optimized for Galaxy S24 Ultra and similar devices",
      color: "bg-blue-500"
    },
    {
      icon: <Eye className="h-5 w-5" />,
      title: "High-DPI Display Support",
      description: "Optimized fonts and spacing for high-resolution mobile displays",
      color: "bg-green-500"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Mobile-First Design",
      description: "Responsive breakpoints ensure perfect scaling from mobile to desktop",
      color: "bg-purple-500"
    }
  ]

  const deviceBreakpoints = [
    { device: "Galaxy S24 Ultra", width: "480px", icon: <Smartphone className="h-4 w-4" /> },
    { device: "iPhone 15 Pro", width: "393px", icon: <Smartphone className="h-4 w-4" /> },
    { device: "iPad", width: "768px", icon: <Tablet className="h-4 w-4" /> },
    { device: "Desktop", width: "1024px+", icon: <Monitor className="h-4 w-4" /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="mb-4">
            📱 Mobile Optimization Complete
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Galaxy S24 Ultra Ready
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your OAW dashboard is now fully optimized for mobile devices, especially high-end smartphones like the Galaxy S24 Ultra.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${feature.color} text-white mb-3`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Device Compatibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Device Compatibility
            </CardTitle>
            <CardDescription>
              Tested and optimized for the following devices and screen sizes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {deviceBreakpoints.map((device, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-blue-600">
                    {device.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{device.device}</p>
                    <p className="text-xs text-muted-foreground">{device.width}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mobile Features Showcase */}
        <Card>
          <CardHeader>
            <CardTitle>Mobile-Optimized Features</CardTitle>
            <CardDescription>
              Experience the dashboard optimized for touch interaction and mobile workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">Collapsible sidebar with touch-friendly navigation</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">Responsive cards that stack beautifully on mobile</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">Large touch targets (44px minimum) for easy interaction</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">Optimized font sizes for high-DPI displays</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">Mobile-first responsive breakpoints</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">Enhanced mobile forms with proper input types</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="h-12 px-8">
            <a href="/dashboard">
              View Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" size="lg" className="h-12 px-8">
            Test on Mobile Device
          </Button>
        </div>

        {/* Instructions */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
              <p><strong>1. Mobile Testing:</strong> Open the dashboard on your Galaxy S24 Ultra or similar device</p>
              <p><strong>2. Touch Interaction:</strong> Test the collapsible sidebar and touch-friendly buttons</p>
              <p><strong>3. Responsiveness:</strong> Rotate your device to test landscape and portrait modes</p>
              <p><strong>4. Browser DevTools:</strong> Use Chrome DevTools to simulate different device sizes</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

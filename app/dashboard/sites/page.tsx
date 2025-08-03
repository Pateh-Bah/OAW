"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { 
  Building, 
  Plus, 
  Search, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle,
  Edit, 
  Trash2,
  Eye,
  Filter
} from "lucide-react"

interface Site {
  id: string
  name: string
  address?: string
  description?: string
  status: string
  budget?: number
  start_date: string
  end_date?: string
  customer_id: string
  created_at: string
  customer?: {
    full_name: string
    company_name?: string
  }
}

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isAddingSite, setIsAddingSite] = useState(false)

  useEffect(() => {
    fetchSites()
  }, [])

  const fetchSites = async () => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select(`
          *,
          customer:customers(full_name, company_name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSites(data || [])
    } catch (error) {
      console.error('Error fetching sites:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSites = sites.filter(site => {
    const matchesSearch = (site.name && site.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (site.address && site.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (site.customer?.full_name && site.customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = filterStatus === "all" || site.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'badge-enhanced bg-oaw-success/10 text-oaw-success border-oaw-success/20'
      case 'In Progress': return 'badge-enhanced bg-oaw-blue/10 text-oaw-blue border-oaw-blue/20'
      case 'Planning': return 'badge-enhanced bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
      case 'On Hold': return 'badge-enhanced bg-gray-500/10 text-oaw-text-light border-gray-500/20'
      default: return 'badge-enhanced bg-gray-500/10 text-oaw-text-light border-gray-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="h-4 w-4" />
      case 'In Progress': return <Clock className="h-4 w-4" />
      case 'Planning': return <Building className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SL', {
      style: 'currency',
      currency: 'SLE',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-oaw-text">Site Management</h1>
          <p className="text-oaw-text-light">
            Manage construction sites and project locations
          </p>
        </div>
        
        <Dialog open={isAddingSite} onOpenChange={setIsAddingSite}>
          <DialogTrigger asChild>
            <Button className="gap-2 btn-primary">
              <Plus className="h-4 w-4" />
              Add Site
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Site</DialogTitle>
              <DialogDescription>
                Add a new construction site or project location.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="siteName" className="text-oaw-text font-medium">Site Name</Label>
                <Input id="siteName" placeholder="Enter site name" className="input-enhanced" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteAddress" className="text-oaw-text font-medium">Address</Label>
                <Input id="siteAddress" placeholder="Enter site address" className="input-enhanced" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription" className="text-oaw-text font-medium">Description</Label>
                <Input id="siteDescription" placeholder="Enter site description" className="input-enhanced" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteBudget" className="text-oaw-text font-medium">Budget (SLE)</Label>
                <Input id="siteBudget" type="number" placeholder="Enter budget amount" className="input-enhanced" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteStatus" className="text-oaw-text font-medium">Status</Label>
                <Select>
                  <SelectTrigger className="input-enhanced">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-oaw-text font-medium">Start Date</Label>
                <Input id="startDate" type="date" className="input-enhanced" />
              </div>
              <Button className="w-full btn-primary">Add Site</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-oaw-text-light" />
          <Input
            placeholder="Search sites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 input-enhanced"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px] input-enhanced">
            <Filter className="h-4 w-4 mr-2 text-oaw-text-light" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Planning">Planning</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="On Hold">On Hold</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="card-enhanced bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-oaw-text-light">Total Sites</CardTitle>
            <Building className="h-4 w-4 text-oaw-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-oaw-text">{sites.length}</div>
            <p className="text-xs text-oaw-text-light">All sites</p>
          </CardContent>
        </Card>

        <Card className="card-enhanced bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-oaw-text-light">Active Sites</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-oaw-text">
              {sites.filter(s => s.status === 'In Progress').length}
            </div>
            <p className="text-xs text-oaw-text-light">Currently working</p>
          </CardContent>
        </Card>

        <Card className="card-enhanced bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-oaw-text-light">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-oaw-text">
              {sites.filter(s => s.status === 'Completed').length}
            </div>
            <p className="text-xs text-oaw-text-light">Finished sites</p>
          </CardContent>
        </Card>

        <Card className="card-enhanced bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-oaw-text-light">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-oaw-text">
              {formatCurrency(sites.reduce((sum, s) => sum + (s.budget || 0), 0))}
            </div>
            <p className="text-xs text-oaw-text-light">Combined value</p>
          </CardContent>
        </Card>
      </div>

      {/* Sites List */}
      <Card className="card-enhanced bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-oaw-text">Sites</CardTitle>
          <CardDescription className="text-oaw-text-light">
            View and manage all construction sites
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-oaw-text-light">Loading sites...</div>
            </div>
          ) : filteredSites.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-oaw-text-light mx-auto mb-4" />
              <h3 className="text-lg font-medium text-oaw-text mb-2">No sites found</h3>
              <p className="text-oaw-text-light mb-4">
                {searchTerm || filterStatus !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by adding your first site"
                }
              </p>
              {!searchTerm && filterStatus === "all" && (
                <Button onClick={() => setIsAddingSite(true)} className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Site
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSites.map((site) => (
                <div key={site.id} className="flex items-center justify-between p-6 card-enhanced hover-lift transition-all duration-300">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 rounded-lg bg-gradient-oaw-primary flex items-center justify-center text-white font-medium">
                      <Building className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-oaw-text">{site.name}</h3>
                        <Badge className={getStatusBadgeColor(site.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(site.status)}
                            {site.status}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-oaw-text-light mb-2">
                        {site.address && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {site.address}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(site.start_date).toLocaleDateString()}
                        </span>
                        {site.budget && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {formatCurrency(site.budget)}
                          </span>
                        )}
                      </div>
                      {site.customer && (
                        <p className="text-sm font-medium text-oaw-text">
                          Client: {site.customer.company_name || site.customer.full_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-oaw-text-light hover:text-oaw-blue hover:bg-oaw-blue/10">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-oaw-text-light hover:text-oaw-blue hover:bg-oaw-blue/10">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

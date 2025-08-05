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
  const [isEditingSite, setIsEditingSite] = useState(false)
  const [editingSiteId, setEditingSiteId] = useState<string | null>(null)
  const [customers, setCustomers] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    budget: "",
    status: "Planning",
    start_date: "",
    end_date: "",
    customer_id: ""
  })

  useEffect(() => {
    fetchSites()
    fetchCustomers()
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

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, full_name, company_name')
        .order('full_name', { ascending: true })

      if (error) throw error
      setCustomers(data || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Please enter a site name')
      }

      if (!formData.customer_id) {
        throw new Error('Please select a customer')
      }

      if (editingSiteId) {
        // Update existing site
        const { data, error } = await supabase
          .from('sites')
          .update({
            name: formData.name.trim(),
            address: formData.address.trim() || null,
            description: formData.description.trim() || null,
            budget: formData.budget ? parseFloat(formData.budget) : null,
            status: formData.status,
            start_date: formData.start_date || null,
            end_date: formData.end_date || null,
            customer_id: formData.customer_id
          })
          .eq('id', editingSiteId)
          .select()

        if (error) throw error
        console.log('✅ Site updated successfully:', data)
      } else {
        // Create new site
        const { data, error } = await supabase
          .from('sites')
          .insert([
            {
              name: formData.name.trim(),
              address: formData.address.trim() || null,
              description: formData.description.trim() || null,
              budget: formData.budget ? parseFloat(formData.budget) : null,
              status: formData.status,
              start_date: formData.start_date || null,
              end_date: formData.end_date || null,
              customer_id: formData.customer_id
            }
          ])
          .select()

        if (error) throw error
        console.log('✅ Site added successfully:', data)
      }

      // Reset form and close dialog
      setFormData({
        name: "",
        address: "",
        description: "",
        budget: "",
        status: "Planning",
        start_date: "",
        end_date: "",
        customer_id: ""
      })
      setIsAddingSite(false)
      setIsEditingSite(false)
      setEditingSiteId(null)
      
      // Refresh the sites list
      await fetchSites()
    } catch (error: any) {
      console.error('❌ Error saving site:', error)
      setSubmitError(error.message || 'Failed to save site')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSite = (site: Site) => {
    setFormData({
      name: site.name,
      address: site.address || "",
      description: site.description || "",
      budget: site.budget ? site.budget.toString() : "",
      status: site.status,
      start_date: site.start_date || "",
      end_date: site.end_date || "",
      customer_id: site.customer_id
    })
    setEditingSiteId(site.id)
    setIsEditingSite(true)
  }

  const handleCancelEdit = () => {
    setFormData({
      name: "",
      address: "",
      description: "",
      budget: "",
      status: "Planning",
      start_date: "",
      end_date: "",
      customer_id: ""
    })
    setEditingSiteId(null)
    setIsEditingSite(false)
    setIsAddingSite(false)
    setSubmitError(null)
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDeleteSite = async (siteId: string) => {
    if (!confirm('Are you sure you want to delete this site?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('sites')
        .delete()
        .eq('id', siteId)

      if (error) throw error

      // Refresh the sites list
      await fetchSites()
      console.log('✅ Site deleted successfully')
    } catch (error) {
      console.error('❌ Error deleting site:', error)
      alert('Failed to delete site')
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
        
        <Dialog open={isAddingSite || isEditingSite} onOpenChange={(open) => {
          if (!open) {
            handleCancelEdit()
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 btn-primary">
              <Plus className="h-4 w-4" />
              Add Site
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingSiteId ? 'Edit Site' : 'Add New Site'}
              </DialogTitle>
              <DialogDescription>
                {editingSiteId ? 'Update site information.' : 'Add a new construction site or project location.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4" autoComplete="off">
              {submitError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {submitError}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="siteName" className="text-oaw-text font-medium">Site Name *</Label>
                <Input 
                  id="siteName" 
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter site name" 
                  className="input-enhanced"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customer" className="text-oaw-text font-medium">Customer *</Label>
                <Select value={formData.customer_id} onValueChange={(value) => handleInputChange('customer_id', value)}>
                  <SelectTrigger className="input-enhanced">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.full_name} {customer.company_name && `(${customer.company_name})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteAddress" className="text-oaw-text font-medium">Address</Label>
                <Input 
                  id="siteAddress" 
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter site address" 
                  className="input-enhanced" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription" className="text-oaw-text font-medium">Description</Label>
                <Input 
                  id="siteDescription" 
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter site description" 
                  className="input-enhanced" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteBudget" className="text-oaw-text font-medium">Budget (SLE)</Label>
                <Input 
                  id="siteBudget" 
                  type="number" 
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="Enter budget amount" 
                  className="input-enhanced" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteStatus" className="text-oaw-text font-medium">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
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
                <Input 
                  id="startDate" 
                  type="date" 
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  className="input-enhanced" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-oaw-text font-medium">End Date</Label>
                <Input 
                  id="endDate" 
                  type="date" 
                  value={formData.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                  className="input-enhanced" 
                />
              </div>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary"
              >
                {isSubmitting 
                  ? (editingSiteId ? 'Updating Site...' : 'Adding Site...')
                  : (editingSiteId ? 'Update Site' : 'Add Site')
                }
              </Button>
            </form>
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
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditSite(site)}
                      className="h-8 w-8 text-oaw-text-light hover:text-oaw-blue hover:bg-oaw-blue/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteSite(site.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
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

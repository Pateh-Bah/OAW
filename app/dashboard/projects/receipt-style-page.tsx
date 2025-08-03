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
import { useStableModal } from "@/hooks/use-stable-modal"
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Edit, 
  Trash2,
  Eye,
  Filter,
  MapPin,
  User,
  Building,
  Minus,
  FileText,
  Printer
} from "lucide-react"

interface BudgetItem {
  id: string
  item_name: string
  quantity: number
  unit_price: number
  total_price: number
}

interface Project {
  id: string
  project_number: string
  name: string
  description: string
  status: string
  customer: {
    id: string
    full_name: string
    phone_number: string
    email: string
  }
  labor_cost: number
  manual_cost: number
  total_items_cost: number
  total_project_cost: number
  created_at: string
  start_date: string
  expected_completion_date: string
  site_address?: string
}

interface CustomerOption {
  id: string
  name: string
  phone: string
  email: string
}

export default function ReceiptStyleProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [customers, setCustomers] = useState<CustomerOption[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isAddingProject, setIsAddingProject] = useState(false)
  
  // Form state for new project with receipt-style structure
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    customer_id: "",
    site_address: "",
    start_date: "",
    expected_completion_date: "",
    labor_cost: 0,
    manual_cost: 0,
    notes: "",
    project_manager: ""
  })

  // Budget items state for dynamic table
  const [budgetItems, setBudgetItems] = useState<Omit<BudgetItem, 'id' | 'total_price'>[]>([
    { item_name: "", quantity: 1, unit_price: 0 }
  ])

  useStableModal()

  useEffect(() => {
    fetchProjects()
    fetchCustomers()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          customer:customers(id, full_name, phone_number, email)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, full_name, phone_number, email')
        .order('full_name')

      if (error) throw error
      
      const customerOptions = data?.map(customer => ({
        id: customer.id,
        name: customer.full_name,
        phone: customer.phone_number,
        email: customer.email
      })) || []
      
      setCustomers(customerOptions)
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const addBudgetItem = () => {
    setBudgetItems([...budgetItems, { item_name: "", quantity: 1, unit_price: 0 }])
  }

  const removeBudgetItem = (index: number) => {
    if (budgetItems.length > 1) {
      setBudgetItems(budgetItems.filter((_, i) => i !== index))
    }
  }

  const updateBudgetItem = (index: number, field: keyof Omit<BudgetItem, 'id' | 'total_price'>, value: string | number) => {
    const updatedItems = budgetItems.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    )
    setBudgetItems(updatedItems)
  }

  const calculateItemTotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice
  }

  const calculateTotalItemsCost = () => {
    return budgetItems.reduce((total, item) => total + calculateItemTotal(item.quantity, item.unit_price), 0)
  }

  const calculateTotalProjectCost = () => {
    return calculateTotalItemsCost() + formData.labor_cost + formData.manual_cost
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      customer_id: "",
      site_address: "",
      start_date: "",
      expected_completion_date: "",
      labor_cost: 0,
      manual_cost: 0,
      notes: "",
      project_manager: ""
    })
    setBudgetItems([{ item_name: "", quantity: 1, unit_price: 0 }])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Create project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert([{
          name: formData.name,
          description: formData.description,
          customer_id: formData.customer_id,
          start_date: formData.start_date || null,
          expected_completion_date: formData.expected_completion_date || null,
          labor_cost: formData.labor_cost,
          manual_cost: formData.manual_cost,
          notes: formData.notes,
          project_manager: formData.project_manager
        }])
        .select()
        .single()

      if (projectError) throw projectError

      // Create site
      if (formData.site_address) {
        const { error: siteError } = await supabase
          .from('sites')
          .insert([{
            project_id: projectData.id,
            site_address: formData.site_address
          }])

        if (siteError) throw siteError
      }

      // Create budget
      const { data: budgetData, error: budgetError } = await supabase
        .from('budgets')
        .insert([{
          project_id: projectData.id,
          budget_name: `${formData.name} Budget`
        }])
        .select()
        .single()

      if (budgetError) throw budgetError

      // Create budget items
      const validBudgetItems = budgetItems.filter(item => 
        item.item_name.trim() !== "" && item.unit_price > 0
      )

      if (validBudgetItems.length > 0) {
        const budgetItemsToInsert = validBudgetItems.map(item => ({
          budget_id: budgetData.id,
          project_id: projectData.id,
          item_name: item.item_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          category: 'Material'
        }))

        const { error: itemsError } = await supabase
          .from('budget_items')
          .insert(budgetItemsToInsert)

        if (itemsError) throw itemsError
      }

      // Refresh projects list
      await fetchProjects()
      
      // Reset form and close modal
      resetForm()
      setIsAddingProject(false)
      
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Error creating project. Please try again.')
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.project_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.customer?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === "all" || project.status.toLowerCase() === filterStatus.toLowerCase()
    
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'in progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'planning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'on hold': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-oaw-blue mx-auto"></div>
          <p className="mt-4 text-oaw-text-light">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-oaw-text mb-2">Projects</h1>
          <p className="text-oaw-text-light">Create and manage aluminum workshop projects with receipt-style budgeting</p>
        </div>
        
        <Dialog open={isAddingProject} onOpenChange={setIsAddingProject}>
          <DialogTrigger asChild>
            <Button className="btn-primary bg-oaw-blue hover:bg-oaw-blue-hover">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-oaw-text">Create New Project</DialogTitle>
              <DialogDescription className="text-oaw-text-light">
                Create a comprehensive project with receipt-style budgeting like your invoice template.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              {/* Basic Project Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-oaw-text border-b pb-2">Project Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-oaw-text">Project Name *</Label>
                    <Input 
                      id="name" 
                      placeholder="Enter project name" 
                      className="input-enhanced"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customer_id" className="text-oaw-text">Customer *</Label>
                    <Select 
                      value={formData.customer_id} 
                      onValueChange={(value) => setFormData({...formData, customer_id: value})}
                    >
                      <SelectTrigger className="input-enhanced">
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{customer.name}</span>
                              {customer.phone && (
                                <span className="text-xs text-gray-500">({customer.phone})</span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-oaw-text">Description</Label>
                  <Input 
                    id="description" 
                    placeholder="Enter project description" 
                    className="input-enhanced"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="site_address" className="text-oaw-text">Site Address *</Label>
                  <Input 
                    id="site_address" 
                    placeholder="Enter complete site address" 
                    className="input-enhanced"
                    value={formData.site_address}
                    onChange={(e) => setFormData({...formData, site_address: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date" className="text-oaw-text">Start Date</Label>
                    <Input 
                      id="start_date" 
                      type="date"
                      className="input-enhanced"
                      value={formData.start_date}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expected_completion_date" className="text-oaw-text">Expected Completion</Label>
                    <Input 
                      id="expected_completion_date" 
                      type="date"
                      className="input-enhanced"
                      value={formData.expected_completion_date}
                      onChange={(e) => setFormData({...formData, expected_completion_date: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Items Table - Receipt Style */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-oaw-text border-b pb-2">Project Items</h3>
                  <Button 
                    type="button" 
                    onClick={addBudgetItem}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                          Item Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                          Unit Price (SLE)
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                          Total (SLE)
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {budgetItems.map((item, index) => (
                        <tr key={index} className="bg-white dark:bg-gray-900">
                          <td className="px-4 py-3">
                            <Input
                              placeholder="Enter item name"
                              value={item.item_name}
                              onChange={(e) => updateBudgetItem(index, 'item_name', e.target.value)}
                              className="border-0 focus:ring-1 focus:ring-oaw-blue"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              min="1"
                              step="0.01"
                              value={item.quantity}
                              onChange={(e) => updateBudgetItem(index, 'quantity', parseFloat(e.target.value) || 1)}
                              className="border-0 focus:ring-1 focus:ring-oaw-blue w-20"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unit_price}
                              onChange={(e) => updateBudgetItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                              className="border-0 focus:ring-1 focus:ring-oaw-blue"
                            />
                          </td>
                          <td className="px-4 py-3 font-medium">
                            {calculateItemTotal(item.quantity, item.unit_price).toLocaleString('en-SL', {
                              style: 'currency',
                              currency: 'SLE',
                              minimumFractionDigits: 2
                            })}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {budgetItems.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => removeBudgetItem(index)}
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                          Items Subtotal:
                        </td>
                        <td className="px-4 py-3 font-bold text-lg">
                          {calculateTotalItemsCost().toLocaleString('en-SL', {
                            style: 'currency',
                            currency: 'SLE',
                            minimumFractionDigits: 2
                          })}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Cost Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-oaw-text border-b pb-2">Cost Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="labor_cost" className="text-oaw-text">Labor Cost (SLE)</Label>
                    <Input 
                      id="labor_cost" 
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      className="input-enhanced"
                      value={formData.labor_cost}
                      onChange={(e) => setFormData({...formData, labor_cost: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="manual_cost" className="text-oaw-text">Additional Manual Cost (SLE)</Label>
                    <Input 
                      id="manual_cost" 
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      className="input-enhanced"
                      value={formData.manual_cost}
                      onChange={(e) => setFormData({...formData, manual_cost: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
                
                <div className="bg-oaw-blue-light p-4 rounded-lg">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Project Cost:</span>
                    <span className="text-2xl text-oaw-blue">
                      {calculateTotalProjectCost().toLocaleString('en-SL', {
                        style: 'currency',
                        currency: 'SLE',
                        minimumFractionDigits: 2
                      })}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    Items: {calculateTotalItemsCost().toLocaleString('en-SL', { style: 'currency', currency: 'SLE' })} + 
                    Labor: {formData.labor_cost.toLocaleString('en-SL', { style: 'currency', currency: 'SLE' })} + 
                    Manual: {formData.manual_cost.toLocaleString('en-SL', { style: 'currency', currency: 'SLE' })}
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-oaw-text border-b pb-2">Additional Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project_manager" className="text-oaw-text">Project Manager</Label>
                    <Input 
                      id="project_manager" 
                      placeholder="Enter project manager name" 
                      className="input-enhanced"
                      value={formData.project_manager}
                      onChange={(e) => setFormData({...formData, project_manager: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-oaw-text">Notes</Label>
                    <Input 
                      id="notes" 
                      placeholder="Additional project notes" 
                      className="input-enhanced"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 btn-primary bg-oaw-blue hover:bg-oaw-blue-hover">
                  <Building className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingProject(false)
                    resetForm()
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-oaw-text-light" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="in progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on hold">On Hold</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {projects.length === 0 ? "No projects yet" : "No projects match your search"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {projects.length === 0 
              ? "Get started by creating your first aluminum workshop project" 
              : "Try adjusting your search criteria"
            }
          </p>
          {projects.length === 0 && (
            <Button 
              onClick={() => setIsAddingProject(true)}
              className="btn-primary bg-oaw-blue hover:bg-oaw-blue-hover"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create First Project
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-oaw-text truncate">
                      {project.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-mono text-oaw-blue bg-oaw-blue-light px-2 py-1 rounded">
                        {project.project_number}
                      </span>
                      <Badge className={`text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {project.description && (
                  <CardDescription className="text-sm text-oaw-text-light line-clamp-2 mt-2">
                    {project.description}
                  </CardDescription>
                )}
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-oaw-text-light">
                    <User className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{project.customer?.full_name || 'No customer assigned'}</span>
                  </div>
                  
                  {project.site_address && (
                    <div className="flex items-center text-sm text-oaw-text-light">
                      <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{project.site_address}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-oaw-text-light">
                    <DollarSign className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="font-semibold text-oaw-blue">
                      {project.total_project_cost?.toLocaleString('en-SL', {
                        style: 'currency',
                        currency: 'SLE',
                        minimumFractionDigits: 2
                      }) || 'SLE 0.00'}
                    </span>
                  </div>
                  
                  {project.start_date && (
                    <div className="flex items-center text-sm text-oaw-text-light">
                      <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>{new Date(project.start_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 hover:bg-oaw-blue hover:text-white"
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 hover:bg-green-600 hover:text-white"
                  >
                    <Printer className="mr-1 h-3 w-3" />
                    Receipt
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-blue-600 hover:text-white"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

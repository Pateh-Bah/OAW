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
  Users, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Trash2,
  UserPlus,
  Filter
} from "lucide-react"

interface Employee {
  id: string
  full_name: string
  designation?: string
  department?: string
  badge_number?: string
  contact_info?: {
    phone?: string
    email?: string
  }
  created_at: string
  updated_at: string
}

interface NewEmployeeForm {
  full_name: string
  designation: string
  department: string
  badge_number: string
  phone: string
  email: string
}

export default function StaffPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [isAddingEmployee, setIsAddingEmployee] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState<NewEmployeeForm>({
    full_name: "",
    designation: "",
    department: "",
    badge_number: "",
    phone: "",
    email: ""
  })

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setEmployees(data || [])
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Validate form data
      if (!formData.full_name.trim()) {
        throw new Error('Please enter a full name')
      }

      // Generate badge number if not provided
      const badgeNumber = formData.badge_number.trim() || `EMP${String(employees.length + 1).padStart(3, '0')}`

      const { data, error } = await supabase
        .from('employees')
        .insert([
          {
            full_name: formData.full_name.trim(),
            designation: formData.designation.trim() || null,
            department: formData.department.trim() || null,
            badge_number: badgeNumber,
            contact_info: {
              phone: formData.phone.trim() || null,
              email: formData.email.trim() || null
            }
          }
        ])
        .select()

      if (error) throw error

      // Reset form and close dialog
      setFormData({
        full_name: "",
        designation: "",
        department: "",
        badge_number: "",
        phone: "",
        email: ""
      })
      setIsAddingEmployee(false)
      
      // Refresh the employee list
      await fetchEmployees()
      
      console.log('✅ Staff member added successfully:', data)
    } catch (error: any) {
      console.error('❌ Error adding employee:', error)
      setSubmitError(error.message || 'Failed to add staff member')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof NewEmployeeForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = (employee.full_name && employee.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (employee.contact_info?.email && employee.contact_info.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (employee.designation && employee.designation.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesDepartment = filterDepartment === "all" || employee.department === filterDepartment
    return matchesSearch && matchesDepartment
  })

  const getDepartmentBadgeColor = (department: string | undefined) => {
    switch (department) {
      case 'Management': return 'badge-enhanced bg-red-50 text-red-700 border-red-200'
      case 'Production': return 'badge-enhanced bg-oaw-blue/10 text-oaw-blue border-oaw-blue/20'
      case 'Quality Control': return 'badge-enhanced bg-oaw-success/10 text-oaw-success border-oaw-success/20'
      case 'Sales': return 'badge-enhanced bg-purple-50 text-purple-700 border-purple-200'
      default: return 'badge-enhanced bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-oaw-text">Staff Management</h1>
          <p className="text-oaw-text-light">
            Manage your workshop staff and their roles
          </p>
        </div>
        
        <Dialog open={isAddingEmployee} onOpenChange={setIsAddingEmployee}>
          <DialogTrigger asChild>
            <Button 
              className="gap-2 btn-primary bg-oaw-blue hover:bg-oaw-blue-hover shadow-md transition-colors duration-200 shrink-0"
              type="button"
            >
              <UserPlus className="h-4 w-4" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-oaw-text">Add New Staff Member</DialogTitle>
              <DialogDescription className="text-oaw-text-light">
                Add a new employee to your workshop team.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4" autoComplete="off">
              {submitError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {submitError}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-oaw-text">Full Name *</Label>
                <Input 
                  id="full_name" 
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  placeholder="Enter full name" 
                  className="border-gray-300 focus:border-oaw-blue" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="designation" className="text-oaw-text">Designation</Label>
                <Select value={formData.designation} onValueChange={(value) => handleInputChange('designation', value)}>
                  <SelectTrigger className="border-gray-300 focus:border-oaw-blue">
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Senior Fabricator">Senior Fabricator</SelectItem>
                    <SelectItem value="Project Manager">Project Manager</SelectItem>
                    <SelectItem value="Welder">Welder</SelectItem>
                    <SelectItem value="Quality Inspector">Quality Inspector</SelectItem>
                    <SelectItem value="Sales Representative">Sales Representative</SelectItem>
                    <SelectItem value="Administrative Assistant">Administrative Assistant</SelectItem>
                    <SelectItem value="Technician">Technician</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-oaw-text">Department</Label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                  <SelectTrigger className="border-gray-300 focus:border-oaw-blue">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Production">Production</SelectItem>
                    <SelectItem value="Management">Management</SelectItem>
                    <SelectItem value="Quality Control">Quality Control</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="badge_number" className="text-oaw-text">Badge Number</Label>
                <Input 
                  id="badge_number" 
                  value={formData.badge_number}
                  onChange={(e) => handleInputChange('badge_number', e.target.value)}
                  placeholder="Auto-generated if empty" 
                  className="border-gray-300 focus:border-oaw-blue" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-oaw-text">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address" 
                  className="border-gray-300 focus:border-oaw-blue" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-oaw-text">Phone</Label>
                <Input 
                  id="phone" 
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number" 
                  className="border-gray-300 focus:border-oaw-blue" 
                />
              </div>

              <Button 
                type="submit" 
                className="w-full btn-primary bg-oaw-blue hover:bg-oaw-blue-hover"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Staff Member'}
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
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-oaw-blue"
          />
        </div>
        
        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
          <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-gray-300 focus:border-oaw-blue">
            <Filter className="h-4 w-4 mr-2 text-oaw-text-light" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="Production">Production</SelectItem>
            <SelectItem value="Management">Management</SelectItem>
            <SelectItem value="Quality Control">Quality Control</SelectItem>
            <SelectItem value="Sales">Sales</SelectItem>
            <SelectItem value="Administration">Administration</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="card-enhanced border-0 shadow-lg bg-gradient-to-br from-blue-50 via-indigo-50/50 to-blue-50 dark:from-blue-950/50 dark:to-indigo-950/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-oaw-text-light">Total Staff</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-oaw-blue flex items-center justify-center shadow-sm">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-oaw-text">{employees.length}</div>
            <p className="text-xs text-oaw-text-light">Active employees</p>
          </CardContent>
        </Card>

        <Card className="card-enhanced border-0 shadow-lg bg-gradient-to-br from-green-50 via-emerald-50/50 to-green-50 dark:from-green-950/50 dark:to-emerald-950/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-oaw-text-light">Production Staff</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-oaw-success flex items-center justify-center shadow-sm">
              <UserPlus className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-oaw-text">
              {employees.filter(emp => emp.department === 'Production').length}
            </div>
            <p className="text-xs text-oaw-text-light">Production team</p>
          </CardContent>
        </Card>

        <Card className="card-enhanced border-0 shadow-lg bg-gradient-to-br from-red-50 via-pink-50/50 to-red-50 dark:from-red-950/50 dark:to-pink-950/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-oaw-text-light">Management</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center shadow-sm">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-oaw-text">
              {employees.filter(emp => emp.department === 'Management').length}
            </div>
            <p className="text-xs text-oaw-text-light">Management team</p>
          </CardContent>
        </Card>
      </div>

      {/* Staff List */}
      <Card className="card-enhanced border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-oaw-text">Staff Members</CardTitle>
          <CardDescription className="text-oaw-text-light">
            Manage your workshop team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-oaw-text-light">Loading staff...</div>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-oaw-text-light mx-auto mb-4" />
              <h3 className="text-lg font-medium text-oaw-text mb-2">No staff members found</h3>
              <p className="text-oaw-text-light mb-4">
                {searchTerm || filterDepartment !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by adding your first staff member"
                }
              </p>
              {!searchTerm && filterDepartment === "all" && (
                <Button onClick={() => setIsAddingEmployee(true)} className="btn-primary bg-oaw-blue hover:bg-oaw-blue-hover">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Staff Member
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEmployees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900/50 card-enhanced shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-oaw-blue flex items-center justify-center text-white font-medium shadow-sm">
                      {employee.full_name?.charAt(0).toUpperCase() || 'E'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-oaw-text">{employee.full_name}</p>
                      <div className="flex items-center gap-4 text-sm text-oaw-text-light">
                        {employee.designation && (
                          <span className="text-oaw-text font-medium">{employee.designation}</span>
                        )}
                        {employee.contact_info?.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {employee.contact_info.email}
                          </span>
                        )}
                        {employee.contact_info?.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {employee.contact_info.phone}
                          </span>
                        )}
                      </div>
                      {employee.badge_number && (
                        <div className="text-xs text-oaw-text-light mt-1">
                          Badge: {employee.badge_number}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {employee.department && (
                      <Badge className={getDepartmentBadgeColor(employee.department)}>
                        {employee.department}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-oaw-blue/10 text-oaw-text-light hover:text-oaw-blue">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

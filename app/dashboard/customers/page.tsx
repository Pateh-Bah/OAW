"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import { useStableModal } from "@/hooks/use-stable-modal"
import { 
  UserCheck, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Trash2,
  Building,
  Calendar
} from "lucide-react"

interface Customer {
  id: string
  full_name: string
  email?: string
  phone?: string
  address?: string
  company_name?: string
  created_at: string
  notes?: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddingCustomer, setIsAddingCustomer] = useState(false)

  // Use the stable modal hook to prevent positioning issues
  useStableModal()

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCustomers(data || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(customer =>
    (customer.full_name && customer.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.company_name && customer.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-oaw-text">Customer Management</h1>
          <p className="text-oaw-text-light">
            Manage your workshop customers and their information
          </p>
        </div>
        
        <Dialog open={isAddingCustomer} onOpenChange={setIsAddingCustomer}>
          <DialogTrigger asChild>
            <Button className="gap-2 btn-primary bg-oaw-blue hover:bg-oaw-blue-hover shadow-md">
              <Plus className="h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto card-enhanced dialog-content-override">
            <DialogHeader>
              <DialogTitle className="text-oaw-text">Add New Customer</DialogTitle>
              <DialogDescription className="text-oaw-text-light">
                Add a new customer to your database.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="customerName" className="text-oaw-text">Full Name</Label>
                <Input id="customerName" placeholder="Enter customer name" className="border-gray-300 focus:border-oaw-blue" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail" className="text-oaw-text">Email</Label>
                <Input id="customerEmail" type="email" placeholder="Enter email address" className="border-gray-300 focus:border-oaw-blue" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone" className="text-oaw-text">Phone</Label>
                <Input id="customerPhone" placeholder="Enter phone number" className="border-gray-300 focus:border-oaw-blue" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerCompany" className="text-oaw-text">Company Name (Optional)</Label>
                <Input id="customerCompany" placeholder="Enter company name" className="border-gray-300 focus:border-oaw-blue" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerAddress" className="text-oaw-text">Address</Label>
                <Input id="customerAddress" placeholder="Enter address" className="border-gray-300 focus:border-oaw-blue" />
              </div>
              <Button className="w-full btn-primary bg-oaw-blue hover:bg-oaw-blue-hover">Add Customer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-oaw-text-light" />
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-oaw-blue"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="card-enhanced border-0 shadow-lg bg-gradient-to-br from-blue-50 via-indigo-50/50 to-blue-50 dark:from-blue-950/50 dark:to-indigo-950/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-oaw-text-light">Total Customers</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-oaw-blue flex items-center justify-center shadow-sm">
              <UserCheck className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-oaw-text">{customers.length}</div>
            <p className="text-xs text-oaw-text-light">Registered customers</p>
          </CardContent>
        </Card>

        <Card className="card-enhanced border-0 shadow-lg bg-gradient-to-br from-purple-50 via-pink-50/50 to-purple-50 dark:from-purple-950/50 dark:to-pink-950/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-oaw-text-light">Business Customers</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center shadow-sm">
              <Building className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-oaw-text">
              {customers.filter(customer => customer.company_name).length}
            </div>
            <p className="text-xs text-oaw-text-light">With company names</p>
          </CardContent>
        </Card>

        <Card className="card-enhanced border-0 shadow-lg bg-gradient-to-br from-green-50 via-emerald-50/50 to-green-50 dark:from-green-950/50 dark:to-emerald-950/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-oaw-text-light">This Month</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-oaw-success flex items-center justify-center shadow-sm">
              <Calendar className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-oaw-text">
              {customers.filter(customer => {
                const customerDate = new Date(customer.created_at)
                const now = new Date()
                return customerDate.getMonth() === now.getMonth() && 
                       customerDate.getFullYear() === now.getFullYear()
              }).length}
            </div>
            <p className="text-xs text-oaw-text-light">New customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Customers List */}
      <Card className="card-enhanced border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-oaw-text">Customers</CardTitle>
          <CardDescription className="text-oaw-text-light">
            View and manage all your customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-oaw-text-light">Loading customers...</div>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-8">
              <UserCheck className="h-12 w-12 text-oaw-text-light mx-auto mb-4" />
              <h3 className="text-lg font-medium text-oaw-text mb-2">No customers found</h3>
              <p className="text-oaw-text-light mb-4">
                {searchTerm 
                  ? "Try adjusting your search criteria"
                  : "Get started by adding your first customer"
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsAddingCustomer(true)} className="btn-primary bg-oaw-blue hover:bg-oaw-blue-hover">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900/50 card-enhanced shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-oaw-blue flex items-center justify-center text-white font-medium shadow-sm">
                      {customer.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-oaw-text">{customer.full_name}</p>
                        {customer.company_name && (
                          <Badge variant="outline" className="badge-enhanced text-xs border-oaw-blue/20 text-oaw-blue">
                            {customer.company_name}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-oaw-text-light">
                        {customer.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </span>
                        )}
                        {customer.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </span>
                        )}
                        {customer.address && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {customer.address}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-oaw-blue/10 text-oaw-text-light hover:text-oaw-blue">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
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

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
  Calculator, 
  Plus, 
  Search, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  PieChart,
  BarChart3,
  Filter,
  Download,
  Eye
} from "lucide-react"

interface BudgetItem {
  id: string
  project_name: string
  category: string
  amount: number
  date: string
  status: string
  description?: string
}

export default function BudgetPage() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isAddingBudget, setIsAddingBudget] = useState(false)

  useEffect(() => {
    fetchBudgetData()
  }, [])

  const fetchBudgetData = async () => {
    try {
      // Fetch sites with their budgets
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Transform the data into budget items
      const transformedData = (data || []).map(site => ({
        id: site.id,
        project_name: site.name,
        category: 'Project Budget',
        amount: site.budget || 0,
        date: site.start_date,
        status: site.status,
        description: site.description
      }))
      
      setBudgetItems(transformedData)
    } catch (error) {
      console.error('Error fetching budget data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = budgetItems.filter(item => {
    const matchesSearch = (item.project_name && item.project_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    const matchesStatus = filterStatus === "all" || item.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.amount, 0)
  const completedBudget = budgetItems
    .filter(item => item.status === 'Completed')
    .reduce((sum, item) => sum + item.amount, 0)
  const activeBudget = budgetItems
    .filter(item => item.status === 'In Progress')
    .reduce((sum, item) => sum + item.amount, 0)

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'badge-enhanced bg-oaw-success/10 text-oaw-success border-oaw-success/20'
      case 'In Progress': return 'badge-enhanced bg-oaw-blue/10 text-oaw-blue border-oaw-blue/20'
      case 'Planning': return 'badge-enhanced bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
      case 'On Hold': return 'badge-enhanced bg-gray-500/10 text-oaw-text-light border-gray-500/20'
      default: return 'badge-enhanced bg-gray-500/10 text-oaw-text-light border-gray-500/20'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SL', {
      style: 'currency',
      currency: 'SLE',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const categories = [
    'Project Budget',
    'Materials',
    'Labor',
    'Equipment',
    'Transportation',
    'Utilities',
    'Administrative',
    'Other'
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-oaw-text">Budget Management</h1>
          <p className="text-oaw-text-light">
            Track and manage project budgets and expenses
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          
          <Dialog open={isAddingBudget} onOpenChange={setIsAddingBudget}>
            <DialogTrigger asChild>
              <Button className="gap-2 btn-primary">
                <Plus className="h-4 w-4" />
                Add Budget Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Budget Item</DialogTitle>
                <DialogDescription>
                  Add a new budget entry for tracking expenses.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="budgetProject" className="text-oaw-text font-medium">Project Name</Label>
                  <Input id="budgetProject" placeholder="Enter project name" className="input-enhanced" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetCategory" className="text-oaw-text font-medium">Category</Label>
                  <Select>
                    <SelectTrigger className="input-enhanced">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetAmount" className="text-oaw-text font-medium">Amount (SLE)</Label>
                  <Input id="budgetAmount" type="number" placeholder="Enter amount" className="input-enhanced" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetDate" className="text-oaw-text font-medium">Date</Label>
                  <Input id="budgetDate" type="date" className="input-enhanced" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetStatus" className="text-oaw-text font-medium">Status</Label>
                  <Select>
                    <SelectTrigger className="input-enhanced">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetDescription" className="text-oaw-text font-medium">Description</Label>
                  <Input id="budgetDescription" placeholder="Enter description (optional)" className="input-enhanced" />
                </div>
                <Button className="w-full btn-primary">Add Budget Item</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-oaw-text-light" />
          <Input
            placeholder="Search budget items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 input-enhanced"
          />
        </div>
        
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px] input-enhanced">
            <Filter className="h-4 w-4 mr-2 text-oaw-text-light" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px] input-enhanced">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Planning">Planning</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="On Hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="card-enhanced bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-oaw-text-light">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-oaw-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-oaw-text">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-oaw-text-light">All projects combined</p>
          </CardContent>
        </Card>

        <Card className="card-enhanced bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-oaw-text-light">Active Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-oaw-text">{formatCurrency(activeBudget)}</div>
            <p className="text-xs text-oaw-text-light">Currently in progress</p>
          </CardContent>
        </Card>

        <Card className="card-enhanced bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-oaw-text-light">Completed</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-oaw-text">{formatCurrency(completedBudget)}</div>
            <p className="text-xs text-oaw-text-light">Finished projects</p>
          </CardContent>
        </Card>

        <Card className="card-enhanced bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-oaw-text-light">Budget Items</CardTitle>
            <Calculator className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-oaw-text">{budgetItems.length}</div>
            <p className="text-xs text-oaw-text-light">Total entries</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Overview Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-enhanced bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-oaw-text flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Budget by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Completed', 'In Progress', 'Planning', 'On Hold'].map(status => {
                const statusBudget = budgetItems
                  .filter(item => item.status === status)
                  .reduce((sum, item) => sum + item.amount, 0)
                const percentage = totalBudget > 0 ? (statusBudget / totalBudget) * 100 : 0
                
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        status === 'Completed' ? 'bg-green-500' :
                        status === 'In Progress' ? 'bg-blue-500' :
                        status === 'Planning' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`} />
                      <span className="text-sm text-oaw-text">{status}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-oaw-text">{formatCurrency(statusBudget)}</div>
                      <div className="text-xs text-oaw-text-light">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-oaw-text flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-oaw-text-light mx-auto mb-4" />
              <p className="text-oaw-text-light">Budget trend visualization</p>
              <p className="text-sm text-oaw-text-light">Chart implementation pending</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget List */}
      <Card className="card-enhanced bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-oaw-text">Budget Items</CardTitle>
          <CardDescription className="text-oaw-text-light">
            Track all budget entries and expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-oaw-text-light">Loading budget data...</div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <Calculator className="h-12 w-12 text-oaw-text-light mx-auto mb-4" />
              <h3 className="text-lg font-medium text-oaw-text mb-2">No budget items found</h3>
              <p className="text-oaw-text-light mb-4">
                {searchTerm || filterCategory !== "all" || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by adding your first budget item"
                }
              </p>
              {!searchTerm && filterCategory === "all" && filterStatus === "all" && (
                <Button onClick={() => setIsAddingBudget(true)} className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Budget Item
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 rounded-lg bg-oaw-blue flex items-center justify-center text-white font-medium">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-oaw-text">{item.project_name}</h3>
                        <Badge className={getStatusBadgeColor(item.status)}>
                          {item.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-oaw-text-light">
                        <span className="flex items-center gap-1 font-medium text-oaw-blue">
                          <DollarSign className="h-3 w-3" />
                          {formatCurrency(item.amount)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-oaw-text-light mt-1">{item.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
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

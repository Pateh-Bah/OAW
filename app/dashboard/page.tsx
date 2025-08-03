"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { 
  Users, 
  FolderOpen, 
  UserCheck, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Calendar,
  Activity,
  Loader2,
  RefreshCw
} from "lucide-react"

interface DashboardStats {
  totalStaff: number
  activeProjects: number
  totalCustomers: number
  monthlyRevenue: number
  projectBreakdown: {
    inProgress: number
    completed: number
    pending: number
  }
}

interface RecentActivity {
  id: string
  type: 'project' | 'customer' | 'staff' | 'quote'
  title: string
  timestamp: string
  status?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalStaff: 0,
    activeProjects: 0,
    totalCustomers: 0,
    monthlyRevenue: 0,
    projectBreakdown: {
      inProgress: 0,
      completed: 0,
      pending: 0
    }
  })
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔍 Fetching dashboard data...')

      // Initialize default stats
      let staffCount = 0
      let customersCount = 0
      let projectsData: any[] = []
      let recentProjects: any[] = []
      let recentCustomers: any[] = []

      // Try to fetch staff count with fallback
      try {
        const { count, error } = await supabase
          .from('employees')
          .select('*', { count: 'exact', head: true })
        
        if (!error) {
          staffCount = count || 0
          console.log('✅ Staff count:', staffCount)
        } else {
          console.warn('⚠️ Could not fetch staff count:', error.message)
        }
      } catch (err) {
        console.warn('⚠️ Staff table might not exist')
      }

      // Try to fetch customers count with fallback
      try {
        const { count, error } = await supabase
          .from('customers')
          .select('*', { count: 'exact', head: true })

        if (!error) {
          customersCount = count || 0
          console.log('✅ Customers count:', customersCount)
        } else {
          console.warn('⚠️ Could not fetch customers count:', error.message)
        }
      } catch (err) {
        console.warn('⚠️ Customers table might not exist')
      }

      // Try to fetch projects data with fallback
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('status, total_project_cost, created_at')

        if (!error && data) {
          projectsData = data
          console.log('✅ Projects data:', projectsData.length, 'projects')
        } else {
          console.warn('⚠️ Could not fetch projects:', error?.message)
        }
      } catch (err) {
        console.warn('⚠️ Projects table might not exist')
      }

      // Calculate project breakdown
      const projectBreakdown = {
        inProgress: projectsData?.filter(project => project.status === 'In Progress').length || 0,
        completed: projectsData?.filter(project => project.status === 'Completed').length || 0,
        pending: projectsData?.filter(project => project.status === 'Planning').length || 0
      }

      // Calculate monthly revenue
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const monthlyRevenue = projectsData?.reduce((total, project) => {
        const projectDate = new Date(project.created_at)
        if (projectDate.getMonth() === currentMonth && projectDate.getFullYear() === currentYear) {
          return total + (parseFloat(project.total_project_cost?.toString() || '0') || 0)
        }
        return total
      }, 0) || 0

      // Try to fetch recent activities with fallback
      try {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            id, 
            created_at, 
            status,
            name,
            customers!inner(full_name)
          `)
          .order('created_at', { ascending: false })
          .limit(3)

        if (!error && data) {
          recentProjects = data
          console.log('✅ Recent projects:', recentProjects.length)
        }
      } catch (err) {
        console.warn('⚠️ Could not fetch recent projects')
      }

      try {
        const { data, error } = await supabase
          .from('customers')
          .select('id, full_name, created_at')
          .order('created_at', { ascending: false })
          .limit(2)

        if (!error && data) {
          recentCustomers = data
          console.log('✅ Recent customers:', recentCustomers.length)
        }
      } catch (err) {
        console.warn('⚠️ Could not fetch recent customers')
      }

      // Combine recent activities
      const activities: RecentActivity[] = []
      
      recentProjects?.forEach(project => {
        const customer = project.customers as any
        activities.push({
          id: project.id,
          type: 'project',
          title: `New project: ${project.name} for ${customer?.full_name || 'Customer'}`,
          timestamp: project.created_at,
          status: project.status
        })
      })

      recentCustomers?.forEach(customer => {
        activities.push({
          id: customer.id,
          type: 'customer',
          title: `New customer added: ${customer.full_name}`,
          timestamp: customer.created_at
        })
      })

      // Sort activities by timestamp
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      const finalStats = {
        totalStaff: staffCount || 0,
        activeProjects: projectBreakdown.inProgress + projectBreakdown.completed,
        totalCustomers: customersCount || 0,
        monthlyRevenue: monthlyRevenue,
        projectBreakdown
      }

      console.log('📊 Final dashboard stats:', finalStats)
      setStats(finalStats)
      setRecentActivities(activities.slice(0, 5))
      
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err)
      setError(`Dashboard loading failed: ${err.message}`)
      
      // Set default stats even on error
      setStats({
        totalStaff: 0,
        activeProjects: 0,
        totalCustomers: 0,
        monthlyRevenue: 0,
        projectBreakdown: { inProgress: 0, completed: 0, pending: 0 }
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours === 1) return '1 hour ago'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return '1 day ago'
    return `${diffInDays} days ago`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-oaw-text">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-oaw-text">Error Loading Dashboard</h3>
            <p className="text-oaw-text-light">{error}</p>
          </div>
          <Button onClick={fetchDashboardData} className="btn-primary">
            Try Again
          </Button>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-oaw-text">Dashboard</h1>
          <p className="text-oaw-text-light">
            Welcome to your workshop management system
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="btn-secondary gap-2 border-oaw-blue/20 hover:bg-oaw-blue/5"
            onClick={fetchDashboardData}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Activity className="h-4 w-4" />
            )}
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button 
            className="btn-primary gap-2 bg-oaw-blue hover:bg-oaw-blue-hover shadow-md"
            onClick={() => router.push('/dashboard/projects')}
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-enhanced border-0 shadow-lg bg-gradient-to-br from-blue-50 via-indigo-50/50 to-blue-50 dark:from-blue-950/50 dark:to-indigo-950/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-oaw-text-light">
              Total Staff
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-oaw-blue flex items-center justify-center shadow-sm">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-oaw-text">{stats.totalStaff}</div>
            <div className="flex items-center gap-1 text-xs text-oaw-text-light">
              <Users className="h-3 w-3 text-oaw-blue" />
              Active employees in system
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced border-0 shadow-lg bg-gradient-to-br from-green-50 via-emerald-50/50 to-green-50 dark:from-green-950/50 dark:to-emerald-950/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-oaw-text-light">
              Active Projects
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-oaw-success flex items-center justify-center shadow-sm">
              <FolderOpen className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-oaw-text">{stats.activeProjects}</div>
            <div className="flex items-center gap-1 text-xs text-oaw-text-light">
              <Activity className="h-3 w-3 text-oaw-success" />
              {stats.projectBreakdown.inProgress} in progress, {stats.projectBreakdown.completed} completed
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced border-0 shadow-lg bg-gradient-to-br from-purple-50 via-pink-50/50 to-purple-50 dark:from-purple-950/50 dark:to-pink-950/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-oaw-text-light">
              Total Customers
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center shadow-sm">
              <UserCheck className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-oaw-text">{stats.totalCustomers}</div>
            <div className="flex items-center gap-1 text-xs text-oaw-text-light">
              <CheckCircle className="h-3 w-3 text-purple-600" />
              Registered customers
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced border-0 shadow-lg bg-gradient-to-br from-orange-50 via-amber-50/50 to-orange-50 dark:from-orange-950/50 dark:to-amber-950/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-oaw-text-light">
              Monthly Revenue
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-orange-600 flex items-center justify-center shadow-sm">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-oaw-text">{formatCurrency(stats.monthlyRevenue)}</div>
            <div className="flex items-center gap-1 text-xs text-oaw-text-light">
              <DollarSign className="h-3 w-3 text-orange-600" />
              Current month earnings
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card className="card-enhanced border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-oaw-text">
              <div className="h-5 w-5 rounded bg-oaw-blue flex items-center justify-center shadow-sm">
                <Plus className="h-3 w-3 text-white" />
              </div>
              Quick Actions
            </CardTitle>
            <CardDescription className="text-oaw-text-light">
              Frequently used operations for your workshop
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="btn-secondary w-full justify-start gap-3 h-12 hover:bg-oaw-blue/5 border-oaw-blue/20"
              onClick={() => router.push('/dashboard/customers')}
            >
              <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center dark:bg-oaw-blue/20 shadow-sm">
                <UserCheck className="h-4 w-4 text-oaw-blue" />
              </div>
              <div className="text-left">
                <div className="font-medium text-oaw-text">Add New Customer</div>
                <div className="text-xs text-oaw-text-light">Create customer profile</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="btn-secondary w-full justify-start gap-3 h-12 hover:bg-oaw-success/5 border-oaw-success/20"
              onClick={() => router.push('/dashboard/projects')}
            >
              <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center dark:bg-oaw-success/20 shadow-sm">
                <FolderOpen className="h-4 w-4 text-oaw-success" />
              </div>
              <div className="text-left">
                <div className="font-medium text-oaw-text">Create New Project</div>
                <div className="text-xs text-oaw-text-light">Start a new project</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="btn-secondary w-full justify-start gap-3 h-12 hover:bg-purple-50/50 border-purple-200"
              onClick={() => router.push('/dashboard/staff')}
            >
              <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center dark:bg-purple-950/50 shadow-sm">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-oaw-text">Add Staff Member</div>
                <div className="text-xs text-oaw-text-light">Manage team members</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="card-enhanced border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-oaw-text">
              <div className="h-5 w-5 rounded bg-oaw-success flex items-center justify-center shadow-sm">
                <Activity className="h-3 w-3 text-white" />
              </div>
              Recent Activity
            </CardTitle>
            <CardDescription className="text-oaw-text-light">
              Latest updates from your workshop
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <div className="text-center py-8 text-oaw-text-light">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No recent activity found</p>
                </div>
              ) : (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shadow-sm ${
                      activity.type === 'project' 
                        ? 'bg-green-50 dark:bg-oaw-success/20' 
                        : activity.type === 'customer'
                        ? 'bg-blue-50 dark:bg-oaw-blue/20'
                        : activity.type === 'staff'
                        ? 'bg-purple-50 dark:bg-purple-950/50'
                        : 'bg-orange-50 dark:bg-orange-950/50'
                    }`}>
                      {activity.type === 'project' ? (
                        <CheckCircle className="h-4 w-4 text-oaw-success" />
                      ) : activity.type === 'customer' ? (
                        <UserCheck className="h-4 w-4 text-oaw-blue" />
                      ) : activity.type === 'staff' ? (
                        <Users className="h-4 w-4 text-purple-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-oaw-text">{activity.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={activity.type === 'project' ? 'secondary' : 'outline'} className={`badge-enhanced text-xs ${
                          activity.type === 'project' 
                            ? 'bg-oaw-success/10 text-oaw-success border-oaw-success/20'
                            : activity.type === 'customer'
                            ? 'border-oaw-blue/20 text-oaw-blue'
                            : activity.type === 'staff'
                            ? 'border-purple-200 text-purple-700'
                            : 'bg-orange-50 text-orange-700 border-orange-200'
                        }`}>
                          {activity.type === 'project' ? (activity.status || 'Project') : 
                           activity.type === 'customer' ? 'Customer' :
                           activity.type === 'staff' ? 'Staff' : 'Quote'}
                        </Badge>
                        <span className="text-xs text-oaw-text-light">{formatTimeAgo(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Status Overview */}
      <Card className="card-enhanced border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-oaw-text">Project Status Overview</CardTitle>
          <CardDescription className="text-oaw-text-light">
            Current status of all active projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-oaw-text">In Progress</span>
                <Badge className="badge-enhanced bg-oaw-blue/10 text-oaw-blue border-oaw-blue/20 shadow-sm">
                  {stats.projectBreakdown.inProgress}
                </Badge>
              </div>
              <div className="h-3 bg-gray-100 rounded-full dark:bg-gray-800 shadow-inner">
                <div 
                  className="h-3 bg-gradient-to-r from-oaw-blue to-blue-500 rounded-full shadow-sm transition-all duration-300" 
                  style={{
                    width: `${stats.activeProjects > 0 ? (stats.projectBreakdown.inProgress / stats.activeProjects) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-oaw-text">Completed</span>
                <Badge className="badge-enhanced bg-oaw-success/10 text-oaw-success border-oaw-success/20 shadow-sm">
                  {stats.projectBreakdown.completed}
                </Badge>
              </div>
              <div className="h-3 bg-gray-100 rounded-full dark:bg-gray-800 shadow-inner">
                <div 
                  className="h-3 bg-gradient-to-r from-oaw-success to-green-500 rounded-full shadow-sm transition-all duration-300" 
                  style={{
                    width: `${stats.activeProjects > 0 ? (stats.projectBreakdown.completed / stats.activeProjects) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-oaw-text">Pending</span>
                <Badge className="badge-enhanced bg-orange-50 text-orange-700 border-orange-200 shadow-sm">
                  {stats.projectBreakdown.pending}
                </Badge>
              </div>
              <div className="h-3 bg-gray-100 rounded-full dark:bg-gray-800 shadow-inner">
                <div 
                  className="h-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-sm transition-all duration-300" 
                  style={{
                    width: `${stats.activeProjects > 0 ? (stats.projectBreakdown.pending / stats.activeProjects) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
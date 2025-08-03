'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Badge } from '../../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Plus, Trash2, Edit, Save, X, Calculator, MapPin, User, Calendar, DollarSign, Eye } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Project, Customer, BudgetItem, Employee } from '../../../types';

// Extended Project type for joined queries
interface ProjectWithRelations extends Omit<Project, 'project_manager' | 'customer'> {
  customer?: Customer;
  project_manager?: Employee;
  assigned_team_lead?: Employee;
}

interface BudgetItemForm {
  id?: string;
  item_name: string;
  description: string;
  category: 'Material' | 'Labor' | 'Equipment' | 'Tool' | 'Subcontractor' | 'Permit' | 'Other';
  quantity: number;
  unit: string;
  unit_price: number;
  supplier: string;
  supplier_contact: string;
  expected_delivery_date: string;
  notes: string;
}

export default function EnhancedProjectsPage() {
  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithRelations | null>(null);
  const [budgetItems, setBudgetItems] = useState<BudgetItemForm[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Form state for project creation/editing
  const [formData, setFormData] = useState({
    project_number: '',
    name: '',
    description: '',
    customer_id: '',
    project_manager_id: '',
    assigned_team_lead_id: '',
    status: 'Planning' as 'Planning' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled',
    priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Urgent',
    start_date: '',
    expected_completion_date: '',
    site_address: '',
    site_city: '',
    site_state: '',
    site_zip: '',
    site_coordinates: '',
    site_conditions: '',
    site_access_notes: '',
    workmanship_fee: 0,
    overhead_percentage: 10,
    profit_margin_percentage: 15,
    notes: '',
    special_requirements: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load projects with customer data and budget items
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          customer:customers(id, name, email, phone, company),
          project_manager:employees!projects_project_manager_id_fkey(id, full_name, designation),
          assigned_team_lead:employees!projects_assigned_team_lead_id_fkey(id, full_name, designation)
        `)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Load customers for dropdown
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .order('name');

      if (customersError) throw customersError;

      // Load employees for project manager dropdown
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('*')
        .eq('status', 'Active')
        .order('full_name');

      if (employeesError) throw employeesError;

      setProjects(projectsData || []);
      setCustomers(customersData || []);  
      setEmployees(employeesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBudgetItem = () => {
    setBudgetItems([...budgetItems, {
      item_name: '',
      description: '',
      category: 'Material',
      quantity: 1,
      unit: 'each',
      unit_price: 0,
      supplier: '',
      supplier_contact: '',
      expected_delivery_date: '',
      notes: ''
    }]);
  };

  const removeBudgetItem = (index: number) => {
    setBudgetItems(budgetItems.filter((_, i) => i !== index));
  };

  const updateBudgetItem = (index: number, field: keyof BudgetItemForm, value: any) => {
    const updated = [...budgetItems];
    updated[index] = { ...updated[index], [field]: value };
    setBudgetItems(updated);
  };

  const calculateBudgetTotals = () => {
    const totals = budgetItems.reduce((acc, item) => {
      const itemTotal = item.quantity * item.unit_price;
      switch (item.category) {
        case 'Material':
          acc.materials += itemTotal;
          break;
        case 'Labor':
          acc.labor += itemTotal;
          break;
        case 'Equipment':
        case 'Tool':
          acc.equipment += itemTotal;
          break;
        default:
          acc.other += itemTotal;
          break;
      }
      return acc;
    }, { materials: 0, labor: 0, equipment: 0, other: 0 });

    const subtotal = totals.materials + totals.labor + totals.equipment + totals.other + formData.workmanship_fee;
    const overhead = subtotal * (formData.overhead_percentage / 100);
    const profit = (subtotal + overhead) * (formData.profit_margin_percentage / 100);
    const total = subtotal + overhead + profit;

    return { ...totals, subtotal, overhead, profit, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);

      if (editingProject) {
        // Update existing project
        const { error: projectError } = await supabase
          .from('projects')
          .update({
            name: formData.name,
            description: formData.description,
            customer_id: formData.customer_id,
            project_manager_id: formData.project_manager_id || null,
            assigned_team_lead_id: formData.assigned_team_lead_id || null,
            status: formData.status,
            priority: formData.priority,
            start_date: formData.start_date || null,
            expected_completion_date: formData.expected_completion_date || null,
            site_address: formData.site_address,
            site_city: formData.site_city || null,
            site_state: formData.site_state || null,
            site_zip: formData.site_zip || null,
            site_coordinates: formData.site_coordinates || null,
            site_conditions: formData.site_conditions || null,
            site_access_notes: formData.site_access_notes || null,
            workmanship_fee: formData.workmanship_fee,
            overhead_percentage: formData.overhead_percentage,
            profit_margin_percentage: formData.profit_margin_percentage,
            notes: formData.notes || null,
            special_requirements: formData.special_requirements || null
          })
          .eq('id', editingProject.id);

        if (projectError) throw projectError;

        // Delete existing budget items and recreate them
        await supabase.from('budget_items').delete().eq('project_id', editingProject.id);
        
        if (budgetItems.length > 0) {
          const budgetItemsToInsert = budgetItems.map(item => ({
            project_id: editingProject.id,
            item_name: item.item_name,
            description: item.description || null,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit,
            unit_price: item.unit_price,
            supplier: item.supplier || null,
            supplier_contact: item.supplier_contact || null,
            expected_delivery_date: item.expected_delivery_date || null,
            notes: item.notes || null
          }));

          const { error: budgetError } = await supabase
            .from('budget_items')
            .insert(budgetItemsToInsert);

          if (budgetError) throw budgetError;
        }
      } else {
        // Create new project
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .insert({
            name: formData.name,
            description: formData.description,
            customer_id: formData.customer_id,
            project_manager_id: formData.project_manager_id || null,
            assigned_team_lead_id: formData.assigned_team_lead_id || null,
            status: formData.status,
            priority: formData.priority,
            start_date: formData.start_date || null,
            expected_completion_date: formData.expected_completion_date || null,
            site_address: formData.site_address,
            site_city: formData.site_city || null,
            site_state: formData.site_state || null,
            site_zip: formData.site_zip || null,
            site_coordinates: formData.site_coordinates || null,
            site_conditions: formData.site_conditions || null,
            site_access_notes: formData.site_access_notes || null,
            workmanship_fee: formData.workmanship_fee,
            overhead_percentage: formData.overhead_percentage,
            profit_margin_percentage: formData.profit_margin_percentage,
            notes: formData.notes || null,
            special_requirements: formData.special_requirements || null
          })
          .select()
          .single();

        if (projectError) throw projectError;

        // Insert budget items
        if (budgetItems.length > 0) {
          const budgetItemsToInsert = budgetItems.map(item => ({
            project_id: projectData.id,
            item_name: item.item_name,
            description: item.description || null,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit,
            unit_price: item.unit_price,
            supplier: item.supplier || null,
            supplier_contact: item.supplier_contact || null,
            expected_delivery_date: item.expected_delivery_date || null,
            notes: item.notes || null
          }));

          const { error: budgetError } = await supabase
            .from('budget_items')
            .insert(budgetItemsToInsert);

          if (budgetError) throw budgetError;
        }
      }

      // Reset form and reload data
      resetForm();
      setShowCreateDialog(false);
      setEditingProject(null);
      await loadData();

    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      project_number: '',
      name: '',
      description: '',
      customer_id: '',
      project_manager_id: '',
      assigned_team_lead_id: '',
      status: 'Planning' as 'Planning' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled',
      priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Urgent',
      start_date: '',
      expected_completion_date: '',
      site_address: '',
      site_city: '',
      site_state: '',
      site_zip: '',
      site_coordinates: '',
      site_conditions: '',
      site_access_notes: '',
      workmanship_fee: 0,
      overhead_percentage: 10,
      profit_margin_percentage: 15,
      notes: '',
      special_requirements: ''
    });
    setBudgetItems([]);
  };

  const handleEdit = async (project: ProjectWithRelations) => {
    setEditingProject(project);
    setFormData({
      project_number: project.project_number || '',
      name: project.name,
      description: project.description || '',
      customer_id: project.customer_id,
      project_manager_id: project.project_manager_id || '',
      assigned_team_lead_id: project.assigned_team_lead_id || '',
      status: project.status,
      priority: project.priority,
      start_date: project.start_date || '',
      expected_completion_date: project.expected_completion_date || '',
      site_address: project.site_address,
      site_city: project.site_city || '',
      site_state: project.site_state || '',
      site_zip: project.site_zip || '',
      site_coordinates: project.site_coordinates || '',
      site_conditions: project.site_conditions || '',
      site_access_notes: project.site_access_notes || '',
      workmanship_fee: project.workmanship_fee || 0,
      overhead_percentage: project.overhead_percentage || 10,
      profit_margin_percentage: project.profit_margin_percentage || 15,
      notes: project.notes || '',
      special_requirements: project.special_requirements || ''
    });

    // Load existing budget items
    const { data: budgetItemsData, error } = await supabase
      .from('budget_items')
      .select('*')
      .eq('project_id', project.id);

    if (!error && budgetItemsData) {
      setBudgetItems(budgetItemsData.map(item => ({
        id: item.id,
        item_name: item.item_name,
        description: item.description || '',
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        supplier: item.supplier || '',
        supplier_contact: item.supplier_contact || '',
        expected_delivery_date: item.expected_delivery_date || '',
        notes: item.notes || ''
      })));
    }

    setShowCreateDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'On Hold': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.site_address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const totals = calculateBudgetTotals();

  if (loading && !showCreateDialog) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600 mt-1">Complete relational project management with dynamic budget tracking</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </DialogTitle>
              <DialogDescription>
                {editingProject ? 'Update project details and budget items' : 'Create a new project with dynamic budget items and site information'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Enter project name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="customer_id">Customer *</Label>
                  <select
                    id="customer_id"
                    value={formData.customer_id}
                    onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} {customer.company && `(${customer.company})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Project description..."
                />
              </div>

              {/* Project Management */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="project_manager_id">Project Manager</Label>
                  <select
                    id="project_manager_id"
                    value={formData.project_manager_id}
                    onChange={(e) => setFormData({ ...formData, project_manager_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Project Manager</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.full_name} - {employee.designation}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="expected_completion_date">Expected Completion</Label>
                  <Input
                    id="expected_completion_date"
                    type="date"
                    value={formData.expected_completion_date}
                    onChange={(e) => setFormData({ ...formData, expected_completion_date: e.target.value })}
                  />
                </div>
              </div>

              {/* Site Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Site Information
                </h3>
                
                <div>
                  <Label htmlFor="site_address">Site Address *</Label>
                  <Input
                    id="site_address"
                    value={formData.site_address}
                    onChange={(e) => setFormData({ ...formData, site_address: e.target.value })}
                    required
                    placeholder="Enter complete site address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="site_city">City</Label>
                    <Input
                      id="site_city"
                      value={formData.site_city}
                      onChange={(e) => setFormData({ ...formData, site_city: e.target.value })}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="site_state">State</Label>
                    <Input
                      id="site_state"
                      value={formData.site_state}
                      onChange={(e) => setFormData({ ...formData, site_state: e.target.value })}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <Label htmlFor="site_zip">ZIP Code</Label>
                    <Input
                      id="site_zip"
                      value={formData.site_zip}
                      onChange={(e) => setFormData({ ...formData, site_zip: e.target.value })}
                      placeholder="ZIP"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="site_conditions">Site Conditions</Label>
                  <textarea
                    id="site_conditions"
                    value={formData.site_conditions}
                    onChange={(e) => setFormData({ ...formData, site_conditions: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Describe site conditions..."
                  />
                </div>
              </div>

              {/* Dynamic Budget Items */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Budget Items
                  </h3>
                  <Button type="button" onClick={addBudgetItem} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                {budgetItems.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div>
                        <Label>Item Name *</Label>
                        <Input
                          value={item.item_name}
                          onChange={(e) => updateBudgetItem(index, 'item_name', e.target.value)}
                          placeholder="Item name"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label>Category</Label>
                        <select
                          value={item.category}
                          onChange={(e) => updateBudgetItem(index, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Material">Material</option>
                          <option value="Labor">Labor</option>
                          <option value="Equipment">Equipment</option>
                          <option value="Tool">Tool</option>
                          <option value="Subcontractor">Subcontractor</option>
                          <option value="Permit">Permit</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          step="0.001"
                          value={item.quantity}
                          onChange={(e) => updateBudgetItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                      
                      <div>
                        <Label>Unit Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unit_price}
                          onChange={(e) => updateBudgetItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                      </div>
                      
                      <div>
                        <Label>Total</Label>
                        <Input
                          value={`$${(item.quantity * item.unit_price).toFixed(2)}`}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                      
                      <div className="flex items-end">
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm"
                          onClick={() => removeBudgetItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <Label>Unit</Label>
                        <Input
                          value={item.unit}
                          onChange={(e) => updateBudgetItem(index, 'unit', e.target.value)}
                          placeholder="each, lb, ft, etc."
                        />
                      </div>
                      <div>
                        <Label>Supplier</Label>
                        <Input
                          value={item.supplier}
                          onChange={(e) => updateBudgetItem(index, 'supplier', e.target.value)}
                          placeholder="Supplier name"
                        />
                      </div>
                      <div>
                        <Label>Expected Delivery</Label>
                        <Input
                          type="date"
                          value={item.expected_delivery_date}
                          onChange={(e) => updateBudgetItem(index, 'expected_delivery_date', e.target.value)}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Budget Summary */}
              {budgetItems.length > 0 && (
                <Card className="p-4 bg-blue-50">
                  <h4 className="font-semibold text-gray-900 mb-3">Budget Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Materials:</span>
                      <div className="font-semibold">${totals.materials.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Labor:</span>
                      <div className="font-semibold">${totals.labor.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Equipment:</span>
                      <div className="font-semibold">${totals.equipment.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Other:</span>
                      <div className="font-semibold">${totals.other.toFixed(2)}</div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Manual Budget Entries */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="workmanship_fee">Workmanship Fee</Label>
                  <Input
                    id="workmanship_fee"
                    type="number"
                    step="0.01"
                    value={formData.workmanship_fee}
                    onChange={(e) => setFormData({ ...formData, workmanship_fee: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="overhead_percentage">Overhead %</Label>
                  <Input
                    id="overhead_percentage"
                    type="number"
                    step="0.01"
                    value={formData.overhead_percentage}
                    onChange={(e) => setFormData({ ...formData, overhead_percentage: parseFloat(e.target.value) || 0 })}
                    placeholder="10.00"
                  />
                </div>
                <div>
                  <Label htmlFor="profit_margin_percentage">Profit Margin %</Label>
                  <Input
                    id="profit_margin_percentage"
                    type="number"
                    step="0.01"
                    value={formData.profit_margin_percentage}
                    onChange={(e) => setFormData({ ...formData, profit_margin_percentage: parseFloat(e.target.value) || 0 })}
                    placeholder="15.00"
                  />
                </div>
              </div>

              {/* Final Total */}
              <Card className="p-4 bg-green-50">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Project Cost:</span>
                  <span className="text-2xl font-bold text-green-600">${totals.total.toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Subtotal: ${totals.subtotal.toFixed(2)} + Overhead: ${totals.overhead.toFixed(2)} + Profit: ${totals.profit.toFixed(2)}
                </div>
              </Card>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Additional project notes..."
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="Search projects, customers, or addresses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="Planning">Planning</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <User className="h-4 w-4" />
                    {project.customer?.name}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                  <Badge className={getPriorityColor(project.priority)}>
                    {project.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{project.site_address}</span>
              </div>
              
              {project.project_manager && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{project.project_manager.full_name}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold">${project.total_project_cost?.toFixed(2) || '0.00'}</span>
              </div>
              
              {project.expected_completion_date && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(project.expected_completion_date).toLocaleDateString()}</span>
                </div>
              )}
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            {projects.length === 0 ? 'No projects found. Create your first project!' : 'No projects match your search criteria.'}
          </div>
        </div>
      )}
    </div>
  );
}

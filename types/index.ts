// Database Types - Final Relational Structure
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  full_name: string;
  designation: string;
  department: string;
  email?: string;
  phone_number?: string;
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: 'Manager' | 'Worker' | 'Supervisor' | 'Admin';
  hourly_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface CompanySettings {
  id: string;
  company_name: string;
  company_phone?: string;
  company_email?: string;
  company_address?: string;
  logo_url?: string;
  tax_id?: string;
  registration_number?: string;
  default_overhead_percentage: number;
  default_profit_margin_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  project_number: string;
  name: string;
  description?: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  customer_id: string;
  company_settings_id?: string;
  project_manager_id?: string;
  assigned_team_lead_id?: string;
  primary_service_id?: string;
  start_date?: string;
  expected_completion_date?: string;
  installation_progress: number;
  
  // Site information (can be embedded or referenced)
  site_address?: string;
  site_city?: string;
  site_state?: string;
  site_zip?: string;
  site_coordinates?: string;
  site_conditions?: string;
  site_access_notes?: string;
  special_requirements?: string;
  
  // Simplified cost structure - receipt style
  total_items_cost: number; // Sum of all budget items
  labor_cost: number; // Manual entry by admin
  manual_cost: number; // Additional manual costs
  workmanship_fee?: number; // Additional workmanship fee
  overhead_percentage?: number; // Overhead percentage
  profit_margin_percentage?: number; // Profit margin percentage
  total_project_cost: number; // Auto-calculated: items + labor + manual
  total_budget_items?: number; // Total from budget items
  balance_due?: number; // Outstanding balance
  
  amount_paid: number;
  payment_status: 'Pending' | 'Partial' | 'Paid' | 'Overdue';
  project_manager?: string;
  customer_name?: string; // For backward compatibility
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Relationships
  customer?: Customer;
  company_settings?: CompanySettings;
  site?: Site;
  budget?: Budget;
}

export interface Site {
  id: string;
  project_id: string;
  site_name?: string;
  site_address: string;
  site_city?: string;
  site_state?: string;
  site_area?: number;
  site_conditions?: string;
  site_access?: string;
  special_requirements?: string;
  created_at: string;
  updated_at: string;
  
  // Relationships
  project?: Project;
}

export interface Budget {
  id: string;
  project_id: string;
  budget_name: string;
  budget_status: 'Draft' | 'Approved' | 'Revised' | 'Final';
  created_at: string;
  updated_at: string;
  
  // Relationships
  project?: Project;
  budget_items?: BudgetItem[];
}

export interface BudgetItem {
  id: string;
  budget_id: string;
  project_id: string;
  item_name: string;
  item_description?: string;
  category: 'Material' | 'Labor' | 'Equipment' | 'Transport' | 'Permit' | 'Subcontractor' | 'Other';
  quantity: number;
  unit: string;
  unit_price: number;
  total_cost: number;
  supplier_name?: string;
  supplier_contact?: string;
  expected_delivery_date?: string;
  actual_cost?: number;
  item_status: 'Pending' | 'Ordered' | 'Delivered' | 'Completed' | 'Cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Relationships
  budget?: Budget;
  project?: Project;
}

// Views for enhanced data retrieval
export interface ProjectOverview {
  id: string;
  project_number: string;
  name: string;
  description?: string;
  status: string;
  priority: string;
  customer_id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_company?: string;
  customer_address?: string;
  site_address?: string;
  site_city?: string;
  site_area?: number;
  site_conditions?: string;
  total_materials_cost: number;
  total_labor_cost: number;
  total_equipment_cost: number;
  total_other_cost: number;
  subtotal: number;
  overhead_percentage: number;
  overhead_amount: number;
  profit_margin_percentage: number;
  profit_amount: number;
  total_project_cost: number;
  amount_paid: number;
  balance_due: number;
  payment_status: string;
  start_date?: string;
  expected_completion_date?: string;
  project_manager?: string;
  total_budget_items: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectReceipt {
  project_id: string;
  receipt_id: string;
  project_name: string;
  description?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_company?: string;
  customer_address?: string;
  site_address?: string;
  site_city?: string;
  site_area?: number;
  site_conditions?: string;
  total_materials_cost: number;
  total_labor_cost: number;
  total_equipment_cost: number;
  total_other_cost: number;
  subtotal: number;
  overhead_percentage: number;
  overhead_amount: number;
  profit_margin_percentage: number;
  profit_amount: number;
  total_project_cost: number;
  amount_paid: number;
  balance_due: number;
  payment_status: string;
  start_date?: string;
  expected_completion_date?: string;
  quote_date: string;
  company_name?: string;
  company_phone?: string;
  company_email?: string;
  company_address?: string;
}

// Form interfaces for UI
export interface BudgetItemForm {
  id?: string;
  item_name: string;
  item_description: string;
  category: 'Material' | 'Labor' | 'Equipment' | 'Transport' | 'Permit' | 'Subcontractor' | 'Other';
  quantity: number;
  unit: string;
  unit_price: number;
  supplier_name: string;
  supplier_contact: string;
  expected_delivery_date: string;
  notes: string;
}
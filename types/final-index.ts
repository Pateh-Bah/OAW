// Database Types for OAW System - Final Relational Structure

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CompanySettings {
  id: string;
  company_name: string;
  company_logo_url?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  tax_id?: string;
  default_overhead_percentage: number;
  default_profit_margin: number;
  project_number_prefix: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  project_number: string; // Auto-generated like PRJ-2025-0001
  
  // Basic Info
  name: string;
  description?: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  
  // Relationships
  customer_id: string; // Required
  company_settings_id?: string; // Link to company settings
  
  // Timeline
  start_date?: string;
  expected_completion_date?: string;
  actual_completion_date?: string;
  installation_progress: number; // 0-100
  
  // Budget Totals (calculated from budget_items)
  total_materials_cost: number;
  total_labor_cost: number; // Removed workmanship_fee
  total_equipment_cost: number;
  total_other_cost: number;
  
  // Manual Entries
  overhead_percentage: number;
  profit_margin_percentage: number;
  
  // Calculated fields (read-only)
  subtotal: number;
  overhead_amount: number;
  profit_amount: number;
  total_project_cost: number;
  
  // Payment
  amount_paid: number;
  payment_status: 'Pending' | 'Partial' | 'Paid' | 'Overdue';
  
  // Management
  project_manager?: string;
  notes?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Joined data
  customer?: Customer;
  site?: Site;
  budget?: Budget;
  company_settings?: CompanySettings;
}

export interface Site {
  id: string;
  project_id: string; // Required - cannot exist without project
  
  // Site Details
  site_name?: string;
  site_address: string; // Required
  site_city?: string;
  site_state?: string;
  site_country?: string;
  site_coordinates?: string; // GPS
  
  // Site Specifications
  site_area?: number; // in square meters
  site_access?: string; // access conditions
  site_conditions?: string; // ground conditions, etc.
  special_requirements?: string;
  
  // Media
  site_images?: string[]; // Array of image URLs
  site_drawings_url?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Joined data
  project?: Project;
}

export interface Budget {
  id: string;
  project_id: string; // Required - cannot exist without project
  
  // Budget Details
  budget_name?: string;
  budget_description?: string;
  budget_date?: string;
  
  // Status
  budget_status: 'Draft' | 'Approved' | 'Revised' | 'Final';
  approved_by?: string;
  approved_date?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Joined data
  project?: Project;
  budget_items?: BudgetItem[];
}

export interface BudgetItem {
  id: string;
  budget_id: string; // Required
  project_id: string; // Required - direct link to project
  
  // Item Details
  item_name: string;
  item_description?: string;
  category: 'Material' | 'Labor' | 'Equipment' | 'Transport' | 'Permit' | 'Subcontractor' | 'Other';
  
  // Cost Calculation
  quantity: number;
  unit: string; // piece, kg, m2, hour, etc.
  unit_price: number;
  total_price: number; // Calculated: quantity * unit_price
  
  // Supplier Information
  supplier_name?: string;
  supplier_contact?: string;
  expected_delivery_date?: string;
  
  // Status
  item_status: 'Pending' | 'Ordered' | 'Delivered' | 'Used' | 'Cancelled';
  notes?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Joined data
  budget?: Budget;
  project?: Project;
}

export interface ProjectMedia {
  id: string;
  project_id: string;
  
  // Media Details
  media_url: string;
  file_name?: string;
  media_type: 'image' | 'video' | 'document' | 'drawing';
  file_size?: number;
  caption?: string;
  
  // Progress Stage
  progress_stage?: 'Before' | 'During' | 'After' | 'Completion' | 'Inspection';
  
  // Metadata
  uploaded_by?: string;
  created_at: string;
  
  // Joined data
  project?: Project;
}

// Receipt interface for printable receipts
export interface ProjectReceipt {
  project_id: string;
  receipt_id: string; // Same as project_number
  project_name: string;
  description?: string;
  
  // Customer Info
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_company?: string;
  customer_address?: string;
  
  // Site Info
  site_address?: string;
  site_city?: string;
  site_area?: number;
  site_conditions?: string;
  
  // Financial Summary
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
  
  // Dates
  start_date?: string;
  expected_completion_date?: string;
  quote_date: string;
  
  // Company Info
  company_name?: string;
  company_phone?: string;
  company_email?: string;
  company_address?: string;
}

// Form interfaces for UI
export interface CreateProjectData {
  name: string;
  description?: string;
  customer_id: string;
  status?: Project['status'];
  priority?: Project['priority'];
  start_date?: string;
  expected_completion_date?: string;
  overhead_percentage?: number;
  profit_margin_percentage?: number;
  project_manager?: string;
  notes?: string;
  
  // Site data (embedded in project form)
  site_name?: string;
  site_address: string;
  site_city?: string;
  site_state?: string;
  site_area?: number;
  site_conditions?: string;
  site_access?: string;
  special_requirements?: string;
  
  // Budget items (dynamic array)
  budget_items: BudgetItemForm[];
}

export interface BudgetItemForm {
  id?: string; // For editing existing items
  item_name: string;
  item_description?: string;
  category: BudgetItem['category'];
  quantity: number;
  unit: string;
  unit_price: number;
  supplier_name?: string;
  supplier_contact?: string;
  expected_delivery_date?: string;
  notes?: string;
}

export interface CustomerOption {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  company?: string;
}

// Project Overview for listing
export interface ProjectOverview {
  id: string;
  project_number: string;
  name: string;
  status: string;
  priority: string;
  installation_progress: number;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  site_address?: string;
  site_city?: string;
  total_project_cost: number;
  amount_paid: number;
  balance_due: number;
  payment_status: string;
  start_date?: string;
  expected_completion_date?: string;
  created_at: string;
  total_budget_items: number;
}

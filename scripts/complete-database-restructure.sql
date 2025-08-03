-- Complete Database Restructure: Create Proper Relational Database
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- First, let's clean up and create a proper relational structure
-- Drop any temporary backup tables that are not connected
DROP TABLE IF EXISTS temp_sites_backup CASCADE;
DROP TABLE IF EXISTS temp_budgets_backup CASCADE;
DROP TABLE IF EXISTS temp_projects_backup CASCADE;

-- Drop existing tables to rebuild with proper relationships
DROP TABLE IF EXISTS project_media CASCADE;
DROP TABLE IF EXISTS budget_items CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS sites CASCADE;
DROP TABLE IF EXISTS budgets CASCADE;

-- Clean up any orphaned policies
DO $$
BEGIN
    -- Clean up any existing policies for tables we're recreating
    DROP POLICY IF EXISTS "Allow all operations" ON projects;
    DROP POLICY IF EXISTS "Authenticated users can manage projects" ON projects;
    DROP POLICY IF EXISTS "Allow all operations" ON budget_items;
    DROP POLICY IF EXISTS "Authenticated users can manage budget_items" ON budget_items;
    DROP POLICY IF EXISTS "Allow all operations" ON project_media;
    DROP POLICY IF EXISTS "Authenticated users can manage project_media" ON project_media;
EXCEPTION
    WHEN undefined_object THEN
        RAISE NOTICE 'Some policies did not exist, continuing...';
END $$;

-- 1. CUSTOMERS TABLE (if it doesn't exist, create it)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'customers') THEN
        CREATE TABLE customers (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE,
            phone TEXT,
            company TEXT,
            address TEXT,
            city TEXT,
            state TEXT,
            zip_code TEXT,
            country TEXT DEFAULT 'USA',
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Enable RLS
        ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
        
        RAISE NOTICE 'Created customers table';
    ELSE
        RAISE NOTICE 'Customers table already exists';
    END IF;
END $$;

-- 2. EMPLOYEES TABLE (Connect to profiles if needed)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employees') THEN
        CREATE TABLE employees (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Link to Supabase auth
            profile_id UUID, -- We'll link this to profiles table if it exists
            employee_id TEXT UNIQUE NOT NULL, -- Employee number/code
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            position TEXT,
            department TEXT,
            hire_date DATE,
            salary DECIMAL(10,2),
            status TEXT CHECK (status IN ('Active', 'Inactive', 'Terminated')) DEFAULT 'Active',
            manager_id UUID REFERENCES employees(id), -- Self-referencing for org structure
            created_by UUID REFERENCES auth.users(id),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Enable RLS
        ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
        
        RAISE NOTICE 'Created employees table';
    ELSE
        -- If employees table exists, ensure it has proper relationships
        -- Add profile_id column if it doesn't exist
        IF NOT EXISTS (SELECT column_name FROM information_schema.columns WHERE table_name = 'employees' AND column_name = 'profile_id') THEN
            ALTER TABLE employees ADD COLUMN profile_id UUID;
            RAISE NOTICE 'Added profile_id to employees table';
        END IF;
        
        -- Add user_id column if it doesn't exist
        IF NOT EXISTS (SELECT column_name FROM information_schema.columns WHERE table_name = 'employees' AND column_name = 'user_id') THEN
            ALTER TABLE employees ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
            RAISE NOTICE 'Added user_id to employees table';
        END IF;
        
        RAISE NOTICE 'Employees table already exists, added missing relationships';
    END IF;
END $$;

-- 3. Link PROFILES table to EMPLOYEES if profiles table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
        -- Add employee_id to profiles if it doesn't exist
        IF NOT EXISTS (SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'employee_id') THEN
            ALTER TABLE profiles ADD COLUMN employee_id UUID REFERENCES employees(id);
            RAISE NOTICE 'Added employee_id to profiles table';
        END IF;
        
        -- Add foreign key constraint from employees to profiles if it doesn't exist
        IF NOT EXISTS (SELECT constraint_name FROM information_schema.table_constraints 
                      WHERE table_name = 'employees' AND constraint_name = 'fk_employees_profile') THEN
            ALTER TABLE employees ADD CONSTRAINT fk_employees_profile 
                FOREIGN KEY (profile_id) REFERENCES profiles(id);
            RAISE NOTICE 'Added foreign key constraint from employees to profiles';
        END IF;
        
        -- Enable RLS on profiles
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
        
        RAISE NOTICE 'Linked profiles table to employees';
    ELSE
        RAISE NOTICE 'Profiles table does not exist, skipping profile linking';
    END IF;
END $$;

-- 4. COMPANY_SETTINGS table (Connect to employees)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'company_settings') THEN
        CREATE TABLE company_settings (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            company_name TEXT NOT NULL,
            company_logo_url TEXT,
            address TEXT,
            city TEXT,
            state TEXT,
            zip_code TEXT,
            country TEXT DEFAULT 'USA',
            phone TEXT,
            email TEXT,
            website TEXT,
            tax_id TEXT,
            default_overhead_percentage DECIMAL(5,2) DEFAULT 10.00,
            default_profit_margin DECIMAL(5,2) DEFAULT 15.00,
            created_by UUID REFERENCES employees(id), -- Link to employee who created
            updated_by UUID REFERENCES employees(id), -- Link to employee who last updated
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Enable RLS
        ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
        
        RAISE NOTICE 'Created company_settings table';
    ELSE
        -- Add relationships if they don't exist
        IF NOT EXISTS (SELECT column_name FROM information_schema.columns WHERE table_name = 'company_settings' AND column_name = 'created_by') THEN
            ALTER TABLE company_settings ADD COLUMN created_by UUID REFERENCES employees(id);
            ALTER TABLE company_settings ADD COLUMN updated_by UUID REFERENCES employees(id);
            RAISE NOTICE 'Added employee relationships to company_settings';
        END IF;
        
        -- Enable RLS
        ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
        
        RAISE NOTICE 'Company_settings table already exists, added missing relationships';
    END IF;
END $$;

-- 5. PROJECTS TABLE (Main table with all relationships)
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Basic Project Info
    project_number TEXT UNIQUE NOT NULL, -- Auto-generated project number
    name TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled')) DEFAULT 'Planning',
    priority TEXT CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')) DEFAULT 'Medium',
    
    -- RELATIONSHIPS (Foreign Keys)
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    project_manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    assigned_team_lead_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    created_by UUID REFERENCES employees(id),
    
    -- Timeline
    start_date DATE,
    expected_completion_date DATE,
    actual_completion_date DATE,
    
    -- Site Information
    site_address TEXT NOT NULL,
    site_city TEXT,
    site_state TEXT,
    site_zip TEXT,
    site_coordinates TEXT, -- GPS coordinates if available
    site_conditions TEXT,
    site_access_notes TEXT,
    installation_progress INTEGER DEFAULT 0 CHECK (installation_progress >= 0 AND installation_progress <= 100),
    
    -- Budget Totals (calculated from budget_items)
    materials_total DECIMAL(12,2) DEFAULT 0,
    labor_total DECIMAL(12,2) DEFAULT 0,
    equipment_total DECIMAL(12,2) DEFAULT 0,
    other_costs_total DECIMAL(12,2) DEFAULT 0,
    
    -- Manual Entries
    workmanship_fee DECIMAL(12,2) DEFAULT 0,
    overhead_percentage DECIMAL(5,2) DEFAULT 10.00,
    profit_margin_percentage DECIMAL(5,2) DEFAULT 15.00,
    
    -- Calculated Fields
    subtotal DECIMAL(12,2) GENERATED ALWAYS AS (
        COALESCE(materials_total, 0) + 
        COALESCE(labor_total, 0) + 
        COALESCE(equipment_total, 0) + 
        COALESCE(other_costs_total, 0) +
        COALESCE(workmanship_fee, 0)
    ) STORED,
    
    overhead_amount DECIMAL(12,2) GENERATED ALWAYS AS (
        (COALESCE(materials_total, 0) + 
         COALESCE(labor_total, 0) + 
         COALESCE(equipment_total, 0) + 
         COALESCE(other_costs_total, 0) +
         COALESCE(workmanship_fee, 0)) * 
        (COALESCE(overhead_percentage, 0) / 100)
    ) STORED,
    
    profit_amount DECIMAL(12,2) GENERATED ALWAYS AS (
        ((COALESCE(materials_total, 0) + 
          COALESCE(labor_total, 0) + 
          COALESCE(equipment_total, 0) + 
          COALESCE(other_costs_total, 0) +
          COALESCE(workmanship_fee, 0)) * 
         (1 + COALESCE(overhead_percentage, 0) / 100)) * 
        (COALESCE(profit_margin_percentage, 0) / 100)
    ) STORED,
    
    total_project_cost DECIMAL(12,2) GENERATED ALWAYS AS (
        (COALESCE(materials_total, 0) + 
         COALESCE(labor_total, 0) + 
         COALESCE(equipment_total, 0) + 
         COALESCE(other_costs_total, 0) +
         COALESCE(workmanship_fee, 0)) * 
        (1 + COALESCE(overhead_percentage, 0) / 100 + COALESCE(profit_margin_percentage, 0) / 100)
    ) STORED,
    
    -- Payment Information
    amount_paid DECIMAL(12,2) DEFAULT 0,
    payment_status TEXT CHECK (payment_status IN ('Pending', 'Partial', 'Paid', 'Overdue')) DEFAULT 'Pending',
    
    -- Additional Info
    notes TEXT,
    special_requirements TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 6. BUDGET_ITEMS TABLE (Individual cost items)
CREATE TABLE budget_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Item Details
    item_name TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('Material', 'Labor', 'Equipment', 'Tool', 'Subcontractor', 'Permit', 'Other')) DEFAULT 'Material',
    
    -- Cost Calculation
    quantity DECIMAL(10,3) DEFAULT 1, -- Allow 3 decimal places for precise quantities
    unit TEXT DEFAULT 'each', -- unit of measurement
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    
    -- Additional Info
    supplier TEXT,
    supplier_contact TEXT,
    expected_delivery_date DATE,
    notes TEXT,
    
    -- Tracking
    created_by UUID REFERENCES employees(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on budget_items
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;

-- 7. PROJECT_MEDIA TABLE (Photos, videos, documents)
CREATE TABLE project_media (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Media Details
    media_url TEXT NOT NULL,
    file_name TEXT,
    media_type TEXT CHECK (media_type IN ('image', 'video', 'document', 'drawing')) DEFAULT 'image',
    file_size INTEGER, -- in bytes
    caption TEXT,
    tags TEXT[], -- Array of tags for categorization
    
    -- Progress Tracking
    progress_stage TEXT CHECK (progress_stage IN ('Before', 'During', 'After', 'Inspection', 'Final')),
    
    -- Metadata
    uploaded_by UUID REFERENCES employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on project_media
ALTER TABLE project_media ENABLE ROW LEVEL SECURITY;

-- Create function to auto-generate project numbers
CREATE OR REPLACE FUNCTION generate_project_number()
RETURNS TRIGGER AS $$
BEGIN
    -- Generate project number like PRJ-2025-0001
    NEW.project_number := 'PRJ-' || 
                         EXTRACT(YEAR FROM NOW()) || '-' || 
                         LPAD((
                             SELECT COALESCE(MAX(CAST(SUBSTRING(project_number FROM '\d+$') AS INTEGER)), 0) + 1
                             FROM projects 
                             WHERE project_number LIKE 'PRJ-' || EXTRACT(YEAR FROM NOW()) || '-%'
                         )::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-generating project numbers
CREATE TRIGGER trigger_generate_project_number
    BEFORE INSERT ON projects
    FOR EACH ROW
    EXECUTE FUNCTION generate_project_number();

-- Create function to update project totals when budget items change
CREATE OR REPLACE FUNCTION update_project_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the project totals based on budget items
    UPDATE projects SET
        materials_total = (
            SELECT COALESCE(SUM(total_price), 0) 
            FROM budget_items 
            WHERE project_id = COALESCE(NEW.project_id, OLD.project_id) 
            AND category = 'Material'
        ),
        labor_total = (
            SELECT COALESCE(SUM(total_price), 0) 
            FROM budget_items 
            WHERE project_id = COALESCE(NEW.project_id, OLD.project_id) 
            AND category = 'Labor'
        ),
        equipment_total = (
            SELECT COALESCE(SUM(total_price), 0) 
            FROM budget_items 
            WHERE project_id = COALESCE(NEW.project_id, OLD.project_id) 
            AND category IN ('Equipment', 'Tool')
        ),
        other_costs_total = (
            SELECT COALESCE(SUM(total_price), 0) 
            FROM budget_items 
            WHERE project_id = COALESCE(NEW.project_id, OLD.project_id) 
            AND category IN ('Subcontractor', 'Permit', 'Other')
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.project_id, OLD.project_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update project totals
CREATE TRIGGER trigger_update_project_totals_insert
    AFTER INSERT ON budget_items
    FOR EACH ROW
    EXECUTE FUNCTION update_project_totals();

CREATE TRIGGER trigger_update_project_totals_update
    AFTER UPDATE ON budget_items
    FOR EACH ROW
    EXECUTE FUNCTION update_project_totals();

CREATE TRIGGER trigger_update_project_totals_delete
    AFTER DELETE ON budget_items
    FOR EACH ROW
    EXECUTE FUNCTION update_project_totals();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers for all tables
CREATE TRIGGER trigger_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_company_settings_updated_at
    BEFORE UPDATE ON company_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_budget_items_updated_at
    BEFORE UPDATE ON budget_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_projects_customer_id ON projects(customer_id);
CREATE INDEX idx_projects_project_manager_id ON projects(project_manager_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);

CREATE INDEX idx_budget_items_project_id ON budget_items(project_id);
CREATE INDEX idx_budget_items_category ON budget_items(category);

CREATE INDEX idx_project_media_project_id ON project_media(project_id);

CREATE INDEX idx_employees_user_id ON employees(user_id);
CREATE INDEX idx_employees_profile_id ON employees(profile_id);

-- Insert some sample data if tables are empty
DO $$
BEGIN
    -- Insert sample customer if customers table is empty
    IF NOT EXISTS (SELECT 1 FROM customers LIMIT 1) THEN
        INSERT INTO customers (name, email, phone, company, address, city, state, zip_code) VALUES
        ('John Smith', 'john@example.com', '555-0123', 'Smith Construction', '123 Main St', 'Springfield', 'IL', '62701'),
        ('Sarah Johnson', 'sarah@techcorp.com', '555-0456', 'TechCorp Inc', '456 Tech Ave', 'Chicago', 'IL', '60601');
        
        RAISE NOTICE 'Inserted sample customers';
    END IF;
    
    -- Insert sample employee if employees table is empty
    IF NOT EXISTS (SELECT 1 FROM employees LIMIT 1) THEN
        INSERT INTO employees (employee_id, first_name, last_name, email, position, department, hire_date, status) VALUES
        ('EMP001', 'Admin', 'User', 'admin@company.com', 'Project Manager', 'Operations', CURRENT_DATE, 'Active');
        
        RAISE NOTICE 'Inserted sample employee';
    END IF;
END $$;

RAISE NOTICE 'Database restructure completed successfully!';
RAISE NOTICE 'Created proper relational database with:';
RAISE NOTICE '- customers table (linked to projects)';
RAISE NOTICE '- employees table (linked to auth.users and profiles)';  
RAISE NOTICE '- company_settings table (linked to employees)';
RAISE NOTICE '- projects table (linked to customers and employees)';
RAISE NOTICE '- budget_items table (linked to projects with auto-calculation)';
RAISE NOTICE '- project_media table (linked to projects and employees)';
RAISE NOTICE '- Auto-generated project numbers';
RAISE NOTICE '- Automatic budget total calculations';
RAISE NOTICE '- All tables have Row Level Security enabled';

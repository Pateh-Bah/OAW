-- ===================================================================
-- COMPLETE OVERHEAD ALUMINIUM WORKSHOP DATABASE SETUP
-- Single file containing all required tables and data
-- Run this once in your Supabase SQL Editor
-- ===================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================================================
-- STEP 1: BASE TABLES (Using existing schema structure)
-- ===================================================================

-- Company Settings Table (matches existing schema)
CREATE TABLE IF NOT EXISTS company_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_name TEXT DEFAULT 'Overhead Aluminium Workshop',
    logo_url TEXT,
    primary_color TEXT DEFAULT '#0066CC',
    office_image_url TEXT,
    contact_info JSONB DEFAULT '{"email": "overheadaluminiumworkshop@gmail.com", "phone1": "+232-77-902-889", "phone2": "+232-31-902-889", "address": "8 Hill Cot Road, Freetown", "website": "https://www.overheadaluminium.com"}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services Table (create if not exists)
DROP TABLE IF EXISTS services CASCADE;
CREATE TABLE services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_name TEXT NOT NULL,
    service_description TEXT,
    service_category TEXT CHECK (service_category IN ('Installation', 'Repair', 'Maintenance', 'Consultation', 'Custom Work')) DEFAULT 'Installation',
    base_rate DECIMAL(10,2) DEFAULT 0,
    unit TEXT DEFAULT 'hour',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: customers and employees tables already exist from your schema.sql

-- ===================================================================
-- STEP 2: PROJECT MANAGEMENT TABLES (Receipt-Style Structure)
-- ===================================================================

-- Clean up any existing project tables first
-- Note: This will recreate the tables with the new receipt-style structure
DROP TABLE IF EXISTS project_services CASCADE;
DROP TABLE IF EXISTS budget_items CASCADE;
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS sites CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- Projects Table (Main receipt-style table)
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_number TEXT UNIQUE NOT NULL,
    
    -- Basic Info
    name TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled')) DEFAULT 'Planning',
    priority TEXT CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')) DEFAULT 'Medium',
    
    -- Required Customer (Foreign Key to existing customers table)
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    
    -- Optional Links to existing tables
    company_settings_id UUID REFERENCES company_settings(id),
    project_manager_id UUID REFERENCES employees(id),
    primary_service_id UUID REFERENCES services(id),
    
    -- Timeline
    start_date DATE,
    expected_completion_date DATE,
    installation_progress INTEGER DEFAULT 0 CHECK (installation_progress >= 0 AND installation_progress <= 100),
    
    -- Receipt-Style Cost Structure (Simplified)
    total_items_cost DECIMAL(12,2) DEFAULT 0, -- Sum of all budget items
    labor_cost DECIMAL(12,2) DEFAULT 0, -- Manual entry
    manual_cost DECIMAL(12,2) DEFAULT 0, -- Additional manual costs
    
    -- Auto-calculated total project cost
    total_project_cost DECIMAL(12,2) GENERATED ALWAYS AS (
        COALESCE(total_items_cost, 0) + 
        COALESCE(labor_cost, 0) + 
        COALESCE(manual_cost, 0)
    ) STORED,
    
    -- Payment tracking
    amount_paid DECIMAL(12,2) DEFAULT 0,
    payment_status TEXT CHECK (payment_status IN ('Pending', 'Partial', 'Paid', 'Overdue')) DEFAULT 'Pending',
    
    -- Management
    project_manager TEXT, -- Backup/override for project_manager_id
    notes TEXT,
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sites Table (One site per project)
CREATE TABLE sites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    
    site_name TEXT,
    site_address TEXT NOT NULL,
    site_city TEXT DEFAULT 'Freetown',
    site_state TEXT DEFAULT 'Western Area',
    site_area DECIMAL(10,2),
    site_conditions TEXT,
    site_access TEXT,
    special_requirements TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(project_id) -- One site per project
);

-- Budgets Table (One budget per project)
CREATE TABLE budgets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    
    budget_name TEXT DEFAULT 'Project Budget',
    budget_status TEXT CHECK (budget_status IN ('Draft', 'Approved', 'Revised', 'Final')) DEFAULT 'Draft',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(project_id) -- One budget per project
);

-- Budget Items Table (Receipt-style line items)
CREATE TABLE budget_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Receipt-style item details
    item_name TEXT NOT NULL,
    item_description TEXT,
    category TEXT CHECK (category IN ('Material', 'Labor', 'Equipment', 'Transport', 'Permit', 'Subcontractor', 'Other')) DEFAULT 'Material',
    
    quantity DECIMAL(10,3) DEFAULT 1,
    unit TEXT DEFAULT 'unit',
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    
    -- Supplier info
    supplier_name TEXT,
    supplier_contact TEXT,
    expected_delivery_date DATE,
    
    -- Assignment to employee
    assigned_employee_id UUID REFERENCES employees(id),
    
    item_status TEXT CHECK (item_status IN ('Pending', 'Ordered', 'Delivered', 'Used', 'Cancelled')) DEFAULT 'Pending',
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Services Table (Many-to-many relationship)
CREATE TABLE project_services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    
    -- Service-specific details for this project
    service_quantity DECIMAL(10,2) DEFAULT 1,
    service_rate DECIMAL(10,2), -- Override default service rate if needed
    service_notes TEXT,
    service_status TEXT CHECK (service_status IN ('Planned', 'In Progress', 'Completed', 'Cancelled')) DEFAULT 'Planned',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique service per project
    UNIQUE(project_id, service_id)
);

-- ===================================================================
-- STEP 3: TRIGGERS AND FUNCTIONS
-- ===================================================================

-- Auto-generate project numbers
CREATE OR REPLACE FUNCTION generate_project_number()
RETURNS TRIGGER AS $$
DECLARE
    prefix TEXT := 'PRJ';
    year_part TEXT := EXTRACT(YEAR FROM NOW())::TEXT;
    sequence_num INTEGER;
BEGIN
    -- Generate sequence number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(project_number FROM '\d+$') AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM projects 
    WHERE project_number LIKE prefix || '-' || year_part || '-%';
    
    NEW.project_number := prefix || '-' || year_part || '-' || LPAD(sequence_num::TEXT, 4, '0');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for project numbers
DROP TRIGGER IF EXISTS trigger_generate_project_number ON projects;
CREATE TRIGGER trigger_generate_project_number
    BEFORE INSERT ON projects
    FOR EACH ROW
    EXECUTE FUNCTION generate_project_number();

-- Function to update project totals
CREATE OR REPLACE FUNCTION update_project_totals()
RETURNS TRIGGER AS $$
DECLARE
    target_project_id UUID;
BEGIN
    target_project_id := COALESCE(NEW.project_id, OLD.project_id);
    
    UPDATE projects SET
        total_items_cost = (
            SELECT COALESCE(SUM(bi.total_price), 0)
            FROM budget_items bi
            JOIN budgets b ON bi.budget_id = b.id
            WHERE b.project_id = target_project_id
        ),
        updated_at = NOW()
    WHERE id = target_project_id;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for project totals
DROP TRIGGER IF EXISTS trigger_update_project_totals_insert ON budget_items;
DROP TRIGGER IF EXISTS trigger_update_project_totals_update ON budget_items;
DROP TRIGGER IF EXISTS trigger_update_project_totals_delete ON budget_items;

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

-- ===================================================================
-- STEP 4: INDEXES FOR PERFORMANCE
-- ===================================================================

CREATE INDEX IF NOT EXISTS idx_projects_customer_id ON projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_projects_company_settings_id ON projects(company_settings_id);
CREATE INDEX IF NOT EXISTS idx_projects_project_manager_id ON projects(project_manager_id);
CREATE INDEX IF NOT EXISTS idx_projects_primary_service_id ON projects(primary_service_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_sites_project_id ON sites(project_id);
CREATE INDEX IF NOT EXISTS idx_budgets_project_id ON budgets(project_id);
CREATE INDEX IF NOT EXISTS idx_budget_items_budget_id ON budget_items(budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_items_project_id ON budget_items(project_id);
CREATE INDEX IF NOT EXISTS idx_budget_items_assigned_employee_id ON budget_items(assigned_employee_id);
CREATE INDEX IF NOT EXISTS idx_budget_items_category ON budget_items(category);
CREATE INDEX IF NOT EXISTS idx_project_services_project_id ON project_services(project_id);
CREATE INDEX IF NOT EXISTS idx_project_services_service_id ON project_services(service_id);

-- ===================================================================
-- STEP 5: ROW LEVEL SECURITY (RLS)
-- ===================================================================

-- Enable RLS on all tables
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_services ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for authenticated users - adjust as needed)
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON company_settings;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON services;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON projects;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON sites;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON budgets;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON budget_items;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON project_services;

CREATE POLICY "Allow all operations for authenticated users" ON company_settings FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all operations for authenticated users" ON services FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all operations for authenticated users" ON projects FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all operations for authenticated users" ON sites FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all operations for authenticated users" ON budgets FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all operations for authenticated users" ON budget_items FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all operations for authenticated users" ON project_services FOR ALL USING (auth.uid() IS NOT NULL);

-- Grant permissions
GRANT ALL ON company_settings TO authenticated;
GRANT ALL ON services TO authenticated;
GRANT ALL ON projects TO authenticated;
GRANT ALL ON sites TO authenticated;
GRANT ALL ON budgets TO authenticated;
GRANT ALL ON budget_items TO authenticated;
GRANT ALL ON project_services TO authenticated;

-- ===================================================================
-- STEP 6: SAMPLE DATA
-- ===================================================================

-- Insert sample company settings (using existing schema structure)
INSERT INTO company_settings (company_name, contact_info) VALUES 
('Overhead Aluminium Workshop', '{"email": "overheadaluminiumworkshop@gmail.com", "phone1": "+232-77-902-889", "phone2": "+232-31-902-889", "address": "Business District, Freetown, Sierra Leone", "website": "https://www.overheadaluminium.com"}')
ON CONFLICT (id) DO NOTHING;

-- Insert sample services
INSERT INTO services (service_name, service_description, service_category, base_rate, unit) VALUES
('Window Installation', 'Complete aluminum window installation service', 'Installation', 50.00, 'unit'),
('Door Installation', 'Aluminum door installation and fitting', 'Installation', 75.00, 'unit'),
('Roofing Work', 'Aluminum roofing installation and repair', 'Installation', 30.00, 'sqm'),
('Custom Fabrication', 'Custom aluminum work and fabrication', 'Custom Work', 40.00, 'hour'),
('Maintenance Service', 'Regular maintenance of aluminum structures', 'Maintenance', 25.00, 'hour')
ON CONFLICT (id) DO NOTHING;

-- Insert sample customers (using correct column names)
INSERT INTO customers (full_name, phone_number, email) VALUES
('John Kamara', '+232-77-123-456', 'john.kamara@email.com'),
('Sarah Bangura', '+232-74-789-012', 'sarah.bangura@email.com'),
('Mohamed Sesay', '+232-31-345-678', 'mohamed.sesay@email.com')
ON CONFLICT (id) DO NOTHING;

-- Insert sample employees (using correct column names)
INSERT INTO employees (full_name, designation, department) VALUES
('Ibrahim Koroma', 'Project Manager', 'Operations'),
('Fatima Turay', 'Site Supervisor', 'Operations'),
('Abdul Mansaray', 'Installation Technician', 'Technical'),
('Mariama Kargbo', 'Quality Inspector', 'Quality Control')
ON CONFLICT (id) DO NOTHING;

-- ===================================================================
-- STEP 7: CREATE SAMPLE PROJECT (Receipt-Style)
-- ===================================================================

DO $$
DECLARE
    sample_customer_id UUID;
    sample_project_id UUID;
    sample_budget_id UUID;
    sample_employee_id UUID;
    sample_service_id UUID;
    sample_company_settings_id UUID;
BEGIN
    -- Get existing data for linking
    SELECT id INTO sample_customer_id FROM customers LIMIT 1;
    SELECT id INTO sample_employee_id FROM employees LIMIT 1;
    SELECT id INTO sample_service_id FROM services LIMIT 1;
    SELECT id INTO sample_company_settings_id FROM company_settings LIMIT 1;
    
    IF sample_customer_id IS NOT NULL THEN
        -- Insert sample project with receipt-style structure
        INSERT INTO projects (
            name, 
            description, 
            customer_id, 
            company_settings_id,
            project_manager_id,
            primary_service_id,
            status, 
            start_date, 
            expected_completion_date, 
            installation_progress,
            labor_cost,
            manual_cost
        )
        VALUES (
            'Complete Aluminum Installation Project', 
            'Comprehensive project showcasing receipt-style cost structure', 
            sample_customer_id,
            sample_company_settings_id,
            sample_employee_id,
            sample_service_id,
            'In Progress', 
            CURRENT_DATE, 
            CURRENT_DATE + INTERVAL '30 days', 
            25,
            2000.00, -- Labor cost
            500.00   -- Manual additional costs
        )
        RETURNING id INTO sample_project_id;
        
        -- Insert sample site
        INSERT INTO sites (project_id, site_name, site_address, site_city, site_area, site_conditions)
        VALUES (sample_project_id, 'Modern Office Complex', '45 Business District Road', 'Freetown', 250.00, 'Excellent access, modern infrastructure');
        
        -- Insert sample budget
        INSERT INTO budgets (project_id, budget_name, budget_status)
        VALUES (sample_project_id, 'Comprehensive Project Budget', 'Approved')
        RETURNING id INTO sample_budget_id;
        
        -- Insert sample budget items (receipt-style items)
        INSERT INTO budget_items (budget_id, project_id, item_name, category, quantity, unit, unit_price, supplier_name, assigned_employee_id) VALUES
        (sample_budget_id, sample_project_id, 'Premium Aluminum Window Frames', 'Material', 10, 'piece', 850.00, 'Premium Aluminum Solutions', sample_employee_id),
        (sample_budget_id, sample_project_id, 'Glass Panels', 'Material', 15, 'piece', 150.00, 'Quality Glass Co', sample_employee_id),
        (sample_budget_id, sample_project_id, 'Installation Hardware', 'Material', 1, 'set', 300.00, 'Hardware Supplies Ltd', sample_employee_id),
        (sample_budget_id, sample_project_id, 'Transportation', 'Transport', 2, 'trip', 200.00, 'OAW Logistics', sample_employee_id);
        
        -- Link services to the project
        INSERT INTO project_services (project_id, service_id, service_quantity, service_notes, service_status)
        VALUES (sample_project_id, sample_service_id, 1, 'Primary service for this project', 'In Progress');
        
        RAISE NOTICE 'Sample receipt-style project created successfully!';
        RAISE NOTICE 'Project ID: % with simplified cost calculation', sample_project_id;
        
    ELSE
        RAISE NOTICE 'Base tables created successfully! Sample project will be created after adding customers.';
    END IF;
END
$$;

-- ===================================================================
-- COMPLETION MESSAGE
-- ===================================================================

DO $$
BEGIN
    RAISE NOTICE '🎉 ===== DATABASE SETUP COMPLETE! =====';
    RAISE NOTICE '✅ All tables created with receipt-style structure';
    RAISE NOTICE '✅ Auto project numbering (PRJ-YYYY-####)';
    RAISE NOTICE '✅ Real-time cost calculations';
    RAISE NOTICE '✅ Sample data inserted';
    RAISE NOTICE '📋 Ready for receipt-style project management!';
    RAISE NOTICE '🚀 Your dashboard should now work perfectly!';
END
$$;

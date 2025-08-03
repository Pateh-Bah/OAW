-- ULTRA-SAFE Database Structure Script with Proper Table Linking
-- This version connects employees, company_settings, and services to appropriate tables

-- Enable Row Level Security and clean up
DROP TABLE IF EXISTS project_services CASCADE;
DROP TABLE IF EXISTS budget_items CASCADE;
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS sites CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- 1. PROJECTS TABLE (Main table)
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_number TEXT UNIQUE NOT NULL,
    
    -- Basic Info
    name TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled')) DEFAULT 'Planning',
    priority TEXT CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')) DEFAULT 'Medium',
    
    -- Required Customer (Foreign Key)
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    
    -- Link to Company Settings (for default values and company info)
    company_settings_id UUID REFERENCES company_settings(id),
    
    -- Link to Employee (Project Manager)
    project_manager_id UUID REFERENCES employees(id),
    
    -- Link to Service (What type of service is this project)
    primary_service_id UUID REFERENCES services(id),
    
    -- Timeline
    start_date DATE,
    expected_completion_date DATE,
    installation_progress INTEGER DEFAULT 0 CHECK (installation_progress >= 0 AND installation_progress <= 100),
    
    -- Budget Summary (from budget_items table)
    total_items_cost DECIMAL(12,2) DEFAULT 0, -- Sum of all budget items
    
    -- Manual entries by admin
    labor_cost DECIMAL(12,2) DEFAULT 0,
    manual_cost DECIMAL(12,2) DEFAULT 0, -- Additional manual costs
    
    -- Calculated total project cost
    total_project_cost DECIMAL(12,2) GENERATED ALWAYS AS (
        COALESCE(total_items_cost, 0) + 
        COALESCE(labor_cost, 0) + 
        COALESCE(manual_cost, 0)
    ) STORED,
    
    -- Payment tracking
    amount_paid DECIMAL(12,2) DEFAULT 0,
    payment_status TEXT CHECK (payment_status IN ('Pending', 'Partial', 'Paid', 'Overdue')) DEFAULT 'Pending',
    
    -- Management
    project_manager TEXT, -- Keep as backup/override for project_manager_id
    notes TEXT,
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SITES TABLE
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
    
    UNIQUE(project_id)
);

-- 3. BUDGETS TABLE
CREATE TABLE budgets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    
    budget_name TEXT DEFAULT 'Project Budget',
    budget_status TEXT CHECK (budget_status IN ('Draft', 'Approved', 'Revised', 'Final')) DEFAULT 'Draft',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(project_id)
);

-- 4. BUDGET_ITEMS TABLE
CREATE TABLE budget_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    
    item_name TEXT NOT NULL,
    item_description TEXT,
    category TEXT CHECK (category IN ('Material', 'Labor', 'Equipment', 'Transport', 'Permit', 'Subcontractor', 'Other')) DEFAULT 'Material',
    
    quantity DECIMAL(10,3) DEFAULT 1,
    unit TEXT DEFAULT 'unit',
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    
    supplier_name TEXT,
    supplier_contact TEXT,
    expected_delivery_date DATE,
    
    -- Link to Employee (who will handle this item)
    assigned_employee_id UUID REFERENCES employees(id),
    
    item_status TEXT CHECK (item_status IN ('Pending', 'Ordered', 'Delivered', 'Used', 'Cancelled')) DEFAULT 'Pending',
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PROJECT_SERVICES TABLE (Many-to-many relationship between projects and services)
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

-- 6. Auto-generate project numbers
CREATE OR REPLACE FUNCTION generate_project_number()
RETURNS TRIGGER AS $$
DECLARE
    prefix TEXT := 'PRJ';
    year_part TEXT := EXTRACT(YEAR FROM NOW())::TEXT;
    sequence_num INTEGER;
BEGIN
    -- Use default prefix (no dependency on company_settings columns)
    prefix := 'PRJ';
    
    -- Generate sequence number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(project_number FROM '\d+$') AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM projects 
    WHERE project_number LIKE prefix || '-' || year_part || '-%';
    
    NEW.project_number := prefix || '-' || year_part || '-' || LPAD(sequence_num::TEXT, 4, '0');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger for project numbers
DROP TRIGGER IF EXISTS trigger_generate_project_number ON projects;
CREATE TRIGGER trigger_generate_project_number
    BEFORE INSERT ON projects
    FOR EACH ROW
    EXECUTE FUNCTION generate_project_number();

-- 7. Function to update project totals
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

-- 8. Create triggers for project totals
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

-- 9. Create indexes
CREATE INDEX idx_projects_customer_id ON projects(customer_id);
CREATE INDEX idx_projects_company_settings_id ON projects(company_settings_id);
CREATE INDEX idx_projects_project_manager_id ON projects(project_manager_id);
CREATE INDEX idx_projects_primary_service_id ON projects(primary_service_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

CREATE INDEX idx_sites_project_id ON sites(project_id);

CREATE INDEX idx_budgets_project_id ON budgets(project_id);

CREATE INDEX idx_budget_items_budget_id ON budget_items(budget_id);
CREATE INDEX idx_budget_items_project_id ON budget_items(project_id);
CREATE INDEX idx_budget_items_assigned_employee_id ON budget_items(assigned_employee_id);
CREATE INDEX idx_budget_items_category ON budget_items(category);

CREATE INDEX idx_project_services_project_id ON project_services(project_id);
CREATE INDEX idx_project_services_service_id ON project_services(service_id);

-- 10. Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_services ENABLE ROW LEVEL SECURITY;

-- 11. Create RLS policies
CREATE POLICY "Allow all operations for authenticated users" ON projects FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all operations for authenticated users" ON sites FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all operations for authenticated users" ON budgets FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all operations for authenticated users" ON budget_items FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all operations for authenticated users" ON project_services FOR ALL USING (auth.uid() IS NOT NULL);

-- 12. Grant permissions
GRANT ALL ON projects TO authenticated;
GRANT ALL ON sites TO authenticated;
GRANT ALL ON budgets TO authenticated;
GRANT ALL ON budget_items TO authenticated;
GRANT ALL ON project_services TO authenticated;

-- 13. Insert sample data with proper linking
DO $$
DECLARE
    sample_customer_id UUID;
    sample_project_id UUID;
    sample_budget_id UUID;
    sample_employee_id UUID;
    sample_service_id UUID;
    sample_company_settings_id UUID;
BEGIN
    -- Get existing data for linking (handle missing tables gracefully)
    BEGIN
        SELECT id INTO sample_customer_id FROM customers LIMIT 1;
    EXCEPTION WHEN others THEN
        sample_customer_id := NULL;
    END;
    
    BEGIN
        SELECT id INTO sample_employee_id FROM employees LIMIT 1;
    EXCEPTION WHEN others THEN
        sample_employee_id := NULL;
    END;
    
    BEGIN
        SELECT id INTO sample_service_id FROM services LIMIT 1;
    EXCEPTION WHEN others THEN
        sample_service_id := NULL;
    END;
    
    BEGIN
        SELECT id INTO sample_company_settings_id FROM company_settings LIMIT 1;
    EXCEPTION WHEN others THEN
        sample_company_settings_id := NULL;
    END;
    
    IF sample_customer_id IS NOT NULL THEN
        -- Insert sample project with available relationships
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
        
        -- Link services to the project if available
        IF sample_service_id IS NOT NULL THEN
            INSERT INTO project_services (project_id, service_id, service_quantity, service_notes, service_status)
            VALUES (sample_project_id, sample_service_id, 1, 'Primary service for this project', 'In Progress');
            
            -- Add additional services if they exist
            BEGIN
                INSERT INTO project_services (project_id, service_id, service_quantity, service_notes, service_status)
                SELECT sample_project_id, id, 1, 'Additional service', 'Planned'
                FROM services 
                WHERE id != sample_service_id 
                LIMIT 2;
            EXCEPTION WHEN others THEN
                -- Ignore if no additional services
                NULL;
            END;
        END IF;
        
        RAISE NOTICE 'Complete sample data with receipt-style structure created successfully!';
        RAISE NOTICE 'Project ID: % with simplified cost calculation', sample_project_id;
        RAISE NOTICE 'Cost Structure: Items (auto-calculated) + Labor (2000) + Manual (500) = Total';
        RAISE NOTICE 'Sample items: Window Frames, Glass Panels, Hardware, Transportation';
        
    ELSE
        RAISE NOTICE 'No customers found. Please create customers first to see full functionality.';
        RAISE NOTICE 'The database structure is ready for receipt-style project management!';
    END IF;
    
    -- Display the new simplified structure
    RAISE NOTICE '=== RECEIPT-STYLE COST STRUCTURE ===';
    RAISE NOTICE 'Items: Tracked in budget_items table with quantity × unit_price';
    RAISE NOTICE 'Labor: Manual entry by admin';
    RAISE NOTICE 'Manual: Additional manual costs';
    RAISE NOTICE 'Total: Auto-calculated (items + labor + manual)';
    RAISE NOTICE 'Removed: workmanship_fee, overhead_percentage, profit_margin_percentage';
END
$$;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '=== ULTRA-SAFE DATABASE STRUCTURE CREATED ===';
    RAISE NOTICE 'Tables: projects, sites, budgets, budget_items';
    RAISE NOTICE 'Features: Auto project numbers, real-time calculations, proper relationships';
    RAISE NOTICE 'Ready to use!';
END
$$;

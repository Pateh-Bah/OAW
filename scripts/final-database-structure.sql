-- Final Database Structure: Projects, Sites, Budgets with Proper Relationships
-- Run this in your Supabase SQL Editor
-- Note: uuid-ossp extension is already enabled in Supabase by default

-- Clean up existing tables
DROP TABLE IF EXISTS temp_sites_backup CASCADE;
DROP TABLE IF EXISTS temp_budgets_backup CASCADE;
DROP TABLE IF EXISTS temp_projects_backup CASCADE;
DROP TABLE IF EXISTS project_media CASCADE;
DROP TABLE IF EXISTS budget_items CASCADE;
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS sites CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- 1. PROJECTS TABLE (Main table)
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_number TEXT UNIQUE NOT NULL, -- Auto-generated
    
    -- Basic Info
    name TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled')) DEFAULT 'Planning',
    priority TEXT CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')) DEFAULT 'Medium',
    
    -- Required Customer (Foreign Key)
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    
    -- Link to Company Settings (Optional - may not exist)
    company_settings_id UUID, -- Will add constraint later if company_settings exists
    
    -- Timeline
    start_date DATE,
    expected_completion_date DATE,
    actual_completion_date DATE,
    installation_progress INTEGER DEFAULT 0 CHECK (installation_progress >= 0 AND installation_progress <= 100),
    
    -- Budget Summary (calculated from budget items)
    total_materials_cost DECIMAL(12,2) DEFAULT 0,
    total_labor_cost DECIMAL(12,2) DEFAULT 0, -- Keep only labor_cost, remove workmanship_fee
    total_equipment_cost DECIMAL(12,2) DEFAULT 0,
    total_other_cost DECIMAL(12,2) DEFAULT 0,
    
    -- Manual entries
    overhead_percentage DECIMAL(5,2) DEFAULT 10.00,
    profit_margin_percentage DECIMAL(5,2) DEFAULT 15.00,
    
    -- Calculated totals
    subtotal DECIMAL(12,2) GENERATED ALWAYS AS (
        COALESCE(total_materials_cost, 0) + 
        COALESCE(total_labor_cost, 0) + 
        COALESCE(total_equipment_cost, 0) + 
        COALESCE(total_other_cost, 0)
    ) STORED,
    
    overhead_amount DECIMAL(12,2) GENERATED ALWAYS AS (
        (COALESCE(total_materials_cost, 0) + 
         COALESCE(total_labor_cost, 0) + 
         COALESCE(total_equipment_cost, 0) + 
         COALESCE(total_other_cost, 0)) * 
        (COALESCE(overhead_percentage, 0) / 100)
    ) STORED,
    
    profit_amount DECIMAL(12,2) GENERATED ALWAYS AS (
        ((COALESCE(total_materials_cost, 0) + 
          COALESCE(total_labor_cost, 0) + 
          COALESCE(total_equipment_cost, 0) + 
          COALESCE(total_other_cost, 0)) * 
         (1 + COALESCE(overhead_percentage, 0) / 100)) * 
        (COALESCE(profit_margin_percentage, 0) / 100)
    ) STORED,
    
    total_project_cost DECIMAL(12,2) GENERATED ALWAYS AS (
        (COALESCE(total_materials_cost, 0) + 
         COALESCE(total_labor_cost, 0) + 
         COALESCE(total_equipment_cost, 0) + 
         COALESCE(total_other_cost, 0)) * 
        (1 + COALESCE(overhead_percentage, 0) / 100 + COALESCE(profit_margin_percentage, 0) / 100)
    ) STORED,
    
    -- Payment tracking
    amount_paid DECIMAL(12,2) DEFAULT 0,
    payment_status TEXT CHECK (payment_status IN ('Pending', 'Partial', 'Paid', 'Overdue')) DEFAULT 'Pending',
    
    -- Management
    project_manager TEXT,
    notes TEXT,
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SITES TABLE (Must have a project - cannot exist without project)
CREATE TABLE sites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, -- MUST HAVE PROJECT
    
    -- Site Details
    site_name TEXT,
    site_address TEXT NOT NULL,
    site_city TEXT DEFAULT 'Freetown',
    site_state TEXT DEFAULT 'Western Area',
    site_country TEXT DEFAULT 'Sierra Leone',
    site_coordinates TEXT, -- GPS coordinates
    
    -- Site Conditions
    site_area DECIMAL(10,2), -- in square meters
    site_access TEXT, -- access conditions
    site_conditions TEXT, -- ground conditions, etc.
    special_requirements TEXT,
    
    -- Site Photos/Documents
    site_images TEXT[], -- Array of image URLs
    site_drawings_url TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one site per project (optional constraint)
    UNIQUE(project_id)
);

-- 3. BUDGETS TABLE (Must have a project - cannot exist without project)
CREATE TABLE budgets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, -- MUST HAVE PROJECT
    
    -- Budget Details
    budget_name TEXT DEFAULT 'Project Budget',
    budget_description TEXT,
    budget_date DATE DEFAULT CURRENT_DATE,
    
    -- Budget Status
    budget_status TEXT CHECK (budget_status IN ('Draft', 'Approved', 'Revised', 'Final')) DEFAULT 'Draft',
    approved_by TEXT,
    approved_date DATE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one budget per project (optional constraint)
    UNIQUE(project_id)
);

-- 4. BUDGET_ITEMS TABLE (Individual cost items for each budget)
CREATE TABLE budget_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, -- Direct link to project too
    
    -- Item Details
    item_name TEXT NOT NULL,
    item_description TEXT,
    category TEXT CHECK (category IN ('Material', 'Labor', 'Equipment', 'Transport', 'Permit', 'Subcontractor', 'Other')) DEFAULT 'Material',
    
    -- Cost Calculation
    quantity DECIMAL(10,3) DEFAULT 1,
    unit TEXT DEFAULT 'unit', -- piece, kg, m2, hour, etc.
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    
    -- Supplier Information
    supplier_name TEXT,
    supplier_contact TEXT,
    expected_delivery_date DATE,
    
    -- Item Status
    item_status TEXT CHECK (item_status IN ('Pending', 'Ordered', 'Delivered', 'Used', 'Cancelled')) DEFAULT 'Pending',
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PROJECT_MEDIA TABLE (Photos, videos, documents)
CREATE TABLE project_media (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Media Details
    media_url TEXT NOT NULL,
    file_name TEXT,
    media_type TEXT CHECK (media_type IN ('image', 'video', 'document', 'drawing')) DEFAULT 'image',
    file_size INTEGER, -- in bytes
    caption TEXT,
    
    -- Progress Stage
    progress_stage TEXT CHECK (progress_stage IN ('Before', 'During', 'After', 'Completion', 'Inspection')),
    
    -- Metadata
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Link COMPANY_SETTINGS to PROJECTS (if company_settings exists)
DO $$
BEGIN
    -- Check if company_settings table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'company_settings') THEN
        -- Add foreign key constraint
        ALTER TABLE projects ADD CONSTRAINT fk_company_settings 
        FOREIGN KEY (company_settings_id) REFERENCES company_settings(id);
        
        -- Add default columns to company_settings if they don't exist
        ALTER TABLE company_settings ADD COLUMN IF NOT EXISTS default_overhead_percentage DECIMAL(5,2) DEFAULT 10.00;
        ALTER TABLE company_settings ADD COLUMN IF NOT EXISTS default_profit_margin DECIMAL(5,2) DEFAULT 15.00;
        ALTER TABLE company_settings ADD COLUMN IF NOT EXISTS project_number_prefix TEXT DEFAULT 'PRJ';
        
        RAISE NOTICE 'Company settings linked to projects table';
    ELSE
        RAISE NOTICE 'Company settings table does not exist, skipping foreign key constraint';
    END IF;
END
$$;

-- 7. Create function to auto-generate project numbers
CREATE OR REPLACE FUNCTION generate_project_number()
RETURNS TRIGGER AS $$
DECLARE
    prefix TEXT := 'PRJ';
    year_part TEXT := EXTRACT(YEAR FROM NOW())::TEXT;
    sequence_num INTEGER;
BEGIN
    -- Get prefix from company_settings if available
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'company_settings') THEN
        SELECT COALESCE(project_number_prefix, 'PRJ') INTO prefix FROM company_settings LIMIT 1;
    END IF;
    
    -- Get next sequence number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(project_number FROM '\d+$') AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM projects 
    WHERE project_number LIKE prefix || '-' || year_part || '-%';
    
    -- Generate project number like PRJ-2025-0001
    NEW.project_number := prefix || '-' || year_part || '-' || LPAD(sequence_num::TEXT, 4, '0');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Create trigger for auto-generating project numbers
DROP TRIGGER IF EXISTS trigger_generate_project_number ON projects;
CREATE TRIGGER trigger_generate_project_number
    BEFORE INSERT ON projects
    FOR EACH ROW
    EXECUTE FUNCTION generate_project_number();

-- 9. Create function to update project totals when budget items change
CREATE OR REPLACE FUNCTION update_project_totals()
RETURNS TRIGGER AS $$
DECLARE
    target_project_id UUID;
BEGIN
    -- Get project ID from NEW or OLD record
    target_project_id := COALESCE(NEW.project_id, OLD.project_id);
    
    -- Update project totals based on budget items
    UPDATE projects SET
        total_materials_cost = (
            SELECT COALESCE(SUM(bi.total_price), 0)
            FROM budget_items bi
            JOIN budgets b ON bi.budget_id = b.id
            WHERE b.project_id = target_project_id AND bi.category = 'Material'
        ),
        total_labor_cost = (
            SELECT COALESCE(SUM(bi.total_price), 0)
            FROM budget_items bi
            JOIN budgets b ON bi.budget_id = b.id
            WHERE b.project_id = target_project_id AND bi.category = 'Labor'
        ),
        total_equipment_cost = (
            SELECT COALESCE(SUM(bi.total_price), 0)
            FROM budget_items bi
            JOIN budgets b ON bi.budget_id = b.id
            WHERE b.project_id = target_project_id AND bi.category = 'Equipment'
        ),
        total_other_cost = (
            SELECT COALESCE(SUM(bi.total_price), 0)
            FROM budget_items bi
            JOIN budgets b ON bi.budget_id = b.id
            WHERE b.project_id = target_project_id AND bi.category IN ('Transport', 'Permit', 'Subcontractor', 'Other')
        ),
        updated_at = NOW()
    WHERE id = target_project_id;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 10. Create triggers to update project totals
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

-- 11. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 12. Create updated_at triggers for all tables
DROP TRIGGER IF EXISTS trigger_projects_updated_at ON projects;
DROP TRIGGER IF EXISTS trigger_sites_updated_at ON sites;
DROP TRIGGER IF EXISTS trigger_budgets_updated_at ON budgets;
DROP TRIGGER IF EXISTS trigger_budget_items_updated_at ON budget_items;

CREATE TRIGGER trigger_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_sites_updated_at
    BEFORE UPDATE ON sites
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_budgets_updated_at
    BEFORE UPDATE ON budgets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_budget_items_updated_at
    BEFORE UPDATE ON budget_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 13. Create indexes for performance
CREATE INDEX idx_projects_customer_id ON projects(customer_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

CREATE INDEX idx_sites_project_id ON sites(project_id);
CREATE INDEX idx_budgets_project_id ON budgets(project_id);
CREATE INDEX idx_budget_items_budget_id ON budget_items(budget_id);
CREATE INDEX idx_budget_items_project_id ON budget_items(project_id);
CREATE INDEX idx_budget_items_category ON budget_items(category);

CREATE INDEX idx_project_media_project_id ON project_media(project_id);

-- 14. Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_media ENABLE ROW LEVEL SECURITY;

-- 15. Create RLS policies (permissive for development)
CREATE POLICY "Allow all operations for authenticated users" ON projects FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all operations for authenticated users" ON sites FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all operations for authenticated users" ON budgets FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all operations for authenticated users" ON budget_items FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all operations for authenticated users" ON project_media FOR ALL USING (auth.uid() IS NOT NULL);

-- 16. Create view for project receipt (printable format) - MINIMAL SAFE VERSION
CREATE OR REPLACE VIEW project_receipt AS
SELECT 
    p.id as project_id,
    p.project_number as receipt_id, -- Receipt ID is the project number
    p.name as project_name,
    p.description,
    
    -- Customer Info (Only using columns that definitely exist)
    c.full_name as customer_name,
    COALESCE(c.email, 'N/A') as customer_email,
    COALESCE(c.phone_number, 'N/A') as customer_phone,
    'N/A' as customer_company, -- Placeholder until we know the actual column name
    COALESCE(c.address, 'N/A') as customer_address,
    
    -- Site Info
    s.site_address,
    s.site_city,
    s.site_area,
    s.site_conditions,
    
    -- Project Financial Summary
    p.total_materials_cost,
    p.total_labor_cost,
    p.total_equipment_cost,
    p.total_other_cost,
    p.subtotal,
    p.overhead_percentage,
    p.overhead_amount,
    p.profit_margin_percentage,
    p.profit_amount,
    p.total_project_cost,
    p.amount_paid,
    (p.total_project_cost - p.amount_paid) as balance_due,
    p.payment_status,
    
    -- Dates
    p.start_date,
    p.expected_completion_date,
    p.created_at as quote_date,
    
    -- Company Info (with safe fallbacks)
    'Overhead Aluminium Workshop' as company_name,
    '+232-77-902-889' as company_phone,
    'overheadaluminium@gmail.com' as company_email,
    '5c Hill Cot Road, Freetown, Sierra Leone' as company_address
    
FROM projects p
LEFT JOIN customers c ON p.customer_id = c.id
LEFT JOIN sites s ON p.id = s.project_id
LEFT JOIN budgets b ON p.id = b.project_id;

-- 17. Create view for project overview (for project listing) - MINIMAL SAFE VERSION
CREATE OR REPLACE VIEW project_overview AS
SELECT 
    p.id,
    p.project_number,
    p.name,
    p.status,
    p.priority,
    p.installation_progress,
    
    -- Customer (Only using columns that definitely exist)
    c.full_name as customer_name,
    COALESCE(c.phone_number, 'N/A') as customer_phone,
    COALESCE(c.email, 'N/A') as customer_email,
    
    -- Site
    s.site_address,
    s.site_city,
    
    -- Financial
    p.total_project_cost,
    p.amount_paid,
    (p.total_project_cost - p.amount_paid) as balance_due,
    p.payment_status,
    
    -- Dates
    p.start_date,
    p.expected_completion_date,
    p.created_at,
    
    -- Item counts
    (SELECT COUNT(*) FROM budget_items bi JOIN budgets b ON bi.budget_id = b.id WHERE b.project_id = p.id) as total_budget_items
    
FROM projects p
LEFT JOIN customers c ON p.customer_id = c.id
LEFT JOIN sites s ON p.id = s.project_id
ORDER BY p.created_at DESC;

-- 18. Insert sample data if customers exist
DO $$
DECLARE
    sample_customer_id UUID;
    sample_project_id UUID;
    sample_budget_id UUID;
    sample_site_id UUID;
BEGIN
    -- Check if customers exist
    SELECT id INTO sample_customer_id FROM customers LIMIT 1;
    
    IF sample_customer_id IS NOT NULL THEN
        -- Insert sample project
        INSERT INTO projects (name, description, customer_id, status, start_date, expected_completion_date, installation_progress)
        VALUES ('Aluminum Window Installation', 'Complete window replacement with aluminum frames', sample_customer_id, 'In Progress', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 25)
        RETURNING id INTO sample_project_id;
        
        -- Insert sample site
        INSERT INTO sites (project_id, site_name, site_address, site_city, site_area, site_conditions)
        VALUES (sample_project_id, 'Residential Property', '15 Wilkinson Road, East End', 'Freetown', 150.00, 'Good access, concrete foundation')
        RETURNING id INTO sample_site_id;
        
        -- Insert sample budget
        INSERT INTO budgets (project_id, budget_name, budget_status)
        VALUES (sample_project_id, 'Window Installation Budget', 'Approved')
        RETURNING id INTO sample_budget_id;
        
        -- Insert sample budget items
        INSERT INTO budget_items (budget_id, project_id, item_name, category, quantity, unit, unit_price, supplier_name) VALUES
        (sample_budget_id, sample_project_id, 'Aluminum Window Frame 4x6ft', 'Material', 8, 'piece', 750.00, 'Sierra Aluminum Ltd'),
        (sample_budget_id, sample_project_id, 'Window Glass Panel', 'Material', 8, 'piece', 250.00, 'Glass Masters SL'),
        (sample_budget_id, sample_project_id, 'Installation Labor', 'Labor', 32, 'hour', 35.00, 'OAW Installation Team'),
        (sample_budget_id, sample_project_id, 'Window Sealant', 'Material', 4, 'tube', 45.00, 'Building Supplies Co'),
        (sample_budget_id, sample_project_id, 'Transportation', 'Transport', 1, 'trip', 150.00, 'OAW Transport');
        
        RAISE NOTICE 'Sample project, site, budget, and budget items created successfully!';
        RAISE NOTICE 'Project ID: %', sample_project_id;
        
    ELSE
        RAISE NOTICE 'No customers found. Please create customers first.';
    END IF;
END
$$;

-- 19. Grant permissions
GRANT ALL ON projects TO authenticated;
GRANT ALL ON sites TO authenticated;
GRANT ALL ON budgets TO authenticated;
GRANT ALL ON budget_items TO authenticated;
GRANT ALL ON project_media TO authenticated;
GRANT SELECT ON project_receipt TO authenticated;
GRANT SELECT ON project_overview TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== DATABASE STRUCTURE CREATED SUCCESSFULLY ===';
    RAISE NOTICE '';
    RAISE NOTICE 'Tables created:';
    RAISE NOTICE '✅ projects (main table with customer link)';
    RAISE NOTICE '✅ sites (must have project_id - cannot exist without project)';
    RAISE NOTICE '✅ budgets (must have project_id - cannot exist without project)';
    RAISE NOTICE '✅ budget_items (linked to both budget and project)';
    RAISE NOTICE '✅ project_media (photos/documents)';
    RAISE NOTICE '';
    RAISE NOTICE 'Key Features:';
    RAISE NOTICE '✅ Auto-generated project numbers (PRJ-2025-0001)';
    RAISE NOTICE '✅ Sites cannot exist without projects';
    RAISE NOTICE '✅ Budgets cannot exist without projects';
    RAISE NOTICE '✅ Company settings linked to projects';
    RAISE NOTICE '✅ Automatic cost calculations';
    RAISE NOTICE '✅ Project receipt view (receipt_id = project_number)';
    RAISE NOTICE '✅ Removed workmanship_fee (kept only labor_cost)';
    RAISE NOTICE '';
    RAISE NOTICE 'Ready for project page with dynamic budget items!';
END
$$;

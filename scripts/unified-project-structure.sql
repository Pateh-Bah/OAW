-- OAW Simplified Database Structure: Everything as "Projects"
-- This merges Sites, Budgets, and Projects into one comprehensive Projects table
-- Run this in your Supabase SQL Editor

-- 1. First, backup existing data if tables exist
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'projects') THEN
        CREATE TABLE projects_backup AS SELECT * FROM projects;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'budgets') THEN
        CREATE TABLE budgets_backup AS SELECT * FROM budgets;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sites') THEN
        CREATE TABLE sites_backup AS SELECT * FROM sites;
    END IF;
END $$;

-- 2. Drop existing tables to recreate the structure
DROP TABLE IF EXISTS project_media CASCADE;
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS sites CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- 3. Create Budget Items table for itemized costs
CREATE TABLE budget_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID, -- Will reference projects table
  item_name TEXT NOT NULL,
  item_description TEXT,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_price DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  item_category TEXT CHECK (item_category IN ('Material', 'Equipment', 'Tool', 'Other')) DEFAULT 'Material',
  supplier TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create the comprehensive Projects table (merging everything)
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Basic Project Info
  project_name TEXT NOT NULL,
  project_description TEXT,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  
  -- Project Timeline
  start_date DATE DEFAULT CURRENT_DATE,
  expected_completion_date DATE,
  actual_completion_date DATE,
  
  -- Project Status
  status TEXT CHECK (status IN ('Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled')) DEFAULT 'Planning',
  
  -- Site Information (merged from sites table)
  site_name TEXT,
  site_address TEXT NOT NULL, -- MANDATORY field
  city TEXT DEFAULT 'Freetown',
  district TEXT DEFAULT 'Western Area',
  country TEXT DEFAULT 'Sierra Leone',
  gps_coordinates POINT,
  site_area DECIMAL(10,2), -- in square meters
  access_notes TEXT,
  site_conditions TEXT,
  
  -- Installation Progress
  installation_status TEXT CHECK (installation_status IN ('Not Started', 'In Progress', 'Completed', 'Paused')) DEFAULT 'Not Started',
  completion_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  
  -- Budget Information (merged from budgets table)
  -- Itemized costs will be calculated from budget_items table
  total_items_cost DECIMAL(12,2) DEFAULT 0, -- Sum of all budget items (calculated)
  workmanship_fee DECIMAL(12,2) DEFAULT 0, -- Manual entry by user
  overhead_percentage DECIMAL(5,2) DEFAULT 10.00, -- Overhead percentage (utilities, admin, etc.)
  profit_margin_percentage DECIMAL(5,2) DEFAULT 15.00, -- Profit margin percentage
  
  -- Calculated Budget Fields
  overhead_cost DECIMAL(12,2) GENERATED ALWAYS AS (
    (total_items_cost + workmanship_fee) * (overhead_percentage / 100)
  ) STORED,
  
  profit_amount DECIMAL(12,2) GENERATED ALWAYS AS (
    (total_items_cost + workmanship_fee + ((total_items_cost + workmanship_fee) * (overhead_percentage / 100))) * (profit_margin_percentage / 100)
  ) STORED,
  
  total_project_cost DECIMAL(12,2) GENERATED ALWAYS AS (
    total_items_cost + workmanship_fee + 
    ((total_items_cost + workmanship_fee) * (overhead_percentage / 100)) +
    (((total_items_cost + workmanship_fee) + ((total_items_cost + workmanship_fee) * (overhead_percentage / 100))) * (profit_margin_percentage / 100))
  ) STORED,
  
  -- Budget Status
  budget_status TEXT CHECK (budget_status IN ('Draft', 'Approved', 'Under Review', 'Rejected')) DEFAULT 'Draft',
  budget_approved_by UUID REFERENCES auth.users(id),
  budget_approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Payment Tracking
  amount_paid DECIMAL(12,2) DEFAULT 0,
  payment_status TEXT CHECK (payment_status IN ('Not Paid', 'Partially Paid', 'Fully Paid', 'Overdue')) DEFAULT 'Not Paid',
  
  -- Media and Documentation
  project_images TEXT[], -- Array of image URLs
  project_documents TEXT[], -- Array of document URLs
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Add foreign key reference after projects table is created
ALTER TABLE budget_items ADD CONSTRAINT fk_budget_items_project 
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

-- 6. Create function to update total_items_cost when budget_items change
CREATE OR REPLACE FUNCTION update_project_items_cost()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the total_items_cost in projects table
    UPDATE projects 
    SET total_items_cost = (
        SELECT COALESCE(SUM(total_price), 0) 
        FROM budget_items 
        WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
    )
    WHERE id = COALESCE(NEW.project_id, OLD.project_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create triggers to automatically update total_items_cost
CREATE TRIGGER update_project_cost_on_item_insert
    AFTER INSERT ON budget_items
    FOR EACH ROW EXECUTE PROCEDURE update_project_items_cost();

CREATE TRIGGER update_project_cost_on_item_update
    AFTER UPDATE ON budget_items
    FOR EACH ROW EXECUTE PROCEDURE update_project_items_cost();

CREATE TRIGGER update_project_cost_on_item_delete
    AFTER DELETE ON budget_items
    FOR EACH ROW EXECUTE PROCEDURE update_project_items_cost();

-- 8. Recreate project_media table to reference the new projects structure
CREATE TABLE project_media (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT CHECK (media_type IN ('image', 'video', 'document')) DEFAULT 'image',
  media_category TEXT CHECK (media_category IN ('before', 'during', 'after', 'plans', 'budget', 'other')) DEFAULT 'during',
  description TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Create indexes for better performance
CREATE INDEX idx_projects_customer ON projects(customer_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_installation_status ON projects(installation_status);
CREATE INDEX idx_budget_items_project ON budget_items(project_id);
CREATE INDEX idx_budget_items_category ON budget_items(item_category);
CREATE INDEX idx_project_media_project ON project_media(project_id);

-- 10. Enable RLS on tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_media ENABLE ROW LEVEL SECURITY;

-- 11. Create RLS policies
-- Projects policies
CREATE POLICY "Authenticated users can view projects" ON projects FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage projects" ON projects FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Budget items policies
CREATE POLICY "Authenticated users can view budget items" ON budget_items FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage budget items" ON budget_items FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Project media policies
CREATE POLICY "Authenticated users can view project media" ON project_media FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage project media" ON project_media FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- 12. Create updated_at triggers
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_budget_items_updated_at BEFORE UPDATE ON budget_items
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 13. Insert sample data to demonstrate the new structure
INSERT INTO projects (
  project_name, project_description, customer_id, site_address, site_name,
  workmanship_fee, overhead_percentage, profit_margin_percentage
) VALUES 
(
  'Residential Aluminum Roofing',
  'Complete aluminum roofing system for residential complex',
  (SELECT id FROM customers WHERE full_name = 'East End Residential Complex' LIMIT 1),
  '15 Wilkinson Road, Freetown',
  'East End Residential Site',
  15000.00,
  10.00,
  15.00
),
(
  'Commercial Building Windows',
  'Aluminum windows and frames installation',
  (SELECT id FROM customers WHERE full_name = 'Siaka Stevens Office Building' LIMIT 1),
  '23 Siaka Stevens Street, Freetown',
  'Office Building Site',
  20000.00,
  12.00,
  18.00
);

-- 14. Insert sample budget items for the first project
INSERT INTO budget_items (project_id, item_name, item_description, quantity, unit_price, item_category, supplier) 
SELECT 
  p.id,
  'Aluminum Sheets',
  'High-grade aluminum roofing sheets',
  50.00,
  300.00,
  'Material',
  'Sierra Leone Aluminum Supplies'
FROM projects p WHERE p.project_name = 'Residential Aluminum Roofing';

INSERT INTO budget_items (project_id, item_name, item_description, quantity, unit_price, item_category, supplier) 
SELECT 
  p.id,
  'Roofing Screws',
  'Stainless steel roofing screws',
  200.00,
  5.00,
  'Material',
  'Hardware Store Ltd'
FROM projects p WHERE p.project_name = 'Residential Aluminum Roofing';

INSERT INTO budget_items (project_id, item_name, item_description, quantity, unit_price, item_category, supplier) 
SELECT 
  p.id,
  'Aluminum Gutters',
  'Seamless aluminum guttering system',
  30.00,
  150.00,
  'Material',
  'Sierra Leone Aluminum Supplies'
FROM projects p WHERE p.project_name = 'Residential Aluminum Roofing';

-- 15. Insert sample budget items for the second project
INSERT INTO budget_items (project_id, item_name, item_description, quantity, unit_price, item_category, supplier) 
SELECT 
  p.id,
  'Aluminum Window Frames',
  'Commercial-grade aluminum window frames',
  25.00,
  800.00,
  'Material',
  'Window Systems Ltd'
FROM projects p WHERE p.project_name = 'Commercial Building Windows';

INSERT INTO budget_items (project_id, item_name, item_description, quantity, unit_price, item_category, supplier) 
SELECT 
  p.id,
  'Glass Panels',
  'Double-glazed glass panels',
  25.00,
  200.00,
  'Material',
  'Glass Works SL'
FROM projects p WHERE p.project_name = 'Commercial Building Windows';

-- 16. Drop backup tables if migration was successful
DO $$
BEGIN
    IF (SELECT COUNT(*) FROM projects) > 0 THEN
        DROP TABLE IF EXISTS projects_backup;
        DROP TABLE IF EXISTS budgets_backup;
        DROP TABLE IF EXISTS sites_backup;
    END IF;
END $$;

-- Final verification
SELECT 
    'Database restructure completed successfully!' as status,
    (SELECT COUNT(*) FROM projects) as projects_count,
    (SELECT COUNT(*) FROM budget_items) as budget_items_count,
    (SELECT COUNT(*) FROM project_media) as project_media_count,
    (SELECT project_name, total_items_cost, workmanship_fee, total_project_cost FROM projects LIMIT 1) as sample_project;

-- Show sample project with calculated costs
SELECT 
    p.project_name,
    p.total_items_cost,
    p.workmanship_fee,
    p.overhead_cost,
    p.profit_amount,
    p.total_project_cost,
    (SELECT COUNT(*) FROM budget_items WHERE project_id = p.id) as items_count
FROM projects p
ORDER BY p.created_at DESC;

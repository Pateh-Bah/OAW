-- OAW Database Restructure: Projects, Budgets, and Sites Relationship
-- Run this in your Supabase SQL Editor

-- First, let's create the proper structure with Projects as the central entity

-- 1. Create Projects table (central entity)
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  project_description TEXT,
  start_date DATE DEFAULT CURRENT_DATE,
  expected_completion_date DATE,
  actual_completion_date DATE,
  status TEXT CHECK (status IN ('Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled')) DEFAULT 'Planning',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create separate Budgets table linked to Projects
CREATE TABLE IF NOT EXISTS budgets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  total_budget DECIMAL(12,2) NOT NULL DEFAULT 0,
  material_cost DECIMAL(12,2) DEFAULT 0,
  labor_cost DECIMAL(12,2) DEFAULT 0,
  equipment_cost DECIMAL(12,2) DEFAULT 0,
  overhead_cost DECIMAL(12,2) DEFAULT 0,
  profit_margin DECIMAL(5,2) DEFAULT 15.00, -- percentage
  company_earnings DECIMAL(12,2) GENERATED ALWAYS AS (
    (material_cost + labor_cost + equipment_cost + overhead_cost) * (profit_margin / 100)
  ) STORED,
  total_project_cost DECIMAL(12,2) GENERATED ALWAYS AS (
    material_cost + labor_cost + equipment_cost + overhead_cost + 
    ((material_cost + labor_cost + equipment_cost + overhead_cost) * (profit_margin / 100))
  ) STORED,
  budget_status TEXT CHECK (budget_status IN ('Draft', 'Approved', 'Under Review', 'Rejected')) DEFAULT 'Draft',
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id) -- Each project can only have one budget
);

-- 3. Modify Sites table to be linked to Projects and must have address
-- First, let's check if sites table exists and backup any data
DO $$
BEGIN
    -- Create a backup of existing sites data if the table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sites') THEN
        -- Create temporary backup table
        CREATE TABLE sites_backup AS SELECT * FROM sites;
        
        -- Drop the old sites table
        DROP TABLE IF EXISTS sites CASCADE;
    END IF;
END $$;

-- Create new Sites table properly linked to Projects
CREATE TABLE sites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  site_name TEXT NOT NULL,
  address TEXT NOT NULL, -- This is mandatory now
  city TEXT DEFAULT 'Freetown',
  district TEXT DEFAULT 'Western Area',
  country TEXT DEFAULT 'Sierra Leone',
  gps_coordinates POINT, -- For exact location if needed
  site_area DECIMAL(10,2), -- in square meters
  access_notes TEXT, -- Notes about site access
  site_conditions TEXT, -- Current condition of the site
  installation_status TEXT CHECK (installation_status IN ('Not Started', 'In Progress', 'Completed', 'Paused')) DEFAULT 'Not Started',
  completion_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id) -- Each project can only have one primary site
);

-- 4. Update project_media to reference projects instead of sites
DROP TABLE IF EXISTS project_media CASCADE;
CREATE TABLE project_media (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT CHECK (media_type IN ('image', 'video', 'document')) DEFAULT 'image',
  media_category TEXT CHECK (media_category IN ('before', 'during', 'after', 'plans', 'other')) DEFAULT 'during',
  description TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Add company_name to customers table for better organization
ALTER TABLE customers ADD COLUMN IF NOT EXISTS company_name TEXT;

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_customer ON projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_budgets_project ON budgets(project_id);
CREATE INDEX IF NOT EXISTS idx_sites_project ON sites(project_id);
CREATE INDEX IF NOT EXISTS idx_project_media_project ON project_media(project_id);

-- 7. Enable RLS on new tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies for the new tables
-- Projects policies
CREATE POLICY "Authenticated users can view projects" ON projects FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage projects" ON projects FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Budgets policies  
CREATE POLICY "Authenticated users can view budgets" ON budgets FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage budgets" ON budgets FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Sites policies
CREATE POLICY "Authenticated users can view sites" ON sites FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage sites" ON sites FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Project media policies
CREATE POLICY "Authenticated users can view project media" ON project_media FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can manage project media" ON project_media FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- 9. Create triggers for updated_at columns
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON sites
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 10. Create function to automatically create budget and site when project is created
CREATE OR REPLACE FUNCTION create_project_dependencies()
RETURNS TRIGGER AS $$
BEGIN
    -- Create a default budget for the new project
    INSERT INTO budgets (project_id, total_budget, material_cost, labor_cost, equipment_cost, overhead_cost)
    VALUES (NEW.id, 0, 0, 0, 0, 0);
    
    -- Create a default site for the new project
    INSERT INTO sites (project_id, site_name, address)
    VALUES (NEW.id, NEW.project_name || ' Site', 'Address to be updated');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create budget and site when project is created
CREATE TRIGGER create_project_dependencies_trigger
    AFTER INSERT ON projects
    FOR EACH ROW EXECUTE PROCEDURE create_project_dependencies();

-- 11. Migrate existing data if sites_backup exists
DO $$
DECLARE
    backup_exists boolean;
BEGIN
    SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sites_backup') INTO backup_exists;
    
    IF backup_exists THEN
        -- Create projects from existing sites data
        INSERT INTO projects (customer_id, project_name, status, created_at)
        SELECT 
            customer_id,
            'Project for ' || COALESCE(address, 'Unknown Location'),
            CASE 
                WHEN status = 'Completed' THEN 'Completed'
                WHEN status = 'In Progress' THEN 'In Progress'
                ELSE 'Planning'
            END,
            created_at
        FROM sites_backup;
        
        -- Create budgets from existing sites data
        INSERT INTO budgets (project_id, total_budget, material_cost, labor_cost, equipment_cost, company_earnings)
        SELECT 
            p.id,
            COALESCE(sb.budget, 0),
            COALESCE((sb.cost_breakdown->>'materials')::decimal, 0),
            COALESCE((sb.cost_breakdown->>'labor')::decimal, 0),
            COALESCE((sb.cost_breakdown->>'equipment')::decimal, 0),
            COALESCE(sb.company_earnings, 0)
        FROM sites_backup sb
        JOIN projects p ON p.customer_id = sb.customer_id;
        
        -- Create sites from existing sites data
        INSERT INTO sites (project_id, site_name, address, installation_status)
        SELECT 
            p.id,
            'Site for ' || COALESCE(sb.address, 'Unknown Location'),
            COALESCE(sb.address, 'Address to be updated'),
            CASE 
                WHEN sb.status = 'Completed' THEN 'Completed'
                WHEN sb.status = 'In Progress' THEN 'In Progress'
                ELSE 'Not Started'
            END
        FROM sites_backup sb
        JOIN projects p ON p.customer_id = sb.customer_id;
        
        -- Drop the backup table
        DROP TABLE sites_backup;
    END IF;
END $$;

-- 12. Insert some sample projects with automatic budget and site creation
INSERT INTO projects (customer_id, project_name, project_description, status) VALUES
  ((SELECT id FROM customers WHERE full_name = 'East End Residential Complex'), 'Residential Aluminum Roofing', 'Complete aluminum roofing system for residential complex', 'Completed'),
  ((SELECT id FROM customers WHERE full_name = 'Siaka Stevens Office Building'), 'Commercial Building Windows', 'Aluminum windows and frames installation', 'Completed'),
  ((SELECT id FROM customers WHERE full_name = 'Hill Station Villa Owner'), 'Villa Aluminum Works', 'Aluminum doors, windows and roofing', 'In Progress'),
  ((SELECT id FROM customers WHERE full_name = 'Kissy Shopping Center'), 'Shopping Center Facade', 'Complete aluminum facade system', 'Planning')
ON CONFLICT DO NOTHING;

-- 13. Update the sample budgets with realistic data
UPDATE budgets SET 
    material_cost = 25000,
    labor_cost = 15000,
    equipment_cost = 5000,
    overhead_cost = 3000
WHERE project_id IN (
    SELECT id FROM projects WHERE project_name = 'Residential Aluminum Roofing'
);

UPDATE budgets SET 
    material_cost = 45000,
    labor_cost = 20000,
    equipment_cost = 10000,
    overhead_cost = 5000
WHERE project_id IN (
    SELECT id FROM projects WHERE project_name = 'Commercial Building Windows'
);

-- 14. Update the sample sites with proper addresses
UPDATE sites SET 
    address = '15 Wilkinson Road, Freetown',
    site_name = 'East End Residential Site',
    installation_status = 'Completed',
    completion_percentage = 100
WHERE project_id IN (
    SELECT id FROM projects WHERE project_name = 'Residential Aluminum Roofing'
);

UPDATE sites SET 
    address = '23 Siaka Stevens Street, Freetown',
    site_name = 'Office Building Site',
    installation_status = 'Completed',
    completion_percentage = 100
WHERE project_id IN (
    SELECT id FROM projects WHERE project_name = 'Commercial Building Windows'
);

-- Final verification query
SELECT 
    'Database restructure completed successfully!' as status,
    (SELECT COUNT(*) FROM projects) as projects_count,
    (SELECT COUNT(*) FROM budgets) as budgets_count,
    (SELECT COUNT(*) FROM sites) as sites_count;

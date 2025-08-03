-- Restructure Database: Merge Budget and Site into Projects Table
-- Run this in your Supabase SQL Editor

-- Create backup tables only if source tables exist
DO $$
BEGIN
    -- Backup projects table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'projects') THEN
        EXECUTE 'CREATE TABLE temp_projects_backup AS SELECT * FROM projects';
        RAISE NOTICE 'Created backup of projects table';
    ELSE
        RAISE NOTICE 'Projects table does not exist, skipping backup';
    END IF;
    
    -- Backup sites table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sites') THEN
        EXECUTE 'CREATE TABLE temp_sites_backup AS SELECT * FROM sites';
        RAISE NOTICE 'Created backup of sites table';
    ELSE
        RAISE NOTICE 'Sites table does not exist, skipping backup';
    END IF;
    
    -- Backup budgets table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'budgets') THEN
        EXECUTE 'CREATE TABLE temp_budgets_backup AS SELECT * FROM budgets';
        RAISE NOTICE 'Created backup of budgets table';
    ELSE
        RAISE NOTICE 'Budgets table does not exist, skipping backup';
    END IF;
END
$$;

-- Drop existing tables and recreate with unified structure
DROP TABLE IF EXISTS project_media CASCADE;
DROP TABLE IF EXISTS sites CASCADE;
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS budget_items CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- Create unified projects table with all fields
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Basic Project Info
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled')) DEFAULT 'Planning',
  priority TEXT CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')) DEFAULT 'Medium',
  
  -- Customer (REQUIRED - Foreign Key)
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  
  -- Timeline
  start_date DATE,
  expected_completion_date DATE,
  actual_completion_date DATE,
  
  -- Site Information (Address is mandatory)
  site_address TEXT NOT NULL,
  site_location TEXT, -- Additional location details
  site_conditions TEXT, -- Site conditions/notes
  installation_progress INTEGER DEFAULT 0 CHECK (installation_progress >= 0 AND installation_progress <= 100),
  
  -- Budget Information
  materials_cost DECIMAL(12,2) DEFAULT 0,
  labor_cost DECIMAL(12,2) DEFAULT 0,
  equipment_cost DECIMAL(12,2) DEFAULT 0,
  workmanship_fee DECIMAL(12,2) DEFAULT 0, -- Manual entry as requested
  overhead_percentage DECIMAL(5,2) DEFAULT 10.00, -- Overhead as percentage
  profit_margin_percentage DECIMAL(5,2) DEFAULT 15.00, -- Profit margin as percentage
  
  -- Calculated fields (computed automatically)
  subtotal DECIMAL(12,2) GENERATED ALWAYS AS (
    COALESCE(materials_cost, 0) + 
    COALESCE(labor_cost, 0) + 
    COALESCE(equipment_cost, 0) + 
    COALESCE(workmanship_fee, 0)
  ) STORED,
  
  overhead_amount DECIMAL(12,2) GENERATED ALWAYS AS (
    (COALESCE(materials_cost, 0) + 
     COALESCE(labor_cost, 0) + 
     COALESCE(equipment_cost, 0) + 
     COALESCE(workmanship_fee, 0)) * 
    (COALESCE(overhead_percentage, 0) / 100)
  ) STORED,
  
  profit_amount DECIMAL(12,2) GENERATED ALWAYS AS (
    ((COALESCE(materials_cost, 0) + 
      COALESCE(labor_cost, 0) + 
      COALESCE(equipment_cost, 0) + 
      COALESCE(workmanship_fee, 0)) * 
     (1 + COALESCE(overhead_percentage, 0) / 100)) * 
    (COALESCE(profit_margin_percentage, 0) / 100)
  ) STORED,
  
  total_project_cost DECIMAL(12,2) GENERATED ALWAYS AS (
    (COALESCE(materials_cost, 0) + 
     COALESCE(labor_cost, 0) + 
     COALESCE(equipment_cost, 0) + 
     COALESCE(workmanship_fee, 0)) * 
    (1 + COALESCE(overhead_percentage, 0) / 100 + COALESCE(profit_margin_percentage, 0) / 100)
  ) STORED,
  
  -- Payment Information
  amount_paid DECIMAL(12,2) DEFAULT 0,
  payment_status TEXT CHECK (payment_status IN ('Pending', 'Partial', 'Paid', 'Overdue')) DEFAULT 'Pending',
  
  -- Additional Info
  notes TEXT,
  project_manager TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budget_items table for itemized costs (if needed for detailed breakdown)
CREATE TABLE budget_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Item Details
  item_name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('Material', 'Labor', 'Equipment', 'Tool', 'Other')) DEFAULT 'Material',
  
  -- Cost Calculation
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  
  -- Additional Info
  supplier TEXT,
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_media table for photos/videos
CREATE TABLE project_media (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT CHECK (media_type IN ('image', 'video')) DEFAULT 'image',
  caption TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_projects_customer_id ON projects(customer_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_budget_items_project_id ON budget_items(project_id);
CREATE INDEX idx_project_media_project_id ON project_media(project_id);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_media ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for development)
CREATE POLICY "Allow all project operations" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all budget_items operations" ON budget_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all project_media operations" ON project_media FOR ALL USING (true) WITH CHECK (true);

-- Create or replace the update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_budget_items_updated_at 
  BEFORE UPDATE ON budget_items
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert sample data with proper customer relationships (only if customers exist)
DO $$
BEGIN
    -- Check if customers table exists and has data
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'customers') AND 
       EXISTS (SELECT 1 FROM customers LIMIT 1) THEN
        
        INSERT INTO projects (
          name, description, customer_id, site_address, status,
          materials_cost, labor_cost, equipment_cost, workmanship_fee,
          start_date, expected_completion_date, installation_progress
        ) VALUES 
          (
            'Residential Aluminum Windows Installation',
            'Complete aluminum window replacement for residential complex',
            (SELECT id FROM customers LIMIT 1),
            '15 Wilkinson Road, East End, Freetown',
            'Completed',
            25000.00, 15000.00, 5000.00, 12000.00,
            '2024-11-01', '2024-12-15', 100
          ),
          (
            'Office Building Aluminum Doors',
            'Commercial aluminum door installation and framing',
            (SELECT id FROM customers LIMIT 1),
            '23 Siaka Stevens Street, Central Freetown',
            'In Progress',
            45000.00, 20000.00, 10000.00, 18000.00,
            '2024-12-01', '2025-02-28', 65
          ),
          (
            'Villa Kitchen Cabinet Project',
            'Custom aluminum kitchen cabinets and countertops',
            (SELECT id FROM customers LIMIT 1),
            '8 Hill Station Road, Freetown',
            'Completed',
            20000.00, 10000.00, 5000.00, 8500.00,
            '2024-10-15', '2024-11-30', 100
          ),
          (
            'Shopping Center Storefront',
            'Complete storefront aluminum work with display windows',
            (SELECT id FROM customers LIMIT 1),
            '45 Kissy Street, Kissy, Freetown',
            'Planning',
            60000.00, 25000.00, 10000.00, 22000.00,
            '2025-01-15', '2025-04-30', 0
          );

        -- Add sample budget items for detailed breakdown
        INSERT INTO budget_items (project_id, item_name, description, category, quantity, unit_price, supplier) VALUES
          (
            (SELECT id FROM projects WHERE name = 'Residential Aluminum Windows Installation' LIMIT 1),
            'Aluminum Window Frames', 'Standard residential window frames', 'Material', 20, 800.00, 'Sierra Aluminum Suppliers'
          ),
          (
            (SELECT id FROM projects WHERE name = 'Residential Aluminum Windows Installation' LIMIT 1),
            'Window Glass Panels', 'Double-pane glass panels', 'Material', 20, 450.00, 'Freetown Glass Co.'
          ),
          (
            (SELECT id FROM projects WHERE name = 'Office Building Aluminum Doors' LIMIT 1),
            'Commercial Door Frames', 'Heavy-duty aluminum door frames', 'Material', 15, 1200.00, 'West Africa Metals'
          ),
          (
            (SELECT id FROM projects WHERE name = 'Office Building Aluminum Doors' LIMIT 1),
            'Installation Tools', 'Specialized installation equipment rental', 'Equipment', 1, 5000.00, 'Tool Rental Services'
          );
        
        RAISE NOTICE 'Sample projects and budget items created successfully';
        
    ELSE
        RAISE NOTICE 'No customers found. Please create customers first, then run sample data insertion separately.';
    END IF;
END
$$;

-- Create view for easy project overview with customer names
CREATE VIEW project_overview AS
SELECT 
  p.id,
  p.name,
  p.description,
  p.status,
  p.priority,
  c.full_name as customer_name,
  c.phone_number as customer_phone,
  c.email as customer_email,
  p.site_address,
  p.start_date,
  p.expected_completion_date,
  p.actual_completion_date,
  p.installation_progress,
  p.materials_cost,
  p.labor_cost,
  p.equipment_cost,
  p.workmanship_fee,
  p.subtotal,
  p.overhead_amount,
  p.profit_amount,
  p.total_project_cost,
  p.amount_paid,
  p.payment_status,
  (p.total_project_cost - p.amount_paid) as amount_due,
  p.created_at,
  p.updated_at
FROM projects p
JOIN customers c ON p.customer_id = c.id
ORDER BY p.created_at DESC;

-- Grant necessary permissions
GRANT ALL ON projects TO authenticated;
GRANT ALL ON budget_items TO authenticated;
GRANT ALL ON project_media TO authenticated;
GRANT SELECT ON project_overview TO authenticated;

-- Create function to get customer dropdown options
CREATE OR REPLACE FUNCTION get_customer_options()
RETURNS TABLE(id UUID, name TEXT, phone TEXT, email TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.full_name as name, c.phone_number as phone, c.email
  FROM customers c
  ORDER BY c.full_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to calculate project totals
CREATE OR REPLACE FUNCTION calculate_project_totals(project_uuid UUID)
RETURNS TABLE(
  subtotal DECIMAL(12,2),
  overhead DECIMAL(12,2),
  profit DECIMAL(12,2),
  total DECIMAL(12,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.subtotal,
    p.overhead_amount,
    p.profit_amount,
    p.total_project_cost
  FROM projects p
  WHERE p.id = project_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;

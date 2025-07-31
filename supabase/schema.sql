-- Overhead Aluminium Workshop Database Schema
-- Execute this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user roles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('Admin', 'Staff')) DEFAULT 'Staff',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  designation TEXT,
  department TEXT,
  badge_number TEXT UNIQUE,
  contact_info JSONB,
  profile_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sites table
CREATE TABLE IF NOT EXISTS sites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  budget DECIMAL(12,2),
  cost_breakdown JSONB,
  company_earnings DECIMAL(12,2),
  status TEXT CHECK (status IN ('In Progress', 'Completed')) DEFAULT 'In Progress',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_media table
CREATE TABLE IF NOT EXISTS project_media (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT CHECK (media_type IN ('image', 'video')),
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create company_settings table
CREATE TABLE IF NOT EXISTS company_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_name TEXT DEFAULT 'Overhead Aluminium Workshop',
  logo_url TEXT,
  primary_color TEXT DEFAULT '#0066CC',
  office_image_url TEXT,
  contact_info JSONB DEFAULT '{"email": "overheadaluminium@gmail.com", "phone1": "+232-77-902-889", "phone2": "+232-31-902-889", "address": "8 Hill Cot Road, Freetown", "website": "https://www.overheadaluminium.com"}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- Temporary policies to allow initial data insertion (these will be updated later)
CREATE POLICY "Allow initial setup" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow initial setup" ON employees FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow initial setup" ON sites FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow initial setup" ON company_settings FOR ALL USING (true) WITH CHECK (true);

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for employees (Admin only)
CREATE POLICY "Admin can manage employees" ON employees FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin')
);

-- Create RLS policies for customers (Admin only)
CREATE POLICY "Admin can manage customers" ON customers FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin')
);

-- Create RLS policies for sites (Admin only)
CREATE POLICY "Admin can manage sites" ON sites FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin')
);

-- Create RLS policies for project_media
CREATE POLICY "Staff can upload media" ON project_media FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('Admin', 'Staff'))
);

CREATE POLICY "Admin can manage media" ON project_media FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin')
);

-- Public can view completed project media
CREATE POLICY "Public can view completed project media" ON project_media FOR SELECT USING (
  EXISTS (SELECT 1 FROM sites WHERE id = project_media.site_id AND status = 'Completed')
);

-- Create RLS policies for company_settings (Admin only)
CREATE POLICY "Admin can manage company settings" ON company_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin')
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'Staff');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert default company settings
INSERT INTO company_settings (company_name, contact_info) 
VALUES (
  'Overhead Aluminium Workshop',
  '{"email": "overheadaluminium@gmail.com", "phone1": "+232-77-902-889", "phone2": "+232-74-74-902-889", "phone3": "+232-31-74-902-889", "address": "5c Hill Cot Road, Freetown, Sierra Leone", "website": "https://www.overheadaluminium.com"}'
) ON CONFLICT DO NOTHING;

-- Insert sample customers for the showcase projects
INSERT INTO customers (id, full_name, phone_number, email) VALUES
  (uuid_generate_v4(), 'East End Residential Complex', '+232-76-123-456', 'eastend@example.com'),
  (uuid_generate_v4(), 'Siaka Stevens Office Building', '+232-76-234-567', 'office@siakabuilding.com'),
  (uuid_generate_v4(), 'Hill Station Villa Owner', '+232-76-345-678', 'villa@hillstation.com'),
  (uuid_generate_v4(), 'Kissy Shopping Center', '+232-76-456-789', 'info@kissyshopping.com'),
  (uuid_generate_v4(), 'Circular Road School', '+232-76-567-890', 'admin@circularschool.edu'),
  (uuid_generate_v4(), 'Aberdeen Hotel Chain', '+232-76-678-901', 'management@aberdeenhotel.com')
ON CONFLICT DO NOTHING;

-- Insert sample sites/projects for the showcase
INSERT INTO sites (id, customer_id, address, budget, cost_breakdown, company_earnings, status) VALUES
  (uuid_generate_v4(), (SELECT id FROM customers WHERE full_name = 'East End Residential Complex'), '15 Wilkinson Road, Freetown', 45000.00, '{"materials": 25000, "labor": 15000, "equipment": 5000}', 12000.00, 'Completed'),
  (uuid_generate_v4(), (SELECT id FROM customers WHERE full_name = 'Siaka Stevens Office Building'), '23 Siaka Stevens Street, Freetown', 75000.00, '{"materials": 45000, "labor": 20000, "equipment": 10000}', 18000.00, 'Completed'),
  (uuid_generate_v4(), (SELECT id FROM customers WHERE full_name = 'Hill Station Villa Owner'), '8 Hill Station Road, Freetown', 35000.00, '{"materials": 20000, "labor": 10000, "equipment": 5000}', 8500.00, 'Completed'),
  (uuid_generate_v4(), (SELECT id FROM customers WHERE full_name = 'Kissy Shopping Center'), '45 Kissy Street, Freetown', 95000.00, '{"materials": 60000, "labor": 25000, "equipment": 10000}', 22000.00, 'Completed'),
  (uuid_generate_v4(), (SELECT id FROM customers WHERE full_name = 'Circular Road School'), '12 Circular Road, Freetown', 28000.00, '{"materials": 16000, "labor": 8000, "equipment": 4000}', 7000.00, 'Completed'),
  (uuid_generate_v4(), (SELECT id FROM customers WHERE full_name = 'Aberdeen Hotel Chain'), '7 Aberdeen Road, Freetown', 65000.00, '{"materials": 40000, "labor": 18000, "equipment": 7000}', 15500.00, 'Completed')
ON CONFLICT DO NOTHING;

-- Insert sample employees
INSERT INTO employees (id, full_name, designation, department, badge_number, contact_info) VALUES
  (uuid_generate_v4(), 'Mohamed Kamara', 'Senior Technician', 'Production', 'OAW001', '{"phone": "+232-77-111-222", "emergency_contact": "+232-76-111-222"}'),
  (uuid_generate_v4(), 'Fatima Sesay', 'Project Manager', 'Management', 'OAW002', '{"phone": "+232-77-222-333", "emergency_contact": "+232-76-222-333"}'),
  (uuid_generate_v4(), 'Ibrahim Conteh', 'Aluminum Specialist', 'Production', 'OAW003', '{"phone": "+232-77-333-444", "emergency_contact": "+232-76-333-444"}'),
  (uuid_generate_v4(), 'Aminata Bangura', 'Quality Controller', 'Quality Assurance', 'OAW004', '{"phone": "+232-77-444-555", "emergency_contact": "+232-76-444-555"}'),
  (uuid_generate_v4(), 'Sallieu Mansaray', 'Installation Supervisor', 'Installation', 'OAW005', '{"phone": "+232-77-555-666", "emergency_contact": "+232-76-555-666"}')
ON CONFLICT DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON sites
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_company_settings_updated_at BEFORE UPDATE ON company_settings
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Now replace temporary policies with proper RLS policies
-- Drop temporary policies
DROP POLICY IF EXISTS "Allow initial setup" ON customers;
DROP POLICY IF EXISTS "Allow initial setup" ON employees;
DROP POLICY IF EXISTS "Allow initial setup" ON sites;
DROP POLICY IF EXISTS "Allow initial setup" ON company_settings;
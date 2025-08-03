-- CORRECTED BASE TABLES SETUP
-- This works with your existing schema structure

-- Enable necessary extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Company Settings (if it doesn't exist)
CREATE TABLE IF NOT EXISTS company_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_name TEXT NOT NULL DEFAULT 'Overhead Aluminium Workshop',
    company_phone TEXT DEFAULT '+232-77-902-889',
    company_email TEXT DEFAULT 'overheadaluminium@gmail.com',
    company_address TEXT DEFAULT 'Freetown, Sierra Leone',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services (if it doesn't exist)
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_name TEXT NOT NULL,
    service_description TEXT,
    base_rate DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and create policies for new tables
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow all operations for authenticated users" ON company_settings FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all operations for authenticated users" ON services FOR ALL USING (auth.uid() IS NOT NULL);

-- Grant permissions
GRANT ALL ON company_settings TO authenticated;
GRANT ALL ON services TO authenticated;

-- Insert sample data using CORRECT column names
INSERT INTO company_settings (company_name) VALUES ('Overhead Aluminium Workshop') 
ON CONFLICT (id) DO NOTHING;

-- Insert sample customer using correct column name (phone_number instead of phone)
INSERT INTO customers (full_name, phone_number, email) VALUES 
('John Kamara', '+232-77-123-456', 'john.kamara@email.com') 
ON CONFLICT (id) DO NOTHING;

-- Insert sample employee
INSERT INTO employees (full_name, designation, department) VALUES 
('Ibrahim Koroma', 'Project Manager', 'Operations') 
ON CONFLICT (id) DO NOTHING;

-- Insert sample service
INSERT INTO services (service_name, service_description, base_rate) VALUES 
('Window Installation', 'Complete aluminum window installation service', 500.00) 
ON CONFLICT (id) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '=== BASE TABLES SETUP COMPLETE ===';
    RAISE NOTICE 'Ready to run ultra-safe-database.sql script!';
END
$$;

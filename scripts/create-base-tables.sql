-- COMPLETE DATABASE SETUP - All Required Tables
-- Run this first, then run ultra-safe-database.sql

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clean up any existing tables (in correct dependency order)
DROP TABLE IF EXISTS project_services CASCADE;
DROP TABLE IF EXISTS budget_items CASCADE;
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS sites CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS company_settings CASCADE;

-- 1. COMPANY_SETTINGS TABLE
CREATE TABLE company_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_name TEXT NOT NULL DEFAULT 'Overhead Aluminium Workshop',
    company_phone TEXT DEFAULT '+232-77-902-889',
    company_email TEXT DEFAULT 'overheadaluminium@gmail.com',
    company_address TEXT DEFAULT 'Freetown, Sierra Leone',
    logo_url TEXT,
    tax_id TEXT,
    registration_number TEXT,
    default_overhead_percentage DECIMAL(5,2) DEFAULT 15.00,
    default_profit_margin_percentage DECIMAL(5,2) DEFAULT 20.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CUSTOMERS TABLE
CREATE TABLE customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    address TEXT,
    city TEXT DEFAULT 'Freetown',
    state TEXT DEFAULT 'Western Area',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. EMPLOYEES TABLE  
CREATE TABLE employees (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    role TEXT CHECK (role IN ('Manager', 'Worker', 'Supervisor', 'Admin')) DEFAULT 'Worker',
    hourly_rate DECIMAL(10,2) DEFAULT 0,
    hire_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SERVICES TABLE
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

-- Enable RLS
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow all operations for authenticated users" ON company_settings FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all operations for authenticated users" ON customers FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all operations for authenticated users" ON employees FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow all operations for authenticated users" ON services FOR ALL USING (auth.uid() IS NOT NULL);

-- Grant permissions
GRANT ALL ON company_settings TO authenticated;
GRANT ALL ON customers TO authenticated;
GRANT ALL ON employees TO authenticated;
GRANT ALL ON services TO authenticated;

-- Insert sample data
INSERT INTO company_settings (
    company_name, 
    company_phone, 
    company_email, 
    company_address
) VALUES (
    'Overhead Aluminium Workshop',
    '+232-77-902-889',
    'overheadaluminium@gmail.com',
    'Business District, Freetown, Sierra Leone'
);

INSERT INTO customers (full_name, email, phone, company, address) VALUES
('John Kamara', 'john.kamara@email.com', '+232-77-123-456', 'Kamara Construction', 'Tower Hill, Freetown'),
('Sarah Bangura', 'sarah.bangura@email.com', '+232-74-789-012', 'Bangura Properties', 'Lumley, Freetown'),
('Mohamed Sesay', 'mohamed.sesay@email.com', '+232-31-345-678', 'Sesay Trading', 'Congo Cross, Freetown');

INSERT INTO employees (first_name, last_name, email, phone, role, hourly_rate) VALUES
('Ibrahim', 'Koroma', 'ibrahim@oaw.com', '+232-77-111-222', 'Manager', 25.00),
('Fatima', 'Turay', 'fatima@oaw.com', '+232-74-333-444', 'Supervisor', 20.00),
('Abdul', 'Mansaray', 'abdul@oaw.com', '+232-31-555-666', 'Worker', 15.00),
('Mariama', 'Kargbo', 'mariama@oaw.com', '+232-77-777-888', 'Worker', 15.00);

INSERT INTO services (service_name, service_description, service_category, base_rate, unit) VALUES
('Window Installation', 'Installation of aluminum windows', 'Installation', 50.00, 'unit'),
('Door Installation', 'Installation of aluminum doors', 'Installation', 75.00, 'unit'),
('Roofing Work', 'Aluminum roofing installation and repair', 'Installation', 30.00, 'sqm'),
('Custom Fabrication', 'Custom aluminum work and fabrication', 'Custom Work', 40.00, 'hour'),
('Maintenance Service', 'Regular maintenance of aluminum structures', 'Maintenance', 25.00, 'hour');

-- Success message
DO $$
BEGIN
    RAISE NOTICE '=== BASE TABLES CREATED SUCCESSFULLY ===';
    RAISE NOTICE 'Tables: company_settings, customers, employees, services';
    RAISE NOTICE 'Sample data: 1 company, 3 customers, 4 employees, 5 services';
    RAISE NOTICE 'Now run ultra-safe-database.sql to create the project tables!';
END
$$;

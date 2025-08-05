-- Overhead Aluminium Workshop - Database Setup Instructions
-- Execute these commands in your Supabase SQL Editor

-- STEP 1: Execute the main schema (run schema.sql first)
-- Then execute the commands below:

-- STEP 2: Create Admin User Function
-- This function will be used to create the admin user with proper role
CREATE OR REPLACE FUNCTION create_admin_user(
  user_email TEXT,
  user_password TEXT,
  user_full_name TEXT
)
RETURNS TEXT AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Note: In production, you should create the user through Supabase Auth
  -- This is a placeholder for the admin user creation process
  
  -- For now, return the instructions
  RETURN 'Please create user with email: ' || user_email || ' through Supabase Auth Dashboard, then run the update_admin_role function';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 3: Function to update user role to Admin
CREATE OR REPLACE FUNCTION update_admin_role(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Get the user ID from auth.users table
  SELECT id INTO user_id FROM auth.users WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RETURN 'User not found. Please ensure the user is created in Supabase Auth first.';
  END IF;
  
  -- Update or insert the profile with Admin role
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (user_id, user_email, 'Admin User', 'Admin')
  ON CONFLICT (id) 
  DO UPDATE SET role = 'Admin', updated_at = NOW();
  
  RETURN 'Admin role assigned successfully to ' || user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 4: Create Senior Staff role (optional)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('Admin', 'Senior Staff', 'Staff', 'Customer'));

-- STEP 5: Update company settings with correct address
UPDATE company_settings SET 
contact_info = '{"email": "overheadaluminiumworkshop@gmail.com", "phone1": "+232-77-902-889", "phone2": "+232-74-74-902-889", "phone3": "+232-31-74-902-889", "address": "5c Hill Cot Road, Freetown, Sierra Leone", "website": "https://www.overheadaluminium.com"}'
WHERE company_name = 'Overhead Aluminium Workshop';

-- STEP 6: Create additional helper functions for the admin
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM profiles WHERE id = user_id;
  RETURN COALESCE(user_role, 'Staff');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 7: Create public policies for landing page data
CREATE POLICY "Public can view completed sites" ON sites FOR SELECT USING (status = 'Completed');
CREATE POLICY "Public can view customers of completed sites" ON customers FOR SELECT USING (
  EXISTS (SELECT 1 FROM sites WHERE customer_id = customers.id AND status = 'Completed')
);

-- STEP 8: Insert additional services data
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  features TEXT[],
  icon_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO services (name, description, features, icon_name) VALUES
  ('Aluminum Windows & Doors', 'Custom-designed windows and doors for modern residential and commercial buildings', ARRAY['Custom designs', 'Energy efficient', 'Weather resistant'], 'building2'),
  ('Kitchen Cabinets', 'Durable and elegant aluminum kitchen solutions with modern finishes', ARRAY['Modern designs', 'Durable materials', 'Custom sizes'], 'wrench'),
  ('Imported Aluminum Chairs', 'High-quality imported aluminum furniture for offices and homes', ARRAY['Premium quality', 'Ergonomic design', 'Various styles'], 'users'),
  ('Aluminum Wall Frames', 'Structural aluminum building wall frames for construction projects', ARRAY['Strong structure', 'Lightweight', 'Corrosion resistant'], 'shield'),
  ('Assembly Services', 'Professional assembly of chairs, aluminum products, and cupboards', ARRAY['Expert installation', 'Quality assurance', 'Timely delivery'], 'award'),
  ('Custom Constructions', 'Other custom aluminum constructions tailored to your specific needs', ARRAY['Bespoke solutions', 'Professional consultation', 'Quality craftsmanship'], 'star')
ON CONFLICT DO NOTHING;

-- Enable public access to services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view services" ON services FOR SELECT USING (true);

/*
MANUAL STEPS TO COMPLETE SETUP:

1. Execute schema.sql in Supabase SQL Editor
2. Execute this setup.sql file in Supabase SQL Editor  
3. Go to Supabase Auth Dashboard
4. Create a new user with:
   - Email: admin@overheadaluminium.com
   - Password: Admin@2025
   - Confirm the user's email
5. Run this SQL command to assign admin role:
   SELECT update_admin_role('admin@overheadaluminium.com');
6. The admin user can now login with full access to the dashboard

IMPORTANT NOTES:
- The admin user will have full access to all features
- Staff users will have limited access based on RLS policies
- Public users can view completed projects on the landing page
- All tables have proper Row Level Security enabled
*/

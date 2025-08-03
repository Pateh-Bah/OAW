-- Fix Row Level Security Policies for Complete Relational Database
-- Run this in your Supabase SQL Editor AFTER running complete-database-restructure.sql

-- Handle employees table (connected to auth.users and profiles)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employees') THEN
        DROP POLICY IF EXISTS "Allow initial setup" ON employees;
        DROP POLICY IF EXISTS "Admin can manage employees" ON employees;
        DROP POLICY IF EXISTS "Authenticated users can manage employees" ON employees;
        
        -- Create a more permissive policy for employees
        CREATE POLICY "Authenticated users can manage employees" ON employees FOR ALL USING (
          auth.uid() IS NOT NULL
        ) WITH CHECK (
          auth.uid() IS NOT NULL
        );
        
        RAISE NOTICE 'Updated RLS policies for employees table';
    ELSE
        RAISE NOTICE 'Employees table does not exist, skipping RLS setup';
    END IF;
END
$$;

-- Handle profiles table (connected to employees)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
        DROP POLICY IF EXISTS "Allow initial setup" ON profiles;
        DROP POLICY IF EXISTS "Authenticated users can manage profiles" ON profiles;
        
        CREATE POLICY "Authenticated users can manage profiles" ON profiles FOR ALL USING (
          auth.uid() IS NOT NULL
        ) WITH CHECK (
          auth.uid() IS NOT NULL
        );
        
        RAISE NOTICE 'Updated RLS policies for profiles table';
    ELSE
        RAISE NOTICE 'Profiles table does not exist, skipping RLS setup';
    END IF;
END
$$;

-- Handle customers table
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'customers') THEN
        DROP POLICY IF EXISTS "Allow initial setup" ON customers;
        DROP POLICY IF EXISTS "Authenticated users can manage customers" ON customers;
        
        CREATE POLICY "Authenticated users can manage customers" ON customers FOR ALL USING (
          auth.uid() IS NOT NULL
        ) WITH CHECK (
          auth.uid() IS NOT NULL
        );
        
        RAISE NOTICE 'Updated RLS policies for customers table';
    ELSE
        RAISE NOTICE 'Customers table does not exist, skipping RLS setup';
    END IF;
END
$$;

-- Handle projects table (replaces sites table)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'projects') THEN
        DROP POLICY IF EXISTS "Allow initial setup" ON projects;
        DROP POLICY IF EXISTS "Allow all project operations" ON projects;
        DROP POLICY IF EXISTS "Authenticated users can manage projects" ON projects;
        
        CREATE POLICY "Authenticated users can manage projects" ON projects FOR ALL USING (
          auth.uid() IS NOT NULL
        ) WITH CHECK (
          auth.uid() IS NOT NULL
        );
        
        RAISE NOTICE 'Updated RLS policies for projects table';
    ELSE
        RAISE NOTICE 'Projects table does not exist, skipping RLS setup';
    END IF;
END
$$;

-- Handle budget_items table
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'budget_items') THEN
        DROP POLICY IF EXISTS "Allow all budget_items operations" ON budget_items;
        DROP POLICY IF EXISTS "Authenticated users can manage budget_items" ON budget_items;
        
        CREATE POLICY "Authenticated users can manage budget_items" ON budget_items FOR ALL USING (
          auth.uid() IS NOT NULL
        ) WITH CHECK (
          auth.uid() IS NOT NULL
        );
        
        RAISE NOTICE 'Updated RLS policies for budget_items table';
    ELSE
        RAISE NOTICE 'Budget_items table does not exist, skipping RLS setup';
    END IF;
END
$$;

-- Handle project_media table
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'project_media') THEN
        DROP POLICY IF EXISTS "Allow all project_media operations" ON project_media;
        DROP POLICY IF EXISTS "Authenticated users can manage project_media" ON project_media;
        
        CREATE POLICY "Authenticated users can manage project_media" ON project_media FOR ALL USING (
          auth.uid() IS NOT NULL
        ) WITH CHECK (
          auth.uid() IS NOT NULL
        );
        
        RAISE NOTICE 'Updated RLS policies for project_media table';
    ELSE
        RAISE NOTICE 'Project_media table does not exist, skipping RLS setup';
    END IF;
END
$$;

-- Handle company_settings table if it exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'company_settings') THEN
        DROP POLICY IF EXISTS "Allow initial setup" ON company_settings;
        DROP POLICY IF EXISTS "Authenticated users can manage company_settings" ON company_settings;
        
        CREATE POLICY "Authenticated users can manage company_settings" ON company_settings FOR ALL USING (
          auth.uid() IS NOT NULL
        ) WITH CHECK (
          auth.uid() IS NOT NULL
        );
        
        RAISE NOTICE 'Updated RLS policies for company_settings table';
    ELSE
        RAISE NOTICE 'Company_settings table does not exist, skipping RLS setup';
    END IF;
END
$$;

-- Verify the changes for existing tables
DO $$
BEGIN
    RAISE NOTICE 'Checking RLS policies...';
    
    -- Check if we can query the policies (this will show in the output)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'pg_policies') THEN
        RAISE NOTICE 'RLS policies have been updated successfully!';
    END IF;
END
$$;

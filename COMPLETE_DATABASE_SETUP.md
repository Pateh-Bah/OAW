# Complete Database Setup Instructions

## Overview
This guide will help you set up the database tables and create the admin user for the Overhead Aluminium Workshop application.

## Prerequisites
- Supabase project created
- Supabase CLI installed (✅ Already installed - version 2.33.7)

## Step 1: Set up Supabase Connection

First, you need to link your local project to your Supabase project:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
```

Replace `YOUR_PROJECT_REF` with your actual Supabase project reference ID (found in your Supabase dashboard URL).

## Step 2: Execute Database Schema

Run the schema file to create all tables and policies:

```bash
npx supabase db push
```

OR manually execute the SQL files in the Supabase dashboard:

1. Go to your Supabase dashboard
2. Navigate to "SQL Editor"
3. Copy and paste the contents of `supabase/schema.sql`
4. Click "Run"

## Step 3: Insert Sample Data

After the schema is created, insert sample data:

1. In the Supabase SQL Editor, copy and paste the contents of `supabase/setup.sql`
2. Click "Run"

## Step 4: Create Admin User

### Option A: Using Supabase Dashboard (Recommended)

1. Go to Authentication → Users in your Supabase dashboard
2. Click "Add User"
3. Fill in:
   - **Email:** admin@overheadaluminium.com
   - **Password:** Admin@2025
   - **Email Confirm:** true
4. Click "Create User"

### Option B: Using SQL (After user is created above)

Execute this SQL to assign admin role:

```sql
SELECT update_admin_role('admin@overheadaluminium.com');
```

## Step 5: Update Environment Variables

Make sure your `.env.local` file has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 6: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:3000
3. Click "Login" and use:
   - **Email:** admin@overheadaluminium.com
   - **Password:** Admin@2025

## Troubleshooting

### If tables are not created:
- Check that the UUID extension is enabled in your Supabase project
- Ensure RLS (Row Level Security) is properly configured

### If admin user cannot login:
- Verify the user was created in the Authentication section
- Check that the email is confirmed
- Ensure the profile was created with admin role

### If you get permission errors:
- Check that RLS policies are properly applied
- Verify the user has the correct role in the profiles table

## Database Structure

The database includes these main tables:
- `profiles` - User profiles with roles
- `employees` - Company employees
- `customers` - Client information
- `sites` - Project locations
- `projects` - Aluminium work projects
- `project_media` - Project photos and documents
- `company_settings` - System configuration

## Admin Functions

The admin user can:
- View and manage all projects
- Add/edit employees and customers
- Upload project media
- Access dashboard analytics
- Manage system settings

## Security Features

- Row Level Security (RLS) enabled on all tables
- Role-based access control
- Secure file uploads for project media
- Authentication middleware protection

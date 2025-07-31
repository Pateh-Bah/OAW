# Overhead Aluminium Workshop - Database Setup Guide

## Prerequisites
- Supabase account and project created
- Access to Supabase SQL Editor
- Project environment variables configured

## Setup Steps

### 1. Execute Database Schema
1. Open your Supabase dashboard
2. Go to SQL Editor
3. Copy and paste the content from `supabase/schema.sql`
4. Execute the script

### 2. Execute Setup Commands
1. In the same SQL Editor
2. Copy and paste the content from `supabase/setup.sql`
3. Execute the script

### 3. Create Admin User
1. Go to Authentication > Users in your Supabase dashboard
2. Click "Add user"
3. Fill in the details:
   - Email: `admin@overheadaluminium.com`
   - Password: `Admin@2025`
   - Auto Confirm User: ✅ (check this box)
4. Click "Create user"

### 4. Assign Admin Role
1. Go back to SQL Editor
2. Execute this command:
```sql
SELECT update_admin_role('admin@overheadaluminium.com');
```

### 5. Verify Setup
You should now have:
- ✅ All required tables created
- ✅ Sample data for projects showcase
- ✅ Admin user with email: admin@overheadaluminium.com
- ✅ Admin user with password: Admin@2025
- ✅ Proper role-based access control

## Tables Created
- `profiles` - User profiles with roles
- `employees` - Staff management
- `customers` - Customer information
- `sites` - Project sites and budgets
- `project_media` - Project photos/videos
- `company_settings` - Company configuration
- `services` - Service offerings

## User Roles
- **Admin**: Full access to all features
- **Senior Staff**: Limited admin features
- **Staff**: Basic project access
- **Customer**: View-only access

## Sample Data Included
- 6 completed project sites across Freetown
- 5 sample employees with badge numbers
- Company settings with contact information
- Service offerings for the website

## Testing Login
1. Start your development server: `npm run dev`
2. Go to `/auth/login`
3. Login with:
   - Email: admin@overheadaluminium.com
   - Password: Admin@2025
4. You should be redirected to the admin dashboard

## Troubleshooting
- If login fails, check that the user was created in Supabase Auth
- If role permissions fail, ensure RLS policies are enabled
- Check browser console for any authentication errors
- Verify environment variables are correctly set

## Environment Variables Required
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Security Notes
- Row Level Security (RLS) is enabled on all tables
- Admin users can access all data
- Staff users have limited access based on their role
- Public users can only view completed projects
- All passwords are hashed by Supabase Auth

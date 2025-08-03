# Overhead Aluminium Workshop - Database Setup

## Quick Setup (Single File)

1. **Copy the complete SQL script:**
   - Open `scripts/complete-database-structure.sql`
   - Copy all the content

2. **Run in Supabase:**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Paste the complete script
   - Click "Run"

3. **Done!**
   - Your dashboard will now load properly
   - Receipt-style project management is ready
   - Sample data included for testing

## What This Creates

### Tables:
- ✅ `company_settings` - Company information
- ✅ `services` - Available services  
- ✅ `projects` - Main project table (receipt-style)
- ✅ `sites` - Project locations
- ✅ `budgets` - Project budgets
- ✅ `budget_items` - Receipt line items
- ✅ `project_services` - Service assignments

### Features:
- ✅ Auto project numbering (PRJ-2025-0001)
- ✅ Real-time cost calculations
- ✅ Receipt-style cost structure
- ✅ Professional invoice generation
- ✅ Sample data for testing

### Cost Structure:
- **Items Cost**: Auto-calculated from budget_items
- **Labor Cost**: Manual entry by admin
- **Manual Cost**: Additional costs
- **Total**: Auto-calculated (items + labor + manual)

## Files Cleaned Up
Everything is now in one complete file: `complete-database-structure.sql`

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

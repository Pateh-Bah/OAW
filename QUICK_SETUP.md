# 🎯 QUICK DATABASE SETUP GUIDE

## The tables are NOT created yet. Here's the EASIEST way to fix this:

### Step 1: Open Supabase SQL Editor
1. Go to: https://supabase.com/dashboard/project/rrcudlpndmgaumcgdyco/sql
2. Click on "New Query"

### Step 2: Execute Schema File
1. Open the file `supabase/schema.sql` in your VS Code
2. Copy ALL the content (Ctrl+A, then Ctrl+C)
3. Paste it in the Supabase SQL Editor
4. Click "RUN" button
5. Wait for "Success. No rows returned" message

### Step 3: Execute Setup File
1. Open the file `supabase/setup.sql` in your VS Code  
2. Copy ALL the content (Ctrl+A, then Ctrl+C)
3. Paste it in the Supabase SQL Editor
4. Click "RUN" button
5. Wait for success message

### Step 4: Create Admin User
1. Go to: https://supabase.com/dashboard/project/rrcudlpndmgaumcgdyco/auth/users
2. Click "Add User"
3. Email: `admin@overheadaluminium.com`
4. Password: `Admin@2025`
5. Click "Create User"

### Step 5: Assign Admin Role
Back in SQL Editor, run this single command:
```sql
SELECT update_admin_role('admin@overheadaluminium.com');
```

### Step 6: Test Everything
Your app is running at: http://localhost:3001
- Go to the website
- Click "Login"
- Use: admin@overheadaluminium.com / Admin@2025

## 🔍 Quick Links:
- **SQL Editor**: https://supabase.com/dashboard/project/rrcudlpndmgaumcgdyco/sql
- **Users Panel**: https://supabase.com/dashboard/project/rrcudlpndmgaumcgdyco/auth/users
- **Your App**: http://localhost:3001

## ✅ After Setup You'll Have:
- 6 completed aluminium projects
- 5 company employees
- Complete authentication system
- Admin dashboard access
- Beautiful landing page

Just follow the steps above and your database will be ready in 5 minutes!

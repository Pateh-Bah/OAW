# 🚀 Overhead Aluminium Workshop - Setup Guide

## 📋 Prerequisites
- Node.js 18+ and npm
- Git
- A Supabase account
- A GitHub account
- A Vercel account (for deployment)

---

## 🗄️ 1. Supabase Database Setup

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign in and click **"New Project"**
3. Choose your organization
4. Set project name: `overhead-aluminium-workshop`
5. Set database password (save this!)
6. Select region (closest to your users)
7. Click **"Create new project"**

### Step 2: Run Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the entire contents of `supabase/schema.sql`
3. Click **"Run"** to execute the schema

### Step 3: Get API Keys
1. Go to **Settings** → **API**
2. Copy the following values:
   - `Project URL` → This becomes `NEXT_PUBLIC_SUPABASE_URL`
   - `Project API Keys` → `anon public` → This becomes `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 4: Configure Authentication
1. Go to **Authentication** → **Settings**
2. Under **Site URL**, add your development URL: `http://localhost:3000`
3. Under **Redirect URLs**, add: `http://localhost:3000/auth/callback`

---

## 🔧 2. Local Development Setup

### Step 1: Clone and Install
```bash
# Clone your repository
git clone https://github.com/yourusername/overhead-aluminium-workshop.git
cd overhead-aluminium-workshop

# Install dependencies
npm install
```

### Step 2: Environment Variables
1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` with your actual values:
```env
# Replace with your actual Supabase values
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here

# Application Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Overhead Aluminium Workshop"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Development Configuration
NODE_ENV=development

# Google Maps API (optional - for contact page map)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Company Contact Information
NEXT_PUBLIC_COMPANY_EMAIL=overheadaluminium@gmail.com
NEXT_PUBLIC_COMPANY_PHONE_1=+232-77-902-889
NEXT_PUBLIC_COMPANY_PHONE_2=+232-31-902-889
NEXT_PUBLIC_COMPANY_ADDRESS="8 Hill Cot Road, Freetown"
NEXT_PUBLIC_COMPANY_WEBSITE=https://www.overheadaluminium.com
```

### Step 3: Run Development Server
```bash
npm run dev
```

Your application should now be running at `http://localhost:3000`

---

## 📱 3. GitHub Repository Setup

### Step 1: Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click **"New repository"**
3. Repository name: `overhead-aluminium-workshop`
4. Description: `Web application for Overhead Aluminium Workshop - managing staff, customers, site locations, budgeting, and communication`
5. Set to **Public** or **Private** as preferred
6. Don't initialize with README (already exists)
7. Click **"Create repository"**

### Step 2: Push Code to GitHub
```bash
# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Overhead Aluminium Workshop Web System"

# Add GitHub remote (replace with your actual repository URL)
git remote add origin https://github.com/yourusername/overhead-aluminium-workshop.git

# Push to GitHub
git push -u origin main
```

---

## 🌐 4. Vercel Deployment

### Step 1: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click **"New Project"**
4. Import your `overhead-aluminium-workshop` repository
5. Click **"Deploy"**

### Step 2: Configure Environment Variables in Vercel
1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add the following variables:

| Variable Name | Value |
|---------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel deployment URL |
| `NEXT_PUBLIC_APP_NAME` | Overhead Aluminium Workshop |
| `NEXT_PUBLIC_APP_VERSION` | 1.0.0 |
| `NODE_ENV` | production |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Your Google Maps API key |
| `NEXT_PUBLIC_COMPANY_EMAIL` | overheadaluminium@gmail.com |
| `NEXT_PUBLIC_COMPANY_PHONE_1` | +232-77-902-889 |
| `NEXT_PUBLIC_COMPANY_PHONE_2` | +232-31-902-889 |
| `NEXT_PUBLIC_COMPANY_ADDRESS` | 8 Hill Cot Road, Freetown |
| `NEXT_PUBLIC_COMPANY_WEBSITE` | https://www.overheadaluminium.com |

### Step 3: Update Supabase URLs
1. Go back to your Supabase dashboard
2. **Authentication** → **Settings**
3. Update **Site URL** to your Vercel deployment URL
4. Add your Vercel URL to **Redirect URLs**

### Step 4: Redeploy
1. In Vercel, go to **Deployments**
2. Click **"Redeploy"** to apply the environment variables

---

## 🔐 5. Create Admin Account

### Method 1: Through Supabase Dashboard
1. Go to **Authentication** → **Users**
2. Click **"Add user"**
3. Enter email and password
4. After creation, go to **SQL Editor**
5. Run this query to make the user an admin:
```sql
UPDATE profiles 
SET role = 'Admin' 
WHERE email = 'your-admin-email@example.com';
```

### Method 2: Through Application
1. Sign up normally through your application
2. Go to Supabase **SQL Editor**
3. Run the same query as above

---

## 🎨 6. Google Maps Integration (Optional)

### Get API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Maps JavaScript API**
4. Create API key
5. Restrict API key to your domains
6. Add the key to your environment variables

---

## 🧪 7. Testing

### Health Check
Run the health check script to verify everything is working:
```bash
npm run health-check
```

### Manual Testing
1. **Authentication**: Try signing up/in
2. **Admin Features**: Create customers, sites, employees
3. **Staff Features**: Upload media to projects
4. **Public Pages**: View landing page, gallery

---

## 📁 8. Project Structure

```
overhead-aluminium-workshop/
├── app/                    # Next.js 13+ app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Protected dashboard
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── landing-page.tsx  # Landing page component
│   └── navigation.tsx    # Navigation component
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── supabase.ts      # Supabase client
│   └── utils.ts         # Utility functions
├── scripts/              # Build/utility scripts
├── supabase/            # Database schema
├── types/               # TypeScript type definitions
├── .env.example         # Environment variables template
├── .env.local          # Local environment variables
├── .gitignore          # Git ignore rules
├── REQUIREMENTS.md     # Project requirements
├── README.md           # This file
└── package.json        # Dependencies and scripts
```

---

## 🆘 Troubleshooting

### Common Issues

#### 1. Supabase Connection Error
- Verify your `.env.local` has correct values
- Check Supabase project is running
- Ensure API keys are correct

#### 2. Authentication Issues
- Check redirect URLs in Supabase settings
- Verify site URL matches your domain
- Clear browser cache and cookies

#### 3. Database Permission Errors
- Ensure RLS policies are applied
- Check user has correct role in `profiles` table
- Verify schema was executed completely

#### 4. Build Errors
- Run `npm install` to ensure all dependencies
- Check for TypeScript errors
- Verify environment variables are set

### Getting Help
- Check the [Supabase Documentation](https://supabase.com/docs)
- Review [Next.js Documentation](https://nextjs.org/docs)
- Check project issues on GitHub

---

## 🔄 Development Workflow

### Making Changes
1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test locally
4. Commit: `git commit -m "Add your feature description"`
5. Push: `git push origin feature/your-feature-name`
6. Create Pull Request on GitHub
7. After approval, merge to main
8. Vercel will auto-deploy from main branch

### Environment Management
- **Development**: Use `.env.local`
- **Production**: Configure in Vercel dashboard
- **Never commit** `.env.local` to git

---

## ✅ Next Steps

1. **Complete Setup**: Follow all steps above
2. **Customize Branding**: Update colors, logos, company information
3. **Add Content**: Upload project images, employee photos
4. **Train Users**: Show staff how to upload media, admins how to manage data
5. **Go Live**: Share your public URL with customers

---

## 📞 Support

For technical support or questions about this setup:
- Review this documentation
- Check project requirements in `REQUIREMENTS.md`
- Contact the development team

Good luck with your Overhead Aluminium Workshop application! 🎉

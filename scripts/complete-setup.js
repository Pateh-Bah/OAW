// Complete Database Setup - Run Base Tables First
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Please check your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function setupDatabase() {
  try {
    console.log('🚀 Starting complete database setup...')
    
    // Step 1: Create base tables
    console.log('\n📋 Step 1: Creating base tables (customers, employees, services, company_settings)...')
    const baseTablesSQL = fs.readFileSync(path.join(__dirname, 'create-base-tables.sql'), 'utf8')
    
    const { error: baseError } = await supabase.rpc('exec_sql', { sql: baseTablesSQL })
    if (baseError) {
      console.error('❌ Error creating base tables:', baseError)
      return
    }
    
    console.log('✅ Base tables created successfully!')
    
    // Step 2: Create project tables
    console.log('\n📋 Step 2: Creating project tables (projects, sites, budgets, budget_items)...')
    const projectTablesSQL = fs.readFileSync(path.join(__dirname, 'ultra-safe-database.sql'), 'utf8')
    
    const { error: projectError } = await supabase.rpc('exec_sql', { sql: projectTablesSQL })
    if (projectError) {
      console.error('❌ Error creating project tables:', projectError)
      return
    }
    
    console.log('✅ Project tables created successfully!')
    
    // Step 3: Verify tables exist
    console.log('\n🔍 Step 3: Verifying all tables...')
    const tablesToCheck = [
      'company_settings', 'customers', 'employees', 'services',
      'projects', 'sites', 'budgets', 'budget_items', 'project_services'
    ]
    
    for (const table of tablesToCheck) {
      const { data, error } = await supabase.from(table).select('*').limit(1)
      if (error) {
        console.log(`❌ Table "${table}": ${error.message}`)
      } else {
        console.log(`✅ Table "${table}": Ready`)
      }
    }
    
    console.log('\n🎉 Database setup complete!')
    console.log('🔗 You can now use the dashboard and create projects!')
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
  }
}

setupDatabase()

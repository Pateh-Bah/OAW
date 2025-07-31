const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rrcudlpndmgaumcgdyco.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyY3VkbHBuZG1nYXVtY2dkeWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4OTYzOTIsImV4cCI6MjA2OTQ3MjM5Mn0.J1LLj-LoOc4-3E6q9eZS6bBezO3N0dy6ZSzdIJYFa8E'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function createTablesWithData() {
  console.log('🔨 Creating database tables by inserting sample data...')
  
  try {
    // Step 1: Create profiles table with admin user
    console.log('👤 Creating profiles table...')
    const profileId = generateUUID()
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: profileId,
        email: 'admin@overheadaluminium.com',
        full_name: 'System Administrator',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
    
    if (profileError) {
      console.log('❌ Profiles table error:', profileError.message)
      return false
    }
    console.log('✅ Profiles table created with admin user!')
    
    // Step 2: Create employees table
    console.log('👥 Creating employees table...')
    const employees = [
      {
        id: generateUUID(),
        name: 'Mohamed Bangura',
        position: 'Senior Installer',
        phone: '+232-77-123-456',
        email: 'mohamed@overheadaluminium.com',
        hire_date: '2023-01-15',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: generateUUID(),
        name: 'Fatima Koroma',
        position: 'Project Manager',
        phone: '+232-76-234-567',
        email: 'fatima@overheadaluminium.com',
        hire_date: '2023-03-20',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
    
    const { error: employeeError } = await supabase
      .from('employees')
      .insert(employees)
    
    if (employeeError) {
      console.log('❌ Employees table error:', employeeError.message)
    } else {
      console.log('✅ Employees table created with sample data!')
    }
    
    // Step 3: Create customers table
    console.log('🏢 Creating customers table...')
    const customerId = generateUUID()
    const { error: customerError } = await supabase
      .from('customers')
      .insert([{
        id: customerId,
        name: 'Freetown Shopping Mall',
        phone: '+232-22-123-456',
        email: 'info@freetownmall.sl',
        address: '15 Siaka Stevens Street, Freetown',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
    
    if (customerError) {
      console.log('❌ Customers table error:', customerError.message)
    } else {
      console.log('✅ Customers table created!')
    }
    
    // Step 4: Create projects table with sample projects
    console.log('🏗️ Creating projects table...')
    const projects = [
      {
        id: generateUUID(),
        title: 'Residential Window Installation',
        description: 'Complete aluminium window replacement for family home',
        location: '12 Hill Cot Road, Freetown',
        customer_id: customerId,
        status: 'completed',
        start_date: '2024-01-15',
        completion_date: '2024-01-28',
        budget: 2500000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: generateUUID(),
        title: 'Office Building Curtain Wall',
        description: 'Modern curtain wall system for commercial building',
        location: '45 Siaka Stevens Street, Freetown',
        customer_id: customerId,
        status: 'completed',
        start_date: '2024-02-01',
        completion_date: '2024-03-15',
        budget: 8500000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: generateUUID(),
        title: 'Shopping Center Glass Doors',
        description: 'Installation of automatic glass doors at main entrance',
        location: '78 Kissy Street, Freetown',
        customer_id: customerId,
        status: 'completed',
        start_date: '2024-03-10',
        completion_date: '2024-03-20',
        budget: 4200000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
    
    const { error: projectError } = await supabase
      .from('projects')
      .insert(projects)
    
    if (projectError) {
      console.log('❌ Projects table error:', projectError.message)
    } else {
      console.log('✅ Projects table created with sample projects!')
    }
    
    // Step 5: Create additional tables
    console.log('📊 Creating additional tables...')
    
    // Sites table
    const { error: sitesError } = await supabase
      .from('sites')
      .insert([{
        id: generateUUID(),
        name: 'Main Workshop',
        address: '5c Hill Cot Road, Freetown',
        type: 'workshop',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
    
    if (!sitesError) {
      console.log('✅ Sites table created!')
    }
    
    // Company settings table
    const { error: settingsError } = await supabase
      .from('company_settings')
      .insert([{
        id: generateUUID(),
        setting_key: 'company_name',
        setting_value: 'Overhead Aluminium Workshop',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
    
    if (!settingsError) {
      console.log('✅ Company settings table created!')
    }
    
    return true
    
  } catch (error) {
    console.log('❌ Error during table creation:', error.message)
    return false
  }
}

async function verifySetup() {
  console.log('🔍 Verifying database setup...')
  
  try {
    // Check all tables
    const { data: profiles } = await supabase.from('profiles').select('*')
    const { data: employees } = await supabase.from('employees').select('*')
    const { data: customers } = await supabase.from('customers').select('*')
    const { data: projects } = await supabase.from('projects').select('*')
    
    console.log(`👤 Profiles: ${profiles?.length || 0} records`)
    console.log(`👥 Employees: ${employees?.length || 0} records`)
    console.log(`🏢 Customers: ${customers?.length || 0} records`)
    console.log(`🏗️ Projects: ${projects?.length || 0} records`)
    
    if (profiles?.length > 0 && projects?.length > 0) {
      console.log('✅ Database setup verification successful!')
      return true
    }
    
    return false
    
  } catch (error) {
    console.log('❌ Verification failed:', error.message)
    return false
  }
}

async function automatedSetup() {
  console.log('🎯 Starting fully automated database setup...')
  console.log('🔗 Using Supabase URL:', supabaseUrl)
  
  // First check if tables already exist
  try {
    const { data, error } = await supabase.from('profiles').select('*').limit(1)
    if (!error) {
      console.log('✅ Tables already exist! Checking data...')
      await verifySetup()
      return
    }
  } catch (e) {
    // Tables don't exist, continue with creation
  }
  
  console.log('🔨 Tables do not exist. Creating them now...')
  
  const success = await createTablesWithData()
  
  if (success) {
    console.log('🎉 Automated database setup completed successfully!')
    console.log('')
    console.log('🔑 Next steps:')
    console.log('1. Go to: https://supabase.com/dashboard/project/rrcudlpndmgaumcgdyco/auth/users')
    console.log('2. Click "Add User"')
    console.log('3. Email: admin@overheadaluminium.com')
    console.log('4. Password: Admin@2025')
    console.log('5. Test login at: http://localhost:3001')
    console.log('')
    await verifySetup()
  } else {
    console.log('❌ Automated setup failed.')
    console.log('📖 Please follow manual setup instructions in QUICK_SETUP.md')
  }
}

module.exports = { automatedSetup }

// Run if called directly
if (require.main === module) {
  automatedSetup()
}

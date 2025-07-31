const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rrcudlpndmgaumcgdyco.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyY3VkbHBuZG1nYXVtY2dkeWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4OTYzOTIsImV4cCI6MjA2OTQ3MjM5Mn0.J1LLj-LoOc4-3E6q9eZS6bBezO3N0dy6ZSzdIJYFa8E'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function healthCheck() {
  console.log('🏥 OVERHEAD ALUMINIUM WORKSHOP - HEALTH CHECK')
  console.log('=' .repeat(50))
  
  try {
    // Check tables exist
    console.log('📋 Checking table structure...')
    
    const tables = ['profiles', 'employees', 'customers', 'sites', 'company_settings', 'services']
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1)
        if (error) {
          console.log(`❌ ${table}: ${error.message}`)
        } else {
          console.log(`✅ ${table}: Table accessible`)
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err.message}`)
      }
    }
    
    // Check data with counts (might be restricted by RLS)
    console.log('\n📊 Checking data counts...')
    
    const { data: customers } = await supabase.from('customers').select('*')
    const { data: sites } = await supabase.from('sites').select('*')  
    const { data: employees } = await supabase.from('employees').select('*')
    const { data: settings } = await supabase.from('company_settings').select('*')
    
    console.log(`🏢 Customers: ${customers?.length || 0}`)
    console.log(`🏗️ Sites/Projects: ${sites?.length || 0}`) 
    console.log(`👥 Employees: ${employees?.length || 0}`)
    console.log(`⚙️ Company Settings: ${settings?.length || 0}`)
    
    // Check if setup.sql functions exist
    console.log('\n🔧 Checking admin functions...')
    try {
      const { data, error } = await supabase.rpc('update_admin_role', { user_email: 'test@example.com' })
      if (error && error.message.includes('function update_admin_role')) {
        console.log('❌ Admin functions not created - run setup.sql')
      } else {
        console.log('✅ Admin functions available')
      }
    } catch (err) {
      console.log('⚠️ Admin functions status unknown')
    }
    
    console.log('\n🎯 NEXT STEPS:')
    if ((customers?.length || 0) === 0) {
      console.log('1. Run setup.sql in Supabase SQL Editor')
      console.log('2. Create admin user: admin@overheadaluminium.com')  
      console.log('3. Assign admin role: SELECT update_admin_role(\'admin@overheadaluminium.com\');')
    } else {
      console.log('1. Create admin user: admin@overheadaluminium.com')
      console.log('2. Assign admin role: SELECT update_admin_role(\'admin@overheadaluminium.com\');')
      console.log('3. Test login at: http://localhost:3001') 
    }
    
  } catch (error) {
    console.error('❌ Health check failed:', error.message)
  }
}

healthCheck()

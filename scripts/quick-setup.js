// Simple Database Setup
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://rrcudlpndmgaumcgdyco.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyY3VkbHBuZG1nYXVtY2dkeWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4OTYzOTIsImV4cCI6MjA2OTQ3MjM5Mn0.J1LLj-LoOc4-3E6q9eZS6bBezO3N0dy6ZSzdIJYFa8E'
)

async function quickSetup() {
  console.log('🔧 Quick database setup...')
  
  // Test if tables exist by trying to insert basic data
  try {
    // Try to insert a company setting
    const { error: companyError } = await supabase
      .from('company_settings')
      .upsert({ 
        id: '00000000-0000-0000-0000-000000000001',
        company_name: 'Overhead Aluminium Workshop' 
      })
    
    if (companyError) {
      console.log('❌ company_settings table missing:', companyError.message)
      return false
    }
    
    console.log('✅ company_settings table exists')
    
    // Try customers
    const { error: customerError } = await supabase
      .from('customers')
      .upsert({ 
        id: '00000000-0000-0000-0000-000000000002',
        full_name: 'Test Customer' 
      })
    
    if (customerError) {
      console.log('❌ customers table missing:', customerError.message)
      return false
    }
    
    console.log('✅ customers table exists')
    
    // Try employees
    const { error: employeeError } = await supabase
      .from('employees')
      .upsert({ 
        id: '00000000-0000-0000-0000-000000000003',
        first_name: 'Test',
        last_name: 'Employee' 
      })
    
    if (employeeError) {
      console.log('❌ employees table missing:', employeeError.message)
      return false
    }
    
    console.log('✅ employees table exists')
    
    // Try services
    const { error: serviceError } = await supabase
      .from('services')
      .upsert({ 
        id: '00000000-0000-0000-0000-000000000004',
        service_name: 'Test Service' 
      })
    
    if (serviceError) {
      console.log('❌ services table missing:', serviceError.message)
      return false
    }
    
    console.log('✅ services table exists')
    console.log('🎉 All base tables are ready!')
    
    return true
    
  } catch (error) {
    console.error('❌ Setup error:', error.message)
    return false
  }
}

quickSetup().then(success => {
  if (success) {
    console.log('\n🚀 Now your dashboard should work!')
    console.log('💡 If you still see loading, refresh the page')
  } else {
    console.log('\n⚠️  Some tables are missing. Please run the SQL scripts in Supabase dashboard.')
  }
})

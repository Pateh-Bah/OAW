const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  console.log('Please check your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkTables() {
  console.log('🔍 Checking database tables...')
  
  const tablesToCheck = [
    'company_settings',
    'employees', 
    'customers',
    'services',
    'projects',
    'sites',
    'budgets',
    'budget_items',
    'project_services'
  ]
  
  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        if (error.code === '42P01') {
          console.log(`❌ Table "${table}" does not exist`)
        } else {
          console.log(`⚠️  Table "${table}" exists but has error: ${error.message}`)
        }
      } else {
        console.log(`✅ Table "${table}" exists (${data ? data.length : 0} sample records)`)
      }
    } catch (err) {
      console.log(`❌ Error checking table "${table}": ${err.message}`)
    }
  }
  
  console.log('\n🎯 Table check complete!')
}

checkTables().catch(console.error)

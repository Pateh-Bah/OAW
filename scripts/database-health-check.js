import { supabase } from './lib/supabase'

export async function checkDatabaseHealth() {
  console.log('🔍 Checking database health...')
  
  const results = {
    connection: false,
    customers: false,
    employees: false,
    projects: false,
    company_settings: false,
    services: false
  }

  try {
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('customers')
      .select('count', { count: 'exact', head: true })

    if (connectionError) {
      console.error('❌ Database connection failed:', connectionError.message)
      return results
    }
    
    results.connection = true
    console.log('✅ Database connection successful')

    // Test each table
    const tables = ['customers', 'employees', 'projects', 'company_settings', 'services']
    
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('*')
          .limit(1)

        if (!error) {
          results[table] = true
          console.log(`✅ Table '${table}' accessible`)
        } else {
          console.error(`❌ Table '${table}' error:`, error.message)
        }
      } catch (err) {
        console.error(`❌ Table '${table}' check failed:`, err)
      }
    }

    return results
  } catch (error) {
    console.error('❌ Database health check failed:', error)
    return results
  }
}

// Run the health check if this file is executed directly
if (typeof window === 'undefined') {
  checkDatabaseHealth().then(results => {
    console.log('\n📊 Database Health Summary:')
    Object.entries(results).forEach(([key, value]) => {
      console.log(`  ${value ? '✅' : '❌'} ${key}`)
    })
    
    const healthyTables = Object.values(results).filter(Boolean).length
    const totalChecks = Object.keys(results).length
    console.log(`\n🎯 Health Score: ${healthyTables}/${totalChecks} checks passed`)
    
    if (healthyTables < totalChecks) {
      console.log('\n💡 To fix database issues:')
      console.log('1. Run the complete-database-structure.sql in your Supabase SQL Editor')
      console.log('2. Check RLS policies are properly configured')
      console.log('3. Verify authentication is working')
    }
  })
}

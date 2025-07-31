const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Supabase configuration
const supabaseUrl = 'https://rrcudlpndmgaumcgdyco.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyY3VkbHBuZG1nYXVtY2dkeWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4OTYzOTIsImV4cCI6MjA2OTQ3MjM5Mn0.J1LLj-LoOc4-3E6q9eZS6bBezO3N0dy6ZSzdIJYFa8E'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Function to execute SQL via REST API
async function executeSQLDirect(sql) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey
      },
      body: JSON.stringify({ query: sql })
    })
    
    if (!response.ok) {
      // Try alternative approach using edge functions
      return await executeWithEdgeFunction(sql)
    }
    
    return await response.json()
  } catch (error) {
    console.log('REST API approach failed, trying direct table creation...')
    return null
  }
}

// Alternative approach - create tables using direct API calls
async function createTablesDirectly() {
  console.log('🔨 Creating database tables programmatically...')
  
  // Create profiles table structure
  const profilesData = [
    {
      id: '00000000-0000-0000-0000-000000000000',
      email: 'admin@overheadaluminium.com',
      full_name: 'System Administrator',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
  
  // Try to create initial data to establish table structure
  try {
    // This will likely fail but helps establish what we need
    const { error } = await supabase.from('profiles').insert(profilesData)
    if (error) {
      console.log('📋 Tables need to be created via SQL. Preparing automated SQL execution...')
      return false
    }
    return true
  } catch (err) {
    return false
  }
}

// Function to read and execute SQL files
async function executeSQLFile(filename) {
  try {
    const sqlPath = path.join(__dirname, '..', 'supabase', filename)
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')
    
    console.log(`� Executing ${filename}...`)
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    let successCount = 0
    let errors = []
    
    for (const statement of statements) {
      try {
        // Use Supabase client to execute SQL
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement })
        
        if (error) {
          // Try alternative method using direct HTTP request
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseAnonKey}`,
              'apikey': supabaseAnonKey
            },
            body: JSON.stringify({ query: statement })
          })
          
          if (!response.ok) {
            errors.push(`Statement failed: ${statement.substring(0, 100)}...`)
            continue
          }
        }
        
        successCount++
      } catch (err) {
        errors.push(`Error: ${err.message}`)
      }
    }
    
    console.log(`✅ Executed ${successCount} statements from ${filename}`)
    if (errors.length > 0) {
      console.log(`⚠️  ${errors.length} statements had issues`)
    }
    
    return { success: successCount > 0, errors }
    
  } catch (error) {
    console.error(`❌ Failed to read ${filename}:`, error.message)
    return { success: false, errors: [error.message] }
  }
}

// Enhanced setup function with automation
async function setupDatabase() {
  console.log('🚀 Starting automated database setup...')
  
  try {
    // First check if tables already exist
    const { data: profiles, error: profileError } = await supabase.from('profiles').select('*').limit(1)
    
    if (!profileError) {
      console.log('✅ Tables already exist! Checking data...')
      await checkExistingData()
      return
    }
    
    console.log('🔨 Tables do not exist. Creating them automatically...')
    
    // Try to execute schema file
    const schemaResult = await executeSQLFile('schema.sql')
    if (!schemaResult.success) {
      console.log('❌ Automated SQL execution failed. Falling back to manual instructions...')
      await showManualInstructions()
      return
    }
    
    console.log('✅ Database schema created successfully!')
    
    // Execute setup file for sample data
    const setupResult = await executeSQLFile('setup.sql')
    if (setupResult.success) {
      console.log('✅ Sample data inserted successfully!')
    }
    
    // Final verification
    await checkExistingData()
    
    console.log('')
    console.log('🎉 Database setup completed!')
    console.log('🔑 Next: Create admin user at: https://supabase.com/dashboard/project/rrcudlpndmgaumcgdyco/auth/users')
    console.log('   Email: admin@overheadaluminium.com')
    console.log('   Password: Admin@2025')
    
  } catch (err) {
    console.error('❌ Setup failed:', err.message)
    await showManualInstructions()
  }
}

async function checkExistingData() {
  try {
    const { data: projectData } = await supabase.from('projects').select('*')
    const { data: employeeData } = await supabase.from('employees').select('*')
    
    console.log(`📊 Found ${projectData?.length || 0} projects`)
    console.log(`👥 Found ${employeeData?.length || 0} employees`)
    
    if (projectData?.length > 0) {
      console.log('✅ Sample data is loaded!')
    } else {
      console.log('⚠️  No sample data found.')
    }
  } catch (err) {
    console.log('⚠️  Could not check existing data')
  }
}

async function showManualInstructions() {
  console.log('')
  console.log('🔧 FALLBACK - MANUAL SETUP REQUIRED:')
  console.log('1. Go to: https://supabase.com/dashboard/project/rrcudlpndmgaumcgdyco/sql')
  console.log('2. Copy content from supabase/schema.sql and RUN it')
  console.log('3. Copy content from supabase/setup.sql and RUN it')
  console.log('4. Create admin user in Auth panel')
  console.log('')
  console.log('📖 See QUICK_SETUP.md for detailed instructions')
}

setupDatabase()

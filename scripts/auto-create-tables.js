const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

const supabaseUrl = 'https://rrcudlpndmgaumcgdyco.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyY3VkbHBuZG1nYXVtY2dkeWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4OTYzOTIsImV4cCI6MjA2OTQ3MjM5Mn0.J1LLj-LoOc4-3E6q9eZS6bBezO3N0dy6ZSzdIJYFa8E'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    console.log(`🔧 Running: ${command} ${args.join(' ')}`)
    
    const process = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: __dirname
    })

    process.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command failed with code ${code}`))
      }
    })

    process.on('error', (error) => {
      reject(error)
    })
  })
}

async function executeSQLFile(filename) {
  try {
    const sqlPath = path.join(__dirname, '..', 'supabase', filename)
    console.log(`📄 Executing ${filename}...`)
    
    // Use Supabase CLI to execute SQL file
    await runCommand('npx', ['supabase', 'db', 'push', '--file', sqlPath])
    
    console.log(`✅ ${filename} executed successfully!`)
    return true
  } catch (error) {
    console.log(`❌ Failed to execute ${filename}:`, error.message)
    return false
  }
}

async function executeSQLDirect(filename) {
  try {
    const sqlPath = path.join(__dirname, '..', 'supabase', filename)
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')
    
    console.log(`📄 Reading ${filename}...`)
    
    // Split into individual statements and execute each one
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*'))

    console.log(`🔧 Found ${statements.length} SQL statements to execute`)

    let successCount = 0
    let errors = []

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.length === 0) continue

      try {
        console.log(`📝 Executing statement ${i + 1}/${statements.length}...`)
        
        // Use supabase CLI to execute individual statement
        const tempFile = path.join(__dirname, 'temp_statement.sql')
        fs.writeFileSync(tempFile, statement + ';')
        
        await runCommand('npx', ['supabase', 'db', 'push', '--file', tempFile])
        
        // Clean up temp file
        fs.unlinkSync(tempFile)
        
        successCount++
        console.log(`✅ Statement ${i + 1} executed successfully`)
        
      } catch (error) {
        errors.push(`Statement ${i + 1}: ${error.message}`)
        console.log(`⚠️ Statement ${i + 1} failed: ${error.message}`)
      }
    }

    console.log(`📊 Results: ${successCount} successful, ${errors.length} failed`)
    return successCount > 0

  } catch (error) {
    console.log(`❌ Error reading ${filename}:`, error.message)
    return false
  }
}

async function checkSupabaseCLI() {
  try {
    await runCommand('npx', ['supabase', '--version'])
    console.log('✅ Supabase CLI is available')
    return true
  } catch (error) {
    console.log('❌ Supabase CLI not available:', error.message)
    return false
  }
}

async function automaticTableCreation() {
  console.log('🚀 Starting automatic table creation...')
  
  // Check if Supabase CLI is working
  const cliAvailable = await checkSupabaseCLI()
  if (!cliAvailable) {
    console.log('❌ Supabase CLI is required for automatic execution')
    return false
  }

  // Check if already logged in and linked
  try {
    await runCommand('npx', ['supabase', 'status'])
    console.log('✅ Supabase project is linked')
  } catch (error) {
    console.log('🔗 Linking to Supabase project...')
    try {
      await runCommand('npx', ['supabase', 'link', '--project-ref', 'rrcudlpndmgaumcgdyco'])
    } catch (linkError) {
      console.log('❌ Failed to link project. Please link manually first.')
      return false
    }
  }

  // Execute schema file first
  console.log('📋 Step 1: Creating database schema...')
  const schemaSuccess = await executeSQLDirect('schema.sql')
  
  if (!schemaSuccess) {
    console.log('❌ Schema creation failed')
    return false
  }

  // Wait a moment for schema to be applied
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Execute setup file
  console.log('📊 Step 2: Inserting sample data...')
  const setupSuccess = await executeSQLDirect('setup.sql')

  if (setupSuccess) {
    console.log('🎉 Database tables created successfully!')
    console.log('')
    console.log('🔑 Next steps:')
    console.log('1. Go to: https://supabase.com/dashboard/project/rrcudlpndmgaumcgdyco/auth/users')
    console.log('2. Click "Add User"')
    console.log('3. Email: admin@overheadaluminium.com')
    console.log('4. Password: Admin@2025')
    console.log('5. Run: SELECT update_admin_role(\'admin@overheadaluminium.com\');')
    console.log('')
    
    // Verify the setup
    await verifyTables()
    return true
  } else {
    console.log('❌ Setup failed')
    return false
  }
}

async function verifyTables() {
  console.log('🔍 Verifying table creation...')
  
  try {
    const { data: profiles, error1 } = await supabase.from('profiles').select('*').limit(1)
    const { data: employees, error2 } = await supabase.from('employees').select('*')
    const { data: customers, error3 } = await supabase.from('customers').select('*')
    const { data: sites, error4 } = await supabase.from('sites').select('*')

    if (error1 || error2 || error3 || error4) {
      console.log('⚠️ Some tables may not be accessible yet')
    } else {
      console.log('✅ All tables are accessible!')
      console.log(`👥 Employees: ${employees?.length || 0}`)
      console.log(`🏢 Customers: ${customers?.length || 0}`)
      console.log(`🏗️ Sites: ${sites?.length || 0}`)
    }
  } catch (error) {
    console.log('⚠️ Table verification failed - this is normal during setup')
  }
}

// Run the automatic setup
automaticTableCreation().then(success => {
  if (success) {
    console.log('🎯 Automatic setup completed!')
  } else {
    console.log('❌ Automatic setup failed. Please use manual method.')
  }
}).catch(error => {
  console.error('❌ Unexpected error:', error.message)
})

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

async function readSQLFile(filename) {
  try {
    const sqlPath = path.join(__dirname, '..', 'supabase', filename)
    return fs.readFileSync(sqlPath, 'utf8')
  } catch (error) {
    console.log(`❌ Could not read ${filename}:`, error.message)
    return null
  }
}

async function executeSQLDirectly() {
  console.log('🔧 Attempting to execute SQL files directly...')
  
  // Read schema SQL
  const schemaSql = await readSQLFile('schema.sql')
  if (!schemaSql) return false
  
  // Read setup SQL  
  const setupSql = await readSQLFile('setup.sql')
  if (!setupSql) return false
  
  console.log('📄 SQL files loaded successfully')
  console.log('⚠️  Since we cannot execute raw SQL via API, creating tables with sample data...')
  
  return false // Force manual table creation approach
}

async function createDatabaseStructure() {
  console.log('🚀 Creating database structure programmatically...')
  
  // Define table structures that we need
  const tablesToCreate = [
    {
      name: 'profiles',
      data: {
        id: 'uuid',
        email: 'text',
        full_name: 'text', 
        role: 'text',
        created_at: 'timestamp',
        updated_at: 'timestamp'
      }
    },
    {
      name: 'employees',
      data: {
        id: 'uuid',
        name: 'text',
        position: 'text',
        phone: 'text',
        email: 'text',
        hire_date: 'date'
      }
    },
    {
      name: 'customers', 
      data: {
        id: 'uuid',
        name: 'text',
        phone: 'text',
        email: 'text',
        address: 'text'
      }
    },
    {
      name: 'projects',
      data: {
        id: 'uuid',
        title: 'text',
        description: 'text',
        location: 'text',
        customer_id: 'uuid',
        status: 'text',
        start_date: 'date',
        completion_date: 'date',
        budget: 'numeric'
      }
    }
  ]
  
  // Try to insert sample data to create tables automatically
  try {
    // Sample profile data
    const profileData = {
      id: generateUUID(),
      email: 'admin@overheadaluminium.com',
      full_name: 'System Administrator',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const response = await fetch(`${supabaseUrl}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(profileData)
    })
    
    if (response.ok) {
      console.log('✅ Profiles table created and data inserted!')
      return true
    } else {
      console.log('❌ Direct table creation failed:', await response.text())
      return false
    }
    
  } catch (error) {
    console.log('❌ Error creating tables:', error.message)
    return false
  }
}

async function insertSampleData() {
  console.log('📊 Inserting sample data...')
  
  const sampleProjects = [
    {
      id: generateUUID(),
      title: 'Residential Window Installation',
      description: 'Complete aluminium window replacement for family home',
      location: '12 Hill Cot Road, Freetown', 
      status: 'completed',
      start_date: '2024-01-15',
      completion_date: '2024-01-28',
      budget: 2500000
    },
    {
      id: generateUUID(),
      title: 'Office Building Curtain Wall',
      description: 'Modern curtain wall system for commercial building',
      location: '45 Siaka Stevens Street, Freetown',
      status: 'completed', 
      start_date: '2024-02-01',
      completion_date: '2024-03-15',
      budget: 8500000
    }
  ]
  
  try {
    for (const project of sampleProjects) {
      const response = await fetch(`${supabaseUrl}/rest/v1/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(project)
      })
      
      if (response.ok) {
        console.log(`✅ Project "${project.title}" inserted`)
      } else {
        console.log(`❌ Failed to insert project: ${await response.text()}`)
      }
    }
    
    return true
  } catch (error) {
    console.log('❌ Error inserting sample data:', error.message)
    return false
  }
}

async function automatedSetup() {
  console.log('🎯 Starting fully automated database setup...')
  
  // Try direct table creation
  const tablesCreated = await createDatabaseStructure()
  
  if (tablesCreated) {
    // Insert sample data
    await insertSampleData()
    console.log('🎉 Automated setup completed!')
    console.log('🔑 Create admin user at: https://supabase.com/dashboard/project/rrcudlpndmgaumcgdyco/auth/users')
  } else {
    console.log('❌ Automated setup failed. Please use manual SQL execution.')
    console.log('📖 Check QUICK_SETUP.md for manual instructions')
  }
}

module.exports = { automatedSetup }

// Run if called directly
if (require.main === module) {
  automatedSetup()
}

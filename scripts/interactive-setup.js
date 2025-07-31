#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = 'https://rrcudlpndmgaumcgdyco.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyY3VkbHBuZG1nYXVtY2dkeWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4OTYzOTIsImV4cCI6MjA2OTQ3MjM5Mn0.J1LLj-LoOc4-3E6q9eZS6bBezO3N0dy6ZSzdIJYFa8E'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkDatabaseStatus() {
  console.log('🔍 Checking database status...')
  
  try {
    const { data, error } = await supabase.from('profiles').select('*').limit(1)
    
    if (error) {
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.log('❌ Database tables do not exist')
        return 'no-tables'
      } else {
        console.log('❌ Database connection error:', error.message)
        return 'connection-error'
      }
    }
    
    console.log('✅ Database tables exist!')
    
    // Check for data
    const { data: projects } = await supabase.from('projects').select('*')
    const { data: employees } = await supabase.from('employees').select('*')
    
    console.log(`📊 Projects: ${projects?.length || 0}`)
    console.log(`👥 Employees: ${employees?.length || 0}`)
    
    if (projects?.length > 0) {
      return 'complete'
    } else {
      return 'no-data'
    }
    
  } catch (err) {
    console.log('❌ Unexpected error:', err.message)
    return 'error'
  }
}

function displaySQLContent(filename) {
  try {
    const sqlPath = path.join(__dirname, '..', 'supabase', filename)
    const content = fs.readFileSync(sqlPath, 'utf8')
    
    console.log(`\n📄 Content of ${filename}:`)
    console.log('=' .repeat(50))
    console.log(content)
    console.log('=' .repeat(50))
    
    return content
  } catch (error) {
    console.log(`❌ Could not read ${filename}:`, error.message)
    return null
  }
}

async function interactiveSetup() {
  console.log('🎯 INTERACTIVE DATABASE SETUP')
  console.log('=' .repeat(40))
  
  const status = await checkDatabaseStatus()
  
  switch (status) {
    case 'complete':
      console.log('🎉 Your database is already set up and ready!')
      console.log('🔗 Test your app at: http://localhost:3001')
      break
      
    case 'no-data':
      console.log('⚠️  Tables exist but no sample data found.')
      console.log('\n🔧 COPY AND PASTE THIS SQL:')
      displaySQLContent('setup.sql')
      console.log('\n🔗 Paste it here: https://supabase.com/dashboard/project/rrcudlpndmgaumcgdyco/sql')
      break
      
    case 'no-tables':
      console.log('🔧 STEP 1: CREATE TABLES')
      console.log('Copy this SQL and run in Supabase SQL Editor:')
      displaySQLContent('schema.sql')
      console.log('\n🔗 Go to: https://supabase.com/dashboard/project/rrcudlpndmgaumcgdyco/sql')
      console.log('1. Paste the schema.sql content above')
      console.log('2. Click RUN')
      console.log('\n🔧 STEP 2: ADD SAMPLE DATA')
      console.log('Then copy this SQL and run it:')
      displaySQLContent('setup.sql')
      console.log('\n🔧 STEP 3: CREATE ADMIN USER')
      console.log('Go to: https://supabase.com/dashboard/project/rrcudlpndmgaumcgdyco/auth/users')
      console.log('- Click "Add User"')
      console.log('- Email: admin@overheadaluminium.com')
      console.log('- Password: Admin@2025')
      console.log('- Click "Create User"')
      break
      
    default:
      console.log('❌ Could not determine database status')
      console.log('🔗 Check your Supabase dashboard: https://supabase.com/dashboard/project/rrcudlpndmgaumcgdyco')
  }
  
  console.log('\n🔄 Run this script again to check progress!')
}

// Run the interactive setup
interactiveSetup()

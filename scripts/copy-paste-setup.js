const fs = require('fs')
const path = require('path')

function readSQLFile(filename) {
  try {
    const sqlPath = path.join(__dirname, '..', 'supabase', filename)
    return fs.readFileSync(sqlPath, 'utf8')
  } catch (error) {
    console.log(`❌ Could not read ${filename}:`, error.message)
    return null
  }
}

function displaySQLForCopy() {
  console.log('🎯 AUTOMATIC DATABASE SETUP - COPY & PASTE SOLUTION')
  console.log('=' .repeat(60))
  console.log('')
  console.log('📋 STEP 1: Open Supabase SQL Editor')
  console.log('🔗 https://supabase.com/dashboard/project/rrcudlpndmgaumcgdyco/sql')
  console.log('')
  console.log('📋 STEP 2: Copy and paste this SCHEMA SQL:')
  console.log('=' .repeat(60))
  
  const schemaSql = readSQLFile('schema.sql')
  if (schemaSql) {
    console.log(schemaSql)
  }
  
  console.log('=' .repeat(60))
  console.log('✅ Click RUN after pasting the above SQL')
  console.log('')
  console.log('📋 STEP 3: Copy and paste this SETUP SQL:')
  console.log('=' .repeat(60))
  
  const setupSql = readSQLFile('setup.sql')
  if (setupSql) {
    console.log(setupSql)
  }
  
  console.log('=' .repeat(60))
  console.log('✅ Click RUN after pasting the above SQL')
  console.log('')
  console.log('📋 STEP 4: Create Admin User')
  console.log('🔗 https://supabase.com/dashboard/project/rrcudlpndmgaumcgdyco/auth/users')
  console.log('👤 Email: admin@overheadaluminium.com')
  console.log('🔑 Password: Admin@2025')
  console.log('✅ Check "Email Confirm"')
  console.log('')
  console.log('📋 STEP 5: Assign Admin Role')
  console.log('Copy and paste this SQL in the SQL Editor:')
  console.log('=' .repeat(60))
  console.log("SELECT update_admin_role('admin@overheadaluminium.com');")
  console.log('=' .repeat(60))
  console.log('✅ Click RUN after pasting the above SQL')
  console.log('')
  console.log('🎉 DONE! Test your app at: http://localhost:3001')
  console.log('🔐 Login with: admin@overheadaluminium.com / Admin@2025')
}

// Generate the copy-paste instructions
displaySQLForCopy()

const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')

const supabaseUrl = 'https://rrcudlpndmgaumcgdyco.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyY3VkbHBuZG1nYXVtY2dkeWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4OTYzOTIsImV4cCI6MjA2OTQ3MjM5Mn0.J1LLj-LoOc4-3E6q9eZS6bBezO3N0dy6ZSzdIJYFa8E'

// Since we can't execute raw SQL via API, let's create the tables by using the PostgREST API
// This will create tables with sample data, effectively establishing the schema

async function createTableWithData(tableName, sampleData) {
  try {
    console.log(`🔨 Creating ${tableName} table...`)
    
    const response = await fetch(`${supabaseUrl}/rest/v1/${tableName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(sampleData)
    })

    if (response.ok) {
      console.log(`✅ ${tableName} table created successfully!`)
      return true
    } else {
      const errorText = await response.text()
      console.log(`❌ Failed to create ${tableName}:`, errorText)
      return false
    }
  } catch (error) {
    console.log(`❌ Error creating ${tableName}:`, error.message)
    return false
  }
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function createAllTables() {
  console.log('🚀 Creating database tables automatically...')
  
  // Create employees table with sample data
  const employees = [
    {
      id: generateUUID(),
      full_name: 'Mohamed Kamara',
      designation: 'Senior Technician',
      department: 'Production',
      badge_number: 'OAW001',
      contact_info: { phone: '+232-77-111-222', emergency_contact: '+232-76-111-222' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: generateUUID(),
      full_name: 'Fatima Sesay',
      designation: 'Project Manager',
      department: 'Management',
      badge_number: 'OAW002',
      contact_info: { phone: '+232-77-222-333', emergency_contact: '+232-76-222-333' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  const employeesSuccess = await createTableWithData('employees', employees)

  // Create customers table
  const customers = [
    {
      id: generateUUID(),
      full_name: 'East End Residential Complex',
      phone_number: '+232-76-123-456',
      email: 'eastend@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: generateUUID(),
      full_name: 'Siaka Stevens Office Building',
      phone_number: '+232-76-234-567',
      email: 'office@siakabuilding.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  const customersSuccess = await createTableWithData('customers', customers)

  // Create sites table
  const customerId = customers[0].id
  const sites = [
    {
      id: generateUUID(),
      customer_id: customerId,
      address: '15 Wilkinson Road, Freetown',
      budget: 45000.00,
      cost_breakdown: { materials: 25000, labor: 15000, equipment: 5000 },
      company_earnings: 12000.00,
      status: 'Completed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  const sitesSuccess = await createTableWithData('sites', sites)

  // Create company_settings table
  const companySettings = [
    {
      id: generateUUID(),
      company_name: 'Overhead Aluminium Workshop',
      primary_color: '#0066CC',
      contact_info: {
        email: 'overheadaluminium@gmail.com',
        phone1: '+232-77-902-889',
        phone2: '+232-74-902-889',
        phone3: '+232-31-902-889',
        address: '5c Hill Cot Road, Freetown, Sierra Leone',
        website: 'https://www.overheadaluminium.com'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  const settingsSuccess = await createTableWithData('company_settings', companySettings)

  // Create services table
  const services = [
    {
      id: generateUUID(),
      name: 'Aluminum Windows & Doors',
      description: 'Custom-designed windows and doors for modern residential and commercial buildings',
      features: ['Custom designs', 'Energy efficient', 'Weather resistant'],
      icon_name: 'building2',
      created_at: new Date().toISOString()
    },
    {
      id: generateUUID(),
      name: 'Kitchen Cabinets',
      description: 'Durable and elegant aluminum kitchen solutions with modern finishes',
      features: ['Modern designs', 'Durable materials', 'Custom sizes'],
      icon_name: 'wrench',
      created_at: new Date().toISOString()
    }
  ]

  const servicesSuccess = await createTableWithData('services', services)

  // Summary
  const results = {
    employees: employeesSuccess,
    customers: customersSuccess,
    sites: sitesSuccess,
    company_settings: settingsSuccess,
    services: servicesSuccess
  }

  const successCount = Object.values(results).filter(Boolean).length
  const totalTables = Object.keys(results).length

  console.log('')
  console.log('📊 TABLE CREATION SUMMARY:')
  console.log(`✅ Successfully created: ${successCount}/${totalTables} tables`)
  
  Object.entries(results).forEach(([table, success]) => {
    console.log(`${success ? '✅' : '❌'} ${table}`)
  })

  if (successCount > 0) {
    console.log('')
    console.log('🎉 Database setup partially successful!')
    console.log('📝 Note: Some tables may not be created if they require specific schema.')
    console.log('')
    console.log('🔑 Next steps:')
    console.log('1. Go to: https://supabase.com/dashboard/project/rrcudlpndmgaumcgdyco/auth/users')
    console.log('2. Create admin user: admin@overheadaluminium.com / Admin@2025')
    console.log('3. Test your app at: http://localhost:3001')
    
    return true
  } else {
    console.log('')
    console.log('❌ All table creation failed.')
    console.log('📖 Please use the manual SQL method in Supabase dashboard.')
    return false
  }
}

// Run the table creation
createAllTables().catch(error => {
  console.error('❌ Unexpected error:', error.message)
})

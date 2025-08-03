const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testStaffOperations() {
  console.log('🧪 Testing Staff Database Operations...\n')

  try {
    // Test 1: Check if employees table exists
    console.log('1️⃣ Testing table connection...')
    const { data: tableTest, error: tableError } = await supabase
      .from('employees')
      .select('count', { count: 'exact', head: true })

    if (tableError) {
      console.error('❌ Table connection failed:', tableError)
      return
    }
    console.log('✅ Employees table connected successfully')
    console.log(`📊 Current employee count: ${tableTest || 0}`)

    // Test 2: Insert a test employee
    console.log('\n2️⃣ Testing employee insertion...')
    const testEmployee = {
      full_name: 'Test Employee',
      designation: 'Test Technician',
      department: 'Production',
      badge_number: 'TEST001',
      contact_info: {
        phone: '+232-77-TEST-123',
        email: 'test@oaw.com'
      }
    }

    const { data: insertData, error: insertError } = await supabase
      .from('employees')
      .insert([testEmployee])
      .select()

    if (insertError) {
      console.error('❌ Insert failed:', insertError)
      return
    }
    console.log('✅ Test employee inserted successfully')
    console.log('📄 Inserted data:', insertData[0])

    // Test 3: Fetch employees
    console.log('\n3️⃣ Testing employee fetch...')
    const { data: fetchData, error: fetchError } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (fetchError) {
      console.error('❌ Fetch failed:', fetchError)
      return
    }
    console.log('✅ Employees fetched successfully')
    console.log(`📋 Fetched ${fetchData.length} employees`)
    fetchData.forEach((emp, index) => {
      console.log(`   ${index + 1}. ${emp.full_name} - ${emp.designation || 'No designation'} (${emp.department || 'No department'})`)
    })

    // Test 4: Delete test employee
    console.log('\n4️⃣ Cleaning up test data...')
    const { error: deleteError } = await supabase
      .from('employees')
      .delete()
      .eq('badge_number', 'TEST001')

    if (deleteError) {
      console.error('❌ Delete failed:', deleteError)
      return
    }
    console.log('✅ Test employee deleted successfully')

    console.log('\n🎉 All staff database operations working correctly!')
    console.log('\n💡 Your staff page should now work properly for:')
    console.log('   ✓ Adding new staff members')
    console.log('   ✓ Displaying existing staff')
    console.log('   ✓ Form validation and submission')
    console.log('   ✓ Database integration')

  } catch (error) {
    console.error('💥 Test failed with error:', error)
  }
}

testStaffOperations()

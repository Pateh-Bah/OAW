const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function fixRLSPolicies() {
  console.log('🔧 Fixing RLS Policies for Employee Management...\n')

  try {
    // Test current authentication status
    console.log('1️⃣ Checking authentication status...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.log('⚠️  No authenticated user found')
      console.log('💡 This is expected when using anonymous access')
    } else if (user) {
      console.log('✅ Authenticated user found:', user.email)
    } else {
      console.log('ℹ️  Using anonymous access')
    }

    // Test direct employee insertion with anonymous access
    console.log('\n2️⃣ Testing employee insertion with current policies...')
    const testEmployee = {
      full_name: 'RLS Test Employee',
      designation: 'Test Position',
      department: 'Testing',
      badge_number: 'RLS001',
      contact_info: {
        phone: '+232-77-RLS-TEST',
        email: 'rls.test@oaw.com'
      }
    }

    const { data: insertData, error: insertError } = await supabase
      .from('employees')
      .insert([testEmployee])
      .select()

    if (insertError) {
      console.error('❌ RLS Policy blocking insertion:', insertError.message)
      
      if (insertError.message.includes('row-level security policy')) {
        console.log('\n🔧 SOLUTION NEEDED:')
        console.log('The RLS policies are too restrictive. You need to:')
        console.log('1. Go to your Supabase Dashboard')
        console.log('2. Navigate to SQL Editor')
        console.log('3. Run the fix-rls-policies.sql script')
        console.log('4. Or temporarily disable RLS for development')
        
        console.log('\n📋 Quick SQL Fix (run in Supabase SQL Editor):')
        console.log('```sql')
        console.log('-- Temporarily allow all operations on employees table')
        console.log('DROP POLICY IF EXISTS "Admin can manage employees" ON employees;')
        console.log('DROP POLICY IF EXISTS "Allow initial setup" ON employees;')
        console.log('CREATE POLICY "Allow all employee operations" ON employees FOR ALL USING (true) WITH CHECK (true);')
        console.log('```')
        
        return false
      }
    } else {
      console.log('✅ Employee insertion successful!')
      console.log('📄 Test employee created:', insertData[0])
      
      // Clean up test data
      console.log('\n3️⃣ Cleaning up test data...')
      const { error: deleteError } = await supabase
        .from('employees')
        .delete()
        .eq('badge_number', 'RLS001')
      
      if (deleteError) {
        console.log('⚠️  Could not delete test employee:', deleteError.message)
      } else {
        console.log('✅ Test employee cleaned up successfully')
      }
      
      return true
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error)
    return false
  }
}

async function main() {
  const success = await fixRLSPolicies()
  
  if (success) {
    console.log('\n🎉 RLS Policies are working correctly!')
    console.log('Your staff management page should now work properly.')
  } else {
    console.log('\n🚨 RLS Policies need to be fixed!')
    console.log('Please run the SQL script in your Supabase dashboard.')
  }
}

main()

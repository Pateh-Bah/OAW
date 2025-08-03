// Test script to verify admin user creation and role assignment
// Run this in the browser console after logging in

async function testAdminSetup() {
  console.log('🔍 Testing Admin Setup...')
  
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    
    console.log('✅ Current User:', user?.email)
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileError) throw profileError
    console.log('✅ User Profile:', profile)
    
    // Test database access
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('count')
      .limit(1)
    
    if (customersError) throw customersError
    console.log('✅ Database Access: Working')
    
    // Test admin functions
    if (profile?.role === 'Admin') {
      console.log('✅ Admin Access: Confirmed')
      
      // Test company settings access
      const { data: company, error: companyError } = await supabase
        .from('company_settings')
        .select('*')
        .limit(1)
      
      if (companyError) {
        console.log('⚠️ Company Settings:', companyError.message)
      } else {
        console.log('✅ Company Settings Access: Working')
      }
    } else {
      console.log('❌ Admin Access: Not confirmed - Role:', profile?.role)
    }
    
    console.log('🎉 Admin setup test completed!')
    
  } catch (error) {
    console.error('❌ Error during admin test:', error)
  }
}

// Auto-run if user is logged in
if (typeof supabase !== 'undefined') {
  testAdminSetup()
} else {
  console.log('⚠️ Supabase not available. Run this script after logging in.')
}

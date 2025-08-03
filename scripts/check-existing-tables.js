const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  try {
    console.log('Checking existing table structures...\n');
    
    // Check customers table structure
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('*')
      .limit(1);
      
    if (!customersError) {
      console.log('✅ Customers table exists');
      console.log('Sample row:', customers[0] ? Object.keys(customers[0]) : 'No data');
    } else {
      console.log('❌ Customers table error:', customersError.message);
    }
    
    // Check employees table structure
    const { data: employees, error: employeesError } = await supabase
      .from('employees')
      .select('*')
      .limit(1);
      
    if (!employeesError) {
      console.log('✅ Employees table exists');
      console.log('Sample row:', employees[0] ? Object.keys(employees[0]) : 'No data');
    } else {
      console.log('❌ Employees table error:', employeesError.message);
    }
    
    // Check company_settings table structure
    const { data: settings, error: settingsError } = await supabase
      .from('company_settings')
      .select('*')
      .limit(1);
      
    if (!settingsError) {
      console.log('✅ Company_settings table exists');
      console.log('Sample row:', settings[0] ? Object.keys(settings[0]) : 'No data');
    } else {
      console.log('❌ Company_settings table error:', settingsError.message);
    }
    
    // Check services table structure
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .limit(1);
      
    if (!servicesError) {
      console.log('✅ Services table exists');
      console.log('Sample row:', services[0] ? Object.keys(services[0]) : 'No data');
    } else {
      console.log('❌ Services table error:', servicesError.message);
    }
    
  } catch (error) {
    console.error('Error checking tables:', error);
  }
}

checkTables();

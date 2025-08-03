const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function insertDemoData() {
  try {
    console.log('🚀 Inserting demo data...')

    // Insert demo customers
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .insert([
        {
          full_name: 'John Smith',
          phone_number: '+232-77-123-456',
          email: 'john.smith@email.com'
        },
        {
          full_name: 'Sarah Johnson',
          phone_number: '+232-77-234-567',
          email: 'sarah.johnson@email.com'
        },
        {
          full_name: 'Michael Brown',
          phone_number: '+232-77-345-678',
          email: 'michael.brown@email.com'
        },
        {
          full_name: 'Emily Davis',
          phone_number: '+232-77-456-789',
          email: 'emily.davis@email.com'
        },
        {
          full_name: 'David Wilson',
          phone_number: '+232-77-567-890',
          email: 'david.wilson@email.com'
        }
      ])
      .select()

    if (customersError) {
      console.error('Error inserting customers:', customersError)
    } else {
      console.log('✅ Customers inserted:', customers?.length)
    }

    // Insert demo employees
    const { data: employees, error: employeesError } = await supabase
      .from('employees')
      .insert([
        {
          full_name: 'Ahmed Hassan',
          designation: 'Senior Fabricator',
          department: 'Production',
          badge_number: 'EMP001',
          contact_info: {
            phone: '+232-77-111-222',
            email: 'ahmed.hassan@oaw.com'
          }
        },
        {
          full_name: 'Fatima Kamara',
          designation: 'Project Manager',
          department: 'Management',
          badge_number: 'EMP002',
          contact_info: {
            phone: '+232-77-222-333',
            email: 'fatima.kamara@oaw.com'
          }
        },
        {
          full_name: 'Ibrahim Sesay',
          designation: 'Welder',
          department: 'Production',
          badge_number: 'EMP003',
          contact_info: {
            phone: '+232-77-333-444',
            email: 'ibrahim.sesay@oaw.com'
          }
        },
        {
          full_name: 'Maryam Bangura',
          designation: 'Quality Inspector',
          department: 'Quality Control',
          badge_number: 'EMP004',
          contact_info: {
            phone: '+232-77-444-555',
            email: 'maryam.bangura@oaw.com'
          }
        }
      ])
      .select()

    if (employeesError) {
      console.error('Error inserting employees:', employeesError)
    } else {
      console.log('✅ Employees inserted:', employees?.length)
    }

    // Insert demo sites/projects
    if (customers && customers.length > 0) {
      const { data: sites, error: sitesError } = await supabase
        .from('sites')
        .insert([
          {
            customer_id: customers[0].id,
            address: '45 Circular Road, Freetown',
            budget: 25000.00,
            company_earnings: 5000.00,
            status: 'In Progress',
            cost_breakdown: {
              materials: 15000,
              labor: 8000,
              overhead: 2000
            }
          },
          {
            customer_id: customers[1].id,
            address: '12 Wilkinson Road, Freetown',
            budget: 18000.00,
            company_earnings: 3600.00,
            status: 'Completed',
            cost_breakdown: {
              materials: 11000,
              labor: 6000,
              overhead: 1000
            }
          },
          {
            customer_id: customers[2].id,
            address: '33 Pademba Road, Freetown',
            budget: 32000.00,
            company_earnings: 6400.00,
            status: 'In Progress',
            cost_breakdown: {
              materials: 20000,
              labor: 10000,
              overhead: 2000
            }
          },
          {
            customer_id: customers[3].id,
            address: '78 Fourah Bay Road, Freetown',
            budget: 15000.00,
            company_earnings: 3000.00,
            status: 'Completed',
            cost_breakdown: {
              materials: 9000,
              labor: 5000,
              overhead: 1000
            }
          },
          {
            customer_id: customers[4].id,
            address: '22 Aberdeen Road, Freetown',
            budget: 28000.00,
            company_earnings: 5600.00,
            status: 'In Progress',
            cost_breakdown: {
              materials: 17000,
              labor: 9000,
              overhead: 2000
            }
          }
        ])
        .select()

      if (sitesError) {
        console.error('Error inserting sites:', sitesError)
      } else {
        console.log('✅ Sites/Projects inserted:', sites?.length)
      }
    }

    console.log('🎉 Demo data insertion completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`• ${customers?.length || 0} customers added`)
    console.log(`• ${employees?.length || 0} employees added`)
    console.log(`• Projects and sites created`)
    console.log('\n✨ Your dashboard should now display real data!')

  } catch (error) {
    console.error('❌ Error inserting demo data:', error)
    process.exit(1)
  }
}

// Run the script
insertDemoData()

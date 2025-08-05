/**
 * Test script for contact form API
 * Run with: node test-contact-api.js
 */

const testContactForm = async () => {
  const testData = {
    name: "Test User",
    email: "test@example.com",
    phone: "+232-77-123-456",
    subject: "Test Message",
    message: "This is a test message to verify the contact form is working correctly."
  }

  try {
    console.log('🧪 Testing Contact Form API...')
    console.log('📤 Sending test data:', testData)
    
    const response = await fetch('http://localhost:3001/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })

    const result = await response.json()
    
    console.log('📥 Response status:', response.status)
    console.log('📥 Response data:', result)
    
    if (response.ok && result.success) {
      console.log('✅ SUCCESS: Contact form API is working correctly!')
      console.log('✉️ Message:', result.message)
    } else {
      console.log('❌ FAILED: Contact form API returned an error')
      console.log('🔍 Error:', result.error || 'Unknown error')
    }
    
  } catch (error) {
    console.log('❌ NETWORK ERROR: Failed to connect to the API')
    console.log('🔍 Error details:', error.message)
  }
}

// Run the test
testContactForm()

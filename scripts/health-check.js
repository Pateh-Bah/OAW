#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Running OAW Application Health Check...\n');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found');
  process.exit(1);
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to install dependencies');
    process.exit(1);
  }
}

// Check TypeScript configuration
if (!fs.existsSync('tsconfig.json')) {
  console.error('❌ tsconfig.json not found');
  process.exit(1);
}

// Check Tailwind configuration
if (!fs.existsSync('tailwind.config.ts')) {
  console.error('❌ tailwind.config.ts not found');
  process.exit(1);
}

// Check environment configuration
if (!fs.existsSync('.env.local') && !fs.existsSync('.env')) {
  console.log('⚠️  No environment file found. Please copy .env.example to .env.local and configure your Supabase credentials.');
}

// Check essential directories and files
const essentialPaths = [
  'app/layout.tsx',
  'app/page.tsx',
  'app/dashboard/page.tsx',
  'app/auth/login/page.tsx',
  'components/ui',
  'lib/utils.ts',
  'lib/supabase.ts',
  'types/index.ts',
  'supabase/schema.sql'
];

const missingPaths = essentialPaths.filter(p => !fs.existsSync(p));

if (missingPaths.length > 0) {
  console.error('❌ Missing essential files:');
  missingPaths.forEach(p => console.error(`   - ${p}`));
  process.exit(1);
}

console.log('✅ All essential files present');

// Try to build the application
console.log('\n🏗️  Testing application build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful');
} catch (error) {
  console.error('❌ Build failed');
  console.log('\n💡 Common fixes:');
  console.log('   1. Ensure all dependencies are installed: npm install');
  console.log('   2. Check for TypeScript errors: npm run type-check');
  console.log('   3. Verify Supabase configuration in environment variables');
  process.exit(1);
}

// Try to run the development server briefly
console.log('\n🚀 Testing development server...');
try {
  const child = execSync('timeout 10s npm run dev 2>&1 || true', { 
    encoding: 'utf-8',
    timeout: 15000 
  });
  
  if (child.includes('Ready') || child.includes('started server') || child.includes('Local:')) {
    console.log('✅ Development server started successfully');
  } else {
    console.log('⚠️  Development server may have issues. Check manually with: npm run dev');
  }
} catch (error) {
  console.log('⚠️  Could not test development server automatically. Try manually: npm run dev');
}

console.log('\n🎉 OAW Application Health Check Complete!');
console.log('\n📋 Next Steps:');
console.log('   1. Configure your Supabase project and update .env.local');
console.log('   2. Run the database schema: supabase db reset');
console.log('   3. Start development: npm run dev');
console.log('   4. Visit http://localhost:3000 to see the application');
console.log('\n📖 See README.md for detailed setup instructions');

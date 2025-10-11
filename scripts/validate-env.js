#!/usr/bin/env node

/**
 * RE:MIND Environment Validation Script
 * Validates that all required environment variables are set
 */

const requiredEnvVars = [
  // Supabase
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  
  // Authentication
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  
  // Email
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'FROM_EMAIL',
  
  // Push Notifications
  'NEXT_PUBLIC_VAPID_PUBLIC_KEY',
  'VAPID_PRIVATE_KEY',
  
  // Stripe Payments
  'STRIPE_PUBLIC_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  
  // Security
  'JWT_SECRET',
  'ENCRYPTION_KEY',
  
  // App Configuration
  'NEXT_PUBLIC_APP_URL'
]

const optionalEnvVars = [
  'DATABASE_URL',
  'GOOGLE_ANALYTICS_ID',
  'SENTRY_DSN',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER'
]

console.log('🔍 RE:MIND Environment Validation')
console.log('==================================')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

let allValid = true
let missingVars = []
let foundVars = []

// Check required variables
console.log('\n📋 Required Environment Variables:')
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`❌ Missing: ${envVar}`)
    missingVars.push(envVar)
    allValid = false
  } else {
    console.log(`✅ Found: ${envVar}`)
    foundVars.push(envVar)
  }
})

// Check optional variables
console.log('\n📋 Optional Environment Variables:')
optionalEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ Found: ${envVar}`)
    foundVars.push(envVar)
  } else {
    console.log(`⚠️  Optional: ${envVar} (not set)`)
  }
})

// Validation results
console.log('\n📊 Validation Summary:')
console.log(`✅ Found: ${foundVars.length} variables`)
console.log(`❌ Missing: ${missingVars.length} required variables`)

if (allValid) {
  console.log('\n🎉 All required environment variables are set!')
  console.log('🚀 RE:MIND is ready for deployment!')
  
  // Additional checks
  console.log('\n🔍 Additional Validation:')
  
  // Check URL format
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('https://')) {
    console.log('⚠️  Supabase URL should start with https://')
  }
  
  if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.startsWith('https://')) {
    console.log('⚠️  NextAuth URL should start with https://')
  }
  
  // Check secret lengths
  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
    console.log('⚠️  NextAuth secret should be at least 32 characters')
  }
  
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.log('⚠️  JWT secret should be at least 32 characters')
  }
  
  // Check Stripe keys
  if (process.env.STRIPE_PUBLIC_KEY && !process.env.STRIPE_PUBLIC_KEY.startsWith('pk_')) {
    console.log('⚠️  Stripe public key should start with pk_')
  }
  
  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
    console.log('⚠️  Stripe secret key should start with sk_')
  }
  
  // Check VAPID keys
  if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY.length < 80) {
    console.log('⚠️  VAPID public key seems too short')
  }
  
  if (process.env.VAPID_PRIVATE_KEY && process.env.VAPID_PRIVATE_KEY.length < 40) {
    console.log('⚠️  VAPID private key seems too short')
  }
  
  process.exit(0)
} else {
  console.log('\n❌ Some required environment variables are missing!')
  console.log('\n📝 Missing variables:')
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`)
  })
  
  console.log('\n🔧 Setup Instructions:')
  console.log('1. Copy env.production.example to .env.local')
  console.log('2. Fill in all the missing variables above')
  console.log('3. Run this validation script again')
  console.log('4. See ENVIRONMENT_SETUP_GUIDE.md for detailed instructions')
  
  process.exit(1)
}

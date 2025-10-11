#!/usr/bin/env node

/**
 * RE:MIND Secret Generator for Windows/Cross-platform
 * Generates secure secrets for environment variables
 */

const crypto = require('crypto');

console.log('🔐 RE:MIND Secret Generator');
console.log('=========================');

// Function to generate secure random string
function generateRandomString(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// Function to generate Base64 secret
function generateBase64Secret(length = 24) {
  const bytes = crypto.randomBytes(length);
  return bytes.toString('base64');
}

console.log('\n🔑 Generating secure secrets...');

// Generate NextAuth Secret
const nextAuthSecret = generateBase64Secret(24);
console.log('\n📝 NextAuth Secret:');
console.log(`NEXTAUTH_SECRET=${nextAuthSecret}`);

// Generate JWT Secret
const jwtSecret = generateBase64Secret(24);
console.log('\n📝 JWT Secret:');
console.log(`JWT_SECRET=${jwtSecret}`);

// Generate Encryption Key
const encryptionKey = generateBase64Secret(24);
console.log('\n📝 Encryption Key:');
console.log(`ENCRYPTION_KEY=${encryptionKey}`);

// Generate Stripe Webhook Secret
const stripeWebhookSecret = 'whsec_' + generateRandomString(43);
console.log('\n📝 Stripe Webhook Secret:');
console.log(`STRIPE_WEBHOOK_SECRET=${stripeWebhookSecret}`);

console.log('\n✅ All secrets generated successfully!');
console.log('\n📋 Copy these values to your .env.local file:');
console.log('\n# Authentication and Security');
console.log(`NEXTAUTH_SECRET=${nextAuthSecret}`);
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`ENCRYPTION_KEY=${encryptionKey}`);
console.log(`STRIPE_WEBHOOK_SECRET=${stripeWebhookSecret}`);

console.log('\n🔒 Security Tips:');
console.log('- Keep these secrets secure and never commit them to version control');
console.log('- Use different secrets for development, staging, and production');
console.log('- Rotate secrets regularly (quarterly recommended)');
console.log('- Store production secrets securely (use Vercel environment variables)');

console.log('\n🚀 Ready to configure RE:MIND!');

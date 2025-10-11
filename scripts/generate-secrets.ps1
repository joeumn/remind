# RE:MIND Secret Generation Script for Windows
# Generates secure secrets for environment variables

Write-Host "🔐 RE:MIND Secret Generator" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

# Function to generate secure random string
function Generate-RandomString {
    param(
        [int]$Length = 32,
        [string]$Characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    )
    
    $random = [System.Random]::new()
    $result = ""
    for ($i = 0; $i -lt $Length; $i++) {
        $result += $Characters[$random.Next(0, $Characters.Length)]
    }
    return $result
}

# Function to generate Base64-like string
function Generate-Base64Secret {
    param([int]$Length = 32)
    
    # Generate random bytes
    $bytes = New-Object byte[] $Length
    (New-Object System.Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes)
    
    # Convert to Base64 and remove padding
    $base64 = [System.Convert]::ToBase64String($bytes)
    return $base64 -replace '[+/=]', { param($match) 
        $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        $chars[[System.Random]::new().Next(0, $chars.Length)]
    }
}

Write-Host "`n🔑 Generating secure secrets..." -ForegroundColor Yellow

# Generate NextAuth Secret
$nextAuthSecret = Generate-Base64Secret 32
Write-Host "`n📝 NextAuth Secret:" -ForegroundColor Green
Write-Host "NEXTAUTH_SECRET=$nextAuthSecret" -ForegroundColor White

# Generate JWT Secret
$jwtSecret = Generate-Base64Secret 32
Write-Host "`n📝 JWT Secret:" -ForegroundColor Green
Write-Host "JWT_SECRET=$jwtSecret" -ForegroundColor White

# Generate Encryption Key
$encryptionKey = Generate-Base64Secret 32
Write-Host "`n📝 Encryption Key:" -ForegroundColor Green
Write-Host "ENCRYPTION_KEY=$encryptionKey" -ForegroundColor White

# Generate Stripe Webhook Secret (starts with whsec_)
$stripeWebhookSecret = "whsec_" + (Generate-RandomString 43)
Write-Host "`n📝 Stripe Webhook Secret:" -ForegroundColor Green
Write-Host "STRIPE_WEBHOOK_SECRET=$stripeWebhookSecret" -ForegroundColor White

Write-Host "`n✅ All secrets generated successfully!" -ForegroundColor Green
Write-Host "`n📋 Copy these values to your .env.local file:" -ForegroundColor Yellow

Write-Host "`n# Authentication and Security" -ForegroundColor Cyan
Write-Host "NEXTAUTH_SECRET=$nextAuthSecret"
Write-Host "JWT_SECRET=$jwtSecret"
Write-Host "ENCRYPTION_KEY=$encryptionKey"
Write-Host "STRIPE_WEBHOOK_SECRET=$stripeWebhookSecret"

Write-Host "`n🔒 Security Tips:" -ForegroundColor Yellow
Write-Host "- Keep these secrets secure and never commit them to version control" -ForegroundColor White
Write-Host "- Use different secrets for development, staging, and production" -ForegroundColor White
Write-Host "- Rotate secrets regularly (quarterly recommended)" -ForegroundColor White
Write-Host "- Store production secrets securely (use Vercel environment variables)" -ForegroundColor White

Write-Host "`n🚀 Ready to configure RE:MIND!" -ForegroundColor Green

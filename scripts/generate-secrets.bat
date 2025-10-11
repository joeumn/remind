@echo off
REM RE:MIND Secret Generator for Windows (Batch version)
REM Generates secure secrets for environment variables

echo 🔐 RE:MIND Secret Generator
echo =========================

echo.
echo 🔑 Generating secure secrets...

REM Generate NextAuth Secret (32 characters)
powershell -Command "$bytes = New-Object byte[] 24; (New-Object System.Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes); $base64 = [System.Convert]::ToBase64String($bytes); Write-Host 'NEXTAUTH_SECRET=' $base64"

REM Generate JWT Secret (32 characters)
powershell -Command "$bytes = New-Object byte[] 24; (New-Object System.Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes); $base64 = [System.Convert]::ToBase64String($bytes); Write-Host 'JWT_SECRET=' $base64"

REM Generate Encryption Key (32 characters)
powershell -Command "$bytes = New-Object byte[] 24; (New-Object System.Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes); $base64 = [System.Convert]::ToBase64String($bytes); Write-Host 'ENCRYPTION_KEY=' $base64"

REM Generate Stripe Webhook Secret
powershell -Command "$chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; $random = [System.Random]::new(); $secret = ''; for ($i = 0; $i -lt 43; $i++) { $secret += $chars[$random.Next(0, $chars.Length)] }; Write-Host 'STRIPE_WEBHOOK_SECRET=whsec_' $secret"

echo.
echo ✅ All secrets generated successfully!
echo.
echo 📋 Copy these values to your .env.local file
echo.
echo 🔒 Security Tips:
echo - Keep these secrets secure and never commit them to version control
echo - Use different secrets for development, staging, and production
echo - Rotate secrets regularly (quarterly recommended)
echo - Store production secrets securely (use Vercel environment variables)
echo.
echo 🚀 Ready to configure RE:MIND!

pause

#!/bin/bash

# RE:MIND Deployment Script
# Run this script to deploy RE:MIND to production

set -e

echo "🚀 Starting RE:MIND deployment..."

# Check if required tools are installed
check_dependencies() {
    echo "📋 Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command -v vercel &> /dev/null; then
        echo "⚠️  Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    echo "✅ All dependencies are available"
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
}

# Run tests
run_tests() {
    echo "🧪 Running tests..."
    
    # Type checking
    echo "  🔍 Type checking..."
    npm run type-check
    
    # Linting
    echo "  🔍 Linting..."
    npm run lint
    
    # Build test
    echo "  🔍 Build test..."
    npm run build
    
    echo "✅ All tests passed"
}

# Check environment variables
check_environment() {
    echo "🔧 Checking environment variables..."
    
    if [ ! -f .env.local ]; then
        echo "⚠️  .env.local not found. Please create it from env.production.example"
        echo "   cp env.production.example .env.local"
        echo "   Then edit .env.local with your actual values"
        exit 1
    fi
    
    echo "✅ Environment file found"
}

# Deploy to Vercel
deploy_vercel() {
    echo "🚀 Deploying to Vercel..."
    
    # Login to Vercel if not already logged in
    if ! vercel whoami &> /dev/null; then
        echo "  🔐 Please login to Vercel..."
        vercel login
    fi
    
    # Deploy
    vercel --prod
    
    echo "✅ Deployed to Vercel successfully"
}

# Post-deployment checks
post_deployment_checks() {
    echo "🔍 Running post-deployment checks..."
    
    # Get deployment URL
    DEPLOYMENT_URL=$(vercel ls | grep -E '^[a-zA-Z0-9-]+\.vercel\.app' | head -1 | awk '{print $2}')
    
    if [ -z "$DEPLOYMENT_URL" ]; then
        echo "⚠️  Could not determine deployment URL"
        return
    fi
    
    echo "  🌐 Deployment URL: https://$DEPLOYMENT_URL"
    
    # Check if deployment is accessible
    echo "  🔍 Checking deployment accessibility..."
    if curl -s -o /dev/null -w "%{http_code}" "https://$DEPLOYMENT_URL" | grep -q "200"; then
        echo "  ✅ Deployment is accessible"
    else
        echo "  ⚠️  Deployment might not be accessible yet (this is normal for new deployments)"
    fi
    
    # Check PWA functionality
    echo "  🔍 Checking PWA functionality..."
    curl -s "https://$DEPLOYMENT_URL/manifest.json" | grep -q "RE:MIND" && echo "  ✅ PWA manifest accessible" || echo "  ⚠️  PWA manifest not found"
}

# Main deployment flow
main() {
    echo "🎯 RE:MIND Deployment Script"
    echo "================================"
    
    check_dependencies
    check_environment
    install_dependencies
    run_tests
    deploy_vercel
    post_deployment_checks
    
    echo ""
    echo "🎉 RE:MIND deployed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Configure custom domain in Vercel dashboard"
    echo "2. Set up monitoring and analytics"
    echo "3. Submit to app stores"
    echo "4. Launch marketing campaign"
    echo ""
    echo "🚀 Ready to revolutionize reminder apps!"
}

# Run main function
main "$@"

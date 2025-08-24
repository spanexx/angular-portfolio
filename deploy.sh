#!/bin/bash

# Portfolio Full-Stack Deployment Script
# This script helps deploy both frontend and backend

set -e  # Exit on any error

echo "🚀 Portfolio Full-Stack Deployment Helper"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "src" ]; then
    echo -e "${RED}❌ Error: Please run this script from the root of your portfolio project${NC}"
    exit 1
fi

# Function to print colored output
print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Validate environments
print_status "Step 1: Validating environment configurations..."
cd backend

if npm run validate:env:dev > /dev/null 2>&1; then
    print_success "Development environment validated"
else
    print_error "Development environment validation failed"
    echo "Please check your backend/.env file"
    exit 1
fi

if npm run validate:env:prod > /dev/null 2>&1; then
    print_success "Production environment validated"
else
    print_warning "Production environment has warnings - check MongoDB password"
fi

cd ..

# Step 2: Check MongoDB password
print_status "Step 2: Checking MongoDB configuration..."
if grep -q "\*\*\*\*\*\*\*\*" backend/.env.production; then
    print_warning "MongoDB password still contains placeholder in .env.production"
    echo "Please update the MongoDB password before deploying to production"
    read -p "Do you want to continue anyway? (y/N): " continue_choice
    if [[ $continue_choice != "y" && $continue_choice != "Y" ]]; then
        echo "Deployment cancelled. Please update MongoDB password first."
        exit 1
    fi
fi

# Step 3: Build frontend
print_status "Step 3: Building frontend for production..."
if npm run build:prod; then
    print_success "Frontend built successfully"
    
    if [ -d "dist/angular-portfolio" ]; then
        print_success "Build output found in dist/angular-portfolio/"
        
        # Create a compressed archive for easy upload
        print_status "Creating compressed archive for Hostinger upload..."
        cd dist
        tar -czf angular-portfolio-$(date +%Y%m%d_%H%M%S).tar.gz angular-portfolio/
        print_success "Archive created: dist/angular-portfolio-$(date +%Y%m%d_%H%M%S).tar.gz"
        cd ..
    fi
else
    print_error "Frontend build failed"
    exit 1
fi

# Step 4: Backend deployment option
print_status "Step 4: Backend deployment options..."
echo ""
echo "Choose your backend deployment method:"
echo "1. Deploy to Oracle Cloud (Recommended)"
echo "2. Skip backend deployment (I'll do it manually)"
echo ""
read -p "Enter your choice (1-2): " deploy_choice

case $deploy_choice in
    1)
        print_status "Deploying backend to Oracle Cloud..."
        cd backend
        
        print_warning "Make sure you have:"
        echo "- Oracle Cloud instance created and running"
        echo "- SSH access configured"
        echo "- Security rules allow ports 22, 80, 443, 8080"
        echo ""
        
        read -p "Enter your Oracle Cloud instance IP: " oracle_ip
        if [ -z "$oracle_ip" ]; then
            print_error "IP address is required for deployment"
            exit 1
        fi
        
        # Test SSH connection
        print_status "Testing SSH connection to $oracle_ip..."
        if ssh -o ConnectTimeout=5 -o BatchMode=yes ubuntu@$oracle_ip exit 2>/dev/null; then
            print_success "SSH connection successful"
        else
            print_error "Cannot connect to $oracle_ip"
            echo "Please check:"
            echo "- Instance is running"
            echo "- Security group allows SSH (port 22)"
            echo "- SSH key is properly configured"
            exit 1
        fi
        
        # Run deployment
        export ORACLE_IP=$oracle_ip
        if npm run deploy:oracle; then
            print_success "Backend deployed successfully to Oracle Cloud"
            echo ""
            print_status "Testing backend health check..."
            sleep 5
            if curl -f "http://$oracle_ip:8080/api/health" > /dev/null 2>&1; then
                print_success "Backend is responding at http://$oracle_ip:8080/api/health"
            else
                print_warning "Backend may still be starting up. Try: curl http://$oracle_ip:8080/api/health"
            fi
        else
            print_error "Backend deployment failed"
            exit 1
        fi
        
        cd ..
        ;;
    2)
        print_status "Skipping backend deployment"
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

# Step 5: Frontend deployment instructions
print_status "Step 5: Frontend deployment to Hostinger..."
echo ""
print_success "Frontend is ready for deployment!"
echo ""
echo "📋 Next steps for Hostinger deployment:"
echo "1. Log into your Hostinger control panel"
echo "2. Go to File Manager for spanexx.com"
echo "3. Upload the archive: dist/angular-portfolio-*.tar.gz"
echo "4. Extract it to your domain's public folder"
echo "5. Make sure index.html is in the root of your domain"
echo ""

if [ ! -z "$oracle_ip" ]; then
    echo "📋 Update your frontend API URL:"
    echo "Edit src/environments/environment.prod.ts and change:"
    echo "apiUrl: 'http://$oracle_ip:8080/api'"
    echo ""
    echo "Then rebuild and redeploy frontend:"
    echo "npm run build:prod"
    echo ""
fi

print_success "Deployment script completed!"
echo ""
echo "🔗 Your application will be available at:"
echo "- Frontend: https://spanexx.com"
if [ ! -z "$oracle_ip" ]; then
    echo "- Backend API: http://$oracle_ip:8080/api"
    echo "- Health Check: http://$oracle_ip:8080/api/health"
fi
echo ""
print_status "Check HOSTING_GUIDE.md for detailed instructions and troubleshooting"
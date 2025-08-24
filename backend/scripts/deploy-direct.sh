#!/bin/bash

# Direct Oracle Cloud Deployment Script (No Docker)
# This script deploys the Node.js application directly to Oracle Cloud

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="portfolio-backend"
SERVER_USER="ubuntu"
SERVER_HOST=""  # Will be prompted or set via environment
DEPLOY_PATH="/home/ubuntu/portfolio-backend"
ENVIRONMENT="${1:-production}"

echo -e "${BLUE}🚀 Direct Oracle Cloud Deployment (No Docker)${NC}"
echo -e "${BLUE}=============================================${NC}"

# Function to print colored output
print_step() {
    echo -e "${GREEN}[STEP]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Get server details
get_server_details() {
    if [ -z "$SERVER_HOST" ]; then
        echo -n "Enter your Oracle Cloud instance IP address: "
        read SERVER_HOST
    fi
    
    if [ -z "$SERVER_HOST" ]; then
        print_error "Server IP address is required!"
        exit 1
    fi
    
    echo -e "${GREEN}✓${NC} Target server: $SERVER_USER@$SERVER_HOST"
}

# Check prerequisites
check_prerequisites() {
    print_step "Checking prerequisites..."
    
    # Check if environment file exists
    if [ ! -f ".env.$ENVIRONMENT" ]; then
        print_error "Environment file .env.$ENVIRONMENT not found!"
        exit 1
    fi
    
    # Check SSH connectivity
    echo "Testing SSH connection..."
    if ! ssh -o ConnectTimeout=10 -o BatchMode=yes $SERVER_USER@$SERVER_HOST exit 2>/dev/null; then
        print_error "Cannot connect to server via SSH. Please check:"
        echo "1. Server IP address is correct"
        echo "2. SSH key is properly configured"
        echo "3. Security groups allow SSH (port 22)"
        exit 1
    fi
    
    echo -e "${GREEN}✓${NC} Prerequisites check completed"
}

# Validate environment configuration
validate_environment() {
    print_step "Validating environment configuration..."
    
    if [ -f "scripts/validate-env.js" ]; then
        node scripts/validate-env.js $ENVIRONMENT
        if [ $? -ne 0 ]; then
            print_error "Environment validation failed!"
            exit 1
        fi
    else
        print_warning "Environment validation script not found. Skipping validation."
    fi
}

# Prepare deployment package
prepare_package() {
    print_step "Preparing deployment package..."
    
    # Create temporary deployment directory
    TEMP_DIR="/tmp/portfolio-deploy-$(date +%s)"
    mkdir -p $TEMP_DIR
    
    # Copy necessary files
    cp -r . $TEMP_DIR/
    
    # Remove unnecessary files
    cd $TEMP_DIR
    rm -rf node_modules/
    rm -rf .git/
    rm -rf logs/
    rm -rf *.log
    rm -f docker-compose.yml
    rm -f Dockerfile
    rm -f .dockerignore
    
    # Create deployment archive
    cd ..
    tar -czf portfolio-backend.tar.gz -C $TEMP_DIR .
    
    echo -e "${GREEN}✓${NC} Deployment package created: portfolio-backend.tar.gz"
}

# Setup server environment
setup_server() {
    print_step "Setting up server environment..."
    
    ssh $SERVER_USER@$SERVER_HOST << EOF
        # Update system
        sudo apt update
        
        # Install Node.js 18 if not installed
        if ! command -v node &> /dev/null; then
            echo "Installing Node.js 18..."
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
        fi
        
        # Install PM2 for process management
        if ! command -v pm2 &> /dev/null; then
            echo "Installing PM2..."
            sudo npm install -g pm2
        fi
        
        # Create application directory
        mkdir -p $DEPLOY_PATH
        
        # Create logs directory
        mkdir -p $DEPLOY_PATH/logs
        
        echo "✓ Server environment setup completed"
EOF
    
    echo -e "${GREEN}✓${NC} Server environment configured"
}

# Deploy application
deploy_application() {
    print_step "Deploying application to server..."
    
    # Upload deployment package
    scp /tmp/portfolio-backend.tar.gz $SERVER_USER@$SERVER_HOST:~/
    
    # Extract and setup on server
    ssh $SERVER_USER@$SERVER_HOST << EOF
        # Backup existing deployment if it exists
        if [ -d "$DEPLOY_PATH" ]; then
            echo "Creating backup..."
            sudo mv $DEPLOY_PATH $DEPLOY_PATH.backup.\$(date +%Y%m%d_%H%M%S)
        fi
        
        # Create new deployment directory
        mkdir -p $DEPLOY_PATH
        
        # Extract new version
        tar -xzf ~/portfolio-backend.tar.gz -C $DEPLOY_PATH
        
        # Set proper permissions
        sudo chown -R $SERVER_USER:$SERVER_USER $DEPLOY_PATH
        
        # Navigate to deployment directory
        cd $DEPLOY_PATH
        
        # Install dependencies
        echo "Installing dependencies..."
        npm ci --only=production
        
        # Create PM2 ecosystem file
        cat > ecosystem.config.js << 'EOL'
module.exports = {
  apps: [{
    name: 'portfolio-backend',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: '$ENVIRONMENT',
      PORT: 8080
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOL
        
        echo "✓ Application deployed successfully"
EOF
    
    # Cleanup local temp files
    rm -f /tmp/portfolio-backend.tar.gz
    rm -rf $TEMP_DIR
    
    echo -e "${GREEN}✓${NC} Application deployment completed"
}

# Configure firewall and security
configure_security() {
    print_step "Configuring security..."
    
    ssh $SERVER_USER@$SERVER_HOST << EOF
        # Configure UFW firewall
        if command -v ufw &> /dev/null; then
            sudo ufw --force reset
            sudo ufw default deny incoming
            sudo ufw default allow outgoing
            sudo ufw allow ssh
            sudo ufw allow 8080
            sudo ufw allow 80
            sudo ufw allow 443
            sudo ufw --force enable
            echo "✓ UFW firewall configured"
        else
            echo "UFW not available, skipping firewall configuration"
        fi
        
        # Set up log rotation for PM2 logs
        sudo pm2 install pm2-logrotate
        sudo pm2 set pm2-logrotate:max_size 10M
        sudo pm2 set pm2-logrotate:retain 7
        
        echo "✓ Security configuration completed"
EOF
    
    echo -e "${GREEN}✓${NC} Security configured"
}

# Start application
start_application() {
    print_step "Starting application..."
    
    ssh $SERVER_USER@$SERVER_HOST << EOF
        cd $DEPLOY_PATH
        
        # Stop existing PM2 processes if any
        pm2 delete portfolio-backend 2>/dev/null || true
        
        # Start application with PM2
        pm2 start ecosystem.config.js
        
        # Save PM2 configuration
        pm2 save
        
        # Setup PM2 startup script
        sudo env PATH=\$PATH:/usr/bin pm2 startup systemd -u $SERVER_USER --hp /home/$SERVER_USER
        
        # Show status
        pm2 status
        
        echo "✓ Application started successfully"
EOF
    
    echo -e "${GREEN}✓${NC} Application is running"
}

# Test deployment
test_deployment() {
    print_step "Testing deployment..."
    
    # Wait a moment for application to start
    sleep 5
    
    # Test health endpoint
    if curl -f "http://$SERVER_HOST:8080/api/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Health check passed"
    else
        print_warning "Health check failed. Application might still be starting..."
    fi
    
    # Show application logs
    echo -e "${BLUE}Recent application logs:${NC}"
    ssh $SERVER_USER@$SERVER_HOST "cd $DEPLOY_PATH && pm2 logs portfolio-backend --lines 10"
}

# Main deployment flow
main() {
    echo "Deploying $PROJECT_NAME to Oracle Cloud (Direct deployment)"
    echo "Environment: $ENVIRONMENT"
    echo ""
    
    get_server_details
    check_prerequisites
    validate_environment
    prepare_package
    setup_server
    deploy_application
    configure_security
    start_application
    test_deployment
    
    echo ""
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}Application URLs:${NC}"
    echo "- API: http://$SERVER_HOST:8080"
    echo "- Health Check: http://$SERVER_HOST:8080/api/health"
    echo ""
    echo -e "${BLUE}Useful Commands:${NC}"
    echo "- View logs: ssh $SERVER_USER@$SERVER_HOST 'pm2 logs portfolio-backend'"
    echo "- Restart app: ssh $SERVER_USER@$SERVER_HOST 'pm2 restart portfolio-backend'"
    echo "- Stop app: ssh $SERVER_USER@$SERVER_HOST 'pm2 stop portfolio-backend'"
    echo "- Server status: ssh $SERVER_USER@$SERVER_HOST 'pm2 status'"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Set up a reverse proxy (nginx) for better security and SSL"
    echo "2. Configure your domain to point to $SERVER_HOST"
    echo "3. Update your frontend environment.prod.ts with the backend URL"
    echo "4. Test your frontend at https://spanexx.com"
}

# Run main function
main
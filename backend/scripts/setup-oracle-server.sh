#!/bin/bash

# Oracle Cloud Server Setup Script
# Run this script on your Oracle Cloud instance to set up the environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 Oracle Cloud Server Setup for Portfolio Backend${NC}"
echo -e "${BLUE}=================================================${NC}"

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

# Update system
update_system() {
    print_step "Updating system packages..."
    sudo apt update && sudo apt upgrade -y
    echo -e "${GREEN}✓${NC} System updated"
}

# Install Node.js
install_nodejs() {
    print_step "Installing Node.js 18..."
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        echo "Node.js is already installed: $NODE_VERSION"
        
        # Check if version is 18 or higher
        if [[ $(node --version | cut -d'v' -f2 | cut -d'.' -f1) -lt 18 ]]; then
            print_warning "Node.js version is older than 18. Updating..."
        else
            echo -e "${GREEN}✓${NC} Node.js version is sufficient"
            return
        fi
    fi
    
    # Install Node.js 18
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    # Verify installation
    echo "Node.js version: $(node --version)"
    echo "npm version: $(npm --version)"
    echo -e "${GREEN}✓${NC} Node.js installed successfully"
}

# Install PM2
install_pm2() {
    print_step "Installing PM2 process manager..."
    
    if command -v pm2 &> /dev/null; then
        echo "PM2 is already installed: $(pm2 --version)"
        echo -e "${GREEN}✓${NC} PM2 already available"
        return
    fi
    
    sudo npm install -g pm2
    
    # Install PM2 log rotation
    pm2 install pm2-logrotate
    pm2 set pm2-logrotate:max_size 10M
    pm2 set pm2-logrotate:retain 7
    
    echo -e "${GREEN}✓${NC} PM2 installed successfully"
}

# Install and configure Nginx
install_nginx() {
    print_step "Installing and configuring Nginx..."
    
    if command -v nginx &> /dev/null; then
        echo "Nginx is already installed"
    else
        sudo apt install -y nginx
    fi
    
    # Enable and start nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
    
    # Create basic configuration directory structure
    sudo mkdir -p /etc/nginx/sites-available
    sudo mkdir -p /etc/nginx/sites-enabled
    
    # Remove default site if it exists
    sudo rm -f /etc/nginx/sites-enabled/default
    
    echo -e "${GREEN}✓${NC} Nginx installed and configured"
}

# Configure firewall
configure_firewall() {
    print_step "Configuring UFW firewall..."
    
    # Reset firewall
    sudo ufw --force reset
    
    # Set default policies
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    
    # Allow necessary ports
    sudo ufw allow ssh
    sudo ufw allow 22
    sudo ufw allow 80
    sudo ufw allow 443
    sudo ufw allow 8080
    
    # Enable firewall
    sudo ufw --force enable
    
    # Show status
    sudo ufw status verbose
    
    echo -e "${GREEN}✓${NC} Firewall configured"
}

# Setup application directories
setup_directories() {
    print_step "Setting up application directories..."
    
    # Create application directory
    mkdir -p ~/portfolio-backend
    mkdir -p ~/portfolio-backend/logs
    
    # Set proper permissions
    chmod 755 ~/portfolio-backend
    
    echo -e "${GREEN}✓${NC} Application directories created"
}

# Install SSL certificate support (Certbot)
install_certbot() {
    print_step "Installing Certbot for SSL certificates..."
    
    sudo apt install -y certbot python3-certbot-nginx
    
    echo -e "${GREEN}✓${NC} Certbot installed"
    echo -e "${YELLOW}Note:${NC} To get SSL certificate, run: sudo certbot --nginx -d your-domain.com"
}

# Configure system limits
configure_limits() {
    print_step "Configuring system limits..."
    
    # Add limits for better performance
    sudo tee -a /etc/security/limits.conf > /dev/null << EOF

# Portfolio Backend Limits
* soft nofile 65536
* hard nofile 65536
* soft nproc 32768
* hard nproc 32768
EOF
    
    # Configure sysctl for better networking
    sudo tee -a /etc/sysctl.conf > /dev/null << EOF

# Portfolio Backend Network Tuning
net.core.somaxconn = 65536
net.ipv4.tcp_max_syn_backlog = 65536
net.ipv4.ip_local_port_range = 1024 65535
EOF
    
    echo -e "${GREEN}✓${NC} System limits configured"
}

# Install monitoring tools
install_monitoring() {
    print_step "Installing monitoring tools..."
    
    # Install htop for process monitoring
    sudo apt install -y htop
    
    # Install iostat for disk monitoring
    sudo apt install -y sysstat
    
    echo -e "${GREEN}✓${NC} Monitoring tools installed"
}

# Create useful aliases and scripts
create_aliases() {
    print_step "Creating useful aliases..."
    
    # Add aliases to .bashrc
    cat >> ~/.bashrc << 'EOF'

# Portfolio Backend Aliases
alias portfolio-logs='pm2 logs portfolio-backend'
alias portfolio-status='pm2 status'
alias portfolio-restart='pm2 restart portfolio-backend'
alias portfolio-stop='pm2 stop portfolio-backend'
alias portfolio-start='pm2 start portfolio-backend'
alias portfolio-health='curl -s http://localhost:8080/api/health | jq .'
alias nginx-reload='sudo systemctl reload nginx'
alias nginx-status='sudo systemctl status nginx'

# System monitoring
alias ports='sudo netstat -tulpn'
alias processes='ps aux --sort=-%cpu | head -20'
alias disk-usage='df -h'
alias memory-usage='free -h'
EOF
    
    echo -e "${GREEN}✓${NC} Useful aliases created"
    echo -e "${YELLOW}Note:${NC} Restart your shell or run 'source ~/.bashrc' to use the new aliases"
}

# Display next steps
show_next_steps() {
    echo ""
    echo -e "${BLUE}🎉 Server setup completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}Next Steps:${NC}"
    echo "1. Configure your domain DNS to point to this server's IP"
    echo "2. Deploy your application using the deployment script"
    echo "3. Set up SSL certificate: sudo certbot --nginx -d your-domain.com"
    echo "4. Configure nginx reverse proxy (sample config provided)"
    echo ""
    echo -e "${BLUE}Useful Commands:${NC}"
    echo "- Check system resources: htop"
    echo "- View port usage: ports"
    echo "- Monitor application: portfolio-status"
    echo "- Check application health: portfolio-health"
    echo "- View nginx status: nginx-status"
    echo ""
    echo -e "${BLUE}Important Files:${NC}"
    echo "- Application directory: ~/portfolio-backend"
    echo "- Nginx config: /etc/nginx/sites-available/"
    echo "- PM2 logs: ~/.pm2/logs/"
    echo "- System logs: /var/log/"
    echo ""
    echo -e "${GREEN}Your server is now ready for deployment!${NC}"
}

# Main setup process
main() {
    echo "Setting up Oracle Cloud instance for Portfolio Backend..."
    echo ""
    
    update_system
    install_nodejs
    install_pm2
    install_nginx
    configure_firewall
    setup_directories
    install_certbot
    configure_limits
    install_monitoring
    create_aliases
    
    show_next_steps
}

# Run main function
main
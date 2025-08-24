# Portfolio Backend - Oracle Cloud Deployment Guide (Direct Deployment)

## 🌟 Overview

This guide walks you through deploying your Angular portfolio backend directly to Oracle Cloud Infrastructure (OCI) with MongoDB Atlas integration using Node.js and PM2 (no Docker required).

## 📋 Prerequisites

1. **Oracle Cloud Account**: Free tier is sufficient
2. **MongoDB Atlas**: Already configured with your connection string
3. **Node.js 18+**: For running scripts locally
4. **SSH Key**: For accessing Oracle Cloud instance

## 🔧 Environment Configuration

Your environment files are already configured:

### Development (`.env`)
- MongoDB Atlas connection with placeholder password
- Frontend URL: https://spanexx.com
- Port: 3000 (local development)

### Staging (`.env.staging`)
- Testing environment configuration
- Port: 8080
- Debug features enabled

### Production (`.env.production`)
- Production-optimized settings
- Port: 8080 (Oracle Cloud standard)
- Enhanced security and performance

## 🚀 Quick Start

### 1. Update MongoDB Password

Replace the placeholder password (`********`) in your environment files:

```bash
# Update .env file
MONGODB_URI=mongodb+srv://spanexxvictor:YOUR_ACTUAL_PASSWORD@cluster0.dmxeugw.mongodb.net/Auth?retryWrites=true&w=majority&appName=Cluster0
```

Do the same for `.env.staging` and `.env.production`.

### 2. Validate Configuration

```bash
# Validate development environment
npm run validate:env:dev

# Validate production environment
npm run validate:env:prod
```

### 3. Test Locally

```bash
# Start development server
npm run dev

# Test in another terminal
npm run test:backend
```

### 4. Deploy to Oracle Cloud

```bash
# Run deployment script
npm run deploy:oracle
```

## 🏗️ Oracle Cloud Setup Steps

### Step 1: Create Compute Instance

1. **Login to Oracle Cloud Console**
2. **Navigate to**: Compute → Instances
3. **Create Instance**:
   - **Name**: portfolio-backend
   - **Image**: Ubuntu 22.04 (ARM or x86)
   - **Shape**: VM.Standard.E2.1.Micro (free tier)
   - **Network**: Create new VCN or use existing
   - **SSH Keys**: Add your public SSH key

### Step 2: Configure Security Lists

1. **Navigate to**: Networking → Virtual Cloud Networks
2. **Select your VCN** → Security Lists → Default Security List
3. **Add Ingress Rules**:
   - **Port 8080**: For backend API
   - **Port 80**: For HTTP (optional)
   - **Port 443**: For HTTPS (recommended)

### Step 3: Setup Server Environment

1. **SSH into your instance**:
```bash
ssh ubuntu@YOUR_INSTANCE_IP
```

2. **Run server setup script**:
```bash
# Download the setup script (or copy it manually)
wget https://raw.githubusercontent.com/your-repo/backend/scripts/setup-oracle-server.sh
# OR copy the script from your local scripts/setup-oracle-server.sh

# Make it executable
chmod +x setup-oracle-server.sh

# Run the setup
./setup-oracle-server.sh
```

This script will install:
- Node.js 18
- PM2 process manager
- Nginx reverse proxy
- UFW firewall
- SSL certificate support (Certbot)
- Monitoring tools

### Step 4: Deploy Application

1. **From your local machine, run the deployment script**:
```bash
npm run deploy:oracle
```

2. **The script will**:
   - Validate your environment
   - Package your application
   - Upload it to your Oracle Cloud instance
   - Install dependencies
   - Configure PM2
   - Start the application

### Step 5: Configure Nginx (Optional but Recommended)

1. **Copy nginx configuration**:
```bash
# On your server
sudo cp ~/portfolio-backend/nginx.conf /etc/nginx/sites-available/portfolio-backend
sudo ln -s /etc/nginx/sites-available/portfolio-backend /etc/nginx/sites-enabled/
```

2. **Update the configuration**:
```bash
sudo nano /etc/nginx/sites-available/portfolio-backend
# Update 'your-domain.com' with your actual domain
```

3. **Test and reload nginx**:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 Security Recommendations

### 1. Environment Variables

**Never commit sensitive data!** Your `.env.production` should contain:

```bash
# Use strong, unique secrets
JWT_SECRET=your-super-strong-production-jwt-secret-key-minimum-32-characters
ENCRYPTION_KEY=your-32-character-production-encryption-key

# Actual MongoDB password
MONGODB_URI=mongodb+srv://spanexxvictor:YOUR_ACTUAL_PASSWORD@cluster0.dmxeugw.mongodb.net/Auth?retryWrites=true&w=majority&appName=Cluster0
```

### 2. SSL/HTTPS

- **Use Oracle Load Balancer with SSL certificate**
- **Let's Encrypt** for free SSL certificates
- **Redirect HTTP to HTTPS**

### 3. Firewall

- **Only open necessary ports**: 80, 443, 8080, 22 (SSH)
- **Restrict SSH**: Use key-based authentication
- **Consider VPN**: For admin access

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Check application health
curl https://your-backend-url.com/api/health

# Check PM2 status
pm2 status

# View application logs
pm2 logs portfolio-backend

# Check nginx status
sudo systemctl status nginx
```

### Regular Maintenance

1. **Update dependencies**: Monthly security updates
2. **Monitor logs**: Check for errors and performance issues
3. **Database backups**: MongoDB Atlas handles this automatically
4. **SSL certificate renewal**: Automatic with Let's Encrypt
5. **System updates**: Regular OS patches
6. **PM2 process monitoring**: Ensure application stays running

## 🔧 Troubleshooting

### Common Issues

1. **Port 8080 not accessible**:
   - Check Oracle Cloud Security Lists
   - Verify PM2 process is running: `pm2 status`
   - Check UFW firewall: `sudo ufw status`
   - Verify nginx configuration: `sudo nginx -t`

2. **Database connection errors**:
   - Verify MongoDB Atlas IP whitelist
   - Check connection string format
   - Ensure password is correct

3. **CORS errors**:
   - Verify FRONTEND_URL in environment
   - Check if frontend domain matches exactly

4. **Application crashes**:
   - Check PM2 logs: `pm2 logs portfolio-backend`
   - Restart application: `pm2 restart portfolio-backend`
   - Check system resources: `htop`

### Debug Commands

```bash
# Check environment loading
node scripts/validate-env.js production

# Test database connection
node scripts/seedData.js

# View detailed logs
pm2 logs portfolio-backend --lines 50

# Check port usage
sudo netstat -tlpn | grep 8080

# Check nginx configuration
sudo nginx -t

# Monitor system resources
htop

# Check disk space
df -h

# Restart application
pm2 restart portfolio-backend

# Check PM2 status
pm2 status

# Monitor real-time logs
pm2 logs portfolio-backend --raw
```

## 📱 Frontend Integration

After successful backend deployment:

1. **Update environment.prod.ts**:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-oracle-backend.com/api',
  baseUrl: 'https://your-oracle-backend.com'
};
```

2. **Rebuild and deploy frontend**
3. **Test end-to-end functionality**

## 📞 Support

If you encounter issues:

1. **Check logs**: `pm2 logs portfolio-backend`
2. **Validate environment**: `node scripts/validate-env.js production`
3. **Test health endpoint**: `curl YOUR_BACKEND_URL/api/health`
4. **Review Oracle Cloud documentation**
5. **Check PM2 status**: `pm2 status`

## 🎉 Success Checklist

- [ ] MongoDB Atlas connection working
- [ ] Environment variables properly set
- [ ] PM2 process running
- [ ] Health endpoint responding
- [ ] CORS configured for frontend
- [ ] Oracle Cloud security lists configured
- [ ] Nginx reverse proxy configured (optional)
- [ ] SSL certificate installed (recommended)
- [ ] Frontend updated with backend URL
- [ ] End-to-end testing completed

---

Your portfolio backend is now ready for production on Oracle Cloud! 🚀
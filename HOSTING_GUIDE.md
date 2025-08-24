# Full-Stack Portfolio Hosting Guide

## 🎯 Overview

This guide covers deploying your Angular portfolio (frontend) + Node.js API (backend) with the following hosting strategy:

**Backend**: Oracle Cloud (Free Tier)
**Frontend**: Hostinger (spanexx.com) - Updated with new build
**Database**: MongoDB Atlas (Already configured)

## 📋 Prerequisites

Before starting, ensure you have:

1. ✅ **MongoDB Atlas Password**: Replace `********` in backend environment files
2. ✅ **Oracle Cloud Account**: Free tier is sufficient
3. ✅ **Hostinger Access**: Your existing hosting account
4. ✅ **Domain Access**: spanexx.com management
5. ✅ **SSH Key**: For Oracle Cloud access

## 🚀 Deployment Steps

### Step 1: Update MongoDB Password

**CRITICAL**: Update the placeholder password in your backend environment files:

```bash
# Edit these files:
# backend/.env
# backend/.env.production  
# backend/.env.staging

# Change this line:
MONGODB_URI=mongodb+srv://spanexxvictor:********@cluster0.dmxeugw.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0

# To (with your actual password):
MONGODB_URI=mongodb+srv://spanexxvictor:YOUR_ACTUAL_PASSWORD@cluster0.dmxeugw.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0
```

### Step 2: Deploy Backend to Oracle Cloud

1. **Create Oracle Cloud Instance**:
   - Navigate to Compute → Instances
   - Create Instance:
     - Name: `portfolio-backend`
     - Image: Ubuntu 22.04
     - Shape: VM.Standard.E2.1.Micro (Free Tier)
     - Add your SSH public key
     ssh -i "C:\Users\shuga\OneDrive\Desktop\PRO\Advanced\ssh-key-2025-07-17.key" ubuntu@141.253.105.251


2. **Configure Security Lists**:
   - Add Ingress Rules for ports: 22, 80, 443, 8080

3. **Deploy Backend**:
   ```bash
   # From your local machine (this directory)
   cd backend
   npm run deploy:oracle
   ```
   
   This will:
   - Package your application
   - Upload to Oracle Cloud
   - Install Node.js and dependencies
   - Configure PM2 process manager
   - Start your API

4. **Test Backend**:
   ```bash
   # Replace YOUR_IP with your Oracle Cloud instance IP
   curl http://YOUR_IP:8080/api/health
   ```

### Step 3: Configure Domain for API

Choose **ONE** of these options:

#### Option A: Subdomain (Recommended)
1. Add DNS A record: `api.spanexx.com` → Your Oracle Cloud IP
2. Update frontend environment:
   ```typescript
   apiUrl: 'https://api.spanexx.com/api'
   ```

#### Option B: Direct IP (Quick Start)
1. Update frontend environment:
   ```typescript
   apiUrl: 'http://YOUR_ORACLE_IP:8080/api'
   ```

#### Option C: Path-based (Advanced)
1. Configure reverse proxy on Hostinger
2. Route `spanexx.com/api/*` to Oracle Cloud

### Step 4: Build and Deploy Frontend

1. **Update Frontend API URL**:
   ```bash
   # Edit src/environments/environment.prod.ts
   # Replace the placeholder apiUrl with your chosen option above
   ```

2. **Build for Production**:
   ```bash
   npm run build:prod
   ```

3. **Deploy to Hostinger**:
   - Compress the `dist/angular-portfolio` folder
   - Upload to your Hostinger file manager
   - Extract to your domain's public folder
   - Update any existing files

### Step 5: SSL Configuration (Optional but Recommended)

#### For Subdomain (Option A):
```bash
# On Oracle Cloud instance
sudo certbot --nginx -d api.spanexx.com
```

#### For Direct IP (Option B):
- Use Hostinger's SSL for main domain
- API will be HTTP (consider upgrading to subdomain)

## 🔧 Configuration Files Summary

### Backend Environment Variables
```bash
# .env.production
NODE_ENV=production
PORT=8080
MONGODB_URI=mongodb+srv://spanexxvictor:YOUR_PASSWORD@cluster0.dmxeugw.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0
FRONTEND_URL=https://spanexx.com
JWT_SECRET=your-super-strong-jwt-secret-minimum-32-characters
ENCRYPTION_KEY=your-32-character-encryption-key-here
```

### Frontend Environment Variables
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.spanexx.com/api', // or your chosen option
  githubApiUrl: 'https://api.github.com',
  baseUrl: 'https://spanexx.com',
  enableDebugMode: false,
  logLevel: 'error'
};
```

## 📊 Monitoring and Maintenance

### Health Checks
- Backend: `https://api.spanexx.com/api/health`
- Frontend: `https://spanexx.com`

### Logs and Management
```bash
# SSH to Oracle Cloud
ssh ubuntu@YOUR_ORACLE_IP

# Check API status
pm2 status

# View logs
pm2 logs portfolio-backend

# Restart if needed
pm2 restart portfolio-backend
```

### Updates
```bash
# To update backend
npm run deploy:oracle

# To update frontend
npm run build:prod
# Then upload new dist files to Hostinger
```

## 🎯 Quick Commands Reference

```bash
# Validate environments
npm run validate:env:dev
npm run validate:env:prod

# Test backend locally
cd backend && npm run dev

# Build frontend
npm run build:prod

# Deploy to Oracle Cloud
cd backend && npm run deploy:oracle
```

## 🚨 Important Notes

1. **Database**: Points to `portfolio` database, not `Auth`
2. **CORS**: Backend allows requests from spanexx.com
3. **Security**: Use strong JWT secrets in production
4. **SSL**: Recommended for production (especially for API)
5. **Backup**: Consider regular MongoDB Atlas backups

## 📞 Support

- Oracle Cloud deployment scripts are in `backend/scripts/`
- All validation tools are built-in: `npm run validate:*`
- Health check endpoint: `/api/health`
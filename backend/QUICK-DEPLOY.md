# Quick Deployment Guide - No Docker

## 🚀 Super Quick Oracle Cloud Deployment

### Step 1: Prepare Your Environment
```bash
# Update the password in your environment files
# Replace ******** with your actual MongoDB password in:
# - .env
# - .env.production  
# - .env.staging
```

### Step 2: Create Oracle Cloud Instance
1. **Create a VM** in Oracle Cloud (Ubuntu 22.04)
2. **Add Security Rules** for ports: 22, 80, 443, 8080
3. **Note your instance IP address**

### Step 3: Setup Server (One-time)
```bash
# SSH into your instance
ssh ubuntu@YOUR_INSTANCE_IP

# Download and run setup script
curl -O https://raw.githubusercontent.com/your-repo/scripts/setup-oracle-server.sh
chmod +x setup-oracle-server.sh
./setup-oracle-server.sh
```

### Step 4: Deploy Your Application
```bash
# From your local machine
npm run deploy:oracle
# Follow the prompts to enter your server IP
```

### Step 5: Configure Domain (Optional)
```bash
# On your server, edit nginx config
sudo nano /etc/nginx/sites-available/portfolio-backend
# Replace 'your-domain.com' with your actual domain
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

## ✅ That's it!

Your API will be available at:
- **Direct**: `http://YOUR_INSTANCE_IP:8080/api/health`
- **With domain**: `https://your-domain.com/api/health`

## 🔧 Useful Commands

```bash
# Check application status
ssh ubuntu@YOUR_INSTANCE_IP pm2 status

# View logs
ssh ubuntu@YOUR_INSTANCE_IP pm2 logs portfolio-backend

# Restart application
ssh ubuntu@YOUR_INSTANCE_IP pm2 restart portfolio-backend

# Update application (re-run deployment)
npm run deploy:oracle
```

## 📱 Update Frontend

Update your frontend's `environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-domain.com/api',  // or http://YOUR_IP:8080/api
  baseUrl: 'https://your-domain.com'      // or http://YOUR_IP:8080
};
```

---

**Total deployment time: ~15 minutes** ⏱️
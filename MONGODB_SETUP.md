# IMPORTANT: MongoDB Password Setup

## 🔑 Before You Deploy

You need to update the MongoDB password in your environment files. The current files contain placeholder passwords (`********`) that need to be replaced with your actual MongoDB Atlas password.

### Files to Update:

1. `backend/.env` (for development)
2. `backend/.env.production` (for production)
3. `backend/.env.staging` (for staging)

### How to Update:

1. **Find your MongoDB Atlas password**:
   - Log into MongoDB Atlas
   - Go to Database Access
   - Find user `spanexxvictor`
   - Copy the password or create a new one

2. **Update the files**:
   ```bash
   # Replace this line in all three environment files:
   MONGODB_URI=mongodb+srv://spanexxvictor:********@cluster0.dmxeugw.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0
   
   # With this (using your actual password):
   MONGODB_URI=mongodb+srv://spanexxvictor:YOUR_ACTUAL_PASSWORD@cluster0.dmxeugw.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0
   ```

3. **Validate the configuration**:
   ```bash
   cd backend
   npm run validate:env:dev
   npm run validate:env:prod
   ```

### Security Notes:

- **Never commit real passwords to Git**
- The `.env` files are already in `.gitignore`
- Use strong, unique passwords for production
- Consider using MongoDB Atlas IP whitelist for additional security

### Quick Commands:

```bash
# Test development environment
cd backend
npm run dev

# Test production validation
npm run validate:env:prod

# Deploy when ready
cd ..
./deploy.sh
```
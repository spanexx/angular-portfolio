const path = require('path');
const fs = require('fs');

/**
 * Dynamic Environment Configuration Loader
 * Loads the appropriate environment file based on NODE_ENV
 * Supports development, staging, and production environments
 */
class EnvironmentLoader {
  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.loadEnvironment();
  }

  /**
   * Load environment variables based on current NODE_ENV
   */
  loadEnvironment() {
    // Priority order for loading environment files:
    // 1. .env.{NODE_ENV}.local (highest priority)
    // 2. .env.{NODE_ENV}
    // 3. .env.local
    // 4. .env (lowest priority)
    
    const envFiles = [
      `.env.${this.environment}.local`,
      `.env.${this.environment}`,
      '.env.local',
      '.env'
    ];

    // Load each file if it exists (later files override earlier ones)
    envFiles.forEach(file => {
      const filePath = path.resolve(__dirname, '..', file);
      console.log(`🔍 Checking for environment file: ${filePath}`);
      if (fs.existsSync(filePath)) {
        console.log(`📁 Loading environment from: ${file}`);
        require('dotenv').config({ path: filePath, override: false });
      } else {
        console.log(`❌ File not found: ${file}`);
      }
    });

    // Validate required environment variables
    this.validateRequiredVars();
    
    // Log environment info (without sensitive data)
    this.logEnvironmentInfo();
  }

  /**
   * Validate that all required environment variables are present
   */
  validateRequiredVars() {
    const required = [
      'MONGODB_URI',
      'FRONTEND_URL',
      'PORT'
    ];

    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:', missing);
      console.error('Please check your environment configuration files.');
      process.exit(1);
    }
  }

  /**
   * Log environment information (excluding sensitive data)
   */
  logEnvironmentInfo() {
    const safeEnvVars = {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      FRONTEND_URL: process.env.FRONTEND_URL,
      LOG_LEVEL: process.env.LOG_LEVEL,
      RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS,
      // MongoDB URI with password masked
      MONGODB_URI: this.maskSensitiveData(process.env.MONGODB_URI, 'mongodb'),
    };

    console.log('🔧 Environment Configuration:');
    console.table(safeEnvVars);
  }

  /**
   * Mask sensitive data in environment variables for logging
   */
  maskSensitiveData(value, type) {
    if (!value) return 'Not set';
    
    switch (type) {
      case 'mongodb':
        // Hide password in MongoDB URI
        return value.replace(/:([^@/:]+)@/, ':****@');
      default:
        return value.substring(0, 4) + '****';
    }
  }

  /**
   * Get configuration object with all environment variables
   */
  getConfig() {
    return {
      // Server Configuration
      server: {
        port: parseInt(process.env.PORT) || 3000,
        nodeEnv: process.env.NODE_ENV || 'development',
        logLevel: process.env.LOG_LEVEL || 'info'
      },

      // Database Configuration
      database: {
        uri: process.env.MONGODB_URI,
        poolMin: parseInt(process.env.DB_POOL_MIN) || 5,
        poolMax: parseInt(process.env.DB_POOL_MAX) || 20,
        poolIdleTimeout: parseInt(process.env.DB_POOL_IDLE_TIMEOUT) || 30000
      },

      // Security Configuration
      security: {
        jwtSecret: process.env.JWT_SECRET,
        encryptionKey: process.env.ENCRYPTION_KEY,
        corsOrigin: process.env.FRONTEND_URL
      },

      // Rate Limiting Configuration
      rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
      },

      // Health Check Configuration
      healthCheck: {
        timeout: parseInt(process.env.HEALTH_CHECK_TIMEOUT) || 10000
      },

      // Feature Flags
      features: {
        enableSwagger: process.env.ENABLE_SWAGGER === 'true',
        enableDebugRoutes: process.env.ENABLE_DEBUG_ROUTES === 'true'
      },

      // Cloud Configuration (Oracle Cloud)
      cloud: {
        region: process.env.OCI_REGION,
        compartmentId: process.env.OCI_COMPARTMENT_ID
      }
    };
  }

  /**
   * Check if running in production environment
   */
  isProduction() {
    return this.environment === 'production';
  }

  /**
   * Check if running in development environment
   */
  isDevelopment() {
    return this.environment === 'development';
  }

  /**
   * Check if running in staging environment
   */
  isStaging() {
    return this.environment === 'staging';
  }
}

// Create and export singleton instance
const environmentLoader = new EnvironmentLoader();
const config = environmentLoader.getConfig();

module.exports = {
  EnvironmentLoader,
  config,
  isProduction: environmentLoader.isProduction(),
  isDevelopment: environmentLoader.isDevelopment(),
  isStaging: environmentLoader.isStaging()
};
#!/usr/bin/env node

/**
 * Environment Validation Script
 * Validates that all required environment variables are properly configured
 * for the target deployment environment
 */

const fs = require('fs');
const path = require('path');

// Load environment configuration
const { config, isProduction, isDevelopment, isStaging } = require('./config/environment');

class EnvironmentValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.environment = process.env.NODE_ENV || 'development';
  }

  /**
   * Run all validation checks
   */
  async validate() {
    console.log(`🔍 Validating ${this.environment} environment configuration...\n`);

    this.validateRequiredVariables();
    this.validateDatabaseConnection();
    this.validateSecuritySettings();
    this.validateNetworkConfiguration();
    await this.validateExternalServices();
    this.validateFilePermissions();

    this.displayResults();
    return this.errors.length === 0;
  }

  /**
   * Validate required environment variables
   */
  validateRequiredVariables() {
    const required = {
      'NODE_ENV': process.env.NODE_ENV,
      'PORT': process.env.PORT,
      'MONGODB_URI': process.env.MONGODB_URI,
      'FRONTEND_URL': process.env.FRONTEND_URL
    };

    const productionRequired = {
      'JWT_SECRET': process.env.JWT_SECRET,
      'ENCRYPTION_KEY': process.env.ENCRYPTION_KEY
    };

    // Check basic required variables
    Object.entries(required).forEach(([key, value]) => {
      if (!value) {
        this.errors.push(`Missing required environment variable: ${key}`);
      }
    });

    // Check production-specific variables
    if (isProduction) {
      Object.entries(productionRequired).forEach(([key, value]) => {
        if (!value) {
          this.errors.push(`Missing required production environment variable: ${key}`);
        } else if (value.includes('your-') || value.length < 32) {
          this.errors.push(`${key} appears to be using default/weak value in production`);
        }
      });
    } else if (isDevelopment) {
      Object.entries(productionRequired).forEach(([key, value]) => {
        if (!value) {
          this.warnings.push(`${key} not set (OK for development)`);
        }
      });
    }
  }

  /**
   * Validate database connection string
   */
  validateDatabaseConnection() {
    const mongoUri = process.env.MONGODB_URI;
    
    if (mongoUri) {
      // Check if it's MongoDB Atlas
      if (mongoUri.includes('mongodb+srv://')) {
        if (!mongoUri.includes('retryWrites=true')) {
          this.warnings.push('MongoDB URI should include retryWrites=true for better reliability');
        }
        if (!mongoUri.includes('w=majority')) {
          this.warnings.push('MongoDB URI should include w=majority for write concern');
        }
      }

      // Check for password in URI
      if (mongoUri.includes(':password@') || mongoUri.includes(':@')) {
        this.errors.push('MongoDB URI contains invalid/missing password');
      }

      // Validate database name
      const dbMatch = mongoUri.match(/\/([^?]+)/);
      if (dbMatch) {
        const dbName = dbMatch[1];
        if (isProduction && (dbName.includes('test') || dbName.includes('dev'))) {
          this.warnings.push(`Database name '${dbName}' might not be appropriate for production`);
        }
      }
    }
  }

  /**
   * Validate security settings
   */
  validateSecuritySettings() {
    const jwtSecret = process.env.JWT_SECRET;
    const encryptionKey = process.env.ENCRYPTION_KEY;

    if (jwtSecret && jwtSecret.length < 32) {
      this.warnings.push('JWT_SECRET should be at least 32 characters long');
    }

    if (encryptionKey && encryptionKey.length !== 32) {
      this.warnings.push('ENCRYPTION_KEY should be exactly 32 characters long');
    }

    // Rate limiting validation
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;
    if (isProduction && maxRequests > 1000) {
      this.warnings.push('Rate limit seems high for production (consider lowering RATE_LIMIT_MAX_REQUESTS)');
    }
  }

  /**
   * Validate network configuration
   */
  validateNetworkConfiguration() {
    const frontendUrl = process.env.FRONTEND_URL;
    const port = parseInt(process.env.PORT) || 3000;

    if (frontendUrl) {
      if (!frontendUrl.startsWith('http://') && !frontendUrl.startsWith('https://')) {
        this.errors.push('FRONTEND_URL must start with http:// or https://');
      }

      if (isProduction && frontendUrl.startsWith('http://')) {
        this.warnings.push('FRONTEND_URL should use HTTPS in production');
      }

      if (frontendUrl.includes('localhost') && isProduction) {
        this.errors.push('FRONTEND_URL cannot be localhost in production');
      }
    }

    // Port validation
    if (port < 1024 && process.getuid && process.getuid() !== 0) {
      this.warnings.push('Using privileged port (<1024) may require root privileges');
    }

    if (isProduction && port === 3000) {
      this.warnings.push('Consider using port 8080 for production (Oracle Cloud standard)');
    }
  }

  /**
   * Validate external services connectivity
   */
  async validateExternalServices() {
    // Test MongoDB connection
    try {
      const mongoose = require('mongoose');
      await mongoose.connect(config.database.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
      });
      console.log('✅ MongoDB connection test passed');
      await mongoose.disconnect();
    } catch (error) {
      this.errors.push(`MongoDB connection failed: ${error.message}`);
    }
  }

  /**
   * Validate file permissions and structure
   */
  validateFilePermissions() {
    const criticalFiles = [
      'server.js',
      'package.json',
      'config/environment.js'
    ];

    criticalFiles.forEach(file => {
      const filePath = path.join(__dirname, file);
      if (!fs.existsSync(filePath)) {
        this.errors.push(`Critical file missing: ${file}`);
      } else {
        try {
          fs.accessSync(filePath, fs.constants.R_OK);
        } catch (error) {
          this.errors.push(`Cannot read critical file: ${file}`);
        }
      }
    });

    // Check for .env files in production
    if (isProduction) {
      const envFiles = ['.env', '.env.local', '.env.production.local'];
      envFiles.forEach(file => {
        if (fs.existsSync(path.join(__dirname, file))) {
          this.warnings.push(`${file} file present in production - ensure secrets are managed securely`);
        }
      });
    }
  }

  /**
   * Display validation results
   */
  displayResults() {
    console.log('\n📋 Validation Results:');
    console.log('='.repeat(50));

    if (this.errors.length === 0) {
      console.log('✅ All critical checks passed!');
    } else {
      console.log(`❌ Found ${this.errors.length} critical error(s):`);
      this.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log(`\n⚠️  Found ${this.warnings.length} warning(s):`);
      this.warnings.forEach((warning, index) => {
        console.log(`   ${index + 1}. ${warning}`);
      });
    }

    console.log('\n📊 Environment Summary:');
    console.log(`   Environment: ${this.environment}`);
    console.log(`   Port: ${config.server.port}`);
    console.log(`   Frontend URL: ${config.security.corsOrigin}`);
    console.log(`   Database: ${config.database.uri.split('/').pop().split('?')[0]}`);
    
    if (config.cloud.region) {
      console.log(`   Cloud Region: ${config.cloud.region}`);
    }

    console.log('\n' + '='.repeat(50));
  }
}

// Run validation if script is called directly
if (require.main === module) {
  const validator = new EnvironmentValidator();
  validator.validate()
    .then(isValid => {
      if (!isValid) {
        console.log('\n❌ Validation failed! Please fix the errors above before deploying.');
        process.exit(1);
      } else {
        console.log('\n🎉 Environment validation passed! Ready for deployment.');
        process.exit(0);
      }
    })
    .catch(error => {
      console.error('\n💥 Validation script failed:', error.message);
      process.exit(1);
    });
}

module.exports = EnvironmentValidator;
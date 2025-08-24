#!/usr/bin/env node

/**
 * Environment Validation Script
 * Validates environment configuration before deployment
 * Usage: node scripts/validate-env.js [environment]
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

class EnvironmentValidator {
  constructor(environment = 'development') {
    this.environment = environment;
    this.errors = [];
    this.warnings = [];
    this.results = [];
  }

  /**
   * Main validation function
   */
  async validate() {
    console.log(`${colors.cyan}🔍 Validating ${this.environment} environment configuration...${colors.reset}\n`);
    
    // Load environment
    this.loadEnvironment();
    
    // Run validation checks
    this.validateRequiredVariables();
    this.validateDatabaseConnection();
    this.validateSecuritySettings();
    this.validateCloudConfiguration();
    this.validatePortConfiguration();
    
    // Display results
    this.displayResults();
    
    // Exit with appropriate code
    process.exit(this.errors.length > 0 ? 1 : 0);
  }

  /**
   * Load environment variables
   */
  loadEnvironment() {
    // For development environment, try .env first, then .env.development
    let envFile;
    let envPath;
    
    if (this.environment === 'development') {
      // Try .env first for development
      envFile = '.env';
      envPath = path.resolve(__dirname, '..', envFile);
      
      if (!fs.existsSync(envPath)) {
        // Fallback to .env.development
        envFile = '.env.development';
        envPath = path.resolve(__dirname, '..', envFile);
      }
    } else {
      envFile = `.env.${this.environment}`;
      envPath = path.resolve(__dirname, '..', envFile);
    }
    
    if (!fs.existsSync(envPath)) {
      this.addError(`Environment file not found: ${envFile}`);
      return;
    }

    // Load environment file
    require('dotenv').config({ path: envPath });
    this.addResult('✓', `Loaded environment from ${envFile}`, 'green');
  }

  /**
   * Validate required environment variables
   */
  validateRequiredVariables() {
    const required = [
      'NODE_ENV',
      'PORT',
      'MONGODB_URI',
      'FRONTEND_URL',
      'JWT_SECRET',
      'ENCRYPTION_KEY'
    ];

    required.forEach(variable => {
      if (!process.env[variable]) {
        this.addError(`Missing required variable: ${variable}`);
      } else {
        this.addResult('✓', `${variable} is set`, 'green');
      }
    });
  }

  /**
   * Validate database connection string
   */
  validateDatabaseConnection() {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      this.addError('MONGODB_URI is not set');
      return;
    }

    // Basic MongoDB URI validation
    if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      this.addError('MONGODB_URI does not appear to be a valid MongoDB connection string');
      return;
    }

    // Check for password placeholder
    if (mongoUri.includes('********')) {
      this.addWarning('MONGODB_URI contains placeholder password (********). Update with actual password before deployment.');
    }

    // Check for Auth database
    if (!mongoUri.includes('/Auth')) {
      this.addWarning('MONGODB_URI should point to "Auth" database');
    }

    this.addResult('✓', 'MongoDB URI format appears valid', 'green');
  }

  /**
   * Validate security settings
   */
  validateSecuritySettings() {
    const jwtSecret = process.env.JWT_SECRET;
    const encryptionKey = process.env.ENCRYPTION_KEY;

    // JWT Secret validation
    if (jwtSecret && jwtSecret.length < 32) {
      this.addWarning('JWT_SECRET should be at least 32 characters long for security');
    }

    // Encryption key validation
    if (encryptionKey && encryptionKey.length !== 32) {
      this.addWarning('ENCRYPTION_KEY should be exactly 32 characters long');
    }

    // Check for default values in production
    if (this.environment === 'production') {
      if (jwtSecret && jwtSecret.includes('development')) {
        this.addError('Production environment is using development JWT secret');
      }
      if (encryptionKey && encryptionKey.includes('development')) {
        this.addError('Production environment is using development encryption key');
      }
    }

    this.addResult('✓', 'Security settings validated', 'green');
  }

  /**
   * Validate Oracle Cloud configuration
   */
  validateCloudConfiguration() {
    if (this.environment === 'production' || this.environment === 'staging') {
      const region = process.env.OCI_REGION;
      const compartmentId = process.env.OCI_COMPARTMENT_ID;

      if (!region) {
        this.addWarning('OCI_REGION not set for cloud deployment');
      }

      if (!compartmentId || compartmentId === 'your-compartment-id') {
        this.addWarning('OCI_COMPARTMENT_ID not properly configured');
      }

      if (region && compartmentId && compartmentId !== 'your-compartment-id') {
        this.addResult('✓', 'Oracle Cloud configuration appears valid', 'green');
      }
    }
  }

  /**
   * Validate port configuration
   */
  validatePortConfiguration() {
    const port = parseInt(process.env.PORT);
    
    if (isNaN(port)) {
      this.addError('PORT is not a valid number');
      return;
    }

    if (port < 1 || port > 65535) {
      this.addError('PORT must be between 1 and 65535');
      return;
    }

    // Check for appropriate ports based on environment
    if (this.environment === 'production' && port !== 8080) {
      this.addWarning('Production environment typically uses port 8080');
    }

    this.addResult('✓', `Port ${port} is valid`, 'green');
  }

  /**
   * Add error message
   */
  addError(message) {
    this.errors.push(message);
  }

  /**
   * Add warning message
   */
  addWarning(message) {
    this.warnings.push(message);
  }

  /**
   * Add result message
   */
  addResult(icon, message, color = 'reset') {
    this.results.push({ icon, message, color });
  }

  /**
   * Display validation results
   */
  displayResults() {
    console.log('\n📋 Validation Results:\n');

    // Display all results
    this.results.forEach(result => {
      console.log(`${colors[result.color]}${result.icon} ${result.message}${colors.reset}`);
    });

    // Display warnings
    if (this.warnings.length > 0) {
      console.log(`\n${colors.yellow}⚠️  Warnings:${colors.reset}`);
      this.warnings.forEach(warning => {
        console.log(`${colors.yellow}  • ${warning}${colors.reset}`);
      });
    }

    // Display errors
    if (this.errors.length > 0) {
      console.log(`\n${colors.red}❌ Errors:${colors.reset}`);
      this.errors.forEach(error => {
        console.log(`${colors.red}  • ${error}${colors.reset}`);
      });
    }

    // Summary
    console.log('\n📊 Summary:');
    console.log(`${colors.green}✓ Checks passed: ${this.results.length}${colors.reset}`);
    console.log(`${colors.yellow}⚠ Warnings: ${this.warnings.length}${colors.reset}`);
    console.log(`${colors.red}❌ Errors: ${this.errors.length}${colors.reset}`);

    if (this.errors.length === 0) {
      console.log(`\n${colors.green}🎉 Environment validation passed! Ready for deployment.${colors.reset}`);
    } else {
      console.log(`\n${colors.red}💥 Environment validation failed! Please fix the errors above.${colors.reset}`);
    }
  }
}

// Run validation
const environment = process.argv[2] || 'development';
const validator = new EnvironmentValidator(environment);
validator.validate().catch(console.error);
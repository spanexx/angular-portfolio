#!/usr/bin/env node

/**
 * Local Testing Script
 * Tests the backend setup and database connectivity
 */

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = (color, message) => console.log(`${colors[color]}${message}${colors.reset}`);

class BackendTester {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  async runTests() {
    log('cyan', '🧪 Portfolio Backend Test Suite');
    log('cyan', '===============================\n');

    await this.testHealthEndpoint();
    await this.testApiEndpoints();
    await this.testCorsConfiguration();
    
    this.displayResults();
  }

  async testHealthEndpoint() {
    log('blue', '🏥 Testing health endpoint...');
    
    try {
      const response = await this.makeRequest('/api/health');
      
      if (response.status === 'OK') {
        this.addTest('Health endpoint', true, 'Returns OK status');
        
        if (response.database && response.database.status === 'connected') {
          this.addTest('Database connection', true, 'MongoDB is connected');
        } else {
          this.addTest('Database connection', false, 'MongoDB connection failed');
        }
        
        if (response.environment) {
          this.addTest('Environment detection', true, `Running in ${response.environment} mode`);
        }
        
      } else {
        this.addTest('Health endpoint', false, 'Health check failed');
      }
    } catch (error) {
      this.addTest('Health endpoint', false, `Request failed: ${error.message}`);
    }
  }

  async testApiEndpoints() {
    log('blue', '\n📡 Testing API endpoints...');
    
    const endpoints = [
      '/api/profile',
      '/api/projects',
      '/api/experiences',
      '/api/educations',
      '/api/certifications'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await this.makeRequest(endpoint);
        
        if (response && (Array.isArray(response) || typeof response === 'object')) {
          this.addTest(`${endpoint}`, true, 'Returns valid data');
        } else {
          this.addTest(`${endpoint}`, false, 'Invalid response format');
        }
      } catch (error) {
        this.addTest(`${endpoint}`, false, `Request failed: ${error.message}`);
      }
    }
  }

  async testCorsConfiguration() {
    log('blue', '\n🌐 Testing CORS configuration...');
    
    try {
      // Test preflight request
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'OPTIONS',
        headers: {
          'Origin': 'https://spanexx.com',
          'Access-Control-Request-Method': 'GET'
        }
      });

      if (response.ok) {
        const corsHeaders = response.headers.get('access-control-allow-origin');
        if (corsHeaders === 'https://spanexx.com' || corsHeaders === '*') {
          this.addTest('CORS configuration', true, 'Frontend origin is allowed');
        } else {
          this.addTest('CORS configuration', false, 'Frontend origin might not be allowed');
        }
      } else {
        this.addTest('CORS configuration', false, 'CORS preflight failed');
      }
    } catch (error) {
      this.addTest('CORS configuration', false, `CORS test failed: ${error.message}`);
    }
  }

  async makeRequest(endpoint) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  }

  addTest(name, passed, message) {
    this.tests.push({ name, passed, message });
    if (passed) {
      this.passed++;
      log('green', `  ✓ ${name}: ${message}`);
    } else {
      this.failed++;
      log('red', `  ✗ ${name}: ${message}`);
    }
  }

  displayResults() {
    log('cyan', '\n📊 Test Results Summary');
    log('cyan', '=====================');
    log('green', `✓ Passed: ${this.passed}`);
    log('red', `✗ Failed: ${this.failed}`);
    log('blue', `📋 Total: ${this.tests.length}`);

    if (this.failed === 0) {
      log('green', '\n🎉 All tests passed! Your backend is ready.');
    } else {
      log('yellow', '\n⚠️  Some tests failed. Check the backend server and configuration.');
    }

    // Provide helpful next steps
    log('cyan', '\n💡 Next Steps:');
    console.log('1. Make sure your backend server is running (npm start)');
    console.log('2. Verify your environment configuration');
    console.log('3. Check MongoDB Atlas connection');
    console.log('4. Test with your frontend at https://spanexx.com');
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  log('red', '❌ This script requires Node.js 18+ for fetch support');
  log('yellow', 'Alternative: Install node-fetch package or upgrade Node.js');
  process.exit(1);
}

// Run tests
const tester = new BackendTester();
tester.runTests().catch(error => {
  log('red', `Test suite failed: ${error.message}`);
  process.exit(1);
});
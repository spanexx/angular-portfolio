#!/usr/bin/env node

/**
 * Docker Health Check Script
 * Used by Docker HEALTHCHECK instruction to monitor container health
 */

const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 8080,
  path: '/api/health',
  method: 'GET',
  timeout: 5000
};

const healthCheck = http.request(options, (res) => {
  if (res.statusCode === 200) {
    console.log('Health check passed');
    process.exit(0);
  } else {
    console.log(`Health check failed with status: ${res.statusCode}`);
    process.exit(1);
  }
});

healthCheck.on('error', (err) => {
  console.log(`Health check failed with error: ${err.message}`);
  process.exit(1);
});

healthCheck.on('timeout', () => {
  console.log('Health check timed out');
  healthCheck.destroy();
  process.exit(1);
});

healthCheck.end();
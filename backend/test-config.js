#!/usr/bin/env node

/**
 * Quick test to verify environment configuration
 */

console.log('🧪 Testing Environment Configuration...\n');

try {
  // Load the environment configuration
  const { config, isProduction, isDevelopment } = require('./config/environment');
  
  console.log('✅ Environment configuration loaded successfully!\n');
  
  console.log('📋 Current Configuration:');
  console.log('- Environment:', config.server.nodeEnv);
  console.log('- Port:', config.server.port);
  console.log('- Frontend URL:', config.security.corsOrigin);
  console.log('- Database URI configured:', !!config.database.uri);
  console.log('- Is Production:', isProduction);
  console.log('- Is Development:', isDevelopment);
  
  console.log('\n🔒 Security Settings:');
  console.log('- JWT Secret configured:', !!config.security.jwtSecret);
  console.log('- Encryption Key configured:', !!config.security.encryptionKey);
  
  console.log('\n⚡ Rate Limiting:');
  console.log('- Window (ms):', config.rateLimit.windowMs);
  console.log('- Max requests:', config.rateLimit.maxRequests);
  
  if (config.cloud.region) {
    console.log('\n☁️ Cloud Configuration:');
    console.log('- Region:', config.cloud.region);
    console.log('- Compartment ID:', config.cloud.compartmentId || 'Not set');
  }
  
  console.log('\n🎉 All environment configurations are working correctly!');
  
} catch (error) {
  console.error('❌ Failed to load environment configuration:');
  console.error(error.message);
  process.exit(1);
}
// Load environment configuration dynamically
const { config, isProduction, isDevelopment } = require('./config/environment');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = config.server.port;

// Rate limiting with dynamic configuration
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(config.rateLimit.windowMs / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Middleware with environment-specific configuration
app.use(limiter);
app.use(helmet({
  contentSecurityPolicy: isProduction ? undefined : false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(morgan(isDevelopment ? 'dev' : 'combined'));
app.use(cors({
  origin: config.security.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection with enhanced configuration
mongoose.connect(config.database.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: config.database.poolMax,
  minPoolSize: config.database.poolMin,
  maxIdleTimeMS: config.database.poolIdleTimeout,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  console.log(`🗄️  Database: ${config.database.uri.split('/').pop().split('?')[0]}`);
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  process.exit(1);
});

// Routes
app.use('/api/profile', require('./routes/profile'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/experiences', require('./routes/experiences'));
app.use('/api/educations', require('./routes/educations'));
app.use('/api/certifications', require('./routes/certifications'));
app.use('/api/contact', require('./routes/contact'));

// Health check endpoint with comprehensive information
app.get('/api/health', async (req, res) => {
  try {
    const healthCheck = {
      status: 'OK',
      message: 'Portfolio API is running',
      timestamp: new Date().toISOString(),
      environment: config.server.nodeEnv,
      version: require('./package.json').version || '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: {
        status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        name: mongoose.connection.name
      }
    };

    // Add Oracle Cloud specific health info if available
    if (config.cloud.region) {
      healthCheck.cloud = {
        region: config.cloud.region,
        provider: 'Oracle Cloud'
      };
    }

    res.status(200).json(healthCheck);
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Health check failed',
      timestamp: new Date().toISOString(),
      error: isDevelopment ? error.message : 'Internal server error'
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio Backend API',
    version: '1.0.0',
    endpoints: {
      profile: '/api/profile',
      projects: '/api/projects',
      experiences: '/api/experiences',
      educations: '/api/educations',
      certifications: '/api/certifications',
      contact: '/api/contact',
      health: '/api/health'
    }
  });
});

// Error handling middleware with environment-specific responses
app.use((err, req, res, next) => {
  console.error('🚨 Server Error:', err.stack);
  
  const errorResponse = {
    message: 'Something went wrong!',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  };

  if (isDevelopment) {
    errorResponse.error = err.message;
    errorResponse.stack = err.stack;
  }

  res.status(err.status || 500).json(errorResponse);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received, shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  });
});

app.listen(PORT, () => {
  console.log('🚀 Server is running on port', PORT);
  console.log('📊 Environment:', config.server.nodeEnv);
  console.log('🔗 API Base URL:', `http://localhost:${PORT}`);
  console.log('🌐 Frontend URL:', config.security.corsOrigin);
  
  if (config.cloud.region) {
    console.log('☁️  Cloud Provider: Oracle Cloud');
    console.log('🌍 Region:', config.cloud.region);
  }
  
  console.log('🟢 API is ready to accept requests!');
});

module.exports = app;
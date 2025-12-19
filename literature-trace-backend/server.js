const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const cors = require('cors');
const dotenv = require('dotenv');
const winston = require('winston');

// Load environment variables
dotenv.config();

// Create logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/papers', require('./routes/papers'));
app.use('/api/sync', require('./routes/sync'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Literature Trace Backend is running' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  logger.info('Connected to MongoDB');
})
.catch((error) => {
  logger.error('Failed to connect to MongoDB:', error);
  process.exit(1);
});

// Connect to Redis (optional, if not available, continue without caching)
let redisClient;
try {
  redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  });

  redisClient.on('connect', () => {
    logger.info('Connected to Redis');
  });

  redisClient.on('error', (error) => {
    logger.warn('Failed to connect to Redis, continuing without caching:', error);
  });
} catch (error) {
  logger.warn('Redis connection failed, continuing without caching:', error);
}

// Export redisClient for use in other modules
module.exports.redisClient = redisClient;

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

module.exports = app;
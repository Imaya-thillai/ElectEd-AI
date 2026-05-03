/**
 * Winston Logger Configuration
 * 
 * Provides structured logging with different levels for development
 * and production environments. Logs are formatted as JSON in production
 * for easy parsing by cloud logging services like Google Cloud Logging.
 * 
 * @module utils/logger
 */

'use strict';

const winston = require('winston');

const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

/**
 * Custom log format combining timestamp, level, message, and metadata.
 */
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  process.env.NODE_ENV === 'production'
    ? winston.format.json()
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
          return `${timestamp} [${level}]: ${message} ${metaStr}`;
        })
      )
);

/**
 * Logger instance configured for the application.
 * Uses console transport for compatibility with Cloud Run logging.
 * 
 * @type {winston.Logger}
 */
const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  defaultMeta: { service: 'elected-ai' },
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      handleRejections: true
    })
  ],
  exitOnError: false
});

module.exports = { logger };

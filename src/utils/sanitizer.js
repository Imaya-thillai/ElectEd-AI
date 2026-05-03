/**
 * Input Sanitizer Utility
 * 
 * Provides functions to sanitize and validate user input to prevent
 * XSS attacks, injection attacks, and other security vulnerabilities.
 * 
 * @module utils/sanitizer
 */

'use strict';

/**
 * Maximum allowed length for user chat messages.
 * @constant {number}
 */
const MAX_MESSAGE_LENGTH = 2000;

/**
 * Sanitizes a string by removing potentially dangerous HTML/script content.
 * 
 * @param {string} input - The raw user input string
 * @returns {string} Sanitized string safe for processing
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';

  return input
    .replace(/[<>]/g, '')           // Remove angle brackets
    .replace(/javascript:/gi, '')    // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '')     // Remove inline event handlers
    .replace(/data:/gi, '')          // Remove data: protocol
    .replace(/vbscript:/gi, '')      // Remove vbscript: protocol
    .trim();
}

/**
 * Validates that a chat message meets requirements.
 * 
 * @param {string} message - The message to validate
 * @returns {{ valid: boolean, error?: string }} Validation result
 */
function validateMessage(message) {
  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Message is required and must be a string.' };
  }

  const trimmed = message.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Message cannot be empty.' };
  }

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters.`
    };
  }

  return { valid: true };
}

/**
 * Escapes HTML entities in a string for safe rendering.
 * 
 * @param {string} str - String to escape
 * @returns {string} HTML-escaped string
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';

  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };

  return str.replace(/[&<>"'/]/g, (char) => htmlEntities[char]);
}

module.exports = {
  sanitizeInput,
  validateMessage,
  escapeHtml,
  MAX_MESSAGE_LENGTH
};

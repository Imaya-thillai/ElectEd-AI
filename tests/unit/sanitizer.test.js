/**
 * Unit Tests — Sanitizer Utility
 * @module tests/unit/sanitizer.test
 */

'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { sanitizeInput, validateMessage, escapeHtml, MAX_MESSAGE_LENGTH } = require('../../src/utils/sanitizer');

describe('sanitizeInput', () => {
  it('should remove angle brackets', () => {
    assert.equal(sanitizeInput('<script>alert("xss")</script>'), 'scriptalert("xss")/script');
  });

  it('should remove javascript: protocol', () => {
    assert.equal(sanitizeInput('javascript:alert(1)'), 'alert(1)');
  });

  it('should remove inline event handlers', () => {
    assert.equal(sanitizeInput('onerror=alert(1)'), 'alert(1)');
  });

  it('should trim whitespace', () => {
    assert.equal(sanitizeInput('  hello  '), 'hello');
  });

  it('should return empty string for non-string input', () => {
    assert.equal(sanitizeInput(null), '');
    assert.equal(sanitizeInput(undefined), '');
    assert.equal(sanitizeInput(123), '');
  });

  it('should preserve normal text', () => {
    assert.equal(sanitizeInput('How do I register to vote?'), 'How do I register to vote?');
  });
});

describe('validateMessage', () => {
  it('should reject empty messages', () => {
    const result = validateMessage('');
    assert.equal(result.valid, false);
    assert.ok(result.error);
  });

  it('should reject null input', () => {
    const result = validateMessage(null);
    assert.equal(result.valid, false);
  });

  it('should reject messages exceeding max length', () => {
    const longMsg = 'a'.repeat(MAX_MESSAGE_LENGTH + 1);
    const result = validateMessage(longMsg);
    assert.equal(result.valid, false);
  });

  it('should accept valid messages', () => {
    const result = validateMessage('What is the election process?');
    assert.equal(result.valid, true);
  });

  it('should reject whitespace-only messages', () => {
    const result = validateMessage('   ');
    assert.equal(result.valid, false);
  });
});

describe('escapeHtml', () => {
  it('should escape HTML entities', () => {
    assert.equal(escapeHtml('<div>'), '&lt;div&gt;');
    assert.equal(escapeHtml('"quotes"'), '&quot;quotes&quot;');
    assert.equal(escapeHtml("it's"), "it&#x27;s");
  });

  it('should return empty string for non-string', () => {
    assert.equal(escapeHtml(null), '');
    assert.equal(escapeHtml(42), '');
  });

  it('should preserve safe text', () => {
    assert.equal(escapeHtml('Hello World'), 'Hello World');
  });
});

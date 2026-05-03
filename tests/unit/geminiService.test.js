/**
 * Unit Tests — Gemini Service
 * @module tests/unit/geminiService.test
 */

'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { getFallbackResponse, getStatus } = require('../../src/services/geminiService');

describe('getFallbackResponse', () => {
  it('should return registration info for register queries', () => {
    const response = getFallbackResponse('How do I register to vote?');
    assert.ok(response.includes('Registration'));
  });

  it('should return voting info for vote queries', () => {
    const response = getFallbackResponse('How do I vote?');
    assert.ok(response.includes('Vote'));
  });

  it('should return timeline info for timeline queries', () => {
    const response = getFallbackResponse('What is the election timeline?');
    assert.ok(response.includes('Timeline'));
  });

  it('should return security info for security queries', () => {
    const response = getFallbackResponse('Is my vote secure?');
    assert.ok(response.includes('Security') || response.includes('security') || response.includes('secure'));
  });

  it('should return welcome message for generic queries', () => {
    const response = getFallbackResponse('hello');
    assert.ok(response.includes('ElectEd AI'));
  });

  it('should handle ballot-related queries', () => {
    const response = getFallbackResponse('What is a ballot?');
    assert.ok(response.includes('Vote') || response.includes('Ballot'));
  });
});

describe('getStatus', () => {
  it('should return status object with required fields', () => {
    const status = getStatus();
    assert.ok('initialized' in status);
    assert.ok('activeSessions' in status);
    assert.equal(typeof status.initialized, 'boolean');
    assert.equal(typeof status.activeSessions, 'number');
  });
});

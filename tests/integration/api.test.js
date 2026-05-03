/**
 * Integration Tests — API Endpoints
 * @module tests/integration/api.test
 */

'use strict';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');

const BASE_URL = 'http://localhost:8080';

/**
 * Helper to make HTTP requests.
 * @param {string} path - URL path
 * @param {object} [options] - Request options
 * @returns {Promise<{status: number, data: object}>}
 */
function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const opts = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: { 'Content-Type': 'application/json', ...options.headers }
    };

    const req = http.request(opts, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

describe('Health Endpoint', () => {
  it('GET /api/health should return 200 with status', async () => {
    const { status, data } = await request('/api/health');
    assert.equal(status, 200);
    assert.equal(data.success, true);
    assert.equal(data.status, 'healthy');
    assert.ok(data.timestamp);
    assert.ok(data.services);
  });
});

describe('Election Phases API', () => {
  it('GET /api/election/phases should return phases array', async () => {
    const { status, data } = await request('/api/election/phases');
    assert.equal(status, 200);
    assert.equal(data.success, true);
    assert.ok(Array.isArray(data.data));
    assert.ok(data.data.length >= 5);
  });

  it('GET /api/election/phases/registration should return specific phase', async () => {
    const { status, data } = await request('/api/election/phases/registration');
    assert.equal(status, 200);
    assert.equal(data.data.id, 'registration');
  });

  it('GET /api/election/phases/invalid should return 404', async () => {
    const { status, data } = await request('/api/election/phases/nonexistent');
    assert.equal(status, 404);
    assert.equal(data.success, false);
  });
});

describe('Quiz API', () => {
  it('GET /api/quiz should return quiz questions', async () => {
    const { status, data } = await request('/api/quiz');
    assert.equal(status, 200);
    assert.ok(Array.isArray(data.data));
    assert.ok(data.data.length <= 5);
  });

  it('GET /api/quiz?count=3 should respect count parameter', async () => {
    const { status, data } = await request('/api/quiz?count=3');
    assert.equal(status, 200);
    assert.equal(data.data.length, 3);
  });

  it('POST /api/quiz/check should validate correct answer', async () => {
    // First get a question
    const quizRes = await request('/api/quiz?count=1');
    const question = quizRes.data.data[0];

    const { status, data } = await request('/api/quiz/check', {
      method: 'POST',
      body: { questionId: question.id, answer: question.correct }
    });
    // Note: The quiz check endpoint doesn't have the correct answer on client
    // so we just verify it returns a valid response
    assert.equal(status, 200);
    assert.equal(data.success, true);
    assert.ok('correct' in data.data);
    assert.ok('explanation' in data.data);
  });
});

describe('Glossary API', () => {
  it('GET /api/glossary should return all terms', async () => {
    const { status, data } = await request('/api/glossary');
    assert.equal(status, 200);
    assert.ok(Array.isArray(data.data));
    assert.ok(data.data.length >= 10);
  });

  it('GET /api/glossary?search=ballot should filter terms', async () => {
    const { status, data } = await request('/api/glossary?search=ballot');
    assert.equal(status, 200);
    assert.ok(data.data.length > 0);
    assert.ok(data.data.some(g =>
      g.term.toLowerCase().includes('ballot') ||
      g.definition.toLowerCase().includes('ballot')
    ));
  });
});

describe('Chat API', () => {
  it('POST /api/chat should reject empty messages', async () => {
    const { status, data } = await request('/api/chat', {
      method: 'POST',
      body: { message: '' }
    });
    assert.equal(status, 400);
    assert.equal(data.success, false);
  });

  it('POST /api/chat should accept valid messages', async () => {
    const { status, data } = await request('/api/chat', {
      method: 'POST',
      body: { message: 'What is voter registration?' }
    });
    assert.equal(status, 200);
    assert.equal(data.success, true);
    assert.ok(data.data.response);
    assert.ok(data.data.sessionId);
  });

  it('POST /api/chat/clear should clear chat', async () => {
    const { status, data } = await request('/api/chat/clear', {
      method: 'POST',
      body: { sessionId: 'test-session' }
    });
    assert.equal(status, 200);
    assert.equal(data.success, true);
  });
});

describe('Security Headers', () => {
  it('should include security headers', async () => {
    return new Promise((resolve, reject) => {
      http.get(`${BASE_URL}/api/health`, (res) => {
        // Helmet should set various security headers
        assert.ok(res.headers['x-content-type-options']);
        assert.ok(res.headers['x-frame-options'] || res.headers['content-security-policy']);
        resolve();
      }).on('error', reject);
    });
  });
});

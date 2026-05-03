/**
 * API Routes
 * 
 * Defines all REST API endpoints for the ElectEd AI application.
 * Includes health checks, chat, election data, and quiz endpoints.
 * 
 * @module routes/api
 */

'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../utils/logger');
const { sanitizeInput, validateMessage } = require('../utils/sanitizer');
const geminiService = require('../services/geminiService');
const { electionPhases, quizQuestions, glossary } = require('../data/electionData');

const router = express.Router();

/**
 * GET /api/health
 * Health check endpoint for Cloud Run and monitoring.
 */
router.get('/health', (req, res) => {
  const aiStatus = geminiService.getStatus();
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      server: 'running',
      geminiAI: aiStatus.initialized ? 'connected' : 'not configured',
      activeSessions: aiStatus.activeSessions
    }
  });
});

/**
 * POST /api/chat
 * Send a message to the AI assistant and receive a response.
 * 
 * @body {string} message - The user's message
 * @body {string} [sessionId] - Optional session ID for conversation continuity
 */
router.post('/chat', async (req, res, next) => {
  try {
    const { message, sessionId } = req.body;

    // Validate message
    const validation = validateMessage(message);
    if (!validation.valid) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    // Sanitize input
    const cleanMessage = sanitizeInput(message);
    const session = sessionId || uuidv4();

    // Get AI response
    const result = await geminiService.chat(cleanMessage, session);

    res.status(200).json({
      success: true,
      data: {
        response: result.response,
        source: result.source,
        sessionId: session,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Chat endpoint error:', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/chat/clear
 * Clear conversation history for a session.
 */
router.post('/chat/clear', (req, res) => {
  const { sessionId } = req.body;
  if (sessionId) {
    geminiService.clearChat(sessionId);
  }
  res.status(200).json({ success: true, message: 'Chat history cleared.' });
});

/**
 * GET /api/election/phases
 * Get all election process phases with steps and tips.
 */
router.get('/election/phases', (req, res) => {
  res.status(200).json({
    success: true,
    data: electionPhases
  });
});

/**
 * GET /api/election/phases/:id
 * Get a specific election phase by ID.
 */
router.get('/election/phases/:id', (req, res) => {
  const phase = electionPhases.find(p => p.id === req.params.id);
  if (!phase) {
    return res.status(404).json({ success: false, error: 'Phase not found.' });
  }
  res.status(200).json({ success: true, data: phase });
});

/**
 * GET /api/quiz
 * Get quiz questions for interactive learning.
 * @query {number} [count=5] - Number of questions to return
 */
router.get('/quiz', (req, res) => {
  const count = Math.min(parseInt(req.query.count, 10) || 5, quizQuestions.length);
  // Shuffle and select questions
  const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);
  res.status(200).json({ success: true, data: selected, total: quizQuestions.length });
});

/**
 * POST /api/quiz/check
 * Check a quiz answer.
 */
router.post('/quiz/check', (req, res) => {
  const { questionId, answer } = req.body;
  const question = quizQuestions.find(q => q.id === questionId);
  if (!question) {
    return res.status(404).json({ success: false, error: 'Question not found.' });
  }
  const isCorrect = question.correct === answer;
  res.status(200).json({
    success: true,
    data: {
      correct: isCorrect,
      correctAnswer: question.correct,
      explanation: question.explanation
    }
  });
});

/**
 * GET /api/glossary
 * Get election terminology glossary.
 */
router.get('/glossary', (req, res) => {
  const { search } = req.query;
  let results = glossary;
  if (search) {
    const term = search.toLowerCase();
    results = glossary.filter(g =>
      g.term.toLowerCase().includes(term) ||
      g.definition.toLowerCase().includes(term)
    );
  }
  res.status(200).json({ success: true, data: results });
});

module.exports = router;

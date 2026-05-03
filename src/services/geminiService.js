/**
 * Google Gemini AI Service
 * 
 * Provides AI-powered election education using Google's Gemini API.
 * Handles chat with context-aware responses about election processes.
 * 
 * @module services/geminiService
 */

'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { logger } = require('../utils/logger');

const SYSTEM_PROMPT = `You are ElectEd AI, an expert Election Process Education Assistant. Help users understand elections, voting procedures, timelines, and democratic participation clearly and engagingly.

KNOWLEDGE AREAS: Voter Registration, Types of Elections, Voting Methods, Election Timelines, Voting Process, Electoral Systems, Election Security, Civic Rights, Election Results, Global Elections.

GUIDELINES:
- Be factual, non-partisan, educational
- Use clear, accessible language
- Use markdown formatting with headings, bullets, numbered steps
- Keep responses 200-400 words
- Redirect political opinion questions to factual process info
- Encourage democratic participation without partisan bias`;

/** Manages conversation history per session */
class ConversationManager {
  constructor(maxHistory = 20, sessionTTL = 3600000) {
    this.sessions = new Map();
    this.maxHistory = maxHistory;
    this.sessionTTL = sessionTTL;
    this.cleanupInterval = setInterval(() => this.cleanup(), 600000);
  }

  getHistory(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) { session.lastAccess = Date.now(); return session.messages; }
    return [];
  }

  addMessage(sessionId, userMessage, assistantMessage) {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, { messages: [], lastAccess: Date.now() });
    }
    const session = this.sessions.get(sessionId);
    session.lastAccess = Date.now();
    session.messages.push(
      { role: 'user', parts: [{ text: userMessage }] },
      { role: 'model', parts: [{ text: assistantMessage }] }
    );
    if (session.messages.length > this.maxHistory * 2) {
      session.messages = session.messages.slice(-this.maxHistory * 2);
    }
  }

  clearHistory(sessionId) { this.sessions.delete(sessionId); }

  cleanup() {
    const now = Date.now();
    let cleaned = 0;
    for (const [id, session] of this.sessions) {
      if (now - session.lastAccess > this.sessionTTL) { this.sessions.delete(id); cleaned++; }
    }
    if (cleaned > 0) logger.info(`Cleaned ${cleaned} expired sessions`);
  }

  getActiveSessionCount() { return this.sessions.size; }
  destroy() { if (this.cleanupInterval) clearInterval(this.cleanupInterval); }
}

let genAI = null;
let model = null;
const conversationManager = new ConversationManager();

/** Initialize the Gemini AI client (lazy) */
function initializeAI() {
  if (model) return { genAI, model };
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    logger.warn('Gemini API key not configured.');
    return { genAI: null, model: null };
  }
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { temperature: 0.7, topP: 0.9, topK: 40, maxOutputTokens: 2048 },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
      ]
    });
    logger.info('Gemini AI initialized successfully');
    return { genAI, model };
  } catch (error) {
    logger.error('Failed to initialize Gemini:', { error: error.message });
    return { genAI: null, model: null };
  }
}

/** Fallback responses when AI is unavailable */
function getFallbackResponse(message) {
  const lower = message.toLowerCase();
  if (lower.includes('register')) return '## 📋 Voter Registration\n\n1. **Check Eligibility**: Citizenship, age, residency\n2. **Choose Method**: Online, by mail, or in person\n3. **Gather Documents**: ID, SSN, proof of address\n4. **Submit Before Deadline**: Typically 15-30 days before election\n5. **Verify**: Check status through local election office\n\n> 💡 Some jurisdictions allow same-day registration!';
  if (lower.includes('security') || lower.includes('secure') || lower.includes('safe') || lower.includes('fraud')) return '## 🔒 Election Security\n\n- **Paper Trails**: Verifiable paper records\n- **Audits**: Post-election verification\n- **Poll Watchers**: Multi-party observation\n- **Encryption**: Strong digital security\n- **Chain of Custody**: Strict ballot handling\n- **Bipartisan Teams**: Multi-party operations';
  if (lower.includes('vote') || lower.includes('ballot')) return '## 🗳️ How to Vote\n\n1. **Verify Registration** and find your polling place\n2. **Choose Your Method**: In-person, early voting, or mail-in\n3. **Bring Required ID**\n4. **Cast Your Ballot** carefully\n5. **Get Your Receipt**\n\n> 🔒 Your vote is secret and protected by law.';
  if (lower.includes('timeline') || lower.includes('date') || lower.includes('when')) return '## 📅 Election Timeline\n\n| Phase | When |\n|-------|------|\n| Candidate Filing | 6-12 months before |\n| Primaries | 3-6 months before |\n| Registration Deadline | 15-30 days before |\n| Early Voting | 7-45 days before |\n| Election Day | Set date |\n| Results Certification | Days to weeks after |';
  if (lower.includes('type') || lower.includes('different') || lower.includes('kinds')) return '## 🏛️ Types of Elections\n\n- **General Elections**: Final election to choose officeholders.\n- **Primary Elections**: Parties choose their candidates.\n- **Local Elections**: For city councils, mayors, and school boards.\n- **Special Elections**: Held to fill sudden vacancies.\n- **Midterm Elections**: Congressional elections held halfway through a president\'s term.';
  if (lower.includes('rank') || lower.includes('ranked-choice') || lower.includes('rcv')) return '## 🔢 Ranked-Choice Voting (RCV)\n\nRanked-choice voting allows voters to rank candidates in order of preference (1st, 2nd, 3rd, etc.).\n\n**How it works:**\nIf a candidate wins a majority of first-preference votes, they win. If no one gets a majority, the candidate with the fewest votes is eliminated. Those voters\' second choices are then distributed to the remaining candidates. This process continues until a candidate reaches a majority (>50%).';
  return '## 🏛️ Welcome to ElectEd AI!\n\nI can help you learn about:\n\n- 📋 **Voter Registration**\n- 🗳️ **Voting Methods**\n- 📅 **Election Timelines**\n- 🔒 **Election Security**\n- 🏛️ **Electoral Systems**\n- ♿ **Accessibility**\n\nAsk me anything about elections!';
}

/** Send message to Gemini AI with conversation context */
async function chat(message, sessionId) {
  const { model: aiModel } = initializeAI();
  if (!aiModel) return { response: getFallbackResponse(message), source: 'fallback' };

  try {
    const history = conversationManager.getHistory(sessionId);
    const chatSession = aiModel.startChat({
      history: [
        { role: 'user', parts: [{ text: 'Initialize as ElectEd AI.' }] },
        { role: 'model', parts: [{ text: 'I am ElectEd AI, your Election Process Education Assistant. How can I help you today?' }] },
        ...history
      ],
      systemInstruction: SYSTEM_PROMPT
    });

    const result = await chatSession.sendMessage(message);
    const responseText = result.response.text();
    conversationManager.addMessage(sessionId, message, responseText);
    logger.info('Gemini response generated', { sessionId, len: responseText.length });
    return { response: responseText, source: 'gemini' };
  } catch (error) {
    logger.error('Gemini error:', { error: error.message, sessionId });
    return {
      response: getFallbackResponse(message) + '\n\n> 💡 *Note: Using educational knowledge base while AI is processing.*',
      source: 'fallback'
    };
  }
}

function clearChat(sessionId) {
  conversationManager.clearHistory(sessionId);
  logger.info('Chat cleared', { sessionId });
}

function getStatus() {
  return { initialized: model !== null, activeSessions: conversationManager.getActiveSessionCount() };
}

module.exports = { chat, clearChat, getStatus, initializeAI, SYSTEM_PROMPT, getFallbackResponse };

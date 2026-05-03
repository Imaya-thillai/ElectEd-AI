/**
 * ElectEd AI — Frontend Application
 * 
 * Main client-side application handling navigation, chat, quiz,
 * glossary, and all interactive features.
 * 
 * @author ElectEd AI Team
 */

'use strict';

// =============================================================================
// State Management
// =============================================================================

const AppState = {
  currentSection: 'home',
  sessionId: generateSessionId(),
  isLoading: false,
  quiz: {
    questions: [],
    currentIndex: 0,
    score: 0,
    answered: false
  }
};

/** Generate a unique session ID */
function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

// =============================================================================
// Initialization
// =============================================================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

/** Bootstrap the entire application */
function initializeApp() {
  initNavigation();
  initMobileDrawer();
  initScrollEffects();
  initChat();
  loadElectionPhases();
  loadGlossary();
  hideLoadingScreen();
}

/** Dismiss the loading screen after assets are ready */
function hideLoadingScreen() {
  const loader = document.getElementById('loading-screen');
  const app = document.getElementById('app');
  setTimeout(() => {
    if (loader) loader.classList.add('hidden');
    if (app) app.style.opacity = '1';
  }, 1200);
}

// =============================================================================
// Navigation
// =============================================================================

/** Wire up all navigation buttons */
function initNavigation() {
  // Desktop nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navigateTo(link.dataset.section);
    });
  });

  // Mobile drawer links
  document.querySelectorAll('.mobile-drawer-link').forEach(link => {
    link.addEventListener('click', () => {
      navigateTo(link.dataset.section);
      closeMobileDrawer();
    });
  });

  // Brand click → home
  const brand = document.getElementById('nav-brand');
  if (brand) brand.addEventListener('click', () => navigateTo('home'));
}

/**
 * Navigate to a specific section with 3D transition.
 * @param {string} section - Target section name
 */
function navigateTo(section) {
  if (section === AppState.currentSection) return;

  const currentEl = document.getElementById(`section-${AppState.currentSection}`);
  const targetEl = document.getElementById(`section-${section}`);
  if (!currentEl || !targetEl) return;

  // Update nav active states
  document.querySelectorAll('.nav-link, .mobile-drawer-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === section);
    if (link.dataset.section === section) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  // Transition out
  currentEl.classList.remove('active');
  currentEl.classList.add('exiting');

  setTimeout(() => {
    currentEl.classList.remove('exiting');
    currentEl.hidden = true;

    // Transition in
    targetEl.hidden = false;
    targetEl.classList.add('active');

    AppState.currentSection = section;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 300);
}

// =============================================================================
// Mobile Drawer
// =============================================================================

function initMobileDrawer() {
  const btn = document.getElementById('mobile-menu-btn');
  const overlay = document.getElementById('drawer-overlay');
  const close = document.getElementById('drawer-close');

  if (btn) btn.addEventListener('click', openMobileDrawer);
  if (overlay) overlay.addEventListener('click', closeMobileDrawer);
  if (close) close.addEventListener('click', closeMobileDrawer);
}

function openMobileDrawer() {
  const drawer = document.getElementById('mobile-drawer');
  if (drawer) {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileDrawer() {
  const drawer = document.getElementById('mobile-drawer');
  if (drawer) {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

// =============================================================================
// Scroll Effects
// =============================================================================

function initScrollEffects() {
  const navbar = document.getElementById('navbar');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (navbar) {
          navbar.classList.toggle('scrolled', window.scrollY > 10);
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

// =============================================================================
// Election Phases (Learn Section)
// =============================================================================

/** Fetch and render election phase data */
async function loadElectionPhases() {
  const container = document.getElementById('phases-container');
  try {
    const response = await fetch('/api/election/phases');
    const data = await response.json();
    if (data.success) {
      renderPhases(data.data);
    } else {
      if (container) container.innerHTML = '<p class="error-message">Unable to load election phases. Please try again later.</p>';
    }
  } catch (error) {
    console.error('Failed to load election phases:', error);
    if (container) container.innerHTML = '<p class="error-message">Connection error. Could not load election data.</p>';
  }
}

/**
 * Render all phase cards and timeline dots.
 * @param {Array} phases - Array of election phase objects
 */
function renderPhases(phases) {
  const container = document.getElementById('phases-container');
  const dotsContainer = document.getElementById('timeline-dots');
  if (!container || !dotsContainer) return;

  // Timeline dots
  dotsContainer.innerHTML = phases.map((_, i) =>
    `<div class="timeline-dot ${i === 0 ? 'active' : ''}" data-index="${i}" 
          onclick="scrollToPhase(${i})" tabindex="0" role="button" 
          aria-label="Go to phase ${i + 1}"></div>`
  ).join('');

  // Phase cards
  container.innerHTML = phases.map((phase, i) => `
    <div class="phase-card" id="phase-${phase.id}" 
         onclick="togglePhase('${phase.id}')" tabindex="0" role="button"
         aria-expanded="false" aria-label="${phase.title}">
      <div class="phase-card-header">
        <div class="phase-card-number" style="background: ${phase.color};">${i + 1}</div>
        <div class="phase-card-info">
          <div class="phase-card-title">${phase.title}</div>
          <div class="phase-card-duration">${phase.duration}</div>
        </div>
        <span class="phase-card-icon">${phase.icon}</span>
        <span class="material-icons-outlined phase-card-toggle">expand_more</span>
      </div>
      <div class="phase-card-body">
        <div class="phase-card-content">
          <p class="phase-card-summary">${phase.summary}</p>
          <div class="phase-steps">
            ${phase.steps.map((step, si) => `
              <div class="phase-step">
                <div class="phase-step-num">${si + 1}</div>
                <div>
                  <div class="phase-step-title">${step.title}</div>
                  <div class="phase-step-desc">${step.description}</div>
                </div>
              </div>
            `).join('')}
          </div>
          ${phase.tips ? `
            <div class="phase-tips">
              <div class="phase-tips-title">
                <span class="material-icons-outlined" style="font-size:16px;">tips_and_updates</span>
                Pro Tips
              </div>
              ${phase.tips.map(tip => `<div class="phase-tip">${tip}</div>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');
  
  // Expand first phase by default
  if (phases.length > 0) {
    const firstCard = document.getElementById(`phase-${phases[0].id}`);
    if (firstCard) firstCard.classList.add('expanded');
    updateTimelineProgress(0, phases.length);
  }
}

/**
 * Update the timeline progress bar and dots.
 * @param {number} index - Active phase index
 * @param {number} total - Total number of phases
 */
function updateTimelineProgress(index, total) {
  const progressBar = document.getElementById('timeline-progress-bar');
  const dots = document.querySelectorAll('.timeline-dot');
  
  if (progressBar) {
    const pct = (index / (total - 1)) * 100;
    progressBar.style.width = `${pct}%`;
  }
  
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
    dot.classList.toggle('completed', i < index);
  });
}

/**
 * Toggle a phase card open/closed.
 * @param {string} phaseId - The phase identifier
 */
function togglePhase(phaseId, forceOpen = false) {
  const card = document.getElementById(`phase-${phaseId}`);
  if (!card) return;
  
  const isExpanded = forceOpen ? card.classList.add('expanded') : card.classList.toggle('expanded');
  card.setAttribute('aria-expanded', card.classList.contains('expanded'));

  // If we just opened this card, maybe close others? (Optional: accordion behavior)
  if (card.classList.contains('expanded')) {
    document.querySelectorAll('.phase-card').forEach(c => {
      if (c !== card) {
        c.classList.remove('expanded');
        c.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Update timeline based on the currently expanded card
  const allCards = Array.from(document.querySelectorAll('.phase-card'));
  const activeIndex = allCards.findIndex(c => c.classList.contains('expanded'));
  if (activeIndex !== -1) {
    updateTimelineProgress(activeIndex, allCards.length);
  }
}

/**
 * Scroll to a specific phase card.
 * @param {number} index - Phase index
 */
function scrollToPhase(index) {
  const cards = document.querySelectorAll('.phase-card');
  if (cards[index]) {
    const phaseId = cards[index].id.replace('phase-', '');
    togglePhase(phaseId, true); // Force open
    cards[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// =============================================================================
// AI Chat
// =============================================================================

function initChat() {
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const clearBtn = document.getElementById('clear-chat-btn');

  if (input) {
    input.addEventListener('input', () => {
      sendBtn.disabled = !input.value.trim();
      autoResizeTextarea(input);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  if (sendBtn) sendBtn.addEventListener('click', sendMessage);
  if (clearBtn) clearBtn.addEventListener('click', clearChat);
}

/** Auto-resize the chat textarea */
function autoResizeTextarea(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

/**
 * Send a suggestion as a chat message.
 * @param {string} text - The suggestion text
 */
function sendSuggestion(text) {
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = text;
    sendMessage();
  }
}

/** Send the current chat message to the API */
async function sendMessage() {
  const input = document.getElementById('chat-input');
  const message = input?.value?.trim();
  if (!message || AppState.isLoading) return;

  AppState.isLoading = true;
  input.value = '';
  autoResizeTextarea(input);
  document.getElementById('chat-send-btn').disabled = true;

  // Hide suggestions after first message
  const suggestions = document.getElementById('chat-suggestions');
  if (suggestions) suggestions.style.display = 'none';

  // Add user message
  addChatMessage(message, 'user');

  // Show typing indicator
  const typingId = showTypingIndicator();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId: AppState.sessionId })
    });

    const data = await response.json();
    removeTypingIndicator(typingId);

    if (data.success) {
      addChatMessage(data.data.response, 'assistant');
      AppState.sessionId = data.data.sessionId;
    } else {
      addChatMessage('Sorry, I encountered an error. Please try again.', 'assistant');
    }
  } catch (error) {
    removeTypingIndicator(typingId);
    addChatMessage('Connection error. Please check your internet and try again.', 'assistant');
  }

  AppState.isLoading = false;
}

/**
 * Add a message to the chat window.
 * @param {string} content - Message content (supports markdown)
 * @param {string} role - 'user' or 'assistant'
 */
function addChatMessage(content, role) {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${role}-message`;

  const icon = role === 'assistant' ? 'smart_toy' : 'person';
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const rendered = role === 'assistant' ? renderMarkdown(content) : escapeHtml(content);

  messageDiv.innerHTML = `
    <div class="chat-message-avatar">
      <span class="material-icons-outlined">${icon}</span>
    </div>
    <div class="chat-message-content">
      <div class="chat-message-bubble">${rendered}</div>
      <span class="chat-message-time">${time}</span>
    </div>
  `;

  container.appendChild(messageDiv);
  container.scrollTop = container.scrollHeight;
}

/**
 * Show a typing indicator in chat.
 * @returns {string} The typing element ID
 */
function showTypingIndicator() {
  const container = document.getElementById('chat-messages');
  const id = 'typing-' + Date.now();
  const div = document.createElement('div');
  div.className = 'chat-message assistant-message typing-message';
  div.id = id;
  div.innerHTML = `
    <div class="chat-message-avatar">
      <span class="material-icons-outlined">smart_toy</span>
    </div>
    <div class="chat-message-content">
      <div class="chat-message-bubble">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    </div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return id;
}

/**
 * Remove a typing indicator.
 * @param {string} id - The typing element ID
 */
function removeTypingIndicator(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

/** Clear the chat conversation */
async function clearChat() {
  try {
    await fetch('/api/chat/clear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: AppState.sessionId })
    });
  } catch (_) { /* ignore */ }

  AppState.sessionId = generateSessionId();
  const container = document.getElementById('chat-messages');
  if (container) {
    container.innerHTML = `
      <div class="chat-message assistant-message fade-in">
        <div class="chat-message-avatar">
          <span class="material-icons-outlined">smart_toy</span>
        </div>
        <div class="chat-message-content">
          <div class="chat-message-bubble">
            <h3>👋 Chat cleared! How can I help you?</h3>
            <p>Ask me anything about the election process, voter registration, voting methods, or democratic participation.</p>
          </div>
          <span class="chat-message-time">Just now</span>
        </div>
      </div>
    `;
  }

  const suggestions = document.getElementById('chat-suggestions');
  if (suggestions) suggestions.style.display = 'flex';
}

// =============================================================================
// Quiz
// =============================================================================

/** Fetch quiz questions and start the quiz */
async function startQuiz() {
  try {
    const response = await fetch('/api/quiz?count=5');
    const data = await response.json();
    if (data.success) {
      AppState.quiz = { questions: data.data, currentIndex: 0, score: 0, answered: false };
      showQuizQuestion();

      document.getElementById('quiz-start').hidden = true;
      document.getElementById('quiz-results').hidden = true;
      document.getElementById('quiz-active').hidden = false;
    }
  } catch (error) {
    console.error('Failed to load quiz:', error);
  }
}

/** Display the current quiz question */
function showQuizQuestion() {
  const { questions, currentIndex, score } = AppState.quiz;
  const q = questions[currentIndex];
  if (!q) return;

  AppState.quiz.answered = false;

  document.getElementById('quiz-counter').textContent =
    `Question ${currentIndex + 1} of ${questions.length}`;
  document.getElementById('quiz-score').textContent = score;
  document.getElementById('quiz-progress-bar').style.width =
    `${((currentIndex) / questions.length) * 100}%`;

  document.getElementById('quiz-question-text').textContent = q.question;

  const letters = ['A', 'B', 'C', 'D'];
  document.getElementById('quiz-options').innerHTML = q.options.map((opt, i) => `
    <button class="quiz-option" onclick="checkAnswer('${q.id}', ${i})" 
            role="radio" aria-checked="false" id="quiz-opt-${i}">
      <span class="quiz-option-letter">${letters[i]}</span>
      <span>${escapeHtml(opt)}</span>
    </button>
  `).join('');

  document.getElementById('quiz-explanation').hidden = true;
  document.getElementById('quiz-next-btn').hidden = true;
}

/**
 * Check a quiz answer.
 * @param {string} questionId - Question ID
 * @param {number} answer - Selected answer index
 */
async function checkAnswer(questionId, answer) {
  if (AppState.quiz.answered) return;
  AppState.quiz.answered = true;

  try {
    const response = await fetch('/api/quiz/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, answer })
    });

    const data = await response.json();
    if (!data.success) return;

    const { correct, correctAnswer, explanation } = data.data;

    // Mark options
    document.querySelectorAll('.quiz-option').forEach((opt, i) => {
      opt.classList.add('disabled');
      if (i === correctAnswer) opt.classList.add('correct');
      if (i === answer && !correct) opt.classList.add('incorrect');
    });

    if (correct) AppState.quiz.score++;
    document.getElementById('quiz-score').textContent = AppState.quiz.score;

    // Show explanation
    document.getElementById('quiz-explanation-text').textContent = explanation;
    document.getElementById('quiz-explanation').hidden = false;

    // Show next button or results
    const nextBtn = document.getElementById('quiz-next-btn');
    if (AppState.quiz.currentIndex < AppState.quiz.questions.length - 1) {
      nextBtn.textContent = 'Next Question';
      nextBtn.hidden = false;
    } else {
      nextBtn.textContent = 'See Results';
      nextBtn.hidden = false;
    }
  } catch (error) {
    console.error('Failed to check answer:', error);
  }
}

/** Move to the next question or show results */
function nextQuestion() {
  AppState.quiz.currentIndex++;

  if (AppState.quiz.currentIndex >= AppState.quiz.questions.length) {
    showQuizResults();
  } else {
    showQuizQuestion();
  }
}

/** Display quiz results */
function showQuizResults() {
  const { score, questions } = AppState.quiz;
  const total = questions.length;
  const pct = Math.round((score / total) * 100);

  document.getElementById('quiz-active').hidden = true;
  document.getElementById('quiz-results').hidden = false;

  document.getElementById('quiz-final-score').textContent = score;
  document.getElementById('quiz-total').textContent = total;

  setTimeout(() => {
    document.getElementById('quiz-results-bar').style.width = pct + '%';
  }, 100);

  let title, message, iconColor;
  if (pct >= 80) {
    title = '🎉 Excellent!';
    message = "You have an outstanding understanding of the election process!";
    iconColor = '#34A853';
  } else if (pct >= 60) {
    title = '👏 Good Job!';
    message = "You have a solid grasp of election basics. Review the Learn section to improve!";
    iconColor = '#4285F4';
  } else {
    title = '📚 Keep Learning!';
    message = "Check out our Learn section to build your election knowledge.";
    iconColor = '#FBBC04';
  }

  document.getElementById('quiz-results-title').textContent = title;
  document.getElementById('quiz-results-message').textContent = message;
  document.getElementById('quiz-results-icon').style.background =
    `linear-gradient(135deg, ${iconColor}, ${iconColor}88)`;
}

// =============================================================================
// Glossary
// =============================================================================

/** Fetch and render glossary terms */
async function loadGlossary() {
  try {
    const response = await fetch('/api/glossary');
    const data = await response.json();
    if (data.success) {
      renderGlossary(data.data);
      initGlossarySearch(data.data);
    }
  } catch (error) {
    console.error('Failed to load glossary:', error);
  }
}

/**
 * Render glossary cards.
 * @param {Array} terms - Array of glossary term objects
 */
function renderGlossary(terms) {
  const grid = document.getElementById('glossary-grid');
  if (!grid) return;

  if (terms.length === 0) {
    grid.innerHTML = `
      <div class="glossary-empty">
        <span class="material-icons-outlined">search_off</span>
        <p>No matching terms found.</p>
      </div>`;
    return;
  }

  grid.innerHTML = terms.map((item, i) => `
    <div class="glossary-card fade-in-up stagger-${Math.min(i + 1, 6)}" role="listitem">
      <div class="glossary-term">${escapeHtml(item.term)}</div>
      <div class="glossary-definition">${escapeHtml(item.definition)}</div>
    </div>
  `).join('');
}

/**
 * Initialize glossary search with debounced filtering.
 * @param {Array} allTerms - Complete glossary data
 */
function initGlossarySearch(allTerms) {
  const input = document.getElementById('glossary-search');
  if (!input) return;

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = input.value.toLowerCase().trim();
      const filtered = query
        ? allTerms.filter(t =>
            t.term.toLowerCase().includes(query) ||
            t.definition.toLowerCase().includes(query)
          )
        : allTerms;
      renderGlossary(filtered);
    }, 250);
  });
}

// =============================================================================
// Utilities
// =============================================================================

/**
 * Escape HTML to prevent XSS.
 * @param {string} str - Raw string
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Basic markdown to HTML renderer.
 * @param {string} md - Markdown text
 * @returns {string} HTML string
 */
function renderMarkdown(md) {
  if (!md) return '';
  let html = escapeHtml(md);

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold & Italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>(\n|$))+/g, '<ul>$&</ul>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Tables
  html = html.replace(/\|(.+)\|/g, (match) => {
    const cells = match.split('|').filter(c => c.trim());
    if (cells.every(c => /^[-:\s]+$/.test(c))) return '';
    const tag = 'td';
    return '<tr>' + cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('') + '</tr>';
  });
  html = html.replace(/(<tr>.*<\/tr>(\n|$))+/g, '<table>$&</table>');

  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');

  // Clean up
  html = '<p>' + html + '</p>';
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h[1-3]>)/g, '$1');
  html = html.replace(/(<\/h[1-3]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)<\/p>/g, '$1');
  html = html.replace(/<p>(<table>)/g, '$1');
  html = html.replace(/(<\/table>)<\/p>/g, '$1');
  html = html.replace(/<p>(<blockquote>)/g, '$1');
  html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');

  return html;
}

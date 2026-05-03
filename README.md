# 🗳️ ElectEd AI — Election Process Education Assistant

> An intelligent, AI-powered assistant that helps users understand the election process, timelines, and steps in an interactive and easy-to-follow way.

---

## 📋 Table of Contents

- [Chosen Vertical](#-chosen-vertical)
- [Approach & Logic](#-approach--logic)
- [How It Works](#-how-it-works)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Google Services Integration](#-google-services-integration)
- [Project Structure](#-project-structure)
- [Setup & Installation](#-setup--installation)
- [Running Locally](#-running-locally)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Security](#-security)
- [Accessibility](#-accessibility)
- [Assumptions](#-assumptions)
- [Screenshots](#-screenshots)

---

## 🎯 Chosen Vertical

**Election Process Education** — Create an assistant that helps users understand the election process, timelines, and steps in an interactive and easy-to-follow way.

---

## 🧠 Approach & Logic

### Problem Analysis
Many citizens find the election process confusing — from voter registration to understanding how votes are counted. This creates barriers to democratic participation.

### Solution Design
ElectEd AI addresses this through a **multi-modal learning approach**:

1. **Interactive Timeline** — Visual, step-by-step walkthrough of all 6 election phases (Registration → Post-Election).
2. **AI Chat Assistant** — Natural language Q&A powered by Google Gemini AI for personalized, context-aware answers.
3. **Knowledge Quiz** — Gamified learning with immediate feedback and detailed explanations.
4. **Election Glossary** — Searchable dictionary of election terminology.

### Architectural Decisions
- **Server-side AI processing** — Keeps API keys secure, enables rate limiting.
- **Conversation memory** — Context-aware chat with session management.
- **Progressive enhancement** — Fallback responses when AI is unavailable.
- **Responsive design** — Mobile-first, accessible to all users.
- **Google Cloud-inspired UI** — Clean, professional white theme with premium animations.

### Decision Flow
```
User Query → Input Sanitization → Rate Limit Check → Gemini AI Processing
                                                          ↓
                                          Context-Aware Response ← Conversation History
                                                          ↓
                                              Formatted Response → User
```

---

## ⚙️ How It Works

### 1. Interactive Election Timeline (Learn Section)
- Fetches structured election phase data from the API.
- Renders expandable cards with numbered steps, descriptions, and pro tips.
- Visual progress bar tracks which phases the user has explored.
- Covers: Registration → Pre-Election → Primaries → Early Voting → Election Day → Post-Election.

### 2. AI Chat Assistant
- Users type natural language questions about elections.
- Messages are sanitized, validated, and sent to Google Gemini AI.
- Gemini responds with accurate, non-partisan election education.
- Conversation history is maintained for context-aware follow-ups.
- Suggested questions help users get started.
- Markdown rendering for rich, formatted responses.

### 3. Knowledge Quiz
- Randomized questions pulled from a curated question bank.
- Immediate feedback with correct/incorrect animations.
- Detailed explanations after each answer.
- Score tracking with results summary and performance feedback.

### 4. Election Glossary
- Searchable, filterable glossary of 15+ election terms.
- Real-time search with debounced filtering.
- Clean card layout for easy browsing.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Chat** | Google Gemini-powered Q&A with conversation memory |
| 📚 **Interactive Timeline** | 6-phase election process walkthrough |
| 🧠 **Quiz Engine** | 10 questions with explanations and scoring |
| 📖 **Glossary** | Searchable election terminology dictionary |
| 🔒 **Security** | Helmet, CORS, rate limiting, input sanitization |
| ♿ **Accessible** | ARIA labels, keyboard nav, skip links, screen reader support |
| 📱 **Responsive** | Mobile-first design with drawer navigation |
| ☁️ **Cloud Ready** | Dockerized for Google Cloud Run deployment |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Node.js 18+, Express.js |
| **AI Engine** | Google Gemini AI (gemini-2.0-flash) |
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| **Security** | Helmet.js, express-rate-limit, CORS, input sanitization |
| **Logging** | Winston (structured, Cloud Logging compatible) |
| **Testing** | Node.js built-in test runner (node:test) |
| **Deployment** | Docker, Google Cloud Run |
| **Design** | Google Cloud-inspired, Material Icons |

---

## 🔗 Google Services Integration

| Service | Usage |
|---------|-------|
| **Google Gemini AI** | Core AI engine for intelligent election Q&A |
| **Google Cloud Run** | Serverless deployment platform |
| **Google Fonts** | Typography (Google Sans, Inter) |
| **Material Icons** | UI iconography |

---

## 📁 Project Structure

```
elected-ai/
├── server.js                    # Express server entry point
├── package.json                 # Dependencies and scripts
├── Dockerfile                   # Cloud Run deployment config
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── README.md                    # Project documentation
│
├── src/
│   ├── routes/
│   │   └── api.js               # REST API endpoints
│   ├── services/
│   │   └── geminiService.js     # Google Gemini AI integration
│   ├── middleware/
│   │   └── errorHandler.js      # Centralized error handling
│   ├── data/
│   │   └── electionData.js      # Election phases, quiz, glossary
│   └── utils/
│       ├── logger.js            # Winston logging configuration
│       └── sanitizer.js         # Input sanitization & validation
│
├── public/
│   ├── index.html               # Single-page application
│   ├── css/
│   │   ├── design-system.css    # Design tokens & variables
│   │   ├── components.css       # Reusable UI components
│   │   ├── animations.css       # 3D transitions & effects
│   │   ├── app.css              # Layout styles
│   │   └── pages.css            # Page-specific styles
│   └── js/
│       └── app.js               # Client-side application logic
│
└── tests/
    ├── unit/
    │   ├── sanitizer.test.js    # Sanitizer utility tests
    │   ├── geminiService.test.js # AI service tests
    │   └── electionData.test.js # Data integrity tests
    └── integration/
        └── api.test.js          # API endpoint tests
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ installed
- A Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Imaya-thillai/ElectEd-AI.git
cd ElectEd-AI

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# 4. Start the server
npm start
```

---

## 💻 Running Locally

```bash
# Start in production mode
npm start

# The app will be available at http://localhost:8080
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit
```

### Test Coverage
- **Unit Tests**: Sanitizer, Gemini service fallbacks, election data integrity
- **Integration Tests**: All API endpoints, security headers, input validation
- **Total**: 30+ test cases covering security, functionality, and data validation

---

## ☁️ Deployment (Google Cloud Run)

```bash
# Build Docker image
docker build -t elected-ai .

# Tag for Google Container Registry
docker tag elected-ai gcr.io/YOUR_PROJECT_ID/elected-ai

# Push to registry
docker push gcr.io/YOUR_PROJECT_ID/elected-ai

# Deploy to Cloud Run
gcloud run deploy elected-ai \
  --image gcr.io/YOUR_PROJECT_ID/elected-ai \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=your_key_here"
```

---

## 🔒 Security

- **Helmet.js** — Sets security HTTP headers (CSP, X-Frame-Options, etc.)
- **Rate Limiting** — 100 requests/15min general, 10 requests/min for chat
- **Input Sanitization** — XSS prevention, script injection removal
- **Input Validation** — Message length limits, type checking
- **CORS** — Configurable cross-origin resource sharing
- **Non-root Docker** — Container runs as unprivileged user
- **Environment Variables** — Secrets kept out of source code

---

## ♿ Accessibility

- **Skip Navigation** — Skip-to-content link for keyboard users
- **ARIA Labels** — All interactive elements have descriptive labels
- **Keyboard Navigation** — Full keyboard accessibility
- **Screen Reader Support** — Semantic HTML, ARIA roles, live regions
- **Reduced Motion** — Respects `prefers-reduced-motion` preference
- **High Contrast** — Supports `forced-colors` mode
- **Focus Indicators** — Visible focus outlines on all interactive elements
- **Color Contrast** — WCAG AA compliant color ratios

---

## 📝 Assumptions

1. **Non-partisan Education** — The assistant provides factual, non-partisan information about election processes without favoring any political party or candidate.
2. **General Elections** — Content covers general democratic election processes applicable across multiple jurisdictions, with a focus on U.S. elections as the primary reference.
3. **Educational Purpose** — This tool is for educational purposes only and should not be considered legal advice. Users should verify information with their local election officials.
4. **AI Availability** — The application gracefully degrades with keyword-based fallback responses when the Gemini AI service is unavailable.
5. **Modern Browser** — The frontend targets modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+).

---

## 📸 Screenshots

### Home Page
Clean, Google Cloud-inspired design with animated hero section and feature cards.

### Interactive Timeline
Step-by-step election phases with expandable cards and visual progress tracking.

### AI Chat Assistant
Real-time AI-powered Q&A with typing indicators and markdown rendering.

### Knowledge Quiz
Gamified learning with instant feedback, explanations, and score tracking.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ using Google Antigravity & Google Gemini AI
  <br>
  <strong>Hack2Skill Virtual PromptWars 2026</strong>
</p>

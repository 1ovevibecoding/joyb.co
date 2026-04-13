/**
 * JoyB.VN Chatbox Backend Server
 * Express API with RAG + Groq LLM
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { searchKnowledge } from './ragSearch.js';
import { getLLMResponse } from './llmService.js';
import { randomUUID } from 'crypto';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ============================================================
// Session Memory Store (in-memory)
// ============================================================
const sessions = new Map();
const SESSION_MAX_MESSAGES = 20;
const SESSION_TTL_MS = 60 * 60 * 1000; // 1 hour

function getSession(sessionId) {
  const session = sessions.get(sessionId);
  if (session) {
    session.lastAccess = Date.now();
    return session;
  }
  return null;
}

function createSession(sessionId) {
  const session = {
    id: sessionId,
    messages: [],
    createdAt: Date.now(),
    lastAccess: Date.now()
  };
  sessions.set(sessionId, session);
  return session;
}

function addToSession(sessionId, role, content) {
  const session = sessions.get(sessionId);
  if (!session) return;

  session.messages.push({ role, content });

  // Keep only last N messages
  if (session.messages.length > SESSION_MAX_MESSAGES) {
    session.messages = session.messages.slice(-SESSION_MAX_MESSAGES);
  }
  session.lastAccess = Date.now();
}

// Cleanup old sessions every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.lastAccess > SESSION_TTL_MS) {
      sessions.delete(id);
    }
  }
}, 10 * 60 * 1000);

// ============================================================
// API Routes
// ============================================================

/**
 * POST /api/chat
 * Body: { message: string, sessionId?: string }
 * Response: { reply: string, sessionId: string, ragSources: Array }
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId: clientSessionId } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get or create session
    const sessionId = clientSessionId || randomUUID();
    let session = getSession(sessionId);
    if (!session) {
      session = createSession(sessionId);
    }

    // Step 1: RAG search for relevant knowledge
    const ragResults = searchKnowledge(message.trim(), 3);
    console.log(`[RAG] Query: "${message.trim().substring(0, 50)}..." → Found ${ragResults.length} results`);

    // Step 2: Call LLM with RAG context + conversation history
    const { reply, provider } = await getLLMResponse(
      message.trim(),
      ragResults,
      session.messages
    );
    console.log(`[LLM] Provider: ${provider}`);

    // Step 3: Store in session memory
    addToSession(sessionId, 'user', message.trim());
    addToSession(sessionId, 'assistant', reply);

    // Response
    res.json({
      reply,
      sessionId,
      ragSources: ragResults.map(r => ({ title: r.title, category: r.category, score: r.score }))
    });

  } catch (error) {
    console.error('[Error]', error);
    res.status(500).json({
      error: 'Internal server error',
      reply: 'Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau! 🙏'
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    activeSessions: sessions.size
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🤖 JoyB Chatbox Server running on http://localhost:${PORT}`);
  console.log(`   POST /api/chat   - Chat endpoint`);
  console.log(`   GET  /api/health - Health check\n`);

  if (!process.env.GROQ_API_KEY) {
    console.warn('⚠️  GROQ_API_KEY not set! Set it in .env file.');
  }
  if (!process.env.GEMINI_API_KEY) {
    console.warn('ℹ️  GEMINI_API_KEY not set. Gemini fallback will not work.');
  }
});

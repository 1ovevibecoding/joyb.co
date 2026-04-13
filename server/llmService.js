/**
 * LLM Service - Groq (primary) with Gemini fallback
 * Handles prompt building and API calls
 */

import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `Bạn là trợ lý hỗ trợ khách hàng thân thiện của JoyB.VN - nền tảng bán vé sự kiện hàng đầu Việt Nam.

Phong cách trả lời:
- Thân thiện, nhiệt tình, gần gũi, sử dụng tiếng Việt tự nhiên.
- Trả lời ngắn gọn, rõ ràng, dùng emoji vừa phải.
- Luôn cố gắng giúp người dùng giải quyết vấn đề nhanh nhất có thể.
- Nếu không biết hoặc không chắc chắn, hãy nói thật và đề nghị chuyển sang nhân viên hỗ trợ.
- Ưu tiên dựa vào kiến thức được cung cấp trong context.

Kiến thức của bạn được cung cấp qua RAG. Hãy trả lời dựa trên thông tin đó trước.
Nếu người dùng hỏi về sự kiện cụ thể, hãy trả lời lịch sự và hướng dẫn họ kiểm tra trên website.
Nếu người dùng chào hỏi, hãy chào hỏi lại thân thiện và hỏi xem bạn có thể giúp gì.`;

// Initialize Groq client
let groqClient = null;
function getGroqClient() {
  if (!groqClient) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }
  return groqClient;
}

/**
 * Build the message array for the LLM
 */
function buildMessages(userMessage, ragContext, conversationHistory) {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT }
  ];

  // Add RAG context as a system message if available
  if (ragContext && ragContext.length > 0) {
    const contextText = ragContext
      .map(c => `[${c.title}]\n${c.content}`)
      .join('\n\n---\n\n');

    messages.push({
      role: 'system',
      content: `Dưới đây là kiến thức liên quan từ cơ sở dữ liệu JoyB.VN. Hãy ưu tiên sử dụng thông tin này để trả lời:\n\n${contextText}`
    });
  }

  // Add conversation history (last 20 messages max)
  if (conversationHistory && conversationHistory.length > 0) {
    const recentHistory = conversationHistory.slice(-20);
    messages.push(...recentHistory);
  }

  // Add current user message
  messages.push({ role: 'user', content: userMessage });

  return messages;
}

/**
 * Call Groq API with Llama 3.3 70B
 */
async function callGroq(messages) {
  const client = getGroqClient();
  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages,
    temperature: 0.7,
    max_tokens: 1024,
    top_p: 0.9
  });

  return response.choices[0]?.message?.content || 'Xin lỗi, tôi không thể trả lời lúc này.';
}

/**
 * Call Gemini API as fallback
 */
async function callGemini(messages) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  // Convert messages to Gemini format
  const systemInstruction = messages
    .filter(m => m.role === 'system')
    .map(m => m.content)
    .join('\n\n');

  const contents = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          topP: 0.9
        }
      })
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Xin lỗi, tôi không thể trả lời lúc này.';
}

/**
 * Main function: Get LLM response with Groq primary + Gemini fallback
 */
export async function getLLMResponse(userMessage, ragContext, conversationHistory) {
  const messages = buildMessages(userMessage, ragContext, conversationHistory);

  try {
    // Try Groq first
    const reply = await callGroq(messages);
    return { reply, provider: 'groq' };
  } catch (error) {
    console.error('Groq API error:', error.message);

    // Fallback to Gemini on rate limit or other errors
    if (error.status === 429 || error.message?.includes('rate_limit')) {
      console.log('Groq rate limited, falling back to Gemini...');
    } else {
      console.log('Groq error, attempting Gemini fallback...');
    }

    try {
      const reply = await callGemini(messages);
      return { reply, provider: 'gemini' };
    } catch (geminiError) {
      console.error('Gemini fallback also failed:', geminiError.message);
      return {
        reply: 'Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau hoặc liên hệ hotline 1900-xxxx để được hỗ trợ trực tiếp. 🙏',
        provider: 'error'
      };
    }
  }
}

export default getLLMResponse;
